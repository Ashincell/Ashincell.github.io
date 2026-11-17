# Ashin Cell V1.4 — UID Admin tanpa koleksi admins

Firebase Project: `ashin-cell`. Login Email/Password melalui Firebase Authentication.

## Persiapan
1. Aktifkan Authentication > Email/Password, pastikan akun yang akan dipakai memiliki UID `z9d9XlrsGBVuov9W6QNwrWaqUkG2`.
2. Firestore > Rules: tempel isi `firestore.rules` lalu Publish. Tidak perlu membuat koleksi `admins`.
3. Deploy dari folder ini: `firebase deploy --only hosting,firestore:rules` setelah login `firebase login` dan memilih proyek yang benar. Bisa juga publikasikan rules lewat Console dahulu.
4. Buka URL hosting `/admin.html`, login dengan email/password akun UID tersebut, lalu klik tombol impor 34 produk awal satu kali.
5. Cek halaman publik dan uji perubahan harga/status produk. Uji bahwa akun lain tidak bisa mengedit.

## Catatan
- Admin mengelola koleksi `products`; hanya produk `active == true` dapat dibaca publik lewat Firestore. Admin dapat membaca semua produk.
- Halaman Cek Area dan XL Harian masih memakai daftar tertanam dari versi lama; perubahan admin pada katalog tidak otomatis menyinkronkan dua daftar tersebut.
- Jangan simpan kredensial admin atau private key di kode website.
- PWA hanya bisa diinstal dari domain HTTPS/localhost. Belum dilakukan pengujian deploy langsung.
