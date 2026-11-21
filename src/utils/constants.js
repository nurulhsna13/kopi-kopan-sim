// Konstanta aplikasi (bukan data bisnis): label status, urutan status, metode bayar
export const ORDER_STATUS = {
  baru: { label: 'Baru', tone: 'info' },
  diproses: { label: 'Diproses', tone: 'warn' },
  siap: { label: 'Siap diantar', tone: 'ok' },
  disajikan: { label: 'Sudah disajikan', tone: 'muted' },
  dibayar: { label: 'Lunas', tone: 'ok' },
}
export const NEXT_STATUS = { baru: 'diproses', diproses: 'siap', siap: 'disajikan' }
export const KITCHEN_ACTION = { baru: 'Mulai masak', diproses: 'Tandai siap' }
export const PAYMENT_METHODS = ['Tunai', 'QRIS', 'Transfer']
// Kebutuhan minimal karyawan per shift (dipakai untuk menandai kekurangan man power)
export const MIN_STAFF_PER_SHIFT = { pelayan: 2, dapur: 2, kasir: 1 }
export const ALL_ROLES = ['owner', 'kasir', 'pelayan', 'dapur']
