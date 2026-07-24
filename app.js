const KEY="edinburgh_distribution_crm_v2";
const statuses=["Researching","Contacted","Meeting","Negotiating","Won","Lost"];
let state=JSON.parse(localStorage.getItem(KEY)||'{"manufacturers":[],"contacts":[],"calls":[],"templates":[]}');
let editContext={type:null,id:null};

const seed={
 manufacturers:[
  {id:crypto.randomUUID(),company:"Youibot Robotics",country:"China",industry:"Automation",product:"Autonomous mobile robots",website:"",score:9,dealValue:50000,commissionRate:15,status:"Researching",nextFollowup:"",notes:"Potential European agency opportunity."},
  {id:crypto.randomUUID(),company:"MCA Process",country:"France",industry:"Food automation",product:"Food processing systems",website:"",score:8,dealValue:50000,commissionRate:15,status:"Researching",nextFollowup:"",notes:"Strong fit for Scotland's food and drink sector."},
  {id:crypto.randomUUID(),company:"ICA SpA",country:"Italy",industry:"Packaging",product:"Packaging machinery",website:"",score:8,dealValue:30000,commissionRate:15,status:"Researching",nextFollowup:"",notes:"Potential exclusive territory after proving sales."},
  {id:crypto.randomUUID(),company:"KBB Italia",country:"Italy",industry:"Industrial machinery",product:"Industrial machinery",website:"",score:8,dealValue:50000,commissionRate:15,status:"Researching",nextFollowup:"",notes:"Target export or international sales director."}
 ],
 contacts:[],calls:[],
 templates:[
  {id:crypto.randomUUID(),name:"Initial manufacturer outreach",subject:"Scottish market representation opportunity",body:"Hello [Name],\\n\\nI am building a focused technical sales presence across Edinburgh and Scotland and would like to discuss representing [Company] as your local growth partner.\\n\\nKind regards,\\nDylan Keddie"},
  {id:crypto.randomUUID(),name:"Follow-up after no reply",subject:"Following up: Scottish market opportunity",body:"Hello [Name],\\n\\nI wanted to follow up on my previous message regarding local representation for [Company] in Scotland.\\n\\nKind regards,\\nDylan Keddie"}
 ]
};

function save(){localStorage.setItem(KEY,JSON.stringify(state));renderAll()}
function money(n){return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(Number(n)||0)}
function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function byId(id){return document.getElementById(id)}
function manufacturerName(id){return state.manufacturers.find(x=>x.id===id)?.company||"—"}

function switchView(name){
 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
 byId("view-"+name).classList.add("active");
 document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));
 byId("viewTitle").textContent=document.querySelector(`.nav-item[data-view="${name}"]`).textContent;
 byId("sidebar").classList.remove("open");
}

document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
byId("menuBtn").onclick=()=>byId("sidebar").classList.toggle("open");
byId("themeToggle").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("crm_theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("crm_theme")==="dark")document.body.classList.add("dark");

const schemas={
 manufacturer:[
  ["company","Company","text",true],["country","Country","text"],["industry","Industry","text"],["product","Product","text"],
  ["website","Website","url"],["score","Opportunity score","number"],["dealValue","Estimated deal value (£)","number"],
  ["commissionRate","Commission rate (%)","number"],["status","Status","select"],["nextFollowup","Next follow-up","date"],
  ["notes","Notes","textarea"]
 ],
 contact:[
  ["name","Contact name","text",true],["manufacturerId","Manufacturer","manufacturer"],["jobTitle","Job title","text"],
  ["email","Email","email"],["phone","Phone","tel"],["linkedin","LinkedIn","url"],["notes","Notes","textarea"]
 ],
 call:[
  ["manufacturerId","Manufacturer","manufacturer",true],["contactId","Contact","contact"],["date","Date","date",true],
  ["outcome","Outcome","text"],["notes","Notes","textarea"],["nextAction","Next action","text"]
 ],
 template:[
  ["name","Template name","text",true],["subject","Subject","text"],["body","Email body","textarea"]
 ]
};

function openDialog(type,id=null){
 editContext={type,id}; const existing=id?state[type+"s"].find(x=>x.id===id):{};
 byId("recordDialogTitle").textContent=(id?"Edit ":"Add ")+type;
 byId("deleteRecord").classList.toggle("hidden",!id);
 byId("dynamicFields").innerHTML=schemas[type].map(([key,label,input,required])=>{
   const value=existing?.[key]??"";
   if(input==="select")return `<label>${label}<select name="${key}">${statuses.map(s=>`<option ${value===s?"selected":""}>${s}</option>`).join("")}</select></label>`;
   if(input==="manufacturer")return `<label>${label}<select name="${key}" ${required?"required":""}><option value="">Select…</option>${state.manufacturers.map(m=>`<option value="${m.id}" ${value===m.id?"selected":""}>${esc(m.company)}</option>`).join("")}</select></label>`;
   if(input==="contact")return `<label>${label}<select name="${key}"><option value="">Select…</option>${state.contacts.map(c=>`<option value="${c.id}" ${value===c.id?"selected":""}>${esc(c.name)}</option>`).join("")}</select></label>`;
   if(input==="textarea")return `<label class="full">${label}<textarea name="${key}" rows="5">${esc(value)}</textarea></label>`;
   return `<label>${label}<input name="${key}" type="${input}" value="${esc(value)}" ${required?"required":""}></label>`;
 }).join("");
 byId("recordDialog").showModal();
}

byId("recordForm").onsubmit=e=>{
 e.preventDefault(); const fd=new FormData(e.target); const obj={id:editContext.id||crypto.randomUUID()};
 schemas[editContext.type].forEach(([key])=>obj[key]=fd.get(key)||"");
 ["score","dealValue","commissionRate"].forEach(k=>{if(k in obj)obj[k]=Number(obj[k])||0});
 const arr=state[editContext.type+"s"],i=arr.findIndex(x=>x.id===obj.id);
 if(i>=0)arr[i]=obj;else arr.unshift(obj);
 byId("recordDialog").close();save();
};
byId("closeDialog").onclick=byId("cancelDialog").onclick=()=>byId("recordDialog").close();
byId("deleteRecord").onclick=()=>{if(confirm("Delete this record?")){state[editContext.type+"s"]=state[editContext.type+"s"].filter(x=>x.id!==editContext.id);byId("recordDialog").close();save()}};

byId("quickAddBtn").onclick=()=>openDialog("manufacturer");
byId("addManufacturerBtn").onclick=()=>openDialog("manufacturer");
byId("addContactBtn").onclick=()=>openDialog("contact");
byId("addCallBtn").onclick=()=>openDialog("call");
byId("addTemplateBtn").onclick=()=>openDialog("template");

function renderDashboard(){
 byId("statManufacturers").textContent=state.manufacturers.length;
 byId("statActive").textContent=state.manufacturers.filter(x=>!["Won","Lost"].includes(x.status)).length;
 const today=new Date().toISOString().slice(0,10);
 byId("statFollowups").textContent=state.manufacturers.filter(x=>x.nextFollowup&&x.nextFollowup<=today&&!["Won","Lost"].includes(x.status)).length;
 byId("statPipeline").textContent=money(state.manufacturers.filter(x=>!["Lost"].includes(x.status)).reduce((a,b)=>a+(Number(b.dealValue)||0),0));
 byId("pipelineSummary").innerHTML=statuses.map(s=>`<div class="summary-row"><span>${s}</span><strong>${state.manufacturers.filter(x=>x.status===s).length}</strong></div>`).join("");
 const upcoming=[...state.manufacturers].filter(x=>x.nextFollowup).sort((a,b)=>a.nextFollowup.localeCompare(b.nextFollowup)).slice(0,6);
 byId("dashboardFollowups").innerHTML=upcoming.length?upcoming.map(x=>`<div class="list-row"><div><strong>${esc(x.company)}</strong><div class="muted">${esc(x.nextFollowup)}</div></div><button class="secondary-btn" onclick="openManufacturer('${x.id}')">Open</button></div>`).join(""):`<p class="muted">No follow-ups scheduled.</p>`;
 const priority=[...state.manufacturers].sort((a,b)=>b.score-a.score).slice(0,8);
 byId("priorityCompanies").innerHTML=table(["Company","Country","Score","Status"],priority.map(x=>[x.company,x.country,x.score+"/10",x.status]));
}

function table(headers,rows){
 return `<table class="data-table"><thead><tr>${headers.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
}

window.openManufacturer=id=>openDialog("manufacturer",id);
window.openContact=id=>openDialog("contact",id);
window.openCall=id=>openDialog("call",id);
window.openTemplate=id=>openDialog("template",id);

function renderManufacturers(){
 const q=byId("manufacturerSearch").value.toLowerCase(),country=byId("countryFilter").value,status=byId("statusFilter").value;
 const countries=[...new Set(state.manufacturers.map(x=>x.country).filter(Boolean))].sort();
 const current=country;byId("countryFilter").innerHTML='<option value="">All countries</option>'+countries.map(c=>`<option ${c===current?"selected":""}>${esc(c)}</option>`).join("");
 const data=state.manufacturers.filter(x=>[x.company,x.country,x.industry,x.product].join(" ").toLowerCase().includes(q)&&(!country||x.country===country)&&(!status||x.status===status));
 byId("manufacturerCards").innerHTML=data.length?data.map(x=>`<article class="company-card">
  <div class="card-head"><div><h3>${esc(x.company)}</h3><div class="sub">${esc([x.country,x.industry].filter(Boolean).join(" · "))}</div></div><span class="badge">${esc(x.status)}</span></div>
  <div class="meta-grid"><div><span>Product</span><strong>${esc(x.product||"—")}</strong></div><div><span>Score</span><strong>${x.score||0}/10</strong></div><div><span>Deal value</span><strong>${money(x.dealValue)}</strong></div><div><span>Commission</span><strong>${x.commissionRate||0}%</strong></div></div>
  <div class="card-actions">${x.website?`<a class="secondary-btn" href="${esc(x.website)}" target="_blank">Website</a>`:""}<button class="primary-btn" onclick="openManufacturer('${x.id}')">Open</button></div>
 </article>`).join(""):`<p class="muted">No manufacturers found.</p>`;
}

function renderPipeline(){
 byId("pipelineBoard").innerHTML=statuses.map(s=>`<section class="pipeline-column"><h3>${s} (${state.manufacturers.filter(x=>x.status===s).length})</h3>${state.manufacturers.filter(x=>x.status===s).map(x=>`<article class="pipeline-card" onclick="openManufacturer('${x.id}')"><h4>${esc(x.company)}</h4><div class="muted">${esc(x.country||"")} · ${money(x.dealValue)}</div></article>`).join("")}</section>`).join("");
}
function renderContacts(){
 const q=byId("contactSearch").value.toLowerCase();
 const rows=state.contacts.filter(x=>[x.name,x.jobTitle,x.email,manufacturerName(x.manufacturerId)].join(" ").toLowerCase().includes(q)).map(x=>[x.name,manufacturerName(x.manufacturerId),x.jobTitle||"",x.email||"",`Open`]);
 byId("contactsTable").innerHTML=`<table class="data-table"><thead><tr><th>Name</th><th>Manufacturer</th><th>Job title</th><th>Email</th><th></th></tr></thead><tbody>${state.contacts.filter(x=>[x.name,x.jobTitle,x.email,manufacturerName(x.manufacturerId)].join(" ").toLowerCase().includes(q)).map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(manufacturerName(x.manufacturerId))}</td><td>${esc(x.jobTitle||"")}</td><td>${esc(x.email||"")}</td><td><button class="secondary-btn" onclick="openContact('${x.id}')">Open</button></td></tr>`).join("")}</tbody></table>`;
}
function renderCalls(){
 const q=byId("callSearch").value.toLowerCase();
 const data=[...state.calls].sort((a,b)=>(b.date||"").localeCompare(a.date||"")).filter(x=>[x.notes,x.outcome,x.nextAction,manufacturerName(x.manufacturerId)].join(" ").toLowerCase().includes(q));
 byId("callsList").innerHTML=data.length?data.map(x=>`<div class="list-row"><div><strong>${esc(manufacturerName(x.manufacturerId))}</strong><div class="muted">${esc(x.date||"")} · ${esc(x.outcome||"No outcome")}</div><div>${esc(x.notes||"")}</div></div><button class="secondary-btn" onclick="openCall('${x.id}')">Open</button></div>`).join(""):`<p class="muted">No calls logged.</p>`;
}
function renderFollowups(){
 const data=[...state.manufacturers].filter(x=>x.nextFollowup).sort((a,b)=>a.nextFollowup.localeCompare(b.nextFollowup));
 byId("followupList").innerHTML=data.length?data.map(x=>`<div class="list-row"><div><strong>${esc(x.company)}</strong><div class="muted">${esc(x.nextFollowup)} · ${esc(x.status)}</div></div><button class="secondary-btn" onclick="openManufacturer('${x.id}')">Open</button></div>`).join(""):`<p class="muted">No follow-ups scheduled.</p>`;
}
function renderTemplates(){
 byId("templateCards").innerHTML=state.templates.map(x=>`<article class="template-card"><h3>${esc(x.name)}</h3><p class="sub">${esc(x.subject||"")}</p><p>${esc((x.body||"").slice(0,180))}${(x.body||"").length>180?"…":""}</p><div class="card-actions"><button class="secondary-btn" onclick="navigator.clipboard.writeText(${JSON.stringify(x.body||"")})">Copy</button><button class="primary-btn" onclick="openTemplate('${x.id}')">Edit</button></div></article>`).join("");
}
function renderCalc(){
 const order=Number(byId("calcOrder").value)||0,rate=Number(byId("calcRate").value)||0,costs=Number(byId("calcCosts").value)||0;
 const gross=order*rate/100,net=gross-costs;
 byId("grossCommission").textContent=money(gross);byId("netCommission").textContent=money(net);byId("monthlyCommission").textContent=money(net/12);
}
["calcOrder","calcRate","calcCosts"].forEach(id=>byId(id).oninput=renderCalc);
["manufacturerSearch","countryFilter","statusFilter"].forEach(id=>byId(id).oninput=renderManufacturers);
byId("contactSearch").oninput=renderContacts;byId("callSearch").oninput=renderCalls;

byId("seedBtn").onclick=()=>{if(confirm("Load starter data? Existing records will be kept.")){state.manufacturers=[...seed.manufacturers,...state.manufacturers];state.templates=[...seed.templates,...state.templates];save()}};
byId("clearAllBtn").onclick=()=>{if(confirm("Delete all CRM data on this device?")){state={manufacturers:[],contacts:[],calls:[],templates:[]};save()}};
byId("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="edinburgh-distribution-crm-backup.json";a.click();URL.revokeObjectURL(a.href)};
byId("importInput").onchange=async e=>{try{const data=JSON.parse(await e.target.files[0].text());state=data;save();alert("Backup imported.")}catch{alert("That backup file could not be read.")}e.target.value=""};

function renderAll(){renderDashboard();renderManufacturers();renderPipeline();renderContacts();renderCalls();renderFollowups();renderTemplates();renderCalc()}
renderAll();
