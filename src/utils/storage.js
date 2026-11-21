// Pembungkus localStorage. Semua akses dibungkus try/catch supaya aplikasi
// tidak crash kalau storage penuh atau diblokir browser.
const PREFIX = 'kopan:'
export const KEYS = ['users', 'menu', 'stock', 'orders', 'session']

export function save(name, value) {
  try {
    localStorage.setItem(PREFIX + name, JSON.stringify(value))
  } catch (e) {
    console.warn('Gagal menyimpan ke localStorage', e)
  }
}

export function read(name) {
  try {
    const raw = localStorage.getItem(PREFIX + name)
    return raw ? JSON.parse(raw) : null
  } catch (e) {
    console.warn('Gagal membaca localStorage', e)
    return null
  }
}

// Kalau localStorage masih kosong, salin data dari file JSON seed lalu simpan.
export function loadOrSeed(name, seed) {
  const saved = read(name)
  if (saved) return saved
  const copy = JSON.parse(JSON.stringify(seed))
  save(name, copy)
  return copy
}

export function resetAll() {
  KEYS.forEach((k) => localStorage.removeItem(PREFIX + k))
}
