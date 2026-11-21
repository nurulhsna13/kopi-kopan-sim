# Kopi Kopan - Sistem Pesanan, Dapur, Kasir, dan Stok

Proyek UTS Pemrograman Berbasis Komponen (Vue.js v3, Vue Router, Pinia).
Objek usaha: Kopi Kopan, Jl. Soekarno Hatta (seberang PBEC), Pekanbaru.

## Cara menjalankan
```
npm install
npm run dev
```
Buka alamat yang muncul di terminal (biasanya http://localhost:5173).

## Tanpa terminal
File `kopi-kopan-app.html` (hasil `npm run build`) bisa dibuka langsung dengan klik dua kali di browser.

## Akun demo
| Role | Username | Kata sandi |
|---|---|---|
| Pemilik | owner | owner123 |
| Kasir | kasir | kasir123 |
| Pelayan | pelayan | pelayan123 |
| Dapur | dapur | dapur123 |

## Catatan
- Data awal ada di `src/data/seed/*.json`. Saat pertama dibuka, data disalin ke `localStorage`.
- Untuk mengembalikan data awal: login sebagai Pemilik, buka Laporan, klik "Kembalikan ke data awal".
- Tidak ada server. Store Pinia meniru kontrak API di laporan (`/api/v1/...`) dengan `localStorage`.
