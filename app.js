const STAGES=["Lead Identified","Researching","Initial Outreach","Follow-up 1","Discovery Meeting","Proposal Sent","Negotiation","Exclusive Agreement","Won","Lost"];
const OUTREACH_STAGES=["Not contacted","Initial email","Follow-up","Replied","Meeting booked","Proposal sent","Negotiating","Won"];
const PROBABILITIES={"Lead Identified":10,"Researching":15,"Initial Outreach":20,"Follow-up 1":30,"Discovery Meeting":45,"Proposal Sent":60,"Negotiation":75,"Exclusive Agreement":90,"Won":100,"Lost":0};
const KEY="edinburgh_distribution_os_v5";
const uid=()=>crypto.randomUUID?crypto.randomUUID():Date.now().toString(36)+Math.random().toString(36).slice(2);
const today=()=>new Date().toISOString().slice(0,10);
const plusDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const starter=()=>({
 profile:{businessName:"Edinburgh Distribution",ownerName:"Dylan Keddie",location:"Edinburgh, Scotland",email:"",phone:""},
 deals:[
  {id:uid(),company:"Youibot Robotics",country:"China",title:"Scottish robotics representation",stage:"Initial Outreach",value:85000,commission:15,priority:"High",followup:plusDays(2),owner:"Dylan",notes:"Lead with Scottish manufacturing, logistics, energy and inspection opportunities."},
  {id:uid(),company:"ICA Packaging Machines",country:"Italy",title:"Packaging machinery agency",stage:"Researching",value:110000,commission:12,priority:"High",followup:plusDays(4),owner:"Dylan",notes:"Strong fit for Scottish food and drink producers."},
  {id:uid(),company:"Veo Technologies",country:"Denmark",title:"Grassroots football partnership",stage:"Discovery Meeting",value:42000,commission:10,priority:"High",followup:plusDays(1),owner:"Dylan",notes:"Position venue access and local football knowledge."},
  {id:uid(),company:"MCA Process",country:"France",title:"Food automation representation",stage:"Lead Identified",value:70000,commission:12,priority:"Medium",followup:plusDays(6),owner:"Dylan",notes:"Target processors and production facilities."},
  {id:uid(),company:"Spiideo",country:"Sweden",title:"Scottish sports video sales coverage",stage:"Follow-up 1",value:38000,commission:10,priority:"Medium",followup:plusDays(3),owner:"Dylan",notes:"Focus academies, performance clubs and multi-pitch venues."}
 ],
 manufacturers:[
  {id:uid(),name:"Youibot Robotics",country:"China",city:"Shenzhen",sector:"Autonomous mobile robots and industrial robotics",website:"https://www.youibot.com",email:"chenguyu@youibot.com",contact:"Channel Cooperation",status:"Priority target",score:94,opportunity:850000,ukPresence:"Limited / verify",scotlandPresence:"No dedicated Scottish representative identified",competitors:"MiR, Omron, KUKA",targetIndustries:"Manufacturing, logistics, energy, laboratories",nextAction:"Send tailored Scottish representation proposal",research:"Strong channel-partner fit. Local demonstrations and site introductions could reduce market-entry friction.",outreachStage:"Initial email"},
  {id:uid(),name:"ICA Packaging Machines",country:"Italy",city:"Bologna",sector:"Automatic packaging machinery",website:"https://www.icaspa.it/en/",email:"com@icaspa.it",contact:"Export Sales Department",status:"Priority target",score:92,opportunity:1100000,ukPresence:"Export activity present / coverage to verify",scotlandPresence:"No dedicated Scottish agency identified",competitors:"Ishida, Rovema, Syntegon",targetIndustries:"Food, coffee, pet food, dry products",nextAction:"Research Scottish target accounts and send export-sales email",research:"Excellent fit with Scotland's food and drink sector. Position local prospecting, qualification and demonstrations.",outreachStage:"Not contacted"},
  {id:uid(),name:"Veo Technologies",country:"Denmark",city:"Copenhagen",sector:"AI sports cameras and video analysis",website:"https://www.veo.co",email:"",contact:"Sales and partnerships team",status:"Warm target",score:89,opportunity:420000,ukPresence:"Established UK customer base",scotlandPresence:"Opportunity for deeper venue and grassroots coverage",competitors:"Pixellot, Spiideo, Trace",targetIndustries:"Football clubs, venues, schools, universities",nextAction:"Prepare venue-partner proposal and book sales call",research:"Use Edinburgh venue access, grassroots football background and on-the-ground sales support as differentiators.",outreachStage:"Meeting booked"},
  {id:uid(),name:"MCA Process",country:"France",city:"Quimper",sector:"Food processing and production automation",website:"https://www.mca-process.com",email:"",contact:"Export / business development",status:"Researching",score:82,opportunity:700000,ukPresence:"To verify",scotlandPresence:"No dedicated coverage identified",competitors:"GEA, Marel, JBT",targetIndustries:"Seafood, meat, bakery, prepared foods",nextAction:"Identify export decision-maker",research:"Potential fit with Scottish food processors and seafood operations.",outreachStage:"Not contacted"},
  {id:uid(),name:"Spiideo",country:"Sweden",city:"Malmö",sector:"Automated sports production and analysis",website:"https://www.spiideo.com",email:"",contact:"Sales / partnerships",status:"Warm target",score:84,opportunity:380000,ukPresence:"UK customers present",scotlandPresence:"Local penetration opportunity",competitors:"Veo, Pixellot, Hudl",targetIndustries:"Academies, clubs, venues and universities",nextAction:"Follow up with Scottish market-development angle",research:"Could benefit from venue introductions and local account development.",outreachStage:"Follow-up"},
  {id:uid(),name:"Pixellot",country:"Israel",city:"Petah Tikva",sector:"Automated sports production",website:"https://www.pixellot.tv",email:"",contact:"Partnerships team",status:"Researching",score:81,opportunity:500000,ukPresence:"Existing partnerships",scotlandPresence:"Coverage to verify",competitors:"Veo, Spiideo",targetIndustries:"Leagues, venues, governing bodies",nextAction:"Verify partner programme",research:"Assess whether regional venue sales and installation support complement the current model.",outreachStage:"Not contacted"}
 ],
 contacts:[
  {id:uid(),name:"Chenguyu",company:"Youibot Robotics",role:"Product Enquiries / Channel Cooperation",email:"chenguyu@youibot.com",phone:"",linkedin:"",status:"Prospect",notes:"Public channel cooperation contact."},
  {id:uid(),name:"Export Sales Department",company:"ICA Packaging Machines",role:"International Sales",email:"com@icaspa.it",phone:"+39 051 6017 900",linkedin:"",status:"Prospect",notes:"Public export sales contact."},
  {id:uid(),name:"Sales Team",company:"Veo Technologies",role:"Sales and Partnerships",email:"",phone:"",linkedin:"",status:"Prospect",notes:"Use official sales-call route."}
 ],
 templates:[
  {id:uid(),name:"Initial representation approach",subject:"Scottish market representation proposal — {{company}}",body:"Hello {{contact}},\n\nMy name is Dylan Keddie and I am based in Edinburgh. I am building a focused sales and market-development operation representing overseas technical manufacturers across Scotland.\n\nI believe {{company}} has a strong opportunity in the Scottish market, particularly within {{sector}}. I can provide local prospecting, customer introductions, demonstrations, sales follow-up and ongoing account development without the cost of establishing a full local office.\n\nI would like to discuss a commission-based agency or distribution arrangement for Scotland. I can also prepare an initial target-account list and market-entry plan before our first call.\n\nWould you be open to a short introductory conversation next week?\n\nKind regards,\nDylan Keddie\nEdinburgh, Scotland"},
  {id:uid(),name:"Follow-up after no reply",subject:"Following up — Scottish representation for {{company}}",body:"Hello {{contact}},\n\nI wanted to follow up on my note regarding representing {{company}} in Scotland.\n\nMy proposal is straightforward: I would identify and approach suitable Scottish customers, develop the early-stage sales pipeline and act as a local commercial point of contact on a commission-led basis.\n\nI believe the strongest starting opportunities are {{opportunity}}.\n\nWould a 15-minute call be possible to establish whether Scotland is currently covered and whether you are open to a regional partner?\n\nKind regards,\nDylan Keddie"},
  {id:uid(),name:"Post-meeting 90-day proposal",subject:"Next steps for Scotland — {{company}}",body:"Hello {{contact}},\n\nThank you for speaking with me. Based on our discussion, I propose starting with a focused 90-day Scottish market-development trial.\n\nThe trial would include:\n• a defined target-account list;\n• direct outreach and qualification;\n• arranged demonstrations or discovery calls;\n• weekly pipeline reporting;\n• agreed commission on completed sales.\n\nThe initial focus would be {{opportunity}}.\n\nI would welcome your comments on territory, pricing support, product training and commission structure.\n\nKind regards,\nDylan Keddie"}
 ],
 outreach:[
  {id:uid(),date:plusDays(-6),company:"Youibot Robotics",contact:"Chenguyu",type:"Initial email",status:"Awaiting reply",subject:"Scottish market representation proposal"},
  {id:uid(),date:plusDays(-4),company:"Veo Technologies",contact:"Sales Team",type:"Sales enquiry",status:"Meeting booked",subject:"Scottish grassroots football market opportunity"},
  {id:uid(),date:plusDays(-2),company:"Spiideo",contact:"Sales / partnerships",type:"Follow-up",status:"Awaiting reply",subject:"Scottish market development follow-up"}
 ],
 tasks:[
  {id:uid(),title:"Prepare Youibot target-account list",company:"Youibot Robotics",due:plusDays(2),priority:"High",status:"open",notes:"Include manufacturing, logistics and energy prospects."},
  {id:uid(),title:"Book Veo discovery call",company:"Veo Technologies",due:plusDays(1),priority:"High",status:"open",notes:"Prepare venue rollout concept first."},
  {id:uid(),title:"Research ICA UK coverage",company:"ICA Packaging Machines",due:plusDays(4),priority:"Medium",status:"open",notes:"Verify existing UK or Scottish distributor."},
  {id:uid(),title:"Draft Spiideo follow-up",company:"Spiideo",due:plusDays(3),priority:"Medium",status:"open",notes:"Lead with Edinburgh venue opportunities."}
 ],
 documents:[
  {id:uid(),name:"Scottish Market Entry Proposal",company:"General",type:"Proposal",url:"",version:"1.0",notes:"Master proposal structure for overseas manufacturers."},
  {id:uid(),name:"Football Camera Venue Concept",company:"Veo Technologies",type:"Concept note",url:"",version:"1.0",notes:"Venue and grassroots market concept."},
  {id:uid(),name:"Target Account Framework",company:"General",type:"Sales resource",url:"",version:"1.0",notes:"Template for building Scottish prospect lists."}
 ],
 activities:[
  {id:uid(),date:plusDays(-1),type:"Meeting",company:"Veo Technologies",summary:"Discovery call moved into planning",notes:"Prepare Scottish venue rollout outline."},
  {id:uid(),date:plusDays(-2),type:"Email",company:"Spiideo",summary:"Follow-up prepared",notes:"Awaiting response."},
  {id:uid(),date:plusDays(-4),type:"Research",company:"ICA Packaging Machines",summary:"Export sales route identified",notes:"Build target account list."},
  {id:uid(),date:plusDays(-6),type:"Email",company:"Youibot Robotics",summary:"Initial representation email logged",notes:"Follow up after five working days."}
 ]
});
let state=JSON.parse(localStorage.getItem(KEY)||"null")||starter();
["deals","manufacturers","contacts","templates","outreach","tasks","documents","activities"].forEach(k=>state[k]=state[k]||[]);
state.profile=state.profile||starter().profile;
let activeTemplateId=state.templates[0]?.id||null,currentType=null,currentId=null,dragId=null;
const $=id=>document.getElementById(id);
const esc=(v="")=>String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]));
const money=v=>new Intl.NumberFormat("en-GB",{style:"currency",currency:"GBP",maximumFractionDigits:0}).format(Number(v)||0);
function save(){localStorage.setItem(KEY,JSON.stringify(state));renderAll()}
function switchView(name){document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));$("view-"+name).classList.add("active");document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===name));$("pageTitle").textContent=document.querySelector(`[data-view="${name}"]`).textContent.trim();$("sidebar").classList.remove("open");if(name==="proposals")renderProposal()}
document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
document.querySelectorAll("[data-jump]").forEach(b=>b.onclick=()=>switchView(b.dataset.jump));
$("menuBtn").onclick=()=>$("sidebar").classList.toggle("open");
$("themeBtn").onclick=()=>{document.body.classList.toggle("dark");localStorage.setItem("edv5_theme",document.body.classList.contains("dark")?"dark":"light")};
if(localStorage.getItem("edv5_theme")==="dark")document.body.classList.add("dark");

const schemas={
 deal:[["company","Company","text",1],["country","Country","text"],["title","Deal title","text",1],["stage","Stage","stage"],["value","Deal value (£)","number"],["commission","Commission (%)","number"],["priority","Priority","priority"],["followup","Next follow-up","date"],["owner","Owner","text"],["notes","Notes","textarea"]],
 manufacturer:[["name","Manufacturer","text",1],["country","Country","text"],["city","Headquarters city","text"],["sector","Product category / sector","text"],["website","Website","url"],["email","Email","email"],["contact","Contact / department","text"],["status","Status","manufacturerStatus"],["score","Opportunity score","number"],["opportunity","Estimated Scottish opportunity (£)","number"],["ukPresence","UK presence","text"],["scotlandPresence","Scottish presence","text"],["competitors","Competitors","text"],["targetIndustries","Scottish target industries","textarea"],["nextAction","Next recommended action","textarea"],["research","Research notes","textarea"],["outreachStage","Outreach stage","outreachStage"]],
 contact:[["name","Name","text",1],["company","Company","text"],["role","Role","text"],["email","Email","email"],["phone","Phone","tel"],["linkedin","LinkedIn URL","url"],["status","Status","text"],["notes","Notes","textarea"]],
 template:[["name","Template name","text",1],["subject","Subject","text",1],["body","Body","textarea"]],
 task:[["title","Task","text",1],["company","Company","text"],["due","Due date","date"],["priority","Priority","priority"],["status","Status","taskStatus"],["notes","Notes","textarea"]],
 document:[["name","Document name","text",1],["company","Company","text"],["type","Type","text"],["url","File or cloud URL","url"],["version","Version","text"],["notes","Notes","textarea"]]
};
function defaultRecord(type){
 if(type==="deal")return{id:uid(),company:"",country:"",title:"",stage:STAGES[0],value:0,commission:10,priority:"Medium",followup:"",owner:state.profile.ownerName,notes:""};
 if(type==="manufacturer")return{id:uid(),name:"",country:"",city:"",sector:"",website:"",email:"",contact:"",status:"Researching",score:50,opportunity:0,ukPresence:"",scotlandPresence:"",competitors:"",targetIndustries:"",nextAction:"",research:"",outreachStage:"Not contacted"};
 if(type==="contact")return{id:uid(),name:"",company:"",role:"",email:"",phone:"",linkedin:"",status:"Prospect",notes:""};
 if(type==="template")return{id:uid(),name:"",subject:"",body:""};
 if(type==="task")return{id:uid(),title:"",company:"",due:today(),priority:"Medium",status:"open",notes:""};
 return{id:uid(),name:"",company:"",type:"",url:"",version:"1.0",notes:""};
}
function inputHtml(key,label,type,val,required){
 const opts={stage:STAGES,priority:["High","Medium","Low"],manufacturerStatus:["Priority target","Warm target","Researching","Contacted"],outreachStage:OUTREACH_STAGES,taskStatus:["open","done"]}[type];
 if(opts)return `<label>${label}<select name="${key}">${opts.map(x=>`<option ${x===val?"selected":""}>${x}</option>`).join("")}</select></label>`;
 if(type==="textarea")return `<label class="full">${label}<textarea name="${key}" rows="5">${esc(val)}</textarea></label>`;
 return `<label>${label}<input name="${key}" type="${type}" value="${esc(val)}" ${required?"required":""}></label>`;
}
function openModal(type,id=null){
 currentType=type;currentId=id;const list=state[type+"s"],record=id?list.find(x=>x.id===id):defaultRecord(type);
 $("modalTitle").textContent=(id?"Edit ":"Add ")+type;
 $("deleteRecordBtn").classList.toggle("hidden",!id);
 $("modalFields").innerHTML=schemas[type].map(([k,l,t,r])=>inputHtml(k,l,t,record[k]??"",r)).join("");
 $("recordDialog").showModal();
}
$("recordForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target),r={id:currentId||uid()};schemas[currentType].forEach(([k])=>r[k]=fd.get(k)||"");["value","commission","score","opportunity"].forEach(k=>{if(k in r)r[k]=Number(r[k])||0});const list=state[currentType+"s"],i=list.findIndex(x=>x.id===r.id);if(i>=0)list[i]=r;else list.unshift(r);$("recordDialog").close();save()};
$("deleteRecordBtn").onclick=()=>{if(confirm("Delete this record?")){state[currentType+"s"]=state[currentType+"s"].filter(x=>x.id!==currentId);$("recordDialog").close();save()}};
$("closeModalBtn").onclick=$("cancelModalBtn").onclick=()=>$("recordDialog").close();
$("newRecordBtn").onclick=()=>openModal("deal");
$("addManufacturerBtn").onclick=()=>openModal("manufacturer");
$("addContactBtn").onclick=()=>openModal("contact");
$("addTemplateBtn").onclick=()=>openModal("template");
$("addTaskBtn").onclick=()=>openModal("task");
$("addDocumentBtn").onclick=()=>openModal("document");
window.editDeal=id=>openModal("deal",id);window.editManufacturer=id=>openModal("manufacturer",id);window.editContact=id=>openModal("contact",id);window.editTask=id=>openModal("task",id);window.editDocument=id=>openModal("document",id);window.editTemplate=id=>openModal("template",id);

function renderDashboard(){
 const active=state.deals.filter(d=>!["Won","Lost"].includes(d.stage)),pipeline=active.reduce((s,d)=>s+d.value,0),commission=active.reduce((s,d)=>s+d.value*d.commission/100,0),weighted=active.reduce((s,d)=>s+d.value*d.commission/100*(PROBABILITIES[d.stage]||0)/100,0);
 const contacted=state.manufacturers.filter(m=>m.outreachStage!=="Not contacted").length,replies=state.manufacturers.filter(m=>["Replied","Meeting booked","Proposal sent","Negotiating","Won"].includes(m.outreachStage)).length;
 const openTasks=state.tasks.filter(t=>t.status!=="done").length,readiness=Math.min(100,Math.round((state.manufacturers.length*5+state.contacts.length*4+state.deals.length*6+state.outreach.length*5+state.documents.length*3)));
 $("readinessValue").textContent=readiness+"%";$("readinessBar").style.width=readiness+"%";$("readinessText").textContent=readiness<50?"Build contacts and outreach momentum":readiness<80?"Strong foundation — increase meetings":"Outreach-ready operating system";
 const k=[["Active deals",active.length,"Open opportunities"],["Pipeline value",money(pipeline),"Unweighted"],["Projected commission",money(commission),"At full deal value"],["Weighted commission",money(weighted),"Probability adjusted"],["Manufacturers contacted",contacted,`${state.manufacturers.length} total targets`],["Open tasks",openTasks,"Actions remaining"]];
 $("kpis").innerHTML=k.map(x=>`<article class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join("");
 const vals=STAGES.map(s=>({s,v:state.deals.filter(d=>d.stage===s).reduce((a,d)=>a+d.value,0)})),max=Math.max(1,...vals.map(x=>x.v));
 $("pipelineChart").innerHTML=vals.filter(x=>x.v>0).map(x=>`<div class="bar-row"><span>${x.s}</span><div class="bar-track"><i style="width:${x.v/max*100}%"></i></div><strong>${money(x.v)}</strong></div>`).join("")||"<p class='muted'>No pipeline data yet.</p>";
 const tasks=[...state.tasks].filter(t=>t.status!=="done").sort((a,b)=>a.due.localeCompare(b.due)).slice(0,5);
 $("nextActions").innerHTML=tasks.map(t=>`<div class="stack-item"><div><strong>${esc(t.title)}</strong><small>${esc(t.company)} · due ${esc(t.due)}</small></div><span class="badge ${t.priority==="High"?"warning":""}">${t.priority}</span></div>`).join("")||"<p class='muted'>No open tasks.</p>";
 $("funnelChart").innerHTML=OUTREACH_STAGES.map((s,i)=>{const n=state.manufacturers.filter(m=>OUTREACH_STAGES.indexOf(m.outreachStage)>=i).length;return `<div class="funnel-step" style="width:${100-i*7}%">${s}: ${n}</div>`}).join("");
 $("topManufacturers").innerHTML=[...state.manufacturers].sort((a,b)=>b.opportunity-a.opportunity).slice(0,5).map(m=>`<div class="stack-item"><div><strong>${esc(m.name)}</strong><small>${esc(m.sector)}</small></div><strong>${money(m.opportunity)}</strong></div>`).join("");
 $("recentActivity").innerHTML=[...state.activities].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,7).map(a=>`<div class="timeline-item"><i class="timeline-dot"></i><div><strong>${esc(a.summary)}</strong><small>${esc(a.company)} · ${esc(a.type)}</small></div><small>${esc(a.date)}</small></div>`).join("");
}
function renderPipeline(){
 const q=$("pipelineSearch").value.toLowerCase(),p=$("pipelineFilter").value;
 const deals=state.deals.filter(d=>[d.company,d.country,d.title,d.notes].join(" ").toLowerCase().includes(q)&&(!p||d.priority===p));
 $("kanban").innerHTML=STAGES.map(s=>`<section class="kanban-column" data-stage="${s}"><h3>${s} · ${deals.filter(d=>d.stage===s).length}</h3>${deals.filter(d=>d.stage===s).map(d=>`<article class="deal-card" draggable="true" data-id="${d.id}" ondblclick="editDeal('${d.id}')"><div style="display:flex;justify-content:space-between;gap:8px"><div><h4>${esc(d.company)}</h4><small class="muted">${esc(d.country)}</small></div><span class="badge ${d.priority==="High"?"warning":""}">${d.priority}</span></div><p>${esc(d.title)}</p><div class="deal-meta"><div><span>VALUE</span><strong>${money(d.value)}</strong></div><div><span>COMMISSION</span><strong>${money(d.value*d.commission/100)}</strong></div><div><span>PROBABILITY</span><strong>${PROBABILITIES[d.stage]}%</strong></div><div><span>FOLLOW-UP</span><strong>${esc(d.followup||"—")}</strong></div></div></article>`).join("")}</section>`).join("");
 document.querySelectorAll(".deal-card").forEach(c=>c.ondragstart=()=>dragId=c.dataset.id);
 document.querySelectorAll(".kanban-column").forEach(c=>{c.ondragover=e=>{e.preventDefault();c.classList.add("drag-over")};c.ondragleave=()=>c.classList.remove("drag-over");c.ondrop=()=>{c.classList.remove("drag-over");const d=state.deals.find(x=>x.id===dragId);if(d){d.stage=c.dataset.stage;state.activities.unshift({id:uid(),date:today(),type:"Pipeline",company:d.company,summary:`Deal moved to ${d.stage}`,notes:""});save()}}});
}
function renderManufacturers(){
 const q=$("manufacturerSearch").value.toLowerCase(),f=$("manufacturerFilter").value;
 const items=state.manufacturers.filter(m=>[m.name,m.country,m.sector,m.research,m.targetIndustries].join(" ").toLowerCase().includes(q)&&(!f||m.status===f));
 $("manufacturerGrid").innerHTML=items.map(m=>`<article class="intel-card"><div class="intel-top"><div><h3>${esc(m.name)}</h3><div class="muted">${esc(m.city)}, ${esc(m.country)}</div></div><div class="score-ring" style="--score:${m.score}"><strong>${m.score}</strong></div></div><p><span class="badge">${esc(m.status)}</span> <span class="badge success">${esc(m.outreachStage)}</span></p><div class="intel-box"><strong>${esc(m.sector)}</strong><br><span class="muted">Scottish opportunity: ${money(m.opportunity)}</span></div><div class="intel-box"><strong>Market fit</strong><br>${esc(m.targetIndustries)}</div><div class="intel-box"><strong>Next action</strong><br>${esc(m.nextAction)}</div><div class="intel-actions"><button class="secondary" onclick="editManufacturer('${m.id}')">Open profile</button>${m.website?`<button class="secondary" onclick="window.open('${esc(m.website)}','_blank')">Website</button>`:""}${m.email?`<button class="primary" onclick="location.href='mailto:${esc(m.email)}'">Email</button>`:""}</div></article>`).join("")||"<p class='muted'>No manufacturers found.</p>";
}
function mergeTemplate(t,m,c){return {subject:t.subject.replaceAll("{{company}}",m?.name||"the company").replaceAll("{{contact}}",c?.name||"there").replaceAll("{{sector}}",m?.sector||"your sector").replaceAll("{{opportunity}}",m?.targetIndustries||"the Scottish market"),body:t.body.replaceAll("{{company}}",m?.name||"the company").replaceAll("{{contact}}",c?.name||"there").replaceAll("{{sector}}",m?.sector||"your sector").replaceAll("{{opportunity}}",m?.targetIndustries||"the Scottish market")}}
function renderOutreach(){
 $("composeManufacturer").innerHTML=state.manufacturers.map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join("");
 const mid=$("composeManufacturer").value||state.manufacturers[0]?.id,m=state.manufacturers.find(x=>x.id===mid);$("composeManufacturer").value=mid||"";
 const cs=state.contacts.filter(c=>!m||c.company===m.name);$("composeContact").innerHTML=cs.map(c=>`<option value="${c.id}">${esc(c.name)} — ${esc(c.role)}</option>`).join("");
 const t=state.templates.find(x=>x.id===activeTemplateId)||state.templates[0],c=state.contacts.find(x=>x.id===$("composeContact").value)||cs[0];
 if(t){const merged=mergeTemplate(t,m,c);$("composeSubject").value=merged.subject;$("composeBody").value=merged.body}
 $("templateList").innerHTML=state.templates.map(t=>`<div class="template-item ${t.id===activeTemplateId?"active":""}" data-template="${t.id}"><strong>${esc(t.name)}</strong><small>${esc(t.subject)}</small><div style="margin-top:7px"><button class="link-btn" onclick="event.stopPropagation();editTemplate('${t.id}')">Edit</button></div></div>`).join("");
 document.querySelectorAll("[data-template]").forEach(x=>x.onclick=()=>{activeTemplateId=x.dataset.template;renderOutreach()});
 $("outreachTable").innerHTML=`<table><thead><tr><th>Date</th><th>Company</th><th>Contact</th><th>Type</th><th>Status</th><th>Subject</th></tr></thead><tbody>${[...state.outreach].sort((a,b)=>b.date.localeCompare(a.date)).map(o=>`<tr><td>${esc(o.date)}</td><td>${esc(o.company)}</td><td>${esc(o.contact)}</td><td>${esc(o.type)}</td><td><span class="badge">${esc(o.status)}</span></td><td>${esc(o.subject)}</td></tr>`).join("")}</tbody></table>`;
}
$("composeManufacturer").onchange=renderOutreach;$("composeContact").onchange=renderOutreach;
$("copyEmailBtn").onclick=()=>navigator.clipboard.writeText(`Subject: ${$("composeSubject").value}\n\n${$("composeBody").value}`).then(()=>alert("Email copied."));
$("logEmailBtn").onclick=()=>{const m=state.manufacturers.find(x=>x.id===$("composeManufacturer").value),c=state.contacts.find(x=>x.id===$("composeContact").value);if(!m)return;state.outreach.unshift({id:uid(),date:today(),company:m.name,contact:c?.name||m.contact,type:"Email",status:"Awaiting reply",subject:$("composeSubject").value});m.outreachStage=m.outreachStage==="Not contacted"?"Initial email":m.outreachStage;state.activities.unshift({id:uid(),date:today(),type:"Email",company:m.name,summary:"Outreach email logged",notes:$("composeSubject").value});save();alert("Email logged as sent.")};
function renderContacts(){const q=$("contactSearch").value.toLowerCase(),items=state.contacts.filter(c=>[c.name,c.company,c.role,c.email].join(" ").toLowerCase().includes(q));$("contactsTable").innerHTML=`<table><thead><tr><th>Name</th><th>Company</th><th>Role</th><th>Email</th><th>Phone</th><th>Status</th><th></th></tr></thead><tbody>${items.map(c=>`<tr><td>${esc(c.name)}</td><td>${esc(c.company)}</td><td>${esc(c.role)}</td><td>${esc(c.email)}</td><td>${esc(c.phone)}</td><td><span class="badge">${esc(c.status)}</span></td><td><button class="secondary" onclick="editContact('${c.id}')">Open</button></td></tr>`).join("")}</tbody></table>`}
function renderProposal(){
 $("proposalManufacturer").innerHTML=state.manufacturers.map(m=>`<option value="${m.id}">${esc(m.name)}</option>`).join("");
 const m=state.manufacturers.find(x=>x.id===$("proposalManufacturer").value)||state.manufacturers[0];if(!m)return;$("proposalManufacturer").value=m.id;$("proposalOpportunity").value=$("proposalOpportunity").value||m.targetIndustries;
 const p=state.profile;$("proposalPreview").innerHTML=`<div class="proposal-brand"><div class="eyebrow">SCOTTISH MARKET DEVELOPMENT PROPOSAL</div><h2>${esc(p.businessName)}</h2><p>${esc(p.location)} · ${esc(p.ownerName)}</p></div><h3>Proposal for ${esc(m.name)}</h3><p>This proposal outlines a focused route to build commercial traction for ${esc(m.name)} across ${esc($("proposalTerritory").value)} through local market development, prospecting and relationship management.</p><div class="proposal-grid"><div class="proposal-box"><strong>Territory</strong><br>${esc($("proposalTerritory").value)}</div><div class="proposal-box"><strong>Commercial structure</strong><br>${esc($("proposalCommission").value)}</div><div class="proposal-box"><strong>Initial programme</strong><br>${esc($("proposalTrial").value)}</div><div class="proposal-box"><strong>Opportunity score</strong><br>${m.score}/100</div></div><h3>Why Scotland</h3><p>${esc(m.targetIndustries)} represent the strongest initial opportunity. Estimated addressable Scottish opportunity recorded in the CRM: <strong>${money(m.opportunity)}</strong>.</p><h3>What Edinburgh Distribution will deliver</h3><ul><li>Scottish target-account research and prioritisation</li><li>Direct prospecting and decision-maker outreach</li><li>Qualification of commercial opportunities</li><li>Demonstration and discovery-call coordination</li><li>Local follow-up and relationship management</li><li>Weekly pipeline reporting and market feedback</li></ul><h3>90-day market development plan</h3><ol><li>Confirm territory, product focus, pricing support and commission terms.</li><li>Build and approve an initial target-account list.</li><li>Launch tailored outreach and qualify early opportunities.</li><li>Coordinate meetings, demonstrations and proposals.</li><li>Review results and agree the next commercial phase.</li></ol><h3>Primary opportunity</h3><p>${esc($("proposalOpportunity").value)}</p><h3>Next step</h3><p>A short commercial discussion to confirm Scottish coverage, partner expectations, product training and an initial trial structure.</p><p style="margin-top:60px"><strong>${esc(p.ownerName)}</strong><br>${esc(p.businessName)}<br>${esc(p.location)}<br>${esc(p.email)} ${esc(p.phone)}</p>`;
}
["proposalManufacturer","proposalTerritory","proposalCommission","proposalTrial","proposalOpportunity"].forEach(id=>$(id).oninput=renderProposal);$("refreshProposalBtn").onclick=renderProposal;$("printProposalBtn").onclick=()=>window.print();
function renderTasks(){
 const q=$("taskSearch").value.toLowerCase(),f=$("taskFilter").value,items=state.tasks.filter(t=>[t.title,t.company,t.notes].join(" ").toLowerCase().includes(q)&&(!f||t.status===f));
 const groups=[["Overdue",t=>t.status!=="done"&&t.due<today()],["Upcoming",t=>t.status!=="done"&&t.due>=today()],["Completed",t=>t.status==="done"]];
 $("taskBoard").innerHTML=groups.map(([n,fn])=>`<section class="task-column"><h3>${n} · ${items.filter(fn).length}</h3>${items.filter(fn).sort((a,b)=>a.due.localeCompare(b.due)).map(t=>`<article class="task-card ${t.status==="done"?"done":""}"><div style="display:flex;justify-content:space-between;gap:8px"><h4>${esc(t.title)}</h4><span class="badge ${t.priority==="High"?"warning":""}">${t.priority}</span></div><small class="muted">${esc(t.company)} · ${esc(t.due)}</small><p>${esc(t.notes)}</p><div class="task-actions"><button class="secondary" onclick="editTask('${t.id}')">Edit</button><button class="primary" onclick="toggleTask('${t.id}')">${t.status==="done"?"Reopen":"Complete"}</button></div></article>`).join("")}</section>`).join("");
}
window.toggleTask=id=>{const t=state.tasks.find(x=>x.id===id);t.status=t.status==="done"?"open":"done";save()};
function renderDocuments(){const q=$("documentSearch").value.toLowerCase(),items=state.documents.filter(d=>[d.name,d.company,d.type,d.notes].join(" ").toLowerCase().includes(q));$("documentGrid").innerHTML=items.map(d=>`<article class="document-card"><div class="eyebrow">${esc(d.type)}</div><h3>${esc(d.name)}</h3><p class="muted">${esc(d.company)} · version ${esc(d.version)}</p><p>${esc(d.notes)}</p><div class="intel-actions"><button class="secondary" onclick="editDocument('${d.id}')">Edit</button>${d.url?`<button class="primary" onclick="window.open('${esc(d.url)}','_blank')">Open file</button>`:""}</div></article>`).join("")||"<p class='muted'>No documents found.</p>"}
function renderAnalytics(){
 const active=state.deals.filter(d=>!["Won","Lost"].includes(d.stage)),weighted=active.reduce((s,d)=>s+d.value*d.commission/100*(PROBABILITIES[d.stage]||0)/100,0),sent=state.outreach.length,replied=state.outreach.filter(o=>/reply|meeting|proposal|won/i.test(o.status)).length,response=sent?Math.round(replied/sent*100):0,meetings=state.manufacturers.filter(m=>OUTREACH_STAGES.indexOf(m.outreachStage)>=OUTREACH_STAGES.indexOf("Meeting booked")).length;
 $("analyticsKpis").innerHTML=[["Weighted commission",money(weighted),"Probability adjusted"],["Outreach logged",sent,"Messages and follow-ups"],["Reply rate",response+"%","Based on logged outcomes"],["Meetings or later",meetings,"Advanced outreach stages"],["Average opportunity",money(state.manufacturers.reduce((s,m)=>s+m.opportunity,0)/(state.manufacturers.length||1)),"Per manufacturer"],["Open tasks",state.tasks.filter(t=>t.status!=="done").length,"Current workload"]].map(x=>`<article class="kpi"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></article>`).join("");
 const vals=STAGES.map(s=>({s,v:active.filter(d=>d.stage===s).reduce((a,d)=>a+d.value*d.commission/100*(PROBABILITIES[d.stage]||0)/100,0)})),max=Math.max(1,...vals.map(x=>x.v));$("weightedChart").innerHTML=vals.filter(x=>x.v>0).map(x=>`<div class="bar-row"><span>${x.s}</span><div class="bar-track"><i style="width:${x.v/max*100}%"></i></div><strong>${money(x.v)}</strong></div>`).join("");
 $("responseChart").innerHTML=`<div class="donut" style="--value:${response}"><strong>${response}%</strong></div>`;
 $("territoryMap").innerHTML=`<div class="map-shape"></div><span class="map-pin" style="left:48%;top:72%">Edinburgh</span><span class="map-pin" style="left:40%;top:68%">Glasgow</span><span class="map-pin" style="left:60%;top:46%">Aberdeen</span><span class="map-pin" style="left:55%;top:60%">Dundee</span><span class="map-pin" style="left:47%;top:34%">Inverness</span>`;
}
function renderSettings(){const p=state.profile;$("businessName").value=p.businessName;$("ownerName").value=p.ownerName;$("businessLocation").value=p.location;$("businessEmail").value=p.email;$("businessPhone").value=p.phone}
$("saveProfileBtn").onclick=()=>{state.profile={businessName:$("businessName").value,ownerName:$("ownerName").value,location:$("businessLocation").value,email:$("businessEmail").value,phone:$("businessPhone").value};save();alert("Profile saved.")};
$("exportBtn").onclick=()=>{const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="edinburgh-distribution-os-v5-backup.json";a.click();URL.revokeObjectURL(a.href)};
$("importInput").onchange=async e=>{try{state=JSON.parse(await e.target.files[0].text());save();alert("Backup imported.")}catch{alert("That backup could not be read.")}e.target.value=""};
$("resetBtn").onclick=()=>{if(confirm("Replace current data with V5 starter data?")){state=starter();save()}};
$("clearBtn").onclick=()=>{if(confirm("Clear all CRM records?")){state={...starter(),deals:[],manufacturers:[],contacts:[],templates:[],outreach:[],tasks:[],documents:[],activities:[]};save()}};

$("globalSearchBtn").onclick=()=>{$("searchDialog").showModal();$("globalSearchInput").focus();renderGlobalSearch()};$("closeSearchBtn").onclick=()=>$("searchDialog").close();$("globalSearchInput").oninput=renderGlobalSearch;
function renderGlobalSearch(){
 const q=$("globalSearchInput").value.toLowerCase();if(!q){$("globalSearchResults").innerHTML="<p class='muted'>Type to search the entire operating system.</p>";return}
 const results=[];
 state.manufacturers.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,5).forEach(x=>results.push({type:"Manufacturer",title:x.name,sub:x.sector,view:"manufacturers"}));
 state.deals.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,5).forEach(x=>results.push({type:"Deal",title:x.company,sub:x.title,view:"pipeline"}));
 state.contacts.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,5).forEach(x=>results.push({type:"Contact",title:x.name,sub:x.company,view:"contacts"}));
 state.tasks.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,5).forEach(x=>results.push({type:"Task",title:x.title,sub:x.company,view:"tasks"}));
 state.documents.filter(x=>JSON.stringify(x).toLowerCase().includes(q)).slice(0,5).forEach(x=>results.push({type:"Document",title:x.name,sub:x.company,view:"documents"}));
 $("globalSearchResults").innerHTML=results.map(r=>`<button class="stack-item secondary" data-result-view="${r.view}"><div><strong>${esc(r.title)}</strong><small>${r.type} · ${esc(r.sub)}</small></div><span>→</span></button>`).join("")||"<p class='muted'>No results found.</p>";
 document.querySelectorAll("[data-result-view]").forEach(b=>b.onclick=()=>{$("searchDialog").close();switchView(b.dataset.resultView)});
}

function renderAll(){renderDashboard();renderPipeline();renderManufacturers();renderOutreach();renderContacts();renderProposal();renderTasks();renderDocuments();renderAnalytics();renderSettings()}
["pipelineSearch","pipelineFilter","manufacturerSearch","manufacturerFilter","contactSearch","taskSearch","taskFilter","documentSearch"].forEach(id=>$(id).oninput=renderAll);
renderAll();
