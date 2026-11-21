export function formatRupiah(value) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value || 0)
}
export function formatDateTime(iso) {
  return new Date(iso).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
}
export function formatDate(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { dateStyle: 'medium' })
}
export function dayKey(iso) {
  return new Date(iso).toISOString().slice(0, 10)
}
