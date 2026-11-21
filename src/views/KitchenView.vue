<script setup>
import { computed } from 'vue'
import { useOrderStore } from '../stores/orders'
import { ORDER_STATUS, KITCHEN_ACTION } from '../utils/constants'
import OrderCard from '../components/features/OrderCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import EmptyState from '../components/common/EmptyState.vue'

const orders = useOrderStore()
const columns = computed(() =>
  ['baru', 'diproses', 'siap'].map((status) => ({
    status,
    title: ORDER_STATUS[status].label,
    list: orders.activeOrders.filter((o) => o.status === status),
  })),
)
</script>

<template>
  <section class="board">
    <div v-for="col in columns" :key="col.status" class="board__col">
      <h2 class="board__title">{{ col.title }} ({{ col.list.length }})</h2>
      <EmptyState v-if="!col.list.length" title="Kosong" />
      <OrderCard v-for="o in col.list" :key="o.id" :order="o">
        <template #actions>
          <BaseButton v-if="KITCHEN_ACTION[o.status]" small @click="orders.advanceStatus(o.id)">{{ KITCHEN_ACTION[o.status] }}</BaseButton>
          <span v-else class="muted">Menunggu pelayan mengantar</span>
        </template>
      </OrderCard>
    </div>
  </section>
</template>
