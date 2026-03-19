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
<button class="tabBtn ${attendanceTab==='checkin'?'active':''}" 
onclick="switchAttendanceTab('checkin')">Check-in</button>

<button class="tabBtn ${attendanceTab==='staff'?'active':''}" 
onclick="switchAttendanceTab('staff')">พนักงาน</button>
</div>

<div id="attendanceContent"></div>
`

renderAttendance()

}

// ================= SWITCH TAB =================
function switchAttendanceTab(tab){
attendanceTab = tab
drawAttendancePage()
}

// ================= RENDER =================
function renderAttendance(){

let content = document.getElementById("attendanceContent")
if(!content) return

// ===== CHECK-IN =====
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
},400)

}

// ===== STAFF =====
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
video.muted = true

await video.play()

cameraStarted = true

}catch(e){
console.log(e)
showToast("❌ เปิดกล้องไม่ได้")
}

}

// ================= CAPTURE =================
function capture(type){

let name = document.getElementById("staffSelect")?.value
let video = document.getElementById("video")
let canvas = document.getElementById("canvas")

if(!name){
showToast("เลือกพนักงานก่อน")
return
}

if(!video || video.videoWidth === 0){
showToast("กล้องยังไม่พร้อม")
return
}

let ctx = canvas.getContext("2d")

let w = 200
let h = video.videoHeight * (200 / video.videoWidth)

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

saveAttendance(name,type,image,now)

// 🔄 restart camera (แก้ค้าง)
setTimeout(()=>{
restartCamera()
},200)

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

showToast("บันทึกสำเร็จ ✅")

}

// ================= TOAST =================
function showToast(msg){

let toast = document.createElement("div")

toast.innerText = msg

toast.style.position = "fixed"
toast.style.bottom = "20px"
toast.style.left = "50%"
toast.style.transform = "translateX(-50%)"
toast.style.background = "#333"
toast.style.color = "#fff"
toast.style.padding = "10px 20px"
toast.style.borderRadius = "10px"
toast.style.zIndex = "9999"

document.body.appendChild(toast)

setTimeout(()=>toast.remove(),1500)

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
<img src="${d.checkin.image}" width="70">
</div>` : ""}

${d.checkout ? `
<div>
<p>Check-out: ${d.checkout.time}</p>
<img src="${d.checkout.image}" width="70">
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

// ================= DELETE =================
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

// ================= RESTART CAMERA =================
function restartCamera(){

let video = document.getElementById("video")
if(!video) return

if(video.srcObject){
video.srcObject.getTracks().forEach(t=>t.stop())
video.srcObject = null
}

cameraStarted = false

setTimeout(()=>{
startCamera()
},200)

}