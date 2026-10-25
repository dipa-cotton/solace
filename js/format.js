// ===== Formatting and distance helpers =====
const T=f=>S.useC?Math.round((f-32)*5/9)+'°C':Math.round(f)+'°F';
const ago=ms=>{const s=Math.max(0,Math.floor(ms/1000));return s<60?s+' s ago':s<3600?Math.floor(s/60)+' min ago':Math.floor(s/3600)+' h ago'};
const tm=t=>new Date(t).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'});

const dist=(a,b)=>{const R=6371e3,r=Math.PI/180,dl=(b.lat-a.lat)*r,dn=(b.lon-a.lon)*r,x=Math.sin(dl/2)**2+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(x))};
const dirURL=p=>'https://maps.apple.com/?daddr='+p.lat+','+p.lon+'&dirflg=d';
const dTxt=m=>S.useC?(m/1000).toFixed(1)+' km':(m/1609.34).toFixed(1)+' mi';
