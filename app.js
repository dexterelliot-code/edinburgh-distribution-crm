const STAGES=["Lead Identified","Researching","Initial Outreach","Follow-up 1","Discovery Meeting","Proposal Sent","Negotiation","Exclusive Agreement","Won","Lost"];
const STORAGE_KEY="edinburgh_distribution_crm_v3_plain";
const starterData={
 deals:[
  {id:uid(),company:"Youibot Robotics",country:"China",title:"Scottish distribution agreement",value:50000,commission:15,stage:"Lead Identified",priority:9,followup:"",owner:"Dylan",notes:"Potential robotics distribution partnership."},
  {id:uid(),company:"MCA Process",country:"France",title:"Scottish food automation representation",value:65000,commission:12,stage:"Researching",priority:8,followup:"",owner:"Dylan",notes:"Relevant to food and drink manufacturers."},
  {id:uid(),company:"ICA SpA",country:"Italy",title:"Packaging machinery agency",value:40000,commission:15,stage:"Initial Outreach",priority:8,followup:"",owner:"Dylan",notes:"Target export sales director."}
 ],contacts:[],activities:[]
};
let state=JSON.parse(localStorage.getItem(STORAGE_KEY)||JSON.stringify(starterData));
let currentType=null,currentId=null,dragId=null;

function uid(){return crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2)}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state));renderAll()}
function money(v){return new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(Number(v)||0)}
function esc(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function byId(id){return document.getElementById(id)}
function today(){return new Date().toISOString().slice(0,10)}

document.querySelectorAll(".nav-btn").forEach(btn=>btn.addEventListener("click",()=>switchView(btn.dataset.view)));
byId("menuBtn").onclick=()=>byId("sidebar").classList.toggle("open");
byId("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("crm_v3_plain_theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("crm_v3_plain_theme")==="dark")document.body.classList.add("dark");

function switchView(view){
 document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
 byId("view-"+view).classList.add("active");
 document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
 byId("pageTitle").textContent=document.querySelector(`[data-view="${view}"]`).textContent;
 byId("sidebar").classList.remove("open");
}

const schemas={
 deal:[
  ["company","Company","text",true],["country","Country","text"],["title","Deal title","text",true],
  ["stage","Stage","stage"],["value","Deal value (£)","number"],["commission","Commission (%)","number"],
  ["priority","Priority (1–10)","number"],["followup","Next follow-up","date"],["owner","Owner","text"],
  ["notes","Notes","textarea"]
 ],
 contact:[
  ["name","Contact name","text",true],["company","Company","text"],["role","Job title","text"],
  ["email","Email","email"],["phone","Phone","tel"],["linkedin","LinkedIn","url"],["notes","Notes","textarea"]
 ],
 activity:[
  ["type","Activity type","activityType"],["company","Company","text"],["date","Date","date",true],
  ["summary","Summary","text",true],["notes","Notes","textarea"]
 ]
};

function openDialog(type,id=null){
 currentType=type;currentId=id;
 const list=state[type+"s"],record=id?list.find(x=>x.id===id):defaultRecord(type);
 byId("dialogTitle").textContent=(id?"Edit ":"Add ")+type;
 byId("deleteBtn").classList.toggle("hidden",!id);
 byId("formFields").innerHTML=schemas[type].map(([key,label,input,required])=>{
  const val=record[key]??"";
  if(input==="stage")return `<label>${label}<select name="${key}">${STAGES.map(s=>`<option ${s===val?"selected":""}>${s}</option>`).join("")}</select></label>`;
  if(input==="activityType")return `<label>${label}<select name="${key}">${["Call","Email","Meeting","Note","Task"].map(s=>`<option ${s===val?"selected":""}>${s}</option>`).join("")}</select></label>`;
  if(input==="textarea")return `<label class="full">${label}<textarea name="${key}" rows="5">${esc(val)}</textarea></label>`;
  return `<label>${label}<input name="${key}" type="${input}" value="${esc(val)}" ${required?"required":""}></label>`;
 }).join("");
 byId("recordDialog").showModal();
}
function defaultRecord(type){
 if(type==="deal")return {id:uid(),company:"",country:"",title:"",stage:STAGES[0],value:0,commission:15,priority:5,followup:"",owner:"Dylan",notes:""};
 if(type==="contact")return {id:uid(),name:"",company:"",role:"",email:"",phone:"",linkedin:"",notes:""};
 return {id:uid(),type:"Call",company:"",date:today(),summary:"",notes:""};
}
byId("recordForm").onsubmit=e=>{
 e.preventDefault();const fd=new FormData(e.target),record={id:currentId||uid()};
 schemas[currentType].forEach(([key])=>record[key]=fd.get(key)||"");
 ["value","commission","priority"].forEach(k=>{if(k in record)record[k]=Number(record[k])||0});
 const list=state[currentType+"s"],i=list.findIndex(x=>x.id===record.id);
 if(i>=0)list[i]=record;else list.unshift(record);
 byId("recordDialog").close();save();
};
byId("closeDialog").onclick=byId("cancelBtn").onclick=()=>byId("recordDialog").close();
byId("deleteBtn").onclick=()=>{if(confirm("Delete this record?")){state[currentType+"s"]=state[currentType+"s"].filter(x=>x.id!==currentId);byId("recordDialog").close();save()}};
byId("addDealBtn").onclick=()=>openDialog("deal");
byId("addContactBtn").onclick=()=>openDialog("contact");
byId("addActivityBtn").onclick=()=>openDialog("activity");

window.editDeal=id=>openDialog("deal",id);
window.editContact=id=>openDialog("contact",id);
window.editActivity=id=>openDialog("activity",id);

function renderDashboard(){
 const active=state.deals.filter(d=>!["Won","Lost"].includes(d.stage));
 const pipeline=active.reduce((s,d)=>s+Number(d.value||0),0);
 const commission=active.reduce((s,d)=>s+Number(d.value||0)*Number(d.commission||0)/100,0);
 const won=state.deals.filter(d=>d.stage==="Won").length,lost=state.deals.filter(d=>d.stage==="Lost").length;
 const winRate=(won+lost)?Math.round(won/(won+lost)*100):0;
 const average=state.deals.length?state.deals.reduce((s,d)=>s+Number(d.value||0),0)/state.deals.length:0;
 const due=state.deals.filter(d=>d.followup===today()).length;
 byId("stats").innerHTML=[
  ["Active deals",active.length],["Pipeline value",money(pipeline)],["Projected commission",money(commission)],
  ["Due today",due],["Win rate",winRate+"%"],["Average deal",money(average)]
 ].map(x=>`<article class="stat"><span>${x[0]}</span><strong>${x[1]}</strong></article>`).join("");
 byId("stageSummary").innerHTML=STAGES.map(s=>`<div class="row"><span>${s}</span><strong>${state.deals.filter(d=>d.stage===s).length}</strong></div>`).join("");
 const upcoming=[...state.deals].filter(d=>d.followup).sort((a,b)=>a.followup.localeCompare(b.followup)).slice(0,6);
 byId("followupSummary").innerHTML=upcoming.length?upcoming.map(d=>`<div class="row"><div><strong>${esc(d.company)}</strong><div class="muted">${esc(d.followup)} · ${esc(d.stage)}</div></div><button class="secondary-btn" onclick="editDeal('${d.id}')">Open</button></div>`).join(""):`<p class="muted">No follow-ups scheduled.</p>`;
 const top=[...state.deals].sort((a,b)=>b.value-a.value).slice(0,8);
 byId("topDeals").innerHTML=dealTable(top);
}
function dealTable(deals){
 return `<table><thead><tr><th>Company</th><th>Deal</th><th>Stage</th><th>Value</th><th>Commission</th><th></th></tr></thead><tbody>${deals.map(d=>`<tr><td>${esc(d.company)}</td><td>${esc(d.title)}</td><td>${esc(d.stage)}</td><td>${money(d.value)}</td><td>${money(d.value*d.commission/100)}</td><td><button class="secondary-btn" onclick="editDeal('${d.id}')">Open</button></td></tr>`).join("")}</tbody></table>`;
}
function renderPipeline(){
 const q=byId("pipelineSearch").value.toLowerCase();
 const deals=state.deals.filter(d=>[d.company,d.country,d.title,d.stage].join(" ").toLowerCase().includes(q));
 byId("kanban").innerHTML=STAGES.map(stage=>`<section class="column" data-stage="${stage}">
  <h3>${stage} (${deals.filter(d=>d.stage===stage).length})</h3>
  ${deals.filter(d=>d.stage===stage).map(d=>`<article class="deal-card" draggable="true" data-id="${d.id}" ondblclick="editDeal('${d.id}')">
   <div style="display:flex;justify-content:space-between;gap:8px"><div><h4>${esc(d.company)}</h4><div class="sub">${esc(d.country)}</div></div><span class="badge">${d.priority}/10</span></div>
   <p>${esc(d.title)}</p>
   <div class="deal-meta"><div><span>Value</span><strong>${money(d.value)}</strong></div><div><span>Commission</span><strong>${money(d.value*d.commission/100)}</strong></div><div><span>Owner</span><strong>${esc(d.owner||"—")}</strong></div><div><span>Follow-up</span><strong>${esc(d.followup||"—")}</strong></div></div>
  </article>`).join("")}
 </section>`).join("");
 document.querySelectorAll(".deal-card").forEach(card=>card.addEventListener("dragstart",()=>dragId=card.dataset.id));
 document.querySelectorAll(".column").forEach(col=>{
  col.addEventListener("dragover",e=>{e.preventDefault();col.classList.add("drag-over")});
  col.addEventListener("dragleave",()=>col.classList.remove("drag-over"));
  col.addEventListener("drop",()=>{col.classList.remove("drag-over");const d=state.deals.find(x=>x.id===dragId);if(d){d.stage=col.dataset.stage;save()}dragId=null});
 });
}
function renderDeals(){
 const q=byId("dealSearch").value.toLowerCase(),stage=byId("stageFilter").value;
 const deals=state.deals.filter(d=>[d.company,d.country,d.title,d.stage].join(" ").toLowerCase().includes(q)&&(!stage||d.stage===stage));
 byId("dealsTable").innerHTML=dealTable(deals);
}
function renderContacts(){
 const q=byId("contactSearch").value.toLowerCase();
 const contacts=state.contacts.filter(c=>[c.name,c.company,c.role,c.email].join(" ").toLowerCase().includes(q));
 byId("contactsTable").innerHTML=`<table><thead><tr><th>Name</th><th>Company</th><th>Role</th><th>Email</th><th></th></tr></thead><tbody>${contacts.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.company)}</td><td>${esc(c.role)}</td><td>${esc(c.email)}</td><td><button class="secondary-btn" onclick="editContact('${c.id}')">Open</button></td></tr>`).join("")}</tbody></table>`;
}
function renderActivity(){
 const q=byId("activitySearch").value.toLowerCase();
 const items=state.activities.filter(a=>[a.type,a.company,a.summary,a.notes].join(" ").toLowerCase().includes(q)).sort((a,b)=>(b.date||"").localeCompare(a.date||""));
 byId("activityList").innerHTML=items.length?items.map(a=>`<div class="row"><div><strong>${esc(a.type)} — ${esc(a.summary)}</strong><div class="muted">${esc(a.date)} · ${esc(a.company||"No company")}</div><div>${esc(a.notes||"")}</div></div><button class="secondary-btn" onclick="editActivity('${a.id}')">Open</button></div>`).join(""):`<p class="muted">No activity logged.</p>`;
}
function renderAll(){renderDashboard();renderPipeline();renderDeals();renderContacts();renderActivity()}
byId("stageFilter").innerHTML='<option value="">All stages</option>'+STAGES.map(s=>`<option>${s}</option>`).join("");
["pipelineSearch","dealSearch","stageFilter","contactSearch","activitySearch"].forEach(id=>byId(id).addEventListener("input",renderAll));

function exportBackup(){
 const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");
 a.href=URL.createObjectURL(blob);a.download="edinburgh-distribution-crm-v3-backup.json";a.click();URL.revokeObjectURL(a.href);
}
byId("exportBtn").onclick=byId("exportBtnSettings").onclick=exportBackup;
byId("importInput").onchange=async e=>{try{state=JSON.parse(await e.target.files[0].text());save();alert("Backup imported.")}catch{alert("The backup file could not be read.")}e.target.value=""};
byId("loadStarterBtn").onclick=()=>{if(confirm("Load the three starter deals?")){state.deals=[...starterData.deals,...state.deals];save()}};
byId("clearBtn").onclick=()=>{if(confirm("Delete all CRM data in this browser?")){state={deals:[],contacts:[],activities:[]};save()}};

renderAll();
