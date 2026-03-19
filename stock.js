// ================= INIT DATA =================
function initStockIfEmpty(){

let data = getData("stock")

if(!data || data.length === 0){

let sample = [
{
name:"นมสด",
category:"วัตถุดิบหลัก",
qty:5,
min:3,
unit:"ขวด",
update:getToday(),
edit:false
},
{
name:"นมข้นจืด",
category:"วัตถุดิบหลัก",
qty:2,
min:3,
unit:"ขวด",
update:getToday(),
edit:false
}
]

saveData("stock", sample)

}

}

// ================= MIGRATION =================
function migrateStockData(){

let data = getData("stock") || []

data = data.map(item => ({

name: item.name || item.item || "ไม่ระบุ",
category: item.category || "วัตถุดิบหลัก",
qty: Number(item.qty ?? item.quantity ?? 0),
min: Number(item.min ?? item.minimum ?? 0),
unit: item.unit || "-",
update: item.update || getToday(),
edit: item.edit || false

}))

saveData("stock", data)

}

// ================= CONFIG =================
let stockTab = "summary"

const categories = [
"วัตถุดิบหลัก",
"ท็อปปิ้ง",
"แพ็กเกจ",
"ของใช้"
]

// ================= DRAW =================
function drawStockPage(){

let container=document.getElementById("page_stock")

container.innerHTML=`

<h2>Stock</h2>

<div style="display:flex;gap:10px;margin-bottom:15px;flex-wrap:wrap;">
${["summary",...categories,"add"].map(tab=>`
<button onclick="switchStockTab('${tab}')"
style="padding:8px 12px;border:none;border-radius:8px;
background:${stockTab===tab?'#333':'#eee'};
color:${stockTab===tab?'#fff':'#000'}">
${getTabName(tab)}
</button>
`).join("")}
</div>

<div id="stockContent"></div>

`

renderStock()

}

function getTabName(tab){
if(tab==="summary") return "สรุป"
if(tab==="add") return "เพิ่มรายการ"
return tab
}

function switchStockTab(tab){
stockTab = tab
drawStockPage()
}

// ================= RENDER =================
function renderStock(){

let data=getData("stock")||[]

let content=document.getElementById("stockContent")

if(stockTab==="add"){
renderAddStock()
return
}

// ===== SUMMARY =====
if(stockTab==="summary"){

let low = data.filter(i=>(i.qty ?? 0) <= (i.min ?? 0))

if(low.length===0){
content.innerHTML=`<h3 style="color:green;">✅ Stock ดีมาก! ไม่มีของใกล้หมด</h3>`
return
}

content.innerHTML = buildTable(low,false)
return
}

// ===== CATEGORY =====
let filtered = data
.map((item,index)=>({...item,_index:index}))
.filter(i=>i.category===stockTab)

content.innerHTML = buildTable(filtered,true)

}

// ================= TABLE =================
function buildTable(list,editable){

let html=`
<div style="font-weight:bold;display:flex;gap:10px;border-bottom:2px solid #000;padding-bottom:5px;">
<div style="flex:2;">รายการ</div>
<div style="flex:1;">จำนวน</div>
<div style="flex:1;">ขั้นต่ำ</div>
<div style="flex:1;">หน่วย</div>
<div style="flex:1;">update</div>
<div style="width:80px;"></div>
</div>
`

list.forEach((i)=>{

let realIndex = i._index ?? getRealIndex(i)

let name = (i.name && i.name.trim() !== "") ? i.name : "ไม่ระบุ"
let qty = i.qty ?? 0
let min = i.min ?? 0
let unit = i.unit || "-"
let update = i.update || "-"
let isLow = qty <= min

if(!i.edit){

html+=`
<div style="display:flex;gap:10px;padding:8px 0;
${isLow?'background:#ffdddd;':''}">

<div style="flex:2;">${name}</div>
<div style="flex:1;">${qty}</div>
<div style="flex:1;">${min}</div>
<div style="flex:1;">${unit}</div>
<div style="flex:1;">${update}</div>

<div>
${editable?`<button onclick="toggleStockEdit(${realIndex},true)">✏️</button>`:""}
</div>

</div>
`
}else{

html+=`
<div style="display:flex;gap:10px;padding:8px 0;">

<div style="flex:2;">${name}</div>

<div style="flex:1;">
<button onclick="changeQty(${realIndex},-1)">-</button>
${qty}
<button onclick="changeQty(${realIndex},1)">+</button>
</div>

<div style="flex:1;">
<button onclick="changeMin(${realIndex},-1)">-</button>
${min}
<button onclick="changeMin(${realIndex},1)">+</button>
</div>

<div style="flex:1;">${unit}</div>
<div style="flex:1;">${update}</div>

<div>
<button onclick="saveStock(${realIndex})">💾</button>
<button onclick="deleteStock(${realIndex})">🗑</button>
</div>

</div>
`
}

})

return html

}

// ================= ADD =================
function renderAddStock(){

let content=document.getElementById("stockContent")

content.innerHTML=`

<div style="display:flex;flex-direction:column;gap:10px;max-width:400px;">

<select id="cat">
${categories.map(c=>`<option>${c}</option>`).join("")}
</select>

<input id="name" placeholder="ชื่อรายการ">

<div>
จำนวน:
<button onclick="adj('qty',-1)">-</button>
<span id="qty">0</span>
<button onclick="adj('qty',1)">+</button>
</div>

<div>
ขั้นต่ำ:
<button onclick="adj('min',-1)">-</button>
<span id="min">0</span>
<button onclick="adj('min',1)">+</button>
</div>

<input id="unit" placeholder="หน่วย">

<button onclick="addStock()">💾</button>

</div>
`
}

function adj(type,val){
let el=document.getElementById(type)
let v=Number(el.innerText)||0
v+=val
if(v<0)v=0
el.innerText=v
}

function addStock(){

let data=getData("stock")||[]

let itemName = document.getElementById("name").value.trim()

if(!itemName){
alert("กรุณากรอกชื่อรายการ")
return
}

data.push({
category: document.getElementById("cat").value,
name: itemName,
qty:Number(document.getElementById("qty").innerText)||0,
min:Number(document.getElementById("min").innerText)||0,
unit:document.getElementById("unit").value || "-",
update:getToday(),
edit:false
})

saveData("stock",data)

stockTab = document.getElementById("cat").value
drawStockPage()

}

// ================= ACTION =================
function toggleStockEdit(i,state){
let data=getData("stock")||[]
data[i].edit=state
saveData("stock",data)
renderStock()
}

function changeQty(i,val){
let data=getData("stock")||[]
data[i].qty += val
if(data[i].qty<0)data[i].qty=0
saveData("stock",data)
renderStock()
}

function changeMin(i,val){
let data=getData("stock")||[]
data[i].min += val
if(data[i].min<0)data[i].min=0
saveData("stock",data)
renderStock()
}

function saveStock(i){
let data=getData("stock")||[]
data[i].edit=false
data[i].update = getToday()
saveData("stock",data)
renderStock()
}

function deleteStock(i){
let data=getData("stock")||[]
data.splice(i,1)
saveData("stock",data)
renderStock()
}

// ================= UTIL =================
function getToday(){
let d=new Date()
return d.getDate()+"/"+(d.getMonth()+1)+"/"+String(d.getFullYear()).slice(-2)
}

function getRealIndex(item){
let data=getData("stock")||[]
return data.findIndex(i=>
i.name === item.name &&
i.category === item.category
)
}