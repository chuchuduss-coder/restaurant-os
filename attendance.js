let cameraStarted = false
// ================= CONFIG =================
let attendanceTab = "checkin"

// ================= DRAW =================
function drawAttendancePage(){

let el = document.getElementById("page_attendance")

el.innerHTML = `

<h2>Check-in System</h2>

<!-- ===== TABS ===== -->
<div style="display:flex;gap:10px;margin-bottom:15px;">
<button onclick="switchTab('checkin')"
style="background:${attendanceTab==='checkin'?'#333':'#eee'};
color:${attendanceTab==='checkin'?'#fff':'#000'};
padding:8px 12px;border:none;border-radius:8px;">
Check-in
</button>

<button onclick="switchTab('staff')"
style="background:${attendanceTab==='staff'?'#333':'#eee'};
color:${attendanceTab==='staff'?'#fff':'#000'};
padding:8px 12px;border:none;border-radius:8px;">
พนักงาน
</button>
</div>

<div id="attendanceContent"></div>

`

renderAttendance()

}

// ================= SWITCH TAB =================
function switchTab(tab){
attendanceTab = tab
drawAttendancePage()
}

// ================= RENDER =================
function renderAttendance(){

if(attendanceTab==="checkin"){
renderCheckin()
}else{
renderStaff()
}

}

// ================= CHECK-IN =================
function renderCheckin(){

let el = document.getElementById("attendanceContent")

el.innerHTML = `

<select id="staffSelect"></select>

<video id="video" width="300" autoplay></video>
<canvas id="canvas" style="display:none;"></canvas>

<div style="margin-top:10px;">
<button onclick="capture('checkin')">📸 Check-in</button>
<button onclick="capture('checkout')">📸 Check-out</button>
</div>

<div id="timeline"></div>

`

loadStaff()
startCamera()
renderTimeline()

}

// ================= STAFF =================
function renderStaff(){

let el = document.getElementById("attendanceContent")

let staff = getData("staff") || []

el.innerHTML = `

<div style="margin-bottom:15px;display:flex;gap:10px;flex-wrap:wrap;">
<input id="staffName" placeholder="ชื่อพนักงาน">
<input id="staffPos" placeholder="ตำแหน่ง">
<button onclick="addStaff()">เพิ่ม</button>
</div>

<div id="staffList"></div>

`

renderStaffList()

}

// ================= ADD STAFF =================
function addStaff(){

let name = document.getElementById("staffName").value
let pos = document.getElementById("staffPos").value

if(!name){
alert("กรอกชื่อ")
return
}

let data = getData("staff") || []

data.push({
name:name,
position:pos,
edit:false
})

saveData("staff",data)

drawAttendancePage()

}

// ================= STAFF LIST =================
function renderStaffList(){

let staff = getData("staff") || []

let el = document.getElementById("staffList")

let html = ""

staff.forEach((s,i)=>{

if(!s.edit){

html += `
<div style="display:flex;justify-content:space-between;margin-bottom:8px;">
<div>${s.name} | ${s.position||"-"}</div>
<div>
<button onclick="editStaff(${i},true)">✏️</button>
</div>
</div>
`

}else{

html += `
<div style="display:flex;gap:5px;margin-bottom:8px;flex-wrap:wrap;">
<input id="n${i}" value="${s.name}">
<input id="p${i}" value="${s.position||''}">
<button onclick="saveStaff(${i})">💾</button>
<button onclick="deleteStaff(${i})">🗑</button>
</div>
`

}

})

el.innerHTML = html

}

// ================= STAFF ACTION =================
function editStaff(i,state){

let data = getData("staff")
data[i].edit = state
saveData("staff",data)
renderStaffList()

}

function saveStaff(i){

let data = getData("staff")

data[i].name = document.getElementById("n"+i).value
data[i].position = document.getElementById("p"+i).value
data[i].edit = false

saveData("staff",data)

renderStaffList()

}

function deleteStaff(i){

let data = getData("staff")
data.splice(i,1)

saveData("staff",data)

renderStaffList()

}

// ================= CAMERA =================
async function startCamera(){

    if(cameraStarted) return

    let video = document.getElementById("video")
    if(!video) return

    try{
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        video.srcObject = stream
        cameraStarted = true
    }catch(e){
        console.log("Camera error:", e)
    }

}
// ================= LOAD STAFF =================
function loadStaff(){

    let select = document.getElementById("staffSelect")
    if(!select) return

    let staff = getData("staff") || []

    select.innerHTML = staff.map(s=>`
    <option value="${s.name}">${s.name}</option>
    `).join("")

}

// ================= CAPTURE =================
function capture(type){

let name = document.getElementById("staffSelect").value

if(!video.videoWidth){
    alert("กล้องยังไม่พร้อม")
    return
}

if(!name){
alert("เลือกพนักงานก่อน")
return
}

let video = document.getElementById("video")
let canvas = document.getElementById("canvas")
let ctx = canvas.getContext("2d")

canvas.width = video.videoWidth
canvas.height = video.videoHeight

ctx.drawImage(video,0,0)

// timestamp
let now = new Date()
let text = now.toLocaleString()

ctx.fillStyle = "red"
ctx.font = "20px Arial"
ctx.fillText(text,10,30)

let image = canvas.toDataURL("image/png")

saveAttendance(name,type,image,now)

}

// ================= SAVE =================
function saveAttendance(name,type,image,now){

let data = getData("attendance") || []

let today = now.toISOString().split("T")[0]

let record = data.find(d=>d.name===name && d.date===today)

if(!record){
record = {name:name,date:today,checkin:null,checkout:null}
data.push(record)
}

if(type==="checkin"){
record.checkin = {
time:now.toLocaleTimeString(),
image:image
}
}

if(type==="checkout"){
record.checkout = {
time:now.toLocaleTimeString(),
image:image
}
}

saveData("attendance",data)

renderTimeline()

}

// ================= TIMELINE =================
function renderTimeline(){

    let el = document.getElementById("timeline")
    if(!el) return

    let data = getData("attendance") || []

    data.sort((a,b)=>b.date.localeCompare(a.date))

    let html = ""

    data.forEach(d=>{

        html += `
        <div style="border:1px solid #ccc;padding:10px;margin:10px 0;">
        <h3>${d.name} | ${d.date}</h3>

        <div style="display:flex;gap:10px;flex-wrap:wrap;">

        ${d.checkin ? `
        <div>
        <p>Check-in: ${d.checkin.time}</p>
        <img src="${d.checkin.image}" width="120">
        </div>` : ""}

        ${d.checkout ? `
        <div>
        <p>Check-out: ${d.checkout.time}</p>
        <img src="${d.checkout.image}" width="120">
        </div>` : ""}

        </div>
        </div>
        `
    })

    el.innerHTML = html

}