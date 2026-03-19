function drawDashboard(){

let container = document.getElementById("page_dashboard")

if(!container) return

let sales = getData("sales") || []
let expense = getData("expense") || []

// ===== คำนวณ =====
let totalSales = 0
let totalExpense = 0

sales.forEach(s=>{
totalSales += (s.grab||0)+(s.lineman||0)+(s.shopee||0)+(s.cashier||0)
})

expense.forEach(e=>{
totalExpense += Number(e.amount)||0
})

let profit = totalSales - totalExpense

// ===== UI =====
container.innerHTML = `

<h2>Dashboard</h2>

<div style="display:flex;gap:20px;flex-wrap:wrap;">

<div class="card">
<h3>💰 Revenue</h3>
<p>${totalSales}</p>
</div>

<div class="card">
<h3>💸 Expense</h3>
<p>${totalExpense}</p>
</div>

<div class="card">
<h3>📊 Profit</h3>
<p>${profit}</p>
</div>

</div>

<canvas id="dashboardChart" height="100"></canvas>

`

drawDashboardChart(sales)

}

function drawDashboardChart(sales){

let canvas = document.getElementById("dashboardChart")
if(!canvas) return

let ctx = canvas.getContext("2d")

// รวมรายวัน
let map = {}

sales.forEach(s=>{

let d = new Date(s.date).toLocaleDateString()

if(!map[d]) map[d]=0

map[d]+= (s.grab||0)+(s.lineman||0)+(s.shopee||0)+(s.cashier||0)

})

let labels = Object.keys(map)
let data = Object.values(map)

if(typeof Chart === "undefined") return

new Chart(ctx,{
type:"line",
data:{
labels:labels,
datasets:[{
label:"Daily Revenue",
data:data
}]
}
})

}

function refreshDashboard(){

if(typeof drawDashboard==="function"){
drawDashboard()
}

}