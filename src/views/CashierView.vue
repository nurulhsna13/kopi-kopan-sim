<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useOrderStore } from '../stores/orders'
import { PAYMENT_METHODS } from '../utils/constants'
import { formatRupiah } from '../utils/format'
import OrderCard from '../components/features/OrderCard.vue'
import ReceiptPreview from '../components/features/ReceiptPreview.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import FormField from '../components/common/FormField.vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import EmptyState from '../components/common/EmptyState.vue'

const auth = useAuthStore()
const orders = useOrderStore()

const payingId = ref(null)
const method = ref(PAYMENT_METHODS[0])
const received = ref('')
const error = ref('')
const receiptOrderId = ref(null)

const paying = computed(() => orders.orders.find((o) => o.id === payingId.value) ?? null)
const total = computed(() => (paying.value ? orders.orderTotal(paying.value) : 0))
const change = computed(() => (method.value === 'Tunai' ? Math.max(Number(received.value) - total.value, 0) : 0))
const receiptOrder = computed(() => orders.orders.find((o) => o.id === receiptOrderId.value) ?? null)
const receiptTx = computed(() => (receiptOrder.value ? orders.transactionOf(receiptOrder.value.id) : null))

function printReceipt() {
  window.print()
}
function openPay(o) {
  payingId.value = o.id
  method.value = PAYMENT_METHODS[0]
  received.value = ''
  error.value = ''
}
function pay() {
  const result = orders.payOrder({ orderId: payingId.value, cashierId: auth.user.id, method: method.value, received: received.value })
  if (!result.ok) {
    error.value = result.message
    return
  }
  receiptOrderId.value = payingId.value
  payingId.value = null
}
</script>

<template>
  <section>
    <EmptyState v-if="!orders.activeOrders.length" title="Tidak ada pesanan yang menunggu dibayar" />
    <div v-else class="grid grid--cards">
      <OrderCard v-for="o in orders.activeOrders" :key="o.id" :order="o">
        <template #actions>
          <BaseButton small @click="openPay(o)">Bayar</BaseButton>
        </template>
      </OrderCard>
    </div>

    <BaseModal :open="!!paying" :title="`Pembayaran Meja ${paying ? orders.tableNumber(paying.tableId) : ''}`" @close="payingId = null">
      <p class="panel__total">Total: {{ formatRupiah(total) }}</p>
      <FormField label="Metode bayar">
        <select v-model="method" class="input">
          <option v-for="m in PAYMENT_METHODS" :key="m" :value="m">{{ m }}</option>
        </select>
      </FormField>
      <FormField v-if="method === 'Tunai'" v-model="received" label="Uang diterima (Rp)" type="number" />
      <p v-if="method === 'Tunai'" class="muted">Kembalian: {{ formatRupiah(change) }}</p>
      <AlertMessage type="bad" :message="error" />
      <template #footer>
        <BaseButton variant="ghost" @click="payingId = null">Batal</BaseButton>
        <BaseButton @click="pay">Bayar dan buat nota</BaseButton>
      </template>
    </BaseModal>

    <BaseModal :open="!!receiptTx" title="Pembayaran berhasil" @close="receiptOrderId = null">
      <ReceiptPreview v-if="receiptTx" :order="receiptOrder" :transaction="receiptTx" />
      <template #footer>
        <BaseButton variant="ghost" @click="receiptOrderId = null">Tutup</BaseButton>
        <BaseButton @click="printReceipt">Cetak nota</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
