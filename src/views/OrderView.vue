<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useMenuStore } from '../stores/menu'
import { useOrderStore } from '../stores/orders'
import { formatRupiah } from '../utils/format'
import MenuCard from '../components/features/MenuCard.vue'
import OrderItemRow from '../components/features/OrderItemRow.vue'
import TableButton from '../components/features/TableButton.vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import BaseButton from '../components/common/BaseButton.vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import EmptyState from '../components/common/EmptyState.vue'

const auth = useAuthStore()
const menu = useMenuStore()
const orders = useOrderStore()

const tableId = ref(null)
const cart = ref([]) // { productId, qty, note }
const search = ref('')
const moveTo = ref('')
const feedback = ref({ type: 'info', message: '' })

const activeOrder = computed(() => (tableId.value ? orders.orderForTable(tableId.value) : null))
const freeTables = computed(() => orders.tables.filter((t) => !orders.orderForTable(t.id)))
const products = computed(() => menu.products.filter((p) => p.name.toLowerCase().includes(search.value.toLowerCase())))
const cartLines = computed(() =>
  cart.value.map((c) => {
    const p = menu.productById(c.productId)
    return { ...c, name: p?.name ?? '-', subtotal: c.qty * (p?.price ?? 0) }
  }),
)
const cartTotal = computed(() => cartLines.value.reduce((s, l) => s + l.subtotal, 0))
const oldLines = computed(() => (activeOrder.value ? orders.orderLines(activeOrder.value) : []))

function tableBadge(t) {
  const o = orders.orderForTable(t.id)
  if (!o) return ''
  return o.status === 'siap' ? 'Siap diantar' : ''
}
function selectTable(t) {
  tableId.value = t.id
  cart.value = []
  feedback.value = { type: 'info', message: '' }
}
function addToCart(p) {
  const found = cart.value.find((c) => c.productId === p.id)
  if (found) found.qty += 1
  else cart.value.push({ productId: p.id, qty: 1, note: '' })
}
function changeQty(item, delta) {
  item.qty += delta
  if (item.qty <= 0) cart.value = cart.value.filter((c) => c !== item)
}
function submit() {
  const result = orders.submitOrder({ tableId: tableId.value, waiterId: auth.user.id, items: cart.value })
  if (!result.ok) {
    feedback.value = { type: 'bad', message: result.message }
    return
  }
  cart.value = []
  feedback.value = { type: 'ok', message: 'Pesanan terkirim ke dapur.' }
}
function serve() {
  orders.advanceStatus(activeOrder.value.id)
  feedback.value = { type: 'ok', message: 'Pesanan ditandai sudah disajikan.' }
}
function move() {
  const result = orders.moveTable(activeOrder.value.id, Number(moveTo.value))
  if (!result.ok) {
    feedback.value = { type: 'bad', message: result.message }
    return
  }
  tableId.value = Number(moveTo.value)
  moveTo.value = ''
  feedback.value = { type: 'ok', message: 'Pesanan dipindahkan ke meja baru.' }
}
</script>

<template>
  <section>
    <div class="table-row">
      <TableButton
        v-for="t in orders.tables"
        :key="t.id"
        :table="t"
        :occupied="!!orders.orderForTable(t.id)"
        :selected="t.id === tableId"
        :badge="tableBadge(t)"
        @select="selectTable"
      />
    </div>

    <EmptyState v-if="!tableId" title="Pilih meja dulu" hint="Meja berwarna biru tua sudah punya pesanan aktif." />
    <div v-else class="split">
      <div>
        <input v-model="search" class="input" type="search" placeholder="Cari menu" />
        <div class="grid grid--cards grid--compact">
          <MenuCard v-for="p in products" :key="p.id" :product="p" :category-name="menu.categoryName(p.categoryId)" mode="pick" @add="addToCart" />
        </div>
      </div>

      <aside class="panel">
        <h2>Meja {{ orders.tableNumber(tableId) }}</h2>
        <template v-if="activeOrder">
          <p class="panel__row">Status <StatusBadge :status="activeOrder.status" /></p>
          <h3 class="panel__sub">Sudah dikirim</h3>
          <ul class="plain-list">
            <OrderItemRow v-for="(l, i) in oldLines" :key="i" :name="l.name" :qty="l.qty" :subtotal="l.subtotal" :note="l.note" />
          </ul>
          <BaseButton v-if="activeOrder.status === 'siap'" @click="serve">Tandai sudah disajikan</BaseButton>
        </template>

        <h3 class="panel__sub">Menu baru</h3>
        <p v-if="!cartLines.length" class="muted">Belum ada menu dipilih.</p>
        <ul v-else class="plain-list">
          <OrderItemRow
            v-for="item in cartLines"
            :key="item.productId"
            :name="item.name"
            :qty="item.qty"
            :subtotal="item.subtotal"
            editable
            @increment="changeQty(cart.find((c) => c.productId === item.productId), 1)"
            @decrement="changeQty(cart.find((c) => c.productId === item.productId), -1)"
            @remove="cart = cart.filter((c) => c.productId !== item.productId)"
          />
        </ul>
        <p class="panel__total">Tambahan: {{ formatRupiah(cartTotal) }}</p>
        <AlertMessage :type="feedback.type" :message="feedback.message" />
        <BaseButton @click="submit">Kirim ke dapur</BaseButton>

        <div v-if="activeOrder" class="panel__move">
          <select v-model="moveTo" class="input">
            <option value="" disabled>Pindah ke meja...</option>
            <option v-for="t in freeTables" :key="t.id" :value="t.id">Meja {{ t.number }}</option>
          </select>
          <BaseButton variant="ghost" @click="move">Pindahkan</BaseButton>
        </div>
      </aside>
    </div>
  </section>
</template>
