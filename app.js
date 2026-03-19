// ================= INIT =================
function initApp(){

    // 🔥 migrate stock (ของเดิมคุณ)
    if(typeof migrateStockData === "function"){
        migrateStockData()
    }

    // 🔥 init stock ตัวอย่าง (กัน empty)
    if(typeof initStockIfEmpty === "function"){
        initStockIfEmpty()
    }

    // เปิดหน้าแรก
    showPage("dashboard")

}


// ================= PAGE CONTROL =================
function showPage(page){

    // ซ่อนทุกหน้า
    document.querySelectorAll("#main > div").forEach(p=>{
        p.classList.add("hidden")
    })

    // แสดงหน้าที่เลือก
    let target = document.getElementById("page_"+page)
    if(target){
        target.classList.remove("hidden")
    }

    // ================= SAFE DRAW =================

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

    // ✅ 🔥 เพิ่มหน้าใหม่ (สำคัญ)
    if(page==="attendance" && typeof drawAttendancePage==="function"){
        drawAttendancePage()
    }
	


}


// ================= REFRESH =================
function refreshAll(){

    // Dashboard
    if(typeof refreshDashboard==="function"){
        refreshDashboard()
    }

    // POS
    if(typeof renderPOS==="function"){
        renderPOS()
    }

    // Expense
    if(typeof renderExpense==="function"){
        renderExpense()
    }

    // Stock
    if(typeof renderStock==="function"){
        renderStock()
    }

    // Analytics
    if(typeof drawAnalytics==="function"){
        drawAnalytics()
    }

    // KPI
    if(typeof drawKPI==="function"){
        drawKPI()
    }

    // Attendance
    if(typeof renderTimeline==="function"){
        renderTimeline()
    }

}


// ================= LOGOUT =================
function logout(){

    // ✅ confirm
    if(!confirm("ต้องการออกจากระบบ?")) return

    // 🛑 ปิดกล้อง (สำคัญมาก)
    let video = document.getElementById("video")
    if(video && video.srcObject){
        let tracks = video.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        video.srcObject = null
    }

    // 🔄 reset camera flag (จาก attendance.js)
    if(typeof cameraStarted !== "undefined"){
        cameraStarted = false
    }

    // 🔄 reset tab
    if(typeof attendanceTab !== "undefined"){
        attendanceTab = "checkin"
    }

    // 🧹 ล้างหน้า UI ทุกหน้า
    document.querySelectorAll("#main > div").forEach(p=>{
        p.innerHTML = ""
        p.classList.add("hidden")
    })

    // 🔐 ซ่อน app
    document.getElementById("app").style.display = "none"

    // 🔓 แสดง login
    document.getElementById("loginPage").style.display = "block"

}


// ================= LOGIN SUCCESS =================
// (เรียกจาก auth.js)
function onLoginSuccess(){

    document.getElementById("loginPage").style.display = "none"
    document.getElementById("app").style.display = "flex"

    initApp()

}