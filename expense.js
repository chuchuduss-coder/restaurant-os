let expenseTab = "daily" // default

function drawExpensePage(){

let container=document.getElementById("page_expense")

container.innerHTML=`

<h2>Expense</h2>

<div style="display:flex;gap:10px;margin-bottom:15px;">
<button onclick="switchExpenseTab('daily')" 
style="padding:8px 15px;border:none;border-radius:8px;
background:${expenseTab==='daily'?'#333':'#eee'};
color:${expenseTab==='daily'?'#fff':'#000'}">
Daily Expense
</button>

<button onclick="switchExpenseTab('monthly')" 
style="padding:8px 15px;border:none;border-radius:8px;
background:${expenseTab==='monthly'?'#333':'#eee'};
color:${expenseTab==='monthly'?'#fff':'#000'}">
Monthly Expense
</button>
</div>

<div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap;">

<input id="exp_date" type="date">

${expenseTab==="daily"?`
<input id="mat" type="number" placeholder="วัตถุดิบ">
<input id="ice" type="number" placeholder="น้ำแข็ง">
<input id="pack" type="number" placeholder="แพ็กเกจ">
<input id="gas" type="number" placeholder="ค่าน้ำมัน">
<input id="etc" type="number" placeholder="อื่นๆ">
`:
`
<input id="rent" type="number" placeholder="ค่าเช่าร้าน">
<input id="water" type="number" placeholder="ค่าน้ำ">
<input id="elec" type="number" placeholder="ค่าไฟ">
<input id="decorate" type="number" placeholder="ค่าตกแต่งร้าน">
<input id="welfare" type="number" placeholder="สวัสดิการ">
<input id="salary" type="number" placeholder="ค่าแรงพนักงาน">
<input id="etc" type="number" placeholder="อื่นๆ">
`
}

<button onclick="addExpense()">บันทึก</button>

</div>

<div id="expenseTimeline"></div>

`

// default date
let today = new Date().toISOString().split("T")[0]
document.getElementById("exp_date").value = today

renderExpense()

}

function switchExpenseTab(tab){
expenseTab = tab
drawExpensePage()
}

function addExpense(){

let key = expenseTab==="daily" ? "expense_daily" : "expense_monthly"
let data=getData(key)||[]

let selectedDate = document.getElementById("exp_date").value

let obj = {
date: selectedDate || new Date().toISOString().split("T")[0],
edit:false
}

if(expenseTab==="daily"){
obj.mat=Number(mat.value)||0
obj.ice=Number(ice.value)||0
obj.pack=Number(pack.value)||0
obj.gas=Number(gas.value)||0
obj.etc=Number(etc.value)||0
}else{
obj.rent=Number(rent.value)||0
obj.water=Number(water.value)||0
obj.elec=Number(elec.value)||0
obj.decorate=Number(decorate.value)||0
obj.welfare=Number(welfare.value)||0
obj.salary=Number(salary.value)||0
obj.etc=Number(etc.value)||0
}

data.push(obj)

saveData(key,data)

renderExpense()

}

function renderExpense(){

let key = expenseTab==="daily" ? "expense_daily" : "expense_monthly"
let data=getData(key)||[]

data.sort((a,b)=> b.date.localeCompare(a.date))

let grouped={}

data.forEach((e,i)=>{
let d = e.date
if(!grouped[d]) grouped[d]=[]
grouped[d].push({...e,index:i})
})

let html=""

for(let date in grouped){

let list=grouped[date]

// total
let total=0
list.forEach(e=>{
for(let k in e){
if(typeof e[k]==="number") total+=e[k]
}
})

html+=`
<div style="margin-bottom:15px;padding:12px;border:1px solid #ccc;border-radius:10px;">
<h3>${date} | Total: ${total}</h3>
`

list.forEach(e=>{

// ===== NORMAL =====
if(!e.edit){

html+=`
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;">

<div style="flex:1;min-width:250px;">
${expenseTab==="daily"?`
วัตถุดิบ : ${e.mat||0} | น้ำแข็ง : ${e.ice||0} | แพ็กเกจ : ${e.pack||0} | ค่าน้ำมัน : ${e.gas||0} | อื่นๆ : ${e.etc||0}
`:
`
ค่าเช่าร้าน : ${e.rent||0} | ค่าน้ำ : ${e.water||0} | ค่าไฟ : ${e.elec||0} | ตกแต่ง : ${e.decorate||0} | สวัสดิการ : ${e.welfare||0} | ค่าแรง : ${e.salary||0} | อื่นๆ : ${e.etc||0}
`}
</div>

<div>
<button onclick="toggleExpenseEdit(${e.index},true)">✏️</button>
</div>

</div>
`

}

// ===== EDIT =====
else{

html+=`
<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;flex-wrap:wrap;">

<div style="flex:1;min-width:250px;display:flex;flex-wrap:wrap;gap:5px;align-items:center;">

<span>วันที่ :</span>
<input type="date" id="d${e.index}" value="${e.date}" style="width:140px;">

${expenseTab==="daily"?`
<input id="mat${e.index}" type="number" value="${e.mat||0}" style="width:70px;">
<input id="ice${e.index}" type="number" value="${e.ice||0}" style="width:70px;">
<input id="pack${e.index}" type="number" value="${e.pack||0}" style="width:70px;">
<input id="gas${e.index}" type="number" value="${e.gas||0}" style="width:70px;">
<input id="etc${e.index}" type="number" value="${e.etc||0}" style="width:70px;">
`:
`
<input id="rent${e.index}" type="number" value="${e.rent||0}" style="width:70px;">
<input id="water${e.index}" type="number" value="${e.water||0}" style="width:70px;">
<input id="elec${e.index}" type="number" value="${e.elec||0}" style="width:70px;">
<input id="decorate${e.index}" type="number" value="${e.decorate||0}" style="width:70px;">
<input id="welfare${e.index}" type="number" value="${e.welfare||0}" style="width:70px;">
<input id="salary${e.index}" type="number" value="${e.salary||0}" style="width:70px;">
<input id="etc${e.index}" type="number" value="${e.etc||0}" style="width:70px;">
`}
</div>

<div style="display:flex;gap:5px;">
<button onclick="saveExpenseEdit(${e.index})">💾</button>
<button onclick="deleteExpense(${e.index})">🗑</button>
</div>

</div>
`

}

})

html+=`</div>`
}

expenseTimeline.innerHTML=html

}

function toggleExpenseEdit(i,state){

let key = expenseTab==="daily" ? "expense_daily" : "expense_monthly"
let data=getData(key)||[]

data[i].edit=state

saveData(key,data)

renderExpense()

}

function saveExpenseEdit(i){

let key = expenseTab==="daily" ? "expense_daily" : "expense_monthly"
let data=getData(key)||[]

let newDate = document.getElementById("d"+i).value
if(newDate) data[i].date = newDate

if(expenseTab==="daily"){
data[i].mat=Number(document.getElementById("mat"+i).value)||0
data[i].ice=Number(document.getElementById("ice"+i).value)||0
data[i].pack=Number(document.getElementById("pack"+i).value)||0
data[i].gas=Number(document.getElementById("gas"+i).value)||0
data[i].etc=Number(document.getElementById("etc"+i).value)||0
}else{
data[i].rent=Number(document.getElementById("rent"+i).value)||0
data[i].water=Number(document.getElementById("water"+i).value)||0
data[i].elec=Number(document.getElementById("elec"+i).value)||0
data[i].decorate=Number(document.getElementById("decorate"+i).value)||0
data[i].welfare=Number(document.getElementById("welfare"+i).value)||0
data[i].salary=Number(document.getElementById("salary"+i).value)||0
data[i].etc=Number(document.getElementById("etc"+i).value)||0
}

data[i].edit=false

saveData(key,data)

renderExpense()

}

function deleteExpense(i){

let key = expenseTab==="daily" ? "expense_daily" : "expense_monthly"
let data=getData(key)||[]

data.splice(i,1)

saveData(key,data)

renderExpense()

}