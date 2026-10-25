// ===== Location =====
function getLoc(){if(!navigator.geolocation){S.locErr='This browser can’t share location.';return render()}
navigator.geolocation.getCurrentPosition(p=>{S.loc={lat:p.coords.latitude,lon:p.coords.longitude,t:Date.now()};LS('sol_loc',S.loc);S.locErr='';refreshArea(true).then(render);render()},
e=>{S.locErr=e.code===1?'Location is blocked. Allow it in your browser’s site settings, then try again.':'Couldn’t get your location ('+e.message+'). This needs https.';render()},{timeout:15000,maximumAge:60000})}
