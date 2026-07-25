const STORAGE_KEY = "ctp-crm-v1";
const $ = (id) => document.getElementById(id);
const esc = (s="") => s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random());

let data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null") || {
  companies: [{
    id: uid(),
    name: "Example Technology Manufacturer",
    website: "https://example.com",
    country: "Germany",
    category: "Industrial imaging",
    contactName: "Anna Müller",
    contactRole: "International Sales Director",
    contactEmail: "anna@example.com",
    linkedin: "",
    priority: "A",
    stage: "Research",
    fitReason: "Potential fit for Scottish industrial, infrastructure and education customers.",
    notes: "Replace this example with a real prospect.",
    emailProduct: "industrial imaging systems",
    emailOpportunity: "manufacturing, universities and infrastructure projects across Scotland",
    emailCTA: "call",
    emailType: "intro",
    emailSubject: "",
    emailBody: "",
    proposalTerritory: "Scotland",
    commercialModel: "Commission-based sales representation",
    commercialTerms: "",
    proposalValidity: "30 days",
    targetSectors: "manufacturing, universities, infrastructure and systems integrators",
    proposalServices: "Local sales representation\nQualified lead generation\nCustomer and partner meetings\nProduct demonstrations\nMarket feedback and reporting\nOngoing opportunity management",
    activity: []
  }]
};
let selectedId = data.companies[0]?.id || null;

function save(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); render(); }
function selected(){ return data.companies.find(c => c.id === selectedId); }
function fmtDate(iso){ return new Date(iso).toLocaleString("en-GB",{dateStyle:"medium",timeStyle:"short"}); }
function addActivity(company, text){ company.activity ||= []; company.activity.unshift({id:uid(), text, at:new Date().toISOString()}); }

function renderStats(){
  const total=data.companies.length;
  const sent=data.companies.filter(c=>["Email Sent","Follow-up Due","Replied","Meeting Booked","Proposal Sent","Negotiation","Won"].includes(c.stage)).length;
  const replies=data.companies.filter(c=>["Replied","Meeting Booked","Proposal Sent","Negotiation","Won"].includes(c.stage)).length;
  const meetings=data.companies.filter(c=>["Meeting Booked","Proposal Sent","Negotiation","Won"].includes(c.stage)).length;
  const proposals=data.companies.filter(c=>["Proposal Sent","Negotiation","Won"].includes(c.stage)).length;
  const won=data.companies.filter(c=>c.stage==="Won").length;
  $("stats").innerHTML=[
    ["Prospects",total],["Emails sent",sent],["Replies",replies],["Meetings",meetings],["Proposals",proposals],["Won",won]
  ].map(([label,n])=>`<div class="stat"><strong>${n}</strong><span>${label}</span></div>`).join("");
}

function filteredCompanies(){
  const q=$("searchInput").value.toLowerCase();
  const stage=$("statusFilter").value, priority=$("priorityFilter").value;
  return data.companies.filter(c =>
    (!q || [c.name,c.contactName,c.category,c.country].join(" ").toLowerCase().includes(q)) &&
    (!stage || c.stage===stage) && (!priority || c.priority===priority)
  );
}

function renderList(){
  const list=filteredCompanies();
  $("companyCount").textContent=`${list.length} ${list.length===1?"company":"companies"}`;
  $("companyList").innerHTML=list.map(c=>`
    <article class="company-item ${c.id===selectedId?"active":""}" data-id="${c.id}">
      <div class="company-item-top"><h3>${esc(c.name)}</h3><span class="pill priority-${c.priority}">${c.priority}</span></div>
      <p>${esc(c.category||"No category")} · ${esc(c.country||"No country")}</p>
      <span class="badge">${esc(c.stage)}</span>
    </article>`).join("") || `<div class="empty-state"><p>No matching companies.</p></div>`;
  document.querySelectorAll(".company-item").forEach(el=>el.onclick=()=>{selectedId=el.dataset.id;render();});
}

function field(id,key,company){
  const el=$(id); if(!el) return;
  el.value=company[key] ?? "";
  el.oninput=()=>{company[key]=el.value;};
  el.onchange=()=>{company[key]=el.value; if(["stage","priority"].includes(key)) save();};
}

function renderWorkspace(){
  const c=selected();
  $("emptyState").hidden=!!c; $("workspaceContent").hidden=!c;
  if(!c) return;
  $("workspaceCompanyName").textContent=c.name;
  $("workspaceWebsite").textContent=c.website||"";
  $("workspaceWebsite").href=c.website||"#";
  $("companyStageBadge").textContent=c.stage;
  [
    ["companyName","name"],["website","website"],["country","country"],["category","category"],
    ["contactName","contactName"],["contactRole","contactRole"],["contactEmail","contactEmail"],
    ["linkedin","linkedin"],["priority","priority"],["stage","stage"],["fitReason","fitReason"],
    ["notes","notes"],["emailProduct","emailProduct"],["emailOpportunity","emailOpportunity"],
    ["emailCTA","emailCTA"],["emailType","emailType"],["emailSubject","emailSubject"],
    ["emailBody","emailBody"],["proposalTerritory","proposalTerritory"],["commercialModel","commercialModel"],
    ["commercialTerms","commercialTerms"],["proposalValidity","proposalValidity"],["targetSectors","targetSectors"],
    ["proposalServices","proposalServices"]
  ].forEach(args=>field(...args,c));
  renderActivity(c);
  renderProposal(c);
}

function renderActivity(c){
  $("activityList").innerHTML=(c.activity||[]).map(a=>`
    <div class="activity-row"><div>${esc(a.text)}</div><time>${fmtDate(a.at)}</time></div>`
  ).join("") || `<p class="hint">No activity recorded yet.</p>`;
}

function emailCopy(c){
  const first=(c.contactName||"").trim().split(/\s+/)[0] || "there";
  const product=c.emailProduct || c.category || "technology portfolio";
  const opportunity=c.emailOpportunity || "relevant organisations and commercial partners across Scotland";
  const cta={
    call:"Would you be open to a brief 15-minute introductory call to explore whether there could be a fit?",
    reply:"I would welcome your thoughts on whether Scotland is a market you are currently looking to develop.",
    proposal:"I would be pleased to send you a short, tailored Scottish market representation proposal for review."
  }[c.emailCTA||"call"];
  const sign=`Kind regards,\n\nDylan Keddie\nFounder\nCaledonia Technical Partners\ndylan@caledoniatechnicalpartners.com\ncaledoniatechnicalpartners.com`;

  if(c.emailType==="follow1") return {
    subject:`Following up — ${c.name} in Scotland`,
    body:`Hi ${first},\n\nI wanted to follow up on my previous message regarding potential representation for ${c.name} in Scotland.\n\nI believe your ${product} could be relevant to ${opportunity}, and Caledonia Technical Partners could provide focused local sales development without the overhead of establishing a dedicated Scottish office.\n\n${cta}\n\n${sign}`
  };
  if(c.emailType==="follow2") return {
    subject:`Final follow-up — Scottish market opportunity`,
    body:`Hi ${first},\n\nI appreciate you may be busy, so I wanted to send one final follow-up regarding a potential route into the Scottish market for ${c.name}.\n\nShould Scotland become a priority, I would be happy to share a concise outline of the customers, sectors and commercial approach I believe would be most relevant for your ${product}.\n\n${cta}\n\n${sign}`
  };
  if(c.emailType==="proposal") return {
    subject:`Proposal: ${c.name} — Scottish market representation`,
    body:`Hi ${first},\n\nThank you for considering Caledonia Technical Partners as a potential Scottish market representative for ${c.name}.\n\nI have prepared a concise proposal covering the target sectors, local sales activity and suggested commercial model. I would welcome the opportunity to discuss it with you and tailor the approach around your priorities.\n\n${cta}\n\n${sign}`
  };
  return {
    subject:`Scottish market representation for ${c.name}`,
    body:`Hi ${first},\n\nMy name is Dylan Keddie, founder of Caledonia Technical Partners, a technical sales and market-development company based in Edinburgh.\n\nI have been reviewing ${c.name}'s ${product} and believe there may be a genuine opportunity within ${opportunity}.\n\nWe help international technology manufacturers develop business in Scotland through local prospecting, customer engagement, partner development and ongoing market representation—without the immediate cost of building an in-country sales team.\n\n${cta}\n\n${sign}`
  };
}

function proposalHtml(c){
  const today=new Date().toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"});
  const services=(c.proposalServices||"").split("\n").filter(Boolean);
  return `<div class="proposal-doc">
    <section class="proposal-cover">
      <div class="brand"><div class="mark">CTP</div><div><strong style="color:#0b1d36">CALEDONIA</strong><span>TECHNICAL PARTNERS</span></div></div>
      <h1>Scottish Market Representation Proposal</h1>
      <p>Prepared for <strong>${esc(c.name)}</strong></p>
      <p>${today}</p>
    </section>
    <h2>Executive summary</h2>
    <p>Caledonia Technical Partners proposes to support ${esc(c.name)} in developing qualified commercial opportunities across ${esc(c.proposalTerritory||"Scotland")}. Our role would be to provide focused, local market representation while allowing ${esc(c.name)} to enter or expand within the territory without the immediate cost of establishing a dedicated regional sales operation.</p>
    <div class="proposal-meta">
      <div><strong>Territory</strong><br>${esc(c.proposalTerritory||"Scotland")}</div>
      <div><strong>Commercial model</strong><br>${esc(c.commercialModel||"To be agreed")}</div>
      <div><strong>Target sectors</strong><br>${esc(c.targetSectors||"To be agreed")}</div>
      <div><strong>Proposal validity</strong><br>${esc(c.proposalValidity||"30 days")}</div>
    </div>
    <h2>Market opportunity</h2>
    <p>${esc(c.fitReason||`${c.name}'s products appear relevant to organisations and channel partners within the Scottish market.`)}</p>
    <p>Initial activity would focus on validating demand, identifying priority accounts and building a qualified pipeline around ${esc(c.emailProduct||c.category||"the company's product portfolio")}.</p>
    <h2>Proposed services</h2>
    <ul class="proposal-list">${services.map(s=>`<li>${esc(s)}</li>`).join("")}</ul>
    <h2>Commercial framework</h2>
    <p><strong>${esc(c.commercialModel||"Commercial model to be agreed")}</strong></p>
    <p>${esc(c.commercialTerms||"Final commission, retainer, exclusivity, expenses and payment terms would be agreed jointly before commencement.")}</p>
    <h2>Initial 90-day plan</h2>
    <ol class="proposal-list">
      <li>Product, positioning and target-customer onboarding.</li>
      <li>Build and prioritise a Scottish target-account list.</li>
      <li>Launch personalised outreach and channel-partner engagement.</li>
      <li>Arrange qualified discovery calls, demonstrations and meetings.</li>
      <li>Provide a structured activity, pipeline and market-feedback report.</li>
    </ol>
    <h2>Next step</h2>
    <p>A short introductory meeting is recommended to confirm product priorities, territory expectations, sales support and the preferred commercial structure.</p>
    <div class="signature"><strong>Dylan Keddie</strong><br>Founder, Caledonia Technical Partners<br>dylan@caledoniatechnicalpartners.com<br>caledoniatechnicalpartners.com</div>
  </div>`;
}

function renderProposal(c){ $("proposalPreview").innerHTML=proposalHtml(c); }
function render(){ renderStats();renderList();renderWorkspace(); }

$("newCompanyBtn").onclick=()=>{$("companyDialogForm").reset();$("companyDialog").showModal();};
$("createCompanyBtn").onclick=(e)=>{
  e.preventDefault();
  const name=$("newCompanyName").value.trim(); if(!name) return;
  const c={id:uid(),name,website:$("newCompanyWebsite").value.trim(),contactEmail:$("newCompanyEmail").value.trim(),country:"",category:"",contactName:"",contactRole:"",linkedin:"",priority:"A",stage:"Research",fitReason:"",notes:"",emailProduct:"",emailOpportunity:"",emailCTA:"call",emailType:"intro",proposalTerritory:"Scotland",commercialModel:"Commission-based sales representation",proposalValidity:"30 days",proposalServices:"Local sales representation\nQualified lead generation\nCustomer and partner meetings\nProduct demonstrations\nMarket feedback and reporting\nOngoing opportunity management",activity:[]};
  data.companies.unshift(c);selectedId=c.id;$("companyDialog").close();save();
};
$("saveCompanyBtn").onclick=()=>{const c=selected();if(!c)return;addActivity(c,"Company record updated");save();};
$("deleteCompanyBtn").onclick=()=>{const c=selected();if(!c||!confirm(`Delete ${c.name}?`))return;data.companies=data.companies.filter(x=>x.id!==c.id);selectedId=data.companies[0]?.id||null;save();};
$("generateEmailBtn").onclick=()=>{const c=selected();const out=emailCopy(c);c.emailSubject=out.subject;c.emailBody=out.body;c.stage="Email Drafted";addActivity(c,`Generated ${$("emailType").selectedOptions[0].text.toLowerCase()}`);save();activateTab("email");};
$("copyEmailBtn").onclick=async()=>{const c=selected();await navigator.clipboard.writeText(`Subject: ${c.emailSubject}\n\n${c.emailBody}`);alert("Email copied.");};
$("openGmailBtn").onclick=()=>{const c=selected();const url=`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(c.contactEmail||"")}&su=${encodeURIComponent(c.emailSubject||"")}&body=${encodeURIComponent(c.emailBody||"")}`;window.open(url,"_blank");};
$("openMailBtn").onclick=()=>{const c=selected();location.href=`mailto:${encodeURIComponent(c.contactEmail||"")}?subject=${encodeURIComponent(c.emailSubject||"")}&body=${encodeURIComponent(c.emailBody||"")}`;};
$("markSentBtn").onclick=()=>{const c=selected();c.stage="Email Sent";c.lastEmailAt=new Date().toISOString();addActivity(c,`Email marked as sent: ${c.emailSubject||"Outreach email"}`);save();};
$("generateProposalBtn").onclick=()=>{const c=selected();renderProposal(c);addActivity(c,"Generated market representation proposal");save();};
$("printProposalBtn").onclick=()=>{const c=selected();c.stage="Proposal Sent";addActivity(c,"Proposal prepared for PDF export");save();window.print();};
$("addActivityBtn").onclick=()=>{const c=selected(),v=$("activityNote").value.trim();if(!v)return;addActivity(c,v);$("activityNote").value="";save();};
$("searchInput").oninput=renderList;$("statusFilter").onchange=renderList;$("priorityFilter").onchange=renderList;

document.querySelectorAll(".tab").forEach(btn=>btn.onclick=()=>activateTab(btn.dataset.tab));
function activateTab(tab){
  document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.tab===tab));
  document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active"));
  $(`${tab}Panel`).classList.add("active");
}

$("exportDataBtn").onclick=()=>{
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`ctp-crm-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();URL.revokeObjectURL(a.href);
};
$("importDataInput").onchange=async(e)=>{
  try{const imported=JSON.parse(await e.target.files[0].text());if(!Array.isArray(imported.companies))throw new Error();data=imported;selectedId=data.companies[0]?.id||null;save();}
  catch{alert("That file is not a valid CRM backup.");}
};
render();
