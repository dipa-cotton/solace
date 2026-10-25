// --- weather (Open-Meteo)
const omURL=(la,lo)=>'https://api.open-meteo.com/v1/forecast?latitude='+la.map(x=>x.toFixed(4)).join()+'&longitude='+lo.map(x=>x.toFixed(4)).join()+'&current=temperature_2m,relative_humidity_2m,uv_index&temperature_unit=fahrenheit';
async function refreshArea(force){if(!S.loc)return;if(!force&&S.area&&Date.now()-S.area.t<12e4)return;
try{const c=(await(await fetch(omURL([S.loc.lat],[S.loc.lon]))).json()).current;S.area={t:Date.now(),temp:c.temperature_2m,h:c.relative_humidity_2m,uv:c.uv_index||0,f:hi(c.temperature_2m,c.relative_humidity_2m),lat:S.loc.lat,lon:S.loc.lon};LS('sol_area',S.area);S.areaErr='';evalArea()}catch(e){S.areaErr='Couldn’t reach the weather service.'}}
async function refreshGrid(){if(!S.loc)return;S.gridBusy=true;S.gridTry=Date.now();const{lat,lon}=S.loc,st=.04,ls=st/Math.max(Math.cos(lat*Math.PI/180),.2),la=[],lo=[];
for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){la.push(lat+i*st);lo.push(lon+j*ls)}
try{const r=await(await fetch(omURL(la,lo))).json();S.grid={t:Date.now(),lat,lon,pts:r.map((x,k)=>({lat:la[k],lon:lo[k],f:hi(x.current.temperature_2m,x.current.relative_humidity_2m)}))};LS('sol_grid',S.grid);S.gridErr=''}catch(e){S.gridErr='Couldn’t load the heat map. Showing the last saved one, if any.'}
S.gridBusy=false;render()}
function ensureGrid(){if(!S.loc||S.gridBusy)return;if(S.gridTry&&Date.now()-S.gridTry<6e4)return;const g=S.grid;if(!g||Date.now()-g.t>6e5||dist(g,S.loc)>3000)refreshGrid()}
