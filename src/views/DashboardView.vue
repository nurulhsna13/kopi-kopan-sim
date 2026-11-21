<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useOrderStore } from '../stores/orders'
import { useStockStore } from '../stores/stock'
import { useStaffStore } from '../stores/staff'
import { useMenuStore } from '../stores/menu'
import { formatRupiah } from '../utils/format'
import StatCard from '../components/common/StatCard.vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import EmptyState from '../components/common/EmptyState.vue'
import StatusBadge from '../components/common/StatusBadge.vue'

const route = useRoute()
const auth = useAuthStore()
const orders = useOrderStore()
const stock = useStockStore()
const staff = useStaffStore()
const menu = useMenuStore()

const countBy = (status) => orders.activeOrders.filter((o) => o.status === status).length

const stats = computed(() => {
  const lowStock = { label: 'Bahan menipis', value: stock.lowStock.length, hint: 'perlu dibeli', tone: stock.lowStock.length ? 'warn' : 'ok' }
  switch (auth.role) {
    case 'owner':
      return [
        { label: 'Pendapatan tercatat', value: formatRupiah(orders.revenue), tone: 'ok' },
        { label: 'Pesanan aktif', value: orders.activeOrders.length, tone: 'info' },
        lowStock,
        { label: 'Kekurangan man power', value: staff.totalShortage, hint: 'orang di semua shift', tone: staff.totalShortage ? 'warn' : 'ok' },
      ]
    case 'kasir':
      return [
        { label: 'Menunggu pembayaran', value: orders.activeOrders.length, tone: 'warn' },
        { label: 'Sudah disajikan', value: countBy('disajikan'), tone: 'info' },
        { label: 'Total transaksi', value: orders.transactions.length, tone: 'ok' },
      ]
    case 'pelayan':
      return [
        { label: 'Meja terisi', value: `${orders.occupiedCount} / ${orders.tables.length}`, tone: 'info' },
        { label: 'Siap diantar', value: countBy('siap'), hint: 'dari dapur', tone: countBy('siap') ? 'ok' : 'info' },
        { label: 'Menu habis', value: menu.unavailableCount, tone: menu.unavailableCount ? 'warn' : 'ok' },
      ]
    default:
      return [
        { label: 'Antrian baru', value: countBy('baru'), tone: 'warn' },
        { label: 'Sedang diproses', value: countBy('diproses'), tone: 'info' },
        lowStock,
      ]
  }
})
</script>

<template>
  <section>
    <AlertMessage v-if="route.query.denied" type="warn" :message="`Halaman ${route.query.denied} tidak bisa dibuka dengan role ${auth.roleName}.`" />
    <div class="grid grid--stats">
      <StatCard v-for="s in stats" :key="s.label" v-bind="s" />
    </div>

    <h2 class="section-title">Pesanan aktif</h2>
    <EmptyState v-if="!orders.activeOrders.length" title="Belum ada pesanan aktif" hint="Pesanan baru dari pelayan akan muncul di sini." />
    <table v-else class="table">
      <thead>
        <tr><th>Meja</th><th>Status</th><th>Jumlah menu</th><th>Total</th></tr>
      </thead>
      <tbody>
        <tr v-for="o in orders.activeOrders" :key="o.id">
          <td>Meja {{ orders.tableNumber(o.tableId) }}</td>
          <td><StatusBadge :status="o.status" /></td>
          <td>{{ o.items.reduce((s, i) => s + i.qty, 0) }}</td>
          <td>{{ formatRupiah(orders.orderTotal(o)) }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>
