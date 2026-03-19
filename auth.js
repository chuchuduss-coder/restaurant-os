let users=[
{username:"admin",password:"9999",role:"admin"},
{username:"staff",password:"1234",role:"staff"}
]

let currentUser=null


function login(){

let u=username.value
let p=password.value

let user=users.find(x=>x.username===u && x.password===p)

if(!user){
alert("Login failed")
return
}

currentUser=user

loginPage.style.display="none"
app.style.display="flex"

setupRole()

initApp()

}


function logout(){

location.reload()

}


function setupRole(){

if(currentUser.role==="staff"){

menu_dashboard.style.display="none"
menu_pos.style.display="none"
menu_analytics.style.display="none"
menu_kpi.style.display="none"

}

}