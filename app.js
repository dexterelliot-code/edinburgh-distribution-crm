const STAGES=["Lead Identified","Researching","Initial Outreach","Follow-up 1","Discovery Meeting","Proposal Sent","Negotiation","Exclusive Agreement","Won","Lost"];
const STORAGE_KEY="edinburgh_distribution_crm_v3_plain";
const starterData={
 deals:[
  {id:uid(),company:"Youibot Robotics",country:"China",title:"Scottish robotics distribution agreement",value:75000,commission:15,stage:"Lead Identified",priority:9,followup:"",owner:"Dylan",notes:"Target industrial, logistics and inspection automation opportunities in Scotland."},
  {id:uid(),company:"MCA Process",country:"France",title:"Scottish food automation representation",value:65000,commission:12,stage:"Researching",priority:8,followup:"",owner:"Dylan",notes:"Relevant to Scottish food and drink manufacturers."},
  {id:uid(),company:"ICA Packaging Machines",country:"Italy",title:"Packaging machinery agency",value:90000,commission:12,stage:"Initial Outreach",priority:9,followup:"",owner:"Dylan",notes:"Target food, coffee, pet food and dry-goods producers."},
  {id:uid(),company:"Veo Technologies",country:"Denmark",title:"Scottish grassroots football partnership",value:30000,commission:10,stage:"Researching",priority:8,followup:"",owner:"Dylan",notes:"Potential venue, club and league sales partnership."}
 ],
 manufacturers:[
  {id:uid(),name:"Youibot Robotics",country:"China",sector:"Industrial robotics and autonomous mobile robots",website:"https://www.youibot.com",email:"chenguyu@youibot.com",contact:"Chenguyu / Channel Cooperation",status:"Priority target",score:92,opportunity:"Scottish manufacturing, logistics, energy and inspection sites.",research:"Public channel-cooperation contact identified. Position the pitch around local representation, demonstrations and access to Scottish industrial prospects."},
  {id:uid(),name:"ICA Packaging Machines",country:"Italy",sector:"Automatic packaging machinery",website:"https://www.icaspa.it/en/",email:"com@icaspa.it",contact:"Export Sales Department",status:"Priority target",score:90,opportunity:"Food, drink, coffee, pet food and dry-product manufacturers across Scotland.",research:"Export sales contact is public. Strong match for Scotland's food and drink sector and a commission-based regional agency proposition."},
  {id:uid(),name:"Veo Technologies",country:"Denmark",sector:"AI sports cameras and video analysis",website:"https://www.veo.co",email:"",contact:"Sales team via booking form",status:"Warm target",score:86,opportunity:"Grassroots clubs, football centres, schools and universities.",research:"Use the official sales-call form and lead with direct Edinburgh venue access, grassroots football knowledge and local installation support."},
  {id:uid(),name:"MCA Process",country:"France",sector:"Food processing and production automation",website:"https://www.mca-process.com",email:"",contact:"Export or business development team",status:"Researching",score:78,opportunity:"Scottish food processors seeking production automation.",research:"Identify the export sales decision-maker and verify whether the UK or Scotland already has an agent."},
  {id:uid(),name:"Pixellot",country:"Israel",sector:"Automated sports production",website:"https://www.pixellot.tv",email:"",contact:"Partnerships or sales team",status:"Researching",score:80,opportunity:"Football centres, clubs, governing bodies and multi-pitch venues.",research:"Assess channel-partner availability and whether local installation and sales coverage could complement its direct model."},
  {id:uid(),name:"Spiideo",country:"Sweden",sector:"Automated sports video and analysis",website:"https://www.spiideo.com",email:"",contact:"Sales or partnerships team",status:"Researching",score:79,opportunity:"Performance clubs, academies and venues needing automated production.",research:"Pitch Scottish market development, venue introductions and first-line relationship management."}
 ],
 contacts:[
  {id:uid(),name:"Chenguyu",company:"Youibot Robotics",role:"Product Enquiries and Channel Cooperation",email:"chenguyu@youibot.com",phone:"",linkedin:"",notes:"Public contact listed for product enquiries and channel cooperation."},
  {id:uid(),name:"Export Sales Department",company:"ICA Packaging Machines",role:"International Sales",email:"com@icaspa.it",phone:"+39 051 6017 900",linkedin:"",notes:"Public export sales contact."}
 ],
 templates:[
  {id:uid(),name:"Initial distributor approach",subject:"Scottish market representation proposal — {{company}}",body:"Hello {{contact}},\n\nMy name is Dylan Keddie and I am based in Edinburgh. I am building a focused sales and market-development operation representing overseas technical manufacturers across Scotland.\n\nI believe {{company}} has a strong opportunity in the Scottish market, particularly within {{sector}}. I can provide local prospecting, venue and customer introductions, product demonstrations, sales follow-up and ongoing account development without the cost of establishing a full local office.\n\nI would like to discuss a commission-based agency or distribution arrangement for Scotland. I can also prepare an initial target-account list and market-entry plan before our first call.\n\nWould you be open to a short introductory conversation next week?\n\nKind regards,\nDylan Keddie\nEdinburgh, Scotland"},
  {id:uid(),name:"Follow-up after no reply",subject:"Following up — Scottish representation for {{company}}",body:"Hello {{contact}},\n\nI wanted to follow up on my note regarding representing {{company}} in Scotland.\n\nMy proposal is straightforward: I would identify and approach suitable Scottish customers, develop the early-stage sales pipeline and act as a local commercial point of contact on a commission-led basis.\n\nI believe the strongest starting opportunities are {{opportunity}}.\n\nWould a 15-minute call be possible to establish whether Scotland is currently covered and whether you are open to a regional partner?\n\nKind regards,\nDylan Keddie"},
  {id:uid(),name:"Post-meeting proposal",subject:"Next steps for Scotland — {{company}}",body:"Hello {{contact}},\n\nThank you for speaking with me. Based on our discussion, I propose starting with a focused 90-day Scottish market-development trial.\n\nThe trial would include:\n• a defined target-account list;\n• direct outreach and qualification;\n• arranged demonstrations or discovery calls;\n• weekly pipeline reporting;\n• agreed commission on completed sales.\n\nThe initial focus would be {{opportunity}}.\n\nI have attached/outlined the proposed targets and would welcome your comments on territory, pricing support, training and commission structure.\n\nKind regards,\nDylan Keddie"}
 ],
 activities:[]
}
let state=JSON.parse(localStorage.getItem(STORAGE_KEY)||JSON.stringify(starterData));
let currentType=null,currentId=null,dragId=null;
state.manufacturers=state.manufacturers||JSON.parse(JSON.stringify(starterData.manufacturers));
state.templates=state.templates||JSON.parse(JSON.stringify(starterData.templates));
state.contacts=state.contacts||[];
state.activities=state.activities||[];


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
 manufacturer:[
  ["name","Manufacturer name","text",true],["country","Country","text"],["sector","Sector / products","text"],
  ["website","Website","url"],["email","Sales / partner email","email"],["contact","Contact or department","text"],
  ["status","Status","text"],["score","Opportunity score (1–100)","number"],
  ["opportunity","Scottish opportunity","textarea"],["research","Research notes","textarea"]
 ],
 contact:[
  ["name","Contact name","text",true],["company","Company","text"],["role","Job title","text"],
  ["email","Email","email"],["phone","Phone","tel"],["linkedin","LinkedIn","url"],["notes","Notes","textarea"]
 ],
 template:[
  ["name","Template name","text",true],["subject","Email subject","text",true],["body","Email body","textarea"]
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
 if(type==="manufacturer")return {id:uid(),name:"",country:"",sector:"",website:"",email:"",contact:"",status:"Researching",score:50,opportunity:"",research:""};
 if(type==="contact")return {id:uid(),name:"",company:"",role:"",email:"",phone:"",linkedin:"",notes:""};
 if(type==="template")return {id:uid(),name:"",subject:"",body:""};
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
byId("addManufacturerBtn").onclick=()=>openDialog("manufacturer");
byId("addContactBtn").onclick=()=>openDialog("contact");
byId("addTemplateBtn").onclick=()=>openDialog("template");
byId("addActivityBtn").onclick=()=>openDialog("activity");

window.editDeal=id=>openDialog("deal",id);
window.editManufacturer=id=>openDialog("manufacturer",id);
window.editContact=id=>openDialog("contact",id);
window.editTemplate=id=>openDialog("template",id);
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

function renderManufacturers(){
 const q=byId("manufacturerSearch").value.toLowerCase();
 const items=state.manufacturers.filter(m=>[m.name,m.country,m.sector,m.status,m.opportunity].join(" ").toLowerCase().includes(q));
 byId("manufacturersGrid").innerHTML=items.map(m=>`<article class="manufacturer-card">
  <div style="display:flex;justify-content:space-between;gap:10px"><div><h3>${esc(m.name)}</h3><div class="muted">${esc(m.country)} · ${esc(m.sector)}</div></div><span class="badge">${Number(m.score)||0}/100</span></div>
  <p><strong>${esc(m.status||"Researching")}</strong></p>
  <div class="research-box"><strong>Scottish opportunity</strong><br>${esc(m.opportunity||"Not added yet.")}</div>
  <div class="research-box"><strong>Research notes</strong><br>${esc(m.research||"Not added yet.")}</div>
  <p class="muted">${esc(m.contact||"No contact yet")} ${m.email?`· ${esc(m.email)}`:""}</p>
  <div class="card-actions">
   <button class="secondary-btn" onclick="editManufacturer('${m.id}')">Edit</button>
   ${m.website?`<button class="secondary-btn" onclick="window.open('${esc(m.website)}','_blank')">Website</button>`:""}
   ${m.email?`<button class="primary-btn" onclick="location.href='mailto:${esc(m.email)}'">Email</button>`:""}
  </div>
 </article>`).join("") || `<p class="muted">No manufacturers found.</p>`;
}
function renderTemplates(){
 const q=byId("templateSearch").value.toLowerCase();
 const items=state.templates.filter(t=>[t.name,t.subject,t.body].join(" ").toLowerCase().includes(q));
 byId("templatesGrid").innerHTML=items.map(t=>`<article class="manufacturer-card">
  <h3>${esc(t.name)}</h3><p><strong>Subject:</strong> ${esc(t.subject)}</p>
  <div class="template-body">${esc(t.body)}</div>
  <div class="card-actions"><button class="secondary-btn" onclick="editTemplate('${t.id}')">Edit</button><button class="primary-btn" onclick="navigator.clipboard.writeText(${JSON.stringify("")}+state.templates.find(x=>x.id==='${t.id}').body).then(()=>alert('Template copied'))">Copy body</button></div>
 </article>`).join("") || `<p class="muted">No templates found.</p>`;
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
function renderAll(){renderDashboard();renderPipeline();renderDeals();renderManufacturers();renderContacts();renderTemplates();renderActivity()}
byId("stageFilter").innerHTML='<option value="">All stages</option>'+STAGES.map(s=>`<option>${s}</option>`).join("");
["pipelineSearch","dealSearch","stageFilter","manufacturerSearch","contactSearch","templateSearch","activitySearch"].forEach(id=>byId(id).addEventListener("input",renderAll));

function exportBackup(){
 const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");
 a.href=URL.createObjectURL(blob);a.download="edinburgh-distribution-crm-v3-backup.json";a.click();URL.revokeObjectURL(a.href);
}
byId("exportBtn").onclick=byId("exportBtnSettings").onclick=exportBackup;
byId("importInput").onchange=async e=>{try{state=JSON.parse(await e.target.files[0].text());save();alert("Backup imported.")}catch{alert("The backup file could not be read.")}e.target.value=""};
byId("loadStarterBtn").onclick=()=>{if(confirm("Load the three starter deals?")){state.deals=[...starterData.deals,...state.deals];save()}};
byId("clearBtn").onclick=()=>{if(confirm("Delete all CRM data in this browser?")){state={deals:[],manufacturers:[],contacts:[],templates:[],activities:[]};save()}};

renderAll();
