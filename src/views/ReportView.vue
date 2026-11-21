<script setup>
import { computed, ref } from 'vue'
import { useOrderStore } from '../stores/orders'
import { resetAll } from '../utils/storage'
import { formatRupiah, formatDate } from '../utils/format'
import StatCard from '../components/common/StatCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'

const orders = useOrderStore()
const average = computed(() => (orders.transactions.length ? Math.round(orders.revenue / orders.transactions.length) : 0))

const askReset = ref(false)
function resetDemo() {
  resetAll()
  location.reload()
}
</script>

<template>
  <section>
    <div class="grid grid--stats">
      <StatCard label="Total pendapatan" :value="formatRupiah(orders.revenue)" tone="ok" />
      <StatCard label="Jumlah transaksi" :value="orders.transactions.length" />
      <StatCard label="Rata-rata per transaksi" :value="formatRupiah(average)" />
    </div>

    <div class="grid grid--cards">
      <div>
        <h2 class="section-title">Pendapatan per hari</h2>
        <table class="table">
          <thead><tr><th>Tanggal</th><th>Transaksi</th><th>Total</th></tr></thead>
          <tbody>
            <tr v-for="d in orders.revenueByDay" :key="d.key">
              <td>{{ formatDate(d.date) }}</td><td>{{ d.count }}</td><td>{{ formatRupiah(d.total) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div>
        <h2 class="section-title">Menu terlaris</h2>
        <table class="table">
          <thead><tr><th>Menu</th><th>Terjual</th></tr></thead>
          <tbody>
            <tr v-for="p in orders.topProducts" :key="p.name"><td>{{ p.name }}</td><td>{{ p.qty }}</td></tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="toolbar">
      <BaseButton variant="danger" small @click="askReset = true">Kembalikan ke data awal</BaseButton>
    </div>

    <BaseModal :open="askReset" title="Kembalikan data awal" @close="askReset = false">
      <p>Semua data kembali ke data seed. Perubahan yang sudah dibuat akan hilang.</p>
      <template #footer>
        <BaseButton variant="ghost" @click="askReset = false">Batal</BaseButton>
        <BaseButton variant="danger" @click="resetDemo">Kembalikan</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
