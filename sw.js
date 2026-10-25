self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('notificationclick',e=>{e.notification.close();const u=e.notification.data&&e.notification.data.url;
e.waitUntil(u?clients.openWindow(u):clients.matchAll({type:'window'}).then(l=>l.length?l[0].focus():clients.openWindow('./')))});
