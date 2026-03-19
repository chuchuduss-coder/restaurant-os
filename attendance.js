// ================= STATE =================
let cameraStarted = false
let attendanceTab = "checkin"

// ================= DRAW PAGE =================
function drawAttendancePage(){

let container = document.getElementById("page_attendance")

if(!container) return

container.innerHTML = `

<h2>Check-in System</h2>

<div style="display:flex;gap:10px;margin-bottom:15px;">
<button onclick="switchAttendanceTab('checkin')"
style="background:${attendanceTab==='checkin'?'#333':'#eee'};color:${attendanceTab==='checkin'?'#fff':'#000'}">
Check-in
</button>

<button onclick="switchAttendanceTab('staff')"
style="background:${attendanceTab==='staff'?'#333':'#eee'};color:${attendanceTab==='staff'?'#fff':'#000'}">
พนักงาน
</button>
</div>

<div id="attendanceContent"></div>

`

renderAttendance()

}

// ================= SWITCH TAB =================
function switchAttendanceTab(tab){
attendanceTab = tab
renderAttendance()
}

// ================= RENDER =================
function renderAttendance(){

let content = document.getElementById("attendanceContent")
if(!content) return

// ===== CHECK-IN PAGE =====
if(attendanceTab === "checkin"){

content.innerHTML = `

<select id="staffSelect"></select>

<br><br>

<video id="video" width="220" autoplay playsinline style="border-radius:10px;"></video>
<canvas id="canvas" style="display:none;"></canvas>

<br><br>

<button onclick="capture('checkin')">Check-in</button>
<button onclick="capture('checkout')">Check-out</button>

<div id="timeline"></div>

`

setTimeout(()=>{
startCamera()
loadStaff()
renderTimeline()
},300)

}

// ===== STAFF PAGE =====
if(attendanceTab === "staff"){

content.innerHTML = `

<h3>เพิ่มพนักงาน</h3>

<input id="staffName" placeholder="ชื่อพนักงาน">
<button onclick="addStaff()">เพิ่ม</button>

<hr>

<div id="staffList"></div>

`

renderStaffList()

}

}

// ================= CAMERA =================
async function startCamera(){

let video = document.getElementById("video")
if(!video) return

try{

const stream = await navigator.mediaDevices.getUserMedia({ video: true })

video.srcObject = stream
video.setAttribute("playsinline", true)

// 🔥 สำคัญ (iPad fix)
video.muted = true

await video.play()

cameraStarted = true

console.log("CAMERA READY")

}catch(e){

console.log(e)
alert("ไม่สามารถเปิดกล้องได้")

}

}

// ================= CAPTURE =================
function capture(type){

console.log("CLICK:", type)

let name = document.getElementById("staffSelect")?.value
let video = document.getElementById("video")
let canvas = document.getElementById("canvas")

if(!name){
alert("เลือกพนักงานก่อน")
return
}

if(!video || video.videoWidth === 0){
alert("กล้องยังไม่พร้อม (รอ 1-2 วินาที)")
return
}

let ctx = canvas.getContext("2d")

let w = 240
let h = video.videoHeight * (240 / video.videoWidth)

canvas.width = w
canvas.height = h

ctx.drawImage(video,0,0,w,h)

// timestamp
let now = new Date()
ctx.fillStyle="red"
ctx.font="12px Arial"
ctx.fillText(now.toLocaleString(),5,15)

// 🔥 บีบภาพ
let image = canvas.toDataURL("image/jpeg",0.3)

// ❌ กัน storage เต็ม
if(image.length > 200000){
alert("รูปใหญ่เกิน")
return
}

saveAttendance(name,type,image,now)

}

// ================= SAVE =================
function saveAttendance(name,type,image,now){

let data = JSON.parse(localStorage.getItem("attendance") || "[]")

let today = now.toISOString().split("T")[0]

let record = data.find(d=>d.name===name && d.date===today)

if(!record){
record = {name:name,date:today,checkin:null,checkout:null}
data.push(record)
}

if(type==="checkin"){
record.checkin = {
time: now.toLocaleTimeString(),
image: image
}
}

if(type==="checkout"){
record.checkout = {
time: now.toLocaleTimeString(),
image: image
}
}

localStorage.setItem("attendance", JSON.stringify(data))

renderTimeline()

alert("บันทึกสำเร็จ ✅")

}

// ================= TIMELINE =================
function renderTimeline(){

let el = document.getElementById("timeline")
if(!el) return

let data = JSON.parse(localStorage.getItem("attendance") || "[]")

data.sort((a,b)=>b.date.localeCompare(a.date))

let html = ""

data.forEach(d=>{

html += `
<div style="border:1px solid #ccc;padding:10px;margin:10px 0;border-radius:10px;">

<h3>${d.name} | ${d.date}</h3>

<div style="display:flex;gap:10px;flex-wrap:wrap;">

${d.checkin ? `
<div>
<p>Check-in: ${d.checkin.time}</p>
<img src="${d.checkin.image}" width="80">
</div>` : ""}

${d.checkout ? `
<div>
<p>Check-out: ${d.checkout.time}</p>
<img src="${d.checkout.image}" width="80">
</div>` : ""}

</div>

</div>
`

})

el.innerHTML = html

}

// ================= STAFF =================
function addStaff(){

let name = document.getElementById("staffName").value

if(!name) return

let data = JSON.parse(localStorage.getItem("staff") || "[]")

data.push({name:name})

localStorage.setItem("staff", JSON.stringify(data))

document.getElementById("staffName").value=""

renderStaffList()

}

// ================= STAFF LIST =================
function renderStaffList(){

let el = document.getElementById("staffList")
if(!el) return

let data = JSON.parse(localStorage.getItem("staff") || "[]")

el.innerHTML = data.map((s,i)=>`
<div style="margin:5px 0;">
${s.name}
<button onclick="deleteStaff(${i})">🗑</button>
</div>
`).join("")

}

// ================= DELETE STAFF =================
function deleteStaff(i){

let data = JSON.parse(localStorage.getItem("staff") || "[]")

data.splice(i,1)

localStorage.setItem("staff", JSON.stringify(data))

renderStaffList()

}

// ================= LOAD STAFF =================
function loadStaff(){

let select = document.getElementById("staffSelect")
if(!select) return

let data = JSON.parse(localStorage.getItem("staff") || "[]")

select.innerHTML = data.map(s=>`
<option value="${s.name}">${s.name}</option>
`).join("")

}

function restartCamera(){

let video = document.getElementById("video")

if(!video) return

// ปิดของเดิมก่อน
if(video.srcObject){
let tracks = video.srcObject.getTracks()
tracks.forEach(track => track.stop())
video.srcObject = null
}

// reset flag
cameraStarted = false

// เปิดใหม่
setTimeout(()=>{
startCamera()
},300)

}
