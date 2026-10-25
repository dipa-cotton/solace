// ===== App state and saved settings =====
const $=s=>document.querySelector(s);

const S={tab:'dash',useC:false,thr:90,demo:false,demoStart:0,reading:null,hist:[],alerts:[],lastLvl:0,above:false,lastSun:0,water:[],sun:[],goal:64,loc:null};
try{const d=JSON.parse(localStorage.getItem('solace')||'{}');Object.assign(S,{useC:!!d.useC,thr:d.thr||90,water:d.water||[],sun:d.sun||[],goal:d.goal||64})}catch(e){}
const save=()=>{try{localStorage.setItem('solace',JSON.stringify({useC:S.useC,thr:S.thr,water:S.water,sun:S.sun,goal:S.goal}))}catch(e){}};

const LS=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v))}catch(e){return null}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

//saved location, weather, places and notification settings.
S.loc=LS('sol_loc');S.area=LS('sol_area');S.grid=LS('sol_grid');S.pl=LS('sol_places');
S.notif=!!LS('sol_notif')&&'Notification' in window&&Notification.permission==='granted';
S.demoNotif=!!LS('sol_demonotif');S.rem=!!LS('sol_rem');S.lastRem=0;S.aboveA=false;S.lastA=0;S.lvlA=0;
