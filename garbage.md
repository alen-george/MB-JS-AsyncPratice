function(key, value) {
        if (key=='1') return JSON.parse(value);
        return value}


Object.keys(data).forEach(elem=>{

    result[elem]=data[elem].reduce((res,obj)=>{
        
        if(obj.completed){
        res['completed']=[...res['completed'],JSON.stringify({id:obj.id,userId:obj.userId,title:obj.title})]
    }
        else{
        res['Incomplete']=[...res['Incomplete'],JSON.stringify({id:obj.id,userId:obj.userId,title:obj.title})]
        }

        return res
    },{completed:[],Incomplete:[]})
})


