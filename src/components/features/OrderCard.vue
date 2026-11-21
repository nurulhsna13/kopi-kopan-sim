<script setup>
import { computed } from 'vue'
import { useOrderStore } from '../../stores/orders'
import { useStaffStore } from '../../stores/staff'
import { formatRupiah, formatDateTime } from '../../utils/format'
import StatusBadge from '../common/StatusBadge.vue'

const props = defineProps({ order: { type: Object, required: true } })
const orders = useOrderStore()
const staff = useStaffStore()

const lines = computed(() => orders.orderLines(props.order))
const total = computed(() => orders.orderTotal(props.order))
</script>

<template>
  <article class="order-card">
    <header class="order-card__head">
      <h3>Meja {{ orders.tableNumber(order.tableId) }}</h3>
      <StatusBadge :status="order.status" />
    </header>
    <p class="order-card__meta">
      #{{ order.id }} - {{ formatDateTime(order.createdAt) }} - pelayan {{ staff.userName(order.waiterId) }}
    </p>
    <p v-if="order.revision > 0 && order.status !== 'dibayar'" class="order-card__flag">Ada tambahan menu</p>
    <ul class="plain-list">
      <li v-for="(l, i) in lines" :key="i">
        <span>{{ l.qty }}x {{ l.name }}</span>
        <small v-if="l.note"> ({{ l.note }})</small>
      </li>
    </ul>
    <p class="order-card__total">{{ formatRupiah(total) }}</p>
    <div class="order-card__actions"><slot name="actions" /></div>
  </article>
</template>
