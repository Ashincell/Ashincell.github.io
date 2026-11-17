'use strict';
const admin = require('firebase-admin');
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
const token = process.env.FCM_TEST_TOKEN;
if (!raw || !token) throw Error('Secrets FIREBASE_SERVICE_ACCOUNT_JSON dan FCM_TEST_TOKEN wajib diisi.');
let credentials;
try { credentials = JSON.parse(raw); } catch { throw Error('FIREBASE_SERVICE_ACCOUNT_JSON bukan JSON yang valid.'); }
if (credentials.project_id !== 'ashin-cell') throw Error('Project ID service account tidak sesuai.');
admin.initializeApp({credential: admin.credential.cert(credentials)});
const title = process.env.PROMO_TITLE || '🎁 Promo Ashin Cell';
const body = process.env.PROMO_BODY || 'Cek paket internet terbaru di Ashin Cell!';
const url = 'https://ashincell.github.io/';
(async () => {
  const result = await admin.messaging().send({
    token,
    data: {title, body, url},
    webpush: {headers: {TTL: '3600'}}
  });
  console.log('FCM berhasil menerima permintaan pengiriman:', result);
})().catch(err => {
  console.error('Gagal mengirim:', err.code || err.message);
  process.exitCode = 1;
});
