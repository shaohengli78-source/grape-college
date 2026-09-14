const KEY="grape-college-v1";
let data=JSON.parse(localStorage.getItem(KEY)||"null")||{courses:[],sessions:[],tasks:[],questions:[]};
let view="home",selected=null;
const save=()=>localStorage.setItem(KEY,JSON.stringify(data));
const esc=s=>String(s??"").replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
function seed(){if(data.courses.length)return;data.courses=[{id:1,name:"高等数学",teacher:"待填写",room:"待填写"},{id:2,name:"大学英语",teacher:"待填写",room:"待填写"},{id:3,name:"大学物理",teacher:"待填写",room:"待填写"}];save()}
function render(){
 const app=document.querySelector("#app");
 if(view==="detail") return renderDetail(app);
 app.innerHTML=`<main class="shell">
 <div class="top"><div><div class="brand">Grape College</div><div class="muted">把每一节课，变成可追踪的学习记录</div></div></div>
 ${view==="home"?home():view==="courses"?courses():history()}
 </main><nav class="nav">
 <button class="${view==="home"?"active":""}" onclick="view='home';render()">首页</button>
 <button class="${view==="courses"?"active":""}" onclick="view='courses';render()">课程</button>
 <button class="${view==="history"?"active":""}" onclick="view='history';render()">历史</button>
 </nav>`;
}
function home(){return `<section class="hero"><h2>今天学什么？</h2><p class="muted">课程、笔记、作业和疑惑统一记录。</p><div class="actions"><button class="btn" onclick="document.querySelector('#fileInput').click()">上传课程表</button><button class="btn light" onclick="addCourse()">手动添加课程</button></div><div class="stats"><div class="stat">课程<b>${data.courses.length}</b></div><div class="stat">记录<b>${data.sessions.length}</b></div><div class="stat">待办<b>${data.tasks.filter(x=>!x.done).length}</b></div></div></section><div class="section">我的课程</div>${courseGrid(data.courses.slice(0,6))}`}
function courses(){return `<div class="top"><div><div class="section">全部课程</div></div><button class="btn" onclick="addCourse()">＋课程</button></div>${courseGrid(data.courses)} `}
function courseGrid(cs){return cs.length?`<div class="grid">${cs.map(c=>`<article class="card course" onclick="openCourse(${c.id})"><h3>${esc(c.name)}</h3><div class="muted">${esc(c.teacher||"未设置教师")} · ${esc(c.room||"未设置教室")}</div><span class="tag">${data.sessions.filter(s=>s.courseId===c.id).length} 条学习记录</span><span class="tag">${data.tasks.filter(t=>t.courseId===c.id&&!t.done).length} 个待办</span></article>`).join("")}</div>`:`<div class="empty">还没有课程<br><br><button class="btn" onclick="addCourse()">添加第一门课程</button></div>`}
function history(){return `<div class="section">历史记录</div>${data.sessions.length?`<div class="grid">${[...data.sessions].reverse().map(s=>`<article class="card"><b>${esc((data.courses.find(c=>c.id===s.courseId)||{}).name||"课程")}</b><div class="muted">${esc(s.date||"未填写日期")}</div><p>${esc(s.note||"暂无笔记")}</p><span class="tag">${s.questions?.length||0} 个疑惑</span></article>`).join("")}</div>`:`<div class="empty">还没有学习记录。进入课程后即可创建。</div>`}`}
function renderDetail(app){let c=data.courses.find(x=>x.id===selected);let ss=data.sessions.filter(s=>s.courseId===selected);let s=ss[ss.length-1];app.innerHTML=`<main class="shell"><button class="btn light back" onclick="view='courses';render()">← 返回课程</button><div class="detail"><h2>${esc(c.name)}</h2><div class="muted">${esc(c.teacher||"未设置")} · ${esc(c.room||"未设置")}</div><div class="actions" style="margin-top:15px"><button class="btn" onclick="newSession()">＋ 本节课记录</button></div>${s?`<div class="field"><label>上课日期</label><input id="date" value="${esc(s.date||"")}"></div><div class="field"><label>课堂笔记</label><textarea id="note" rows="7" placeholder="记录这节课的重要知识点……">${esc(s.note||"")}</textarea></div><div class="field"><label>作业</label>${data.tasks.filter(t=>t.courseId===selected).map(t=>`<div class="task"><input type="checkbox" ${t.done?"checked":""} onchange="toggleTask(${t.id})"><span>${esc(t.text)}</span></div>`).join("")}<button class="btn light" style="margin-top:10px" onclick="addTask()">＋ 添加作业</button></div><div class="field"><label>疑惑点</label>${(s.questions||[]).map(q=>`<div class="card" style="margin:7px 0">${esc(q)}</div>`).join("")}<button class="btn light" onclick="addQuestion()">＋ 添加疑惑</button></div><button class="btn" onclick="saveSession(${s.id})">保存本节课</button>`:`<div class="empty">还没有本课程的学习记录。<br>点击「本节课记录」开始。</div>`}</div></main>`}
function openCourse(id){selected=id;view="detail";render()}
function newSession(){data.sessions.push({id:Date.now(),courseId:selected,date:new Date().toISOString().slice(0,10),note:"",questions:[]});save();render()}
function saveSession(id){let s=data.sessions.find(x=>x.id===id);s.date=document.querySelector("#date").value;s.note=document.querySelector("#note").value;save();alert("已保存");}
function addTask(){let text=prompt("作业内容");if(!text)return;data.tasks.push({id:Date.now(),courseId:selected,text,done:false});save();render()}
function toggleTask(id){let t=data.tasks.find(x=>x.id===id);t.done=!t.done;save()}
function addQuestion(){let q=prompt("记录你的疑惑");if(!q)return;let ss=data.sessions.filter(s=>s.courseId===selected);if(!ss.length)return alert("请先创建本节课记录");ss[ss.length-1].questions.push(q);save();render()}
function addCourse(){let name=prompt("课程名称");if(!name)return;data.courses.push({id:Date.now(),name,teacher:"待填写",room:"待填写"});save();render()}
document.querySelector("#fileInput").addEventListener("change",e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=x=>{try{const wb=XLSX.read(x.target.result,{type:"array"}),rows=XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]],{defval:""});let added=0;rows.forEach(row=>{let name=row["课程名称"]||row["课程"]||row["科目"]||row["课程名"];if(name&&!data.courses.some(c=>c.name===name)){data.courses.push({id:Date.now()+added,name,teacher:row["教师"]||row["任课教师"]||"待填写",room:row["教室"]||"待填写"});added++}});save();render();alert(`导入完成，新增 ${added} 门课程`)}catch(err){alert("课程表读取失败，请检查 Excel 格式")}};r.readAsArrayBuffer(f)});
seed();render();