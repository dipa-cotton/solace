// ===== Cool places (OpenStreetMap) =====
async function fetchPlaces(){const{lat,lon}=S.loc,a=`(around:10000,${lat},${lon})`;
const q=`[out:json][timeout:25];(nwr["amenity"="library"]${a};nwr["amenity"="community_centre"]${a};nwr["shop"="supermarket"]${a};nwr["shop"="mall"]${a};nwr["amenity"="pharmacy"]${a};nwr["name"~"cooling",i]${a};);out center 200;`;
try{const r=await fetch('https://overpass-api.de/api/interpreter',{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'}});if(!r.ok)throw 0;
const seen=new Set(),list=[];for(const e of(await r.json()).elements){const t=e.tags||{},c=e.center||e;if(c.lat==null||!t.name)continue;
const cat=/cooling/i.test(t.name)?'Cooling center':t.amenity==='library'?'Library':t.amenity==='community_centre'?'Community center':t.shop==='mall'?'Mall':t.shop==='supermarket'?'Grocery store':'Pharmacy';
const k=t.name+cat+c.lat.toFixed(3);if(seen.has(k))continue;seen.add(k);list.push({name:t.name,cat,lat:c.lat,lon:c.lon})}
list.sort((x,y)=>dist(S.loc,x)-dist(S.loc,y));S.pl={t:Date.now(),loc:S.loc,list:list.slice(0,40)};LS('sol_places',S.pl);return S.pl.list}catch(e){return null}}
async function findPlaces(){if(!S.loc){S.placeMsg='Choose a location first (see the top of this page).';return render()}
S.placeBusy=true;S.placeMsg='';render();const l=await fetchPlaces();S.placeBusy=false;
if(!l)S.placeMsg='Couldn’t search. This needs an internet connection. If you’re offline, go to the nearest air-conditioned building you know.';
else if(!l.length)S.placeMsg='No places found within 10 km. In the US you can call 211 to ask about cooling centers.';render()}
async function nearest(){if(!S.loc)return null;let l,saved=false;
if(S.pl&&Date.now()-S.pl.t<18e5&&dist(S.pl.loc,S.loc)<3000)l=S.pl.list;else{l=await fetchPlaces();if(!l&&S.pl){l=S.pl.list;saved=true}}
if(!l||!l.length)return null;const p=l.map(x=>({...x,d:dist(S.loc,x)})).filter(x=>x.d<=1e4).sort((a,b)=>a.d-b.d)[0];return p?{...p,saved}:null}
const sentence=p=>`Closest cool place: ${p.name} (${p.cat.toLowerCase()}, ${dTxt(p.d)} away).`+(p.saved?' From an earlier search, so call ahead if you can.':'');
