function go(t){S.tab=t;render();scrollTo(0,0)}
function render(){const y=scrollY;$('#app').innerHTML=S.tab==='dash'?dash():S.tab==='safe'?safe():track();document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===S.tab));scrollTo(0,y)}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>go(b.dataset.t));
setInterval(()=>{if(S.tab!=='safe'&&!S.demo)render()},30000);

// Refresh area weather every 30 s
setInterval(()=>{refreshArea(false).then(()=>{if(S.tab==='dash'&&!S.demo)render()})},3e4);
setInterval(()=>{if(!S.rem||!S.notif)return;const h=new Date().getHours();if(h<9||h>19||Date.now()-S.lastRem<72e5)return;S.lastRem=Date.now();notify('Drink water','Time for some water.')},6e4);

refreshArea(false).then(render);
try{navigator.permissions.query({name:'geolocation'}).then(p=>{if(p.state==='granted')getLoc()})}catch(e){}
render();
