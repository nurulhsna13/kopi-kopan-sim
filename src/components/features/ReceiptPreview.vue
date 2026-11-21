<script setup>
import { computed } from 'vue'
import { useOrderStore } from '../../stores/orders'
import { formatRupiah, formatDateTime } from '../../utils/format'

const props = defineProps({ order: { type: Object, required: true }, transaction: { type: Object, required: true } })
const orders = useOrderStore()
const lines = computed(() => orders.orderLines(props.order))
</script>

<template>
  <div class="receipt">
    <h3>Kopi Kopan</h3>
    <p class="receipt__sub">Waisan Tanah Melayu</p>
    <p>Meja {{ orders.tableNumber(order.tableId) }} - Nota #{{ transaction.id }}</p>
    <p>{{ formatDateTime(transaction.paidAt) }}</p>
    <hr />
    <div v-for="(l, i) in lines" :key="i" class="receipt__row">
      <span>{{ l.qty }}x {{ l.name }}</span>
      <span>{{ formatRupiah(l.subtotal) }}</span>
    </div>
    <hr />
    <div class="receipt__row"><strong>Total</strong><strong>{{ formatRupiah(transaction.total) }}</strong></div>
    <p>Dibayar dengan {{ transaction.method }}</p>
  </div>
</template>
