import fetch from "node-fetch";
import { readFile, writeFile } from "fs";

import axios from "axios";

// To create output.json

function dumpToFile(solutionA, solutionB, solutionC) {
  const data = {
    solutionA: solutionA,
    solutionB: solutionB,
    solutionC: solutionC,
  };
  writeFile("output1.json", JSON.stringify(data), (err) => {
    if (err) {
      throw err;
    }
    console.log("JSON data is saved.");
  });
}
/*

Users API url: https://jsonplaceholder.typicode.com/users
Todos API url: https://jsonplaceholder.typicode.com/todos
Users API url for specific user ids : https://jsonplaceholder.typicode.com/users?id=2302913&id=2399
Todos API url for specific user Ids : https://jsonplaceholder.typicode.com/todos?userId=2321392&userId=213921398


Q1.Write a function to fetch list of all todos from the above url using both fetch and axios.get.
		
	A. use promises 
	B. use await keyword 	
	
    C. Once the list is fetched.Group the list of tasks based on user IDs.
        Make sure the non completed tasks are always in front.
	{ 
		userId1: [ // All the tasks of userId1]
        	,
		userId2: [ // All the tasks of userId2]

        ...
    
    D.  Also Group tasks based on completed or nonCompleted for each user
        { 
          completed: [..All the completed tasks],
          nonCompleted: [...All the non completed tasks]
        }

    E. Dump the results in a file.

        {
            A: solutionA,
            B: solutionB,
            c: solutionC,
            d: solutionD
        }
*/
const groupTaskbyUserID = (data) => {
  const userData = data.reduce((res, obj) => {
    if (res[obj.userId]) {
      res[obj.userId] = [
        ...res[obj.userId],
        { id: obj.id, title: obj.title, completed: obj.completed },
      ];
    } else {
      res[obj.userId] = [
        { id: obj.id, title: obj.title, completed: obj.completed },
      ];
    }
    return res;
  }, {});

  Object.keys(userData).forEach((elem) => {
    userData[elem].sort((a, b) => a.completed - b.completed);
  });

  return userData;
};

const groupTaskByStatus = (data) => {
  const result = data.reduce((obj, elem) => {
    if (!obj[elem.userId]) {
      obj[elem.userId] = { completed: [], Incomplete: [] };
    }
    if (elem.completed) {
      obj[elem.userId]["completed"] = [
        { id: elem.id, title: elem.title },
        ...obj[elem.userId]["completed"],
      ];
    } else {
      obj[elem.userId]["Incomplete"] = [
        { id: elem.id, title: elem.title },
        ...obj[elem.userId]["Incomplete"],
      ];
    }
    return obj;
  }, {});

  return result;
};

// callback function which will invoke the functions of question 1 and question 3
const storeData = async (response) => {
  let solutionA = response;
  let solutionB = groupTaskbyUserID(response);
  let solutionC = groupTaskByStatus(response);
  let userIDsTodo = await getInfoOfUsers(response);

  // dumpToFile(solutionA,solutionB,solutionC)
};


 //Promise method
function getTodo(storeData) {
 
  return fetch("https://jsonplaceholder.typicode.com/todos")
    .then(
      (response) => response.json(),
      (rejection) => console.log(rejection)
    )
    .then((response) => storeData(response));
}
// getTodo(storeData)


//Async method
async function getTodoAsync() {

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos");
    if (response.ok) {
      const toDoList = await response.json();
      storeData(toDoList);
    }
  } catch (error) {
    console.log(error);
  }
}
getTodoAsync();

/*
Q2. Write a method that returns a promise to read a File (use fs.readFile inside). 
        your method readFile should use fs.readFile and return a promise.
        your method readFile should accept a file path.
        your method should throw an error with message saying "Missing File." if path is incorrect.
        your method should also accept another optional params for transformation of the data .        
       
        write a method for Transformation of data after read operation ...in the form [solutionA, solutionB, solutionC, solutionD].
*/

function readsFile(path, transForm) {
  return new Promise((resolve, reject) => {
        readFile(path, "utf-8", (err, data) => {
          if(err) {
            reject("Missing File.");
          }
          else {
           resolve(transForm(data));
          }
        }
      );
    } 
      
  );
}

const transForm = (data) => {
  const parsedData = JSON.parse(data);
  let arrayOfData =Object.keys(parsedData).map((key) => parsedData[key]);
  

  console.log(arrayOfData);

  return arrayOfData;
};

// readsFile("output1.json", transForm);

/*
Q3. Write a function to get all the users information from the users API url. Find all the users with name "Nicholas". 
Get all the to-dos for those user ids.*/
function userByName(data, toDoData) {
  const userIDFiltered = data.reduce((res, elem) => {
    if (elem.name.split(' ')[0]=="Nicholas") {
    
      res.push(toDoData.filter((toDoelem) => toDoelem.userId == elem.id));
    }

    return res;
  }, []);

  return userIDFiltered;
}

async function getInfoOfUsers(toDoData) {
  try {
    let response = await axios.get(
      "https://jsonplaceholder.typicode.com/users"
    );
    userByName(response.data, toDoData);
  } catch (err) {
    console.error(err);
  }
}

// getInfoOfUsers('')
/*

Q4. Write a function that takes any number of arguments ..and makes api call for each of them to fetch the results.

        A. use Promises.all
        B. use only 1 api call to get all the results.

*/

// A

function getDataOfUsers(...userIDs) {
  let getResults = userIDs.map((key) =>
    axios.get("https://jsonplaceholder.typicode.com/users?id=" + key)
  );

  return Promise.all(getResults).then((results) => {
    let resultsData = results.map((res) => res.data);
    console.log(resultsData);
  });
}

// getDataOfUsers(8,9,10)

// B
function getDataOfUsers2(...userIDs) {
  let listOfIDs = userIDs.reduce(
    (res, elem) => {
      return { id: [...res["id"], elem] };
    },
    { id: [] }
  );
  //   console.log(listOfIDs)
  return axios
    .get("https://jsonplaceholder.typicode.com/users", {
      params: listOfIDs,
    })
    .then((response) => console.log(response.data));
}
// getDataOfUsers2(8,9,10)

/*
Q5. Promisify the following "sayHelloWorld" function 

    const sayHelloWorld = () => {
        window.setTimeout(() => {
            console.log('Hello World')
        }, 1000)

        return;
    }

    (function executeSayHelloWorld () {
        sayHelloWorld();
        console.log('Hey');
    })()

    Note: You need to execute Question 5 on browser due to window.setTimeout.
    Upon running the function in browser you would notice ..that 
    "Hey" gets printed first and then "Hello World".
    Promisify sayHelloWorld so that.."Hello World" gets printed first and then "Hey".

*/

const sayHelloWorld = () => {
  return new Promise(
  window.setTimeout(() => {
      console.log('Hello World')
  }, 1000)
  )

}

(function executeSayHelloWorld () {
  sayHelloWorld();
  console.log('Hey');
})()