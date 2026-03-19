function drawPOSPage(){

let container=document.getElementById("page_pos")

container.innerHTML=`

<h2>POS</h2>

<div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap;">

<input id="pos_date" type="date">
<input id="grab" type="number" placeholder="GRAB">
<input id="lineman" type="number" placeholder="LINE MAN">
<input id="shopee" type="number" placeholder="SHOPEE FOOD">
<input id="cashier" type="number" placeholder="CASHEIR">

<button onclick="addSale()">บันทึก</button>

</div>

<div id="posTimeline"></div>

`

// ✅ default = วันนี้ (ไม่ใช้ ISO เต็ม)
let today = new Date().toISOString().split("T")[0]
document.getElementById("pos_date").value = today

renderPOS()

}

function addSale(){

let data=getData("sales")||[]

let selectedDate = document.getElementById("pos_date").value

data.push({

date: selectedDate || new Date().toISOString().split("T")[0], // ✅ FIX
grab:Number(grab.value)||0,
lineman:Number(lineman.value)||0,
shopee:Number(shopee.value)||0,
cashier:Number(cashier.value)||0,
edit:false

})

saveData("sales",data)

grab.value=""
lineman.value=""
shopee.value=""
cashier.value=""

renderPOS()

}

function renderPOS(){

let data=getData("sales")||[]

// ✅ sort แบบ string YYYY-MM-DD ได้เลย
data.sort((a,b)=> b.date.localeCompare(a.date))

let grouped={}

data.forEach((s,i)=>{
let d = s.date // ✅ FIX ไม่ใช้ Date()
if(!grouped[d]) grouped[d]=[]
grouped[d].push({...s,index:i})
})

let html=""

for(let date in grouped){

let list=grouped[date]

// total
let total=0
list.forEach(s=>{
total+=(s.grab||0)+(s.lineman||0)+(s.shopee||0)+(s.cashier||0)
})

html+=`
<div style="margin-bottom:15px;padding:12px;border:1px solid #ccc;border-radius:10px;">

<h3>${date} | Total: ${total}</h3>
`

list.forEach(s=>{

let dateInput = s.date // ✅ FIX

// ===== NORMAL MODE =====
if(!s.edit){

html+=`
<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:8px;
gap:10px;
flex-wrap:wrap;
">

<div style="flex:1;min-width:250px;">
GRAB : ${s.grab||0} |
LINE MAN : ${s.lineman||0} |
SHOPPEE FOOD : ${s.shopee||0} |
CASHEIR : ${s.cashier||0}
</div>

<div>
<button onclick="toggleEdit(${s.index},true)">✏️</button>
</div>

</div>
`

}

// ===== EDIT MODE =====
else{

html+=`
<div style="
display:flex;
justify-content:space-between;
align-items:center;
margin-bottom:8px;
gap:10px;
flex-wrap:wrap;
">

<div style="flex:1;min-width:250px;display:flex;gap:5px;flex-wrap:wrap;align-items:center;">

<span>วันที่ :</span>
<input type="date" id="d${s.index}" value="${dateInput}" style="width:140px;">

<span>GRAB :</span>
<input style="width:80px;" id="g${s.index}" type="number" value="${s.grab||0}">

<span>| LINE MAN :</span>
<input style="width:80px;" id="l${s.index}" type="number" value="${s.lineman||0}">

<span>| SHOPPEE :</span>
<input style="width:80px;" id="s${s.index}" type="number" value="${s.shopee||0}">

<span>| CASHEIR :</span>
<input style="width:80px;" id="c${s.index}" type="number" value="${s.cashier||0}">

</div>

<div style="display:flex;gap:5px;">
<button onclick="saveEdit(${s.index})">💾</button>
<button onclick="deleteSale(${s.index})">🗑</button>
</div>

</div>
`

}

})

html+=`</div>`
}

posTimeline.innerHTML=html

}

function toggleEdit(i,state){

let data=getData("sales")||[]

data[i].edit=state

saveData("sales",data)

renderPOS()

}

function saveEdit(i){

let data=getData("sales")||[]

// ✅ FIX: เก็บเป็น YYYY-MM-DD ตรงๆ
let newDate = document.getElementById("d"+i).value
if(newDate){
data[i].date = newDate
}

data[i].grab=Number(document.getElementById("g"+i).value)||0
data[i].lineman=Number(document.getElementById("l"+i).value)||0
data[i].shopee=Number(document.getElementById("s"+i).value)||0
data[i].cashier=Number(document.getElementById("c"+i).value)||0

data[i].edit=false

saveData("sales",data)

renderPOS()

}

function deleteSale(i){

let data=getData("sales")||[]

data.splice(i,1)

saveData("sales",data)

renderPOS()

}