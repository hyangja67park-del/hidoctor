/* 하이닥터 AI 서비스워커 — 앱 껍데기를 저장해 두어 다음부터 빠르게 열림. 업데이트 시 VERSION만 올리면 됨 */
const VERSION='hidoctor-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request; if(req.method!=='GET') return;
  const url=new URL(req.url);
  if(url.origin!==location.origin) return;               /* 구글 폰트 등 외부는 브라우저에 맡김 */
  if(req.mode==='navigate'){                             /* 화면(HTML)은 인터넷이 되면 최신본, 안 되면 저장본 */
    e.respondWith(fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put('./index.html',cp));return r;}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(req).then(h=>h||fetch(req).then(r=>{const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp));return r;})));
});
