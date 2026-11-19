// 離線快取：網路不通時仍可開啟。更新版本時把 VERSION 改掉。
var VERSION='tc-v2';
var FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(VERSION).then(function(c){return c.addAll(FILES)}));self.skipWaiting()});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==VERSION}).map(function(k){return caches.delete(k)}))}));self.clients.claim()});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  // 先用網路取得最新版，失敗再用快取
  e.respondWith(fetch(e.request).then(function(r){var cp=r.clone();caches.open(VERSION).then(function(c){c.put(e.request,cp)});return r}).catch(function(){return caches.match(e.request,{ignoreSearch:true})}));
});
