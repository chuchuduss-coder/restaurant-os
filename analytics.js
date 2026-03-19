function drawAnalytics(){

let container = document.getElementById("page_analytics")

if(!container) return

container.innerHTML = `

<h2>Analytics</h2>

<canvas id="analyticsChart" height="120"></canvas>

`

let sales = getData("sales") || []

drawAnalyticsChart(sales)

}

function drawAnalyticsChart(sales){

let canvas = document.getElementById("analyticsChart")
if(!canvas) return

if(typeof Chart === "undefined") return

let ctx = canvas.getContext("2d")

// รวมตามช่องทาง
let grab=0, lineman=0, shopee=0, cashier=0

sales.forEach(s=>{
grab += s.grab||0
lineman += s.lineman||0
shopee += s.shopee||0
cashier += s.cashier||0
})

new Chart(ctx,{
type:"bar",
data:{
labels:["GRAB","LINE MAN","SHOPEE","CASHIER"],
datasets:[{
label:"Sales by Channel",
data:[grab,lineman,shopee,cashier]
}]
}
})

}