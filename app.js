const STORAGE_KEY = "ctp-crm-next-v2";
const $ = id => document.getElementById(id);
const uid = () => crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
const esc = (s="") => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const todayISO = () => new Date().toISOString().slice(0,10);
const fmt = iso => new Date(iso).toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"});

const seed = {
  companies: [{
    id: uid(),
    name: "Youibot Robotics",
    website: "https://www.youibot.com",
    country: "China",
    category: "Autonomous mobile robots and industrial robotics",
    priority: "A",
    stage: "Research",
    opportunity: "Potential demand across Scottish manufacturing, logistics, universities, innovation centres and systems integrators.",
    notes: "",
    emailProduct: "autonomous mobile robots and industrial robotics",
    emailOpportunity: "manufacturing, logistics, universities and industrial automation projects across Scotland",
    emailTemplate: "intro",
    emailSubject: "",
    emailBody: "",
    lastEmailAt: "",
    followupDate: "",
    proposalTerritory: "Scotland",
    proposalModel: "Commission-based sales representation",
    proposalTerms: "",
    proposalValidity: "30 days",
    proposalSectors: "manufacturing, logistics, universities, innovation centres and systems integrators",
    proposalGeneratedAt: "",
    contacts: [{
      id: uid(),
      name: "Chenguyu",
      role: "Product enquiries",
      email: "",
      linkedin: "",
      primary: true
    }],
    activity: []
  }]
};

let db = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || seed;
let selectedCompanyId = db.companies[0]?.id || null;
let currentView = "dashboard";
let activeCompanyTab = "overview";

function persist(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(db)); renderAll(); }
function company(){ return db.companies.find(c => c.id === selectedCompanyId); }
function primaryContact(c){ return c?.contacts?.find(x=>x.primary) || c?.contacts?.[0] || null; }
function addActivity(c,text){ c.activity ||= []; c.activity.unshift({id:uid(),text,at:new Date().toISOString()}); }

function switchView(view){
  currentView=view;
  document.querySelectorAll(".view").forEach(v=>v.classList.remove("active"));
  $(`${view}View`).classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  $("pageTitle").textContent = ({dashboard:"Dashboard",companies:"Company Workspace",outreach:"Outreach Centre",proposals:"Proposal Vault",followups:"Follow-ups"})[view];
  renderAll();
}

function stats(){
  const sent=db.companies.filter(c=>["Email sent","Follow-up due","Replied","Meeting booked","Proposal sent","Negotiation","Won"].includes(c.stage)).length;
  return [
    ["Companies",db.companies.length],
    ["Emails sent",sent],
    ["Replies",db.companies.filter(c=>["Replied","Meeting booked","Proposal sent","Negotiation","Won"].includes(c.stage)).length],
    ["Meetings",db.companies.filter(c=>["Meeting booked","Proposal sent","Negotiation","Won"].includes(c.stage)).length],
    ["Proposals",db.companies.filter(c=>["Proposal sent","Negotiation","Won"].includes(c.stage)).length],
    ["Won",db.companies.filter(c=>c.stage==="Won").length]
  ];
}

function filteredCompanies(){
  const q=$("globalSearch").value.toLowerCase();
  const stage=$("companyStageFilter").value, prio=$("companyPriorityFilter").value;
  return db.companies.filter(c=>{
    const hay=[c.name,c.country,c.category,...(c.contacts||[]).flatMap(x=>[x.name,x.email,x.role])].join(" ").toLowerCase();
    return (!q||hay.includes(q)) && (!stage||c.stage===stage) && (!prio||c.priority===prio);
  });
}

function renderDashboard(){
  $("statsGrid").innerHTML=stats().map(([l,n])=>`<div class="stat-card"><strong>${n}</strong><span>${l}</span></div>`).join("");
  const priority=[...db.companies].sort((a,b)=>a.priority.localeCompare(b.priority)).slice(0,6);
  $("priorityProspects").innerHTML=priority.length?priority.map(c=>miniRow(c)).join(""):`<p class="muted">No companies yet.</p>`;
  const due=db.companies.filter(c=>c.followupDate && c.followupDate<=todayISO()).slice(0,6);
  $("followupPreview").innerHTML=due.length?due.map(c=>miniRow(c,true)).join(""):`<p class="muted">No follow-ups due.</p>`;
}

function miniRow(c,due=false){
  const p=primaryContact(c);
  return `<div class="mini-row" data-open-company="${c.id}">
    <span class="status-dot ${due?"due":"good"}"></span>
    <div><strong>${esc(c.name)}</strong><div class="muted">${esc(c.category||"No category")}</div></div>
    <div>${p?`${esc(p.name)} · ${esc(p.role||"Contact")}`:"No contact"}</div>
    <button class="secondary">Open</button>
  </div>`;
}

function renderCompanyList(){
  const list=filteredCompanies();
  $("companyList").innerHTML=list.map(c=>{
    const p=primaryContact(c);
    return `<article class="record-card ${c.id===selectedCompanyId?"active":""}" data-company-id="${c.id}">
      <div class="record-top"><h3>${esc(c.name)}</h3><span class="badge">${esc(c.priority)}</span></div>
      <p>${esc(c.category||"No category")} · ${esc(c.country||"No country")}</p>
      <p>${p?`Primary: ${esc(p.name)}`:"No contact added"}</p>
      <span class="badge subtle">${esc(c.stage)}</span>
    </article>`;
  }).join("") || `<div class="empty-state"><p>No matching companies.</p></div>`;
  document.querySelectorAll("[data-company-id]").forEach(el=>el.onclick=()=>{selectedCompanyId=el.dataset.companyId;renderAll();});
}

function bind(id,key,c){
  const el=$(id); el.value=c[key] ?? "";
  el.oninput=()=>c[key]=el.value;
  el.onchange=()=>{c[key]=el.value;if(["priority","stage"].includes(key))persist();};
}

function renderCompanyWorkspace(){
  const c=company();
  $("companyEmpty").hidden=!!c; $("companyContent").hidden=!c;
  if(!c)return;
  $("companyHeading").textContent=c.name;
  $("companyPriorityBadge").textContent=`Priority ${c.priority}`;
  $("companyStageBadge").textContent=c.stage;
  $("companyWebsiteLink").textContent=c.website||"";
  $("companyWebsiteLink").href=c.website||"#";

  [
    ["companyName","name"],["companyWebsite","website"],["companyCountry","country"],
    ["companyCategory","category"],["companyPriority","priority"],["companyStage","stage"],
    ["companyOpportunity","opportunity"],["companyNotes","notes"],["emailTemplate","emailTemplate"],
    ["emailProduct","emailProduct"],["emailOpportunity","emailOpportunity"],["emailSubject","emailSubject"],
    ["emailBody","emailBody"],["proposalTerritory","proposalTerritory"],["proposalModel","proposalModel"],
    ["proposalTerms","proposalTerms"],["proposalValidity","proposalValidity"],["proposalSectors","proposalSectors"]
  ].forEach(x=>bind(...x,c));

  renderContacts(c); renderActiveContact(c); renderProposal(c); renderActivity(c);
  activateCompanyTab(activeCompanyTab);
}

function renderContacts(c){
  $("contactCards").innerHTML=(c.contacts||[]).map(p=>`
    <article class="contact-card ${p.primary?"primary-contact":""}">
      <div class="record-top"><h4>${esc(p.name)}</h4>${p.primary?'<span class="badge">Primary</span>':""}</div>
      <p>${esc(p.role||"No job title")}</p>
      <p>${esc(p.email||"No email")}</p>
      <div class="contact-actions">
        <button class="secondary" data-edit-contact="${p.id}">Edit</button>
        ${!p.primary?`<button class="secondary" data-primary-contact="${p.id}">Make primary</button>`:""}
        <button class="danger-light" data-delete-contact="${p.id}">Delete</button>
      </div>
    </article>`).join("") || `<p class="muted">No contacts added yet.</p>`;
  document.querySelectorAll("[data-edit-contact]").forEach(b=>b.onclick=()=>openContactDialog(b.dataset.editContact));
  document.querySelectorAll("[data-primary-contact]").forEach(b=>b.onclick=()=>setPrimary(b.dataset.primaryContact));
  document.querySelectorAll("[data-delete-contact]").forEach(b=>b.onclick=()=>deleteContact(b.dataset.deleteContact));
}

function renderActiveContact(c){
  const p=primaryContact(c);
  $("emailTo").value=p?.email||"";
  $("activeContactCard").innerHTML=p?`<h4>${esc(p.name)}</h4><p>${esc(p.role||"Contact")}</p><p>${esc(p.email||"No email added")}</p>`:`<p class="muted">No contact available. Add a contact first.</p>`;
}

function emailDraft(c){
  const p=primaryContact(c), first=p?.name?.split(/\s+/)[0]||"there";
  const product=c.emailProduct||c.category||"technology portfolio";
  const opp=c.emailOpportunity||c.opportunity||"relevant Scottish organisations and channel partners";
  const sign=`Kind regards,\n\nDylan Keddie\nFounder\nCaledonia Technical Partners\ndylan@caledoniatechnicalpartners.com\ncaledoniatechnicalpartners.com`;

  if(c.emailTemplate==="follow1") return {
    subject:`Following up — Scottish representation for ${c.name}`,
    body:`Hello ${first},\n\nI wanted to follow up on my previous email regarding the potential to develop ${c.name}'s presence in Scotland.\n\nI believe your ${product} could be relevant to ${opp}. Caledonia Technical Partners could provide focused local prospecting, customer introductions, demonstrations and account development without the cost of establishing a dedicated Scottish office.\n\nWould you be open to a brief introductory call?\n\n${sign}`
  };
  if(c.emailTemplate==="follow2") return {
    subject:`Final follow-up — ${c.name} in Scotland`,
    body:`Hello ${first},\n\nI appreciate you may be busy, so I wanted to send one final follow-up regarding a potential route into the Scottish market for ${c.name}.\n\nShould Scotland become a priority, I would be happy to share a concise target-account and market-entry outline focused on ${opp}.\n\nWould a short introductory conversation be useful?\n\n${sign}`
  };
  if(c.emailTemplate==="proposal") return {
    subject:`Proposal — Scottish market representation for ${c.name}`,
    body:`Hello ${first},\n\nI have prepared a concise proposal outlining how Caledonia Technical Partners could support ${c.name} in developing opportunities across Scotland.\n\nIt covers the proposed target sectors, local sales activity, 90-day plan and commercial model. I would welcome the opportunity to discuss it and tailor the approach around your priorities.\n\nWould you be available for a short call next week?\n\n${sign}`
  };
  return {
    subject:`Scottish market representation — ${c.name}`,
    body:`Hello ${first},\n\nMy name is Dylan Keddie, founder of Caledonia Technical Partners, based in Edinburgh, Scotland.\n\nI have been reviewing ${c.name}'s ${product} and believe there may be a genuine opportunity within ${opp}.\n\nWe help international technology manufacturers develop business in Scotland through local prospecting, customer introductions, demonstrations, sales follow-up and ongoing account development—without the immediate cost of establishing a local office.\n\nI would welcome the opportunity to discuss representing ${c.name} in Scotland on a commission-based agency or distribution basis.\n\nWould you be open to a brief introductory conversation next week?\n\n${sign}`
  };
}

function proposalHtml(c){
  const date=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  return `<div class="proposal-doc">
    <section class="proposal-cover">
      <div class="brand-lockup"><div class="brand-mark" style="color:#0d1b2e;border-color:#0d1b2e">CTP</div><div><strong style="color:#0d1b2e">CALEDONIA</strong><span>TECHNICAL PARTNERS</span></div></div>
      <h1>Scottish Market Representation Proposal</h1>
      <p>Prepared for <strong>${esc(c.name)}</strong></p><p>${date}</p>
    </section>
    <h2>Executive summary</h2>
    <p>Caledonia Technical Partners proposes to support ${esc(c.name)} in developing qualified commercial opportunities across ${esc(c.proposalTerritory||"Scotland")} through focused local market representation.</p>
    <div class="proposal-meta">
      <div><strong>Territory</strong><br>${esc(c.proposalTerritory||"Scotland")}</div>
      <div><strong>Commercial model</strong><br>${esc(c.proposalModel||"To be agreed")}</div>
      <div><strong>Target sectors</strong><br>${esc(c.proposalSectors||"To be agreed")}</div>
      <div><strong>Validity</strong><br>${esc(c.proposalValidity||"30 days")}</div>
    </div>
    <h2>Market opportunity</h2>
    <p>${esc(c.opportunity||`${c.name}'s products appear relevant to organisations and channel partners within Scotland.`)}</p>
    <h2>Proposed services</h2>
    <ul class="proposal-list">
      <li>Local sales representation and qualified prospecting</li>
      <li>Customer, integrator and channel-partner introductions</li>
      <li>Product demonstrations and opportunity follow-up</li>
      <li>Pipeline reporting and Scottish market feedback</li>
      <li>Ongoing account development</li>
    </ul>
    <h2>Initial 90-day plan</h2>
    <ol class="proposal-list">
      <li>Product and commercial onboarding.</li>
      <li>Build and prioritise a Scottish target-account list.</li>
      <li>Launch personalised outreach and partner engagement.</li>
      <li>Arrange qualified calls, meetings and demonstrations.</li>
      <li>Provide a structured pipeline and market-feedback report.</li>
    </ol>
    <h2>Commercial framework</h2>
    <p><strong>${esc(c.proposalModel||"To be agreed")}</strong></p>
    <p>${esc(c.proposalTerms||"Commission, retainers, exclusivity, expenses and payment terms would be agreed jointly before commencement.")}</p>
    <h2>Next step</h2>
    <p>A short introductory meeting is recommended to confirm product priorities, territory expectations, sales support and commercial structure.</p>
    <p><strong>Dylan Keddie</strong><br>Founder, Caledonia Technical Partners<br>dylan@caledoniatechnicalpartners.com<br>caledoniatechnicalpartners.com</p>
  </div>`;
}

function renderProposal(c){ $("proposalPreview").innerHTML=proposalHtml(c); }
function renderActivity(c){
  $("activityList").innerHTML=(c.activity||[]).map(a=>`<div class="activity-row"><div>${esc(a.text)}</div><time>${fmt(a.at)}</time></div>`).join("")||`<p class="muted">No activity yet.</p>`;
}

function renderBulkQueue(){
  $("bulkQueue").innerHTML=db.companies.map(c=>{
    const p=primaryContact(c);
    return `<div class="queue-row">
      <input type="checkbox" class="bulk-check" data-bulk-id="${c.id}" ${p&&p.email?"":"disabled"}>
      <div><strong>${esc(c.name)}</strong><div class="muted">${esc(c.category||"No category")}</div></div>
      <div>${p?`${esc(p.name)} · ${esc(p.email||"No email")}`:"No contact"}</div>
      <div class="queue-actions">
        <button class="secondary" data-open-company="${c.id}">Open</button>
        ${c.emailBody?`<button class="primary" data-open-draft="${c.id}">Gmail</button>`:""}
      </div>
    </div>`;
  }).join("")||`<p class="muted">No companies available.</p>`;
}

function renderProposalVault(){
  const list=db.companies.filter(c=>c.proposalGeneratedAt);
  $("proposalVault").innerHTML=list.map(c=>`<div class="vault-row">
    <span class="status-dot good"></span>
    <div><strong>${esc(c.name)}</strong><div class="muted">Generated ${fmt(c.proposalGeneratedAt)}</div></div>
    <div>${esc(c.proposalModel||"")}</div>
    <button class="secondary" data-open-company="${c.id}" data-open-tab="proposal">Open</button>
  </div>`).join("")||`<p class="muted">No proposals generated yet.</p>`;
}

function renderFollowups(){
  const list=db.companies.filter(c=>c.followupDate && c.followupDate<=todayISO());
  $("followupQueue").innerHTML=list.map(c=>`<div class="queue-row">
    <span class="status-dot due"></span>
    <div><strong>${esc(c.name)}</strong><div class="muted">Due ${esc(c.followupDate)}</div></div>
    <div>${esc(primaryContact(c)?.name||"No contact")}</div>
    <button class="primary" data-followup-company="${c.id}">Draft follow-up</button>
  </div>`).join("")||`<p class="muted">No follow-ups due.</p>`;
}

function activateCompanyTab(tab){
  activeCompanyTab=tab;
  document.querySelectorAll("[data-company-tab]").forEach(b=>b.classList.toggle("active",b.dataset.companyTab===tab));
  document.querySelectorAll(".company-tab").forEach(p=>p.classList.remove("active"));
  $(`${tab}Tab`).classList.add("active");
}

function renderAll(){
  renderDashboard(); renderCompanyList(); renderCompanyWorkspace();
  renderBulkQueue(); renderProposalVault(); renderFollowups();
  attachDynamicHandlers();
}

function attachDynamicHandlers(){
  document.querySelectorAll("[data-open-company]").forEach(b=>b.onclick=()=>{
    selectedCompanyId=b.dataset.openCompany; switchView("companies");
    if(b.dataset.openTab) activateCompanyTab(b.dataset.openTab);
  });
  document.querySelectorAll("[data-open-draft]").forEach(b=>b.onclick=()=>openDraftFor(db.companies.find(c=>c.id===b.dataset.openDraft)));
  document.querySelectorAll("[data-followup-company]").forEach(b=>b.onclick=()=>{
    const c=db.companies.find(x=>x.id===b.dataset.followupCompany);
    selectedCompanyId=c.id;c.emailTemplate="follow1";const d=emailDraft(c);c.emailSubject=d.subject;c.emailBody=d.body;c.stage="Follow-up due";persist();switchView("companies");activateCompanyTab("outreach");
  });
}

function openContactDialog(id=""){
  const c=company(), p=c?.contacts?.find(x=>x.id===id);
  $("contactDialogTitle").textContent=p?"Edit contact":"Add contact";
  $("contactEditingId").value=p?.id||"";
  $("contactNameInput").value=p?.name||"";
  $("contactRoleInput").value=p?.role||"";
  $("contactEmailInput").value=p?.email||"";
  $("contactLinkedinInput").value=p?.linkedin||"";
  $("contactPrimaryInput").checked=p?.primary||!(c?.contacts?.length);
  $("contactDialog").showModal();
}

function saveContact(){
  const c=company(); if(!c)return;
  const id=$("contactEditingId").value, existing=c.contacts.find(x=>x.id===id);
  const p=existing||{id:uid()};
  p.name=$("contactNameInput").value.trim();p.role=$("contactRoleInput").value.trim();
  p.email=$("contactEmailInput").value.trim();p.linkedin=$("contactLinkedinInput").value.trim();
  p.primary=$("contactPrimaryInput").checked;
  if(p.primary)c.contacts.forEach(x=>x.primary=false);
  if(!existing)c.contacts.push(p);
  if(!c.contacts.some(x=>x.primary)&&c.contacts[0])c.contacts[0].primary=true;
  addActivity(c,`${existing?"Updated":"Added"} contact ${p.name}`);$("contactDialog").close();persist();
}

function setPrimary(id){const c=company();c.contacts.forEach(x=>x.primary=x.id===id);addActivity(c,`Changed primary contact to ${primaryContact(c).name}`);persist();}
function deleteContact(id){const c=company(),p=c.contacts.find(x=>x.id===id);if(!confirm(`Delete ${p?.name||"this contact"}?`))return;c.contacts=c.contacts.filter(x=>x.id!==id);if(!c.contacts.some(x=>x.primary)&&c.contacts[0])c.contacts[0].primary=true;persist();}
function openDraftFor(c){
  const p=primaryContact(c);
  const url=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(p?.email||"")}&su=${encodeURIComponent(c.emailSubject||"")}&body=${encodeURIComponent(c.emailBody||"")}`;
  window.open(url,"_blank");
}

document.querySelectorAll(".nav-item").forEach(b=>b.onclick=()=>switchView(b.dataset.view));
document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>switchView(b.dataset.go));
document.querySelectorAll("[data-company-tab]").forEach(b=>b.onclick=()=>activateCompanyTab(b.dataset.companyTab));

$("newCompanyBtn").onclick=$("addCompanySmallBtn").onclick=()=>{$("companyDialogForm").reset();$("companyDialog").showModal();};
$("createCompanyBtn").onclick=e=>{
  e.preventDefault();const name=$("newCompanyName").value.trim();if(!name)return;
  const c={id:uid(),name,website:$("newCompanyWebsite").value.trim(),country:$("newCompanyCountry").value.trim(),category:$("newCompanyCategory").value.trim(),priority:"A",stage:"Research",opportunity:"",notes:"",emailProduct:"",emailOpportunity:"",emailTemplate:"intro",emailSubject:"",emailBody:"",lastEmailAt:"",followupDate:"",proposalTerritory:"Scotland",proposalModel:"Commission-based sales representation",proposalTerms:"",proposalValidity:"30 days",proposalSectors:"",proposalGeneratedAt:"",contacts:[],activity:[]};
  db.companies.unshift(c);selectedCompanyId=c.id;$("companyDialog").close();persist();switchView("companies");
};
$("saveCompanyBtn").onclick=()=>{const c=company();addActivity(c,"Company record updated");persist();};
$("deleteCompanyBtn").onclick=()=>{const c=company();if(!c||!confirm(`Delete ${c.name}?`))return;db.companies=db.companies.filter(x=>x.id!==c.id);selectedCompanyId=db.companies[0]?.id||null;persist();};
$("addContactBtn").onclick=()=>openContactDialog();
$("saveContactBtn").onclick=e=>{e.preventDefault();if(!$("contactNameInput").value.trim())return;saveContact();};
$("switchContactBtn").onclick=()=>{
  const c=company();$("contactChooser").innerHTML=(c.contacts||[]).map(p=>`<div class="chooser-card" data-choose-contact="${p.id}"><strong>${esc(p.name)}</strong><div class="muted">${esc(p.role||"")} · ${esc(p.email||"No email")}</div></div>`).join("")||`<p class="muted">No contacts available.</p>`;
  document.querySelectorAll("[data-choose-contact]").forEach(x=>x.onclick=()=>{setPrimary(x.dataset.chooseContact);$("chooseContactDialog").close();});
  $("chooseContactDialog").showModal();
};
$("generateEmailBtn").onclick=()=>{const c=company(),d=emailDraft(c);c.emailSubject=d.subject;c.emailBody=d.body;c.stage="Draft ready";addActivity(c,`Generated ${$("emailTemplate").selectedOptions[0].text.toLowerCase()}`);persist();activateCompanyTab("outreach");};
$("copyEmailBtn").onclick=async()=>{const c=company();await navigator.clipboard.writeText(`To: ${primaryContact(c)?.email||""}\nSubject: ${c.emailSubject}\n\n${c.emailBody}`);alert("Email copied.");};
$("openGmailBtn").onclick=()=>openDraftFor(company());
$("markSentBtn").onclick=()=>{const c=company();c.stage="Email sent";c.lastEmailAt=new Date().toISOString();const d=new Date();d.setDate(d.getDate()+5);c.followupDate=d.toISOString().slice(0,10);addActivity(c,`Email marked sent. Follow-up due ${c.followupDate}`);persist();};
$("generateProposalBtn").onclick=()=>{const c=company();c.proposalGeneratedAt=new Date().toISOString();c.stage="Proposal sent";addActivity(c,"Generated market representation proposal");persist();activateCompanyTab("proposal");};
$("printProposalBtn").onclick=()=>window.print();
$("addActivityBtn").onclick=()=>{const c=company(),v=$("activityInput").value.trim();if(!v)return;addActivity(c,v);$("activityInput").value="";persist();};
$("selectAllOutreachBtn").onclick=()=>document.querySelectorAll(".bulk-check:not(:disabled)").forEach(x=>x.checked=true);
$("generateBulkBtn").onclick=()=>{
  const ids=[...document.querySelectorAll(".bulk-check:checked")].map(x=>x.dataset.bulkId);
  ids.forEach(id=>{const c=db.companies.find(x=>x.id===id),d=emailDraft(c);c.emailSubject=d.subject;c.emailBody=d.body;c.stage="Draft ready";addActivity(c,"Generated bulk outreach draft");});
  persist();alert(`${ids.length} draft${ids.length===1?"":"s"} generated.`);
};
$("globalSearch").oninput=()=>{renderCompanyList(); if(currentView==="dashboard")switchView("companies");};
$("companyStageFilter").onchange=renderCompanyList;$("companyPriorityFilter").onchange=renderCompanyList;

$("exportBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify(db,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`ctp-crm-backup-${todayISO()}.json`;a.click();URL.revokeObjectURL(a.href);
};
$("importInput").onchange=async e=>{
  try{const incoming=JSON.parse(await e.target.files[0].text());if(!Array.isArray(incoming.companies))throw new Error();db=incoming;selectedCompanyId=db.companies[0]?.id||null;persist();}
  catch{alert("That file is not a valid CRM backup.");}
};

renderAll();
