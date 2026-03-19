function getData(key){

let data=localStorage.getItem(key)

if(!data) return []

return JSON.parse(data)

}


function saveData(key,data){

localStorage.setItem(key,JSON.stringify(data))

}