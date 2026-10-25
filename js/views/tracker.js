// ===== Tracker screen (water and sunscreen) =====
const wToday=()=>{const d=new Date().toDateString();return S.water.filter(e=>new Date(e.t).toDateString()===d)};
const sum=a=>a.reduce((x,e)=>x+e.oz,0);

function addW(o){S.water.push({t:Date.now(),oz:o});save();render()}
function addS(){S.sun.push(Date.now());save();render()}
function delW(t){S.water=S.water.filter(e=>e.t!==t);save();render()}
function delS(t){S.sun=S.sun.filter(e=>e!==t);save();render()}
function track(){const td=sum(wToday()),pr=Math.min(td/Math.max(S.goal,1),1),C=2*Math.PI*52;
const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-(6-i));const k=d.toDateString();return{l:d.toLocaleDateString([],{weekday:'narrow'}),oz:sum(S.water.filter(e=>new Date(e.t).toDateString()===k))}});
const mx=Math.max(S.goal,...days.map(d=>d.oz))||1;
const ls=S.sun.length?S.sun[S.sun.length-1]:0,m=Math.floor((Date.now()-ls)/6e4);
const ss=!ls?'No sunscreen logged yet.':m>=120?`Applied ${Math.floor(m/60)} h ago. Time to reapply.`:`Applied ${m} min ago. Reapply in ${120-m} min.`;
let h='<h1>Tracker</h1>';
h+=`<div class="card"><h2>Water today</h2><div class="row"><div style="position:relative" class="ring"><svg viewBox="0 0 120 120" class="ring"><circle cx="60" cy="60" r="52" fill="none" stroke="#ffffff1f" stroke-width="13"/><circle cx="60" cy="60" r="52" fill="none" stroke="#64d2ff" stroke-width="13" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C*(1-pr)}" transform="rotate(-90 60 60)"/><text x="60" y="62" text-anchor="middle" font-size="26" font-weight="800">${Math.round(td)}</text><text x="60" y="80" text-anchor="middle" font-size="11" style="fill:#9aa6b6">of ${S.goal} oz</text></svg></div><div style="display:flex;flex-direction:column;gap:8px">${[8,12,16,24].map(o=>`<button class="cy" onclick="addW(${o})">+${o} oz</button>`).join('')}</div></div>
<div class="row" style="margin-top:12px"><span class="sm">Daily goal: ${S.goal} oz</span><div class="sp"></div><button onclick="S.goal=Math.max(16,S.goal-8);save();render()">−</button><button onclick="S.goal=Math.min(160,S.goal+8);save();render()">+</button></div>
${wToday().length?wToday().slice().reverse().map(e=>`<div class="row sm" style="margin-top:8px">💧 ${e.oz} oz<div class="sp"></div><span class="mut">${tm(e.t)}</span><button onclick="delW(${e.t})">🗑</button></div>`).join(''):'<div class="mut sm" style="margin-top:8px">Nothing logged yet today.</div>'}</div>`;
h+=`<div class="card"><h2>Last 7 days</h2><svg viewBox="0 0 280 110" style="width:100%;height:150px">${days.map((d,i)=>{const bh=d.oz/mx*80;return`<rect x="${i*40+8}" y="${90-bh}" width="26" height="${bh}" rx="3" fill="#64d2ff" opacity="${d.oz>=S.goal?1:.45}"/><text x="${i*40+21}" y="105" text-anchor="middle" font-size="10">${d.l}</text>`}).join('')}<line x1="0" x2="280" y1="${90-S.goal/mx*80}" y2="${90-S.goal/mx*80}" stroke="#fff9" stroke-dasharray="4"/></svg></div>`;
h+=`<div class="card"><h2>Sunscreen</h2><button class="or full" onclick="addS()">☀️ I applied sunscreen</button><div class="mut sm" style="margin:10px 0">${ss}</div>${S.sun.filter(t=>new Date(t).toDateString()===new Date().toDateString()).reverse().map(t=>`<div class="row sm">☀️ Applied<div class="sp"></div><span class="mut">${tm(t)}</span><button onclick="delS(${t})">🗑</button></div>`).join('')}</div>`;
h+=remindersCard();return h}
