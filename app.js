function initApp(){

// 🔥 แก้ข้อมูล stock อัตโนมัติ
if(typeof migrateStockData === "function"){
migrateStockData()
}

// ของเดิมคุณ
showPage("dashboard")

}

function showPage(page){

    document.querySelectorAll("#main > div").forEach(p=>{
        p.classList.add("hidden")
    })

    document.getElementById("page_"+page).classList.remove("hidden")

    // ✅ เรียกแบบ safe (มีค่อยเรียก)

    if(page==="dashboard" && typeof drawDashboard==="function"){
        drawDashboard()
    }

    if(page==="pos" && typeof drawPOSPage==="function"){
        drawPOSPage()
    }

    if(page==="expense" && typeof drawExpensePage==="function"){
        drawExpensePage()
    }

    if(page==="stock" && typeof drawStockPage==="function"){
        drawStockPage()
    }

    if(page==="analytics" && typeof drawAnalytics==="function"){
        drawAnalytics()
    }

    if(page==="kpi" && typeof drawKPI==="function"){
        drawKPI()
    }
}

function refreshAll(){

    if(typeof refreshDashboard==="function"){
        refreshDashboard()
    }

}