// --- notifications
const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const standalone=()=>navigator.standalone===true||(window.matchMedia&&matchMedia('(display-mode: standalone)').matches);
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});
async function enableNotif(){if(!('Notification' in window)){S.notifMsg=isIOS?'On iPad, notifications only work from the Home Screen. Tap Share, then Add to Home Screen, open Solace from there, and tap this button again.':'This browser doesn’t support notifications.';return render()}
const p=await Notification.requestPermission();S.notif=p==='granted';LS('sol_notif',S.notif);S.notifMsg=S.notif?'':'Notifications are blocked. Allow them in Settings > Notifications (or your browser’s site settings).';
if(S.notif)notify('Solace','Notifications are on.');render()}
async function notify(title,msg,place){if(!S.notif||!('Notification' in window)||Notification.permission!=='granted')return;
const o={body:msg,tag:'solace-'+Date.now(),icon:'icon-192.png',badge:'icon-192.png',data:{url:place?dirURL(place):null}};
try{const reg=await navigator.serviceWorker.getRegistration();if(reg){await reg.showNotification(title,o);return}}catch(e){}
try{const n=new Notification(title,o);n.onclick=()=>{window.focus();if(place)window.open(dirURL(place),'_blank')}}catch(e){}}
const GO=/^(Temperature limit|Danger|Extreme Danger)/;
function raise(title,msg){const demo=S.demo,item={t:Date.now(),title:(demo?'Demo: ':'')+title,msg};
S.alerts.unshift(item);if(S.alerts.length>50)S.alerts.pop();const send=()=>{if(!demo||S.demoNotif)notify(item.title,item.msg,item.place)};
if(GO.test(title)&&S.loc)nearest().then(p=>{if(p){item.msg+=' '+sentence(p);item.place=p}send();if(S.tab==='dash')render()});else send()}
function evalArea(){if(S.demo||!S.area)return;const a=S.area,f=a.f,now=Date.now();
if(f>=S.thr){if(!S.aboveA||now-S.lastA>=9e5){S.lastA=now;raise('Temperature limit exceeded','Area feels like '+Math.round(f)+'°F, above your '+S.thr+'°F limit. Head indoors if you can, and drink water.')}S.aboveA=true}else if(f<S.thr-2)S.aboveA=false;
const l=lvl(f);if(l>S.lvlA&&l>=3)raise(LV[l].t+': area feels like '+Math.round(f)+'°F',LV[l].a);S.lvlA=l}


// ===== Demo mode
function tickDemo(){const p=Math.min((Date.now()-S.demoStart)/90000,1),f=84+14*p,h=55+20*p,uv=3+6*p;
const r={t:Date.now(),f:hi(f,h),temp:f,h,uv,lux:20000+70000*p};S.reading=r;S.hist.push(r);if(S.hist.length>360)S.hist.shift();
const l=lvl(r.f);if(r.f>=S.thr){if(!S.above)raise('Temperature limit exceeded','Feels like '+Math.round(r.f)+'°F, above your '+S.thr+'°F limit. Head indoors if you can, and drink water.');S.above=true}
if(l>S.lastLvl&&l>=3)raise(LV[l].t+': feels like '+Math.round(r.f)+'°F',LV[l].a);S.lastLvl=l;
if(uv>=3&&Date.now()-S.lastSun>12e4&&!S.sun.length){S.lastSun=Date.now();raise('Sunscreen reminder','UV is '+uv.toFixed(1)+'. Apply or reapply sunscreen.')}}
let timer=null;
function startDemo(){S.demo=true;S.demoStart=Date.now();S.hist=[];S.reading=null;S.above=false;S.lastLvl=0;clearInterval(timer);timer=setInterval(()=>{tickDemo();if(S.tab==='dash')render()},1000);tickDemo();render()}
function stopDemo(){S.demo=false;clearInterval(timer);S.reading=null;S.hist=[];render()}
