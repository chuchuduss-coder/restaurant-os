function refreshKPI(){

let pos=getData("pos")
let exp=getData("expense")
let stock=getData("stock")

let ok1=pos.length>0
let ok2=exp.length>0
let ok3=stock.every(s=>s.qty>s.min)

page_kpi.innerHTML=`

<h2>KPI</h2>

<div>POS Recorded: ${ok1?"✅":"❌"}</div>
<div>Expense Recorded: ${ok2?"✅":"❌"}</div>
<div>Stock OK: ${ok3?"✅":"❌"}</div>

`

let alertBox=document.getElementById("kpiAlert")

if(!ok1||!ok2||!ok3){

alertBox.innerHTML="⚠ KPI incomplete"

}else{

alertBox.innerHTML=""

}

}