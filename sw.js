// Ashin Cell V1.7 — one service worker for PWA and FCM background messages.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({apiKey:'AIzaSyBSfEdF8iOtAE815CJJoHKPZATpfPjz7lk',authDomain:'ashin-cell.firebaseapp.com',projectId:'ashin-cell',storageBucket:'ashin-cell.firebasestorage.app',messagingSenderId:'777517150847',appId:'1:777517150847:web:8dfd381a2d255ca0d3854a'});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
 // FCM notification payloads are displayed automatically by the SDK/browser.
 if(payload.notification)return;
 const data=payload.data||{};
 self.registration.showNotification(data.title||'Promo Ashin Cell',{body:data.body||'Ada promo terbaru untukmu.',icon:'./icons/icon-192.png',badge:'./icons/icon-192.png',tag:'ashin-promo',data:{url:data.url||'./'}});
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const url=new URL(event.notification.data?.url||'./',self.location.origin);
 if(url.origin!==self.location.origin)url.href=self.location.origin+'/';
 event.waitUntil(clients.openWindow(url.href));
});
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
