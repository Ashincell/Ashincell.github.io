'use strict';
const admin = require('firebase-admin');
const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
if (!raw) throw Error('Secret FIREBASE_SERVICE_ACCOUNT_JSON wajib diisi.');
let credentials;
try { credentials = JSON.parse(raw); } catch { throw Error('FIREBASE_SERVICE_ACCOUNT_JSON bukan JSON valid.'); }
if (credentials.project_id !== 'ashin-cell') throw Error('Project ID service account tidak sesuai.');
admin.initializeApp({ credential: admin.credential.cert(credentials) });
const title = (process.env.PROMO_TITLE || '🎁 Promo Ashin Cell').trim();
const body = (process.env.PROMO_BODY || 'Cek paket internet terbaru di Ashin Cell!').trim();
const url = 'https://ashincell.github.io/';
if (!title || !body || title.length > 120 || body.length > 500) throw Error('Judul harus 1–120 karakter dan isi 1–500 karakter.');
const chunk = (arr, size) => Array.from({length: Math.ceil(arr.length / size)}, (_, i) => arr.slice(i * size, (i + 1) * size));
(async () => {
  const db = admin.firestore();
  const snapshot = await db.collection('pushSubscribers').where('enabled', '==', true).get();
  const entries = snapshot.docs.map(doc => ({ ref: doc.ref, token: doc.data().token }))
    .filter(entry => typeof entry.token === 'string' && entry.token.length > 20);
  const unique = [...new Map(entries.map(entry => [entry.token, entry])).values()];
  console.log(`Subscriber aktif: ${snapshot.size}; token valid unik: ${unique.length}`);
  if (!unique.length) { console.log('Tidak ada penerima. Pengiriman dibatalkan.'); return; }
  let success = 0, failure = 0, removed = 0;
  const invalidCodes = new Set(['messaging/registration-token-not-registered', 'messaging/invalid-registration-token']);
  for (const batch of chunk(unique, 500)) {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: batch.map(item => item.token),
      data: { title, body, url },
      webpush: { headers: { TTL: '3600' } }
    });
    success += response.successCount;
    failure += response.failureCount;
    for (let i = 0; i < response.responses.length; i++) {
      const result = response.responses[i];
      if (!result.success) {
        const code = result.error?.code || 'unknown';
        console.warn(`Pengiriman gagal: ${code}`);
        if (invalidCodes.has(code)) {
          // Hapus hanya jika token dokumen masih sama, agar token baru tidak terhapus.
          await db.runTransaction(async tx => {
            const current = await tx.get(batch[i].ref);
            if (current.exists && current.data().token === batch[i].token) {
              tx.delete(batch[i].ref);
              removed++;
            }
          });
        }
      }
    }
  }
  console.log(`Selesai. Berhasil: ${success}; gagal: ${failure}; token tidak aktif dibersihkan: ${removed}.`);
  if (failure > 0) process.exitCode = 1;
})().catch(err => {
  console.error('Pengiriman massal gagal:', err.code || err.message);
  process.exitCode = 1;
});
