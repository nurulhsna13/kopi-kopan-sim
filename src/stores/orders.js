import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import seed from '../data/seed/orders.json'
import { loadOrSeed, save } from '../utils/storage'
import { NEXT_STATUS } from '../utils/constants'
import { dayKey } from '../utils/format'
import { useMenuStore } from './menu'

const KEY = 'orders'
const fail = (message) => ({ ok: false, message })
const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1

export const useOrderStore = defineStore('orders', () => {
  const menu = useMenuStore()
  const data = loadOrSeed(KEY, seed)
  const tables = ref(data.tables)
  const orders = ref(data.orders)
  const transactions = ref(data.transactions)

  watch([tables, orders, transactions], () => save(KEY, { tables: tables.value, orders: orders.value, transactions: transactions.value }), { deep: true })

  const activeOrders = computed(() => orders.value.filter((o) => o.status !== 'dibayar'))
  const revenue = computed(() => transactions.value.reduce((s, t) => s + t.total, 0))
  const occupiedCount = computed(() => tables.value.filter((t) => orderForTable(t.id)).length)

  const orderTotal = (o) => o.items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
  const orderForTable = (tableId) => activeOrders.value.find((o) => o.tableId === tableId) ?? null
  const tableNumber = (id) => tables.value.find((t) => t.id === id)?.number ?? '-'
  const orderLines = (o) =>
    o.items.map((i) => ({ name: menu.productById(i.productId)?.name ?? 'Menu dihapus', qty: i.qty, note: i.note, unitPrice: i.unitPrice, subtotal: i.qty * i.unitPrice }))
  const transactionOf = (orderId) => transactions.value.find((t) => t.orderId === orderId) ?? null

  // Pelayan mengirim pesanan. Kalau meja sudah punya pesanan aktif, menu baru
  // digabung ke pesanan itu (kasus pelanggan menambah menu).
  function submitOrder({ tableId, waiterId, items }) {
    if (!tableId) return fail('Pilih meja terlebih dahulu')
    if (!items.length) return fail('Pilih minimal satu menu')
    const picked = []
    for (const it of items) {
      const product = menu.productById(it.productId)
      if (!product || !product.available) return fail('Ada menu yang sedang habis, hapus dulu dari daftar')
      picked.push({ product, qty: it.qty, note: it.note ?? '' })
    }
    let order = orderForTable(tableId)
    if (order) {
      order.revision += 1
      if (order.status === 'siap' || order.status === 'disajikan') order.status = 'diproses'
    } else {
      const id = nextId(orders.value)
      orders.value.push({ id, tableId, waiterId, status: 'baru', createdAt: new Date().toISOString(), revision: 0, items: [] })
      order = orders.value.find((o) => o.id === id)
    }
    for (const { product, qty, note } of picked) {
      const same = order.items.find((i) => i.productId === product.id && i.note === note)
      if (same) same.qty += qty
      else order.items.push({ productId: product.id, qty, unitPrice: product.price, note })
    }
    return { ok: true }
  }
  function moveTable(orderId, newTableId) {
    const order = orders.value.find((o) => o.id === orderId)
    if (!order) return fail('Pesanan tidak ditemukan')
    if (!newTableId) return fail('Pilih meja tujuan')
    if (orderForTable(newTableId)) return fail('Meja tujuan sedang terisi')
    order.tableId = newTableId
    return { ok: true }
  }
  function advanceStatus(orderId) {
    const order = orders.value.find((o) => o.id === orderId)
    if (!order || !NEXT_STATUS[order.status]) return fail('Status tidak bisa diubah')
    order.status = NEXT_STATUS[order.status]
    return { ok: true }
  }
  function payOrder({ orderId, cashierId, method, received }) {
    const order = orders.value.find((o) => o.id === orderId)
    if (!order || order.status === 'dibayar') return fail('Pesanan tidak ditemukan atau sudah lunas')
    const total = orderTotal(order)
    if (method === 'Tunai' && !(Number(received) >= total)) return fail('Uang diterima kurang dari total')
    const tx = { id: nextId(transactions.value), orderId, cashierId, total, method, paidAt: new Date().toISOString() }
    transactions.value.push(tx)
    order.status = 'dibayar'
    return { ok: true, data: tx }
  }

  // Data untuk laporan
  const topProducts = computed(() => {
    const count = {}
    orders.value.filter((o) => o.status === 'dibayar').forEach((o) =>
      o.items.forEach((i) => { count[i.productId] = (count[i.productId] ?? 0) + i.qty }),
    )
    return Object.entries(count)
      .map(([id, qty]) => ({ name: menu.productById(Number(id))?.name ?? 'Menu dihapus', qty }))
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5)
  })
  const revenueByDay = computed(() => {
    const map = {}
    transactions.value.forEach((t) => {
      const k = dayKey(t.paidAt)
      map[k] = map[k] ?? { date: t.paidAt, count: 0, total: 0 }
      map[k].count += 1
      map[k].total += t.total
    })
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0])).map(([key, v]) => ({ key, ...v }))
  })

  return {
    tables, orders, transactions, activeOrders, revenue, occupiedCount, topProducts, revenueByDay,
    orderTotal, orderForTable, tableNumber, orderLines, transactionOf, submitOrder, moveTable, advanceStatus, payOrder,
  }
})
