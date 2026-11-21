<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useStockStore } from '../stores/stock'
import { useStaffStore } from '../stores/staff'
import { formatDateTime } from '../utils/format'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import FormField from '../components/common/FormField.vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import StatCard from '../components/common/StatCard.vue'

const auth = useAuthStore()
const stock = useStockStore()
const staff = useStaffStore()
const isOwner = computed(() => auth.role === 'owner')

const moveOpen = ref(false)
const move = reactive({ ingredientId: '', type: 'keluar', qty: '', note: '' })
const newOpen = ref(false)
const fresh = reactive({ name: '', unit: '', stock: 0, minStock: 0 })
const error = ref('')

function openMove(item) {
  Object.assign(move, { ingredientId: item?.id ?? '', type: 'keluar', qty: '', note: '' })
  error.value = ''
  moveOpen.value = true
}
function saveMove() {
  const result = stock.addMovement({ ...move, userId: auth.user.id })
  if (!result.ok) {
    error.value = result.message
    return
  }
  moveOpen.value = false
}
function openNew() {
  Object.assign(fresh, { name: '', unit: '', stock: 0, minStock: 0 })
  error.value = ''
  newOpen.value = true
}
function saveNew() {
  const result = stock.addIngredient(fresh)
  if (!result.ok) {
    error.value = result.message
    return
  }
  newOpen.value = false
}
</script>

<template>
  <section>
    <div class="grid grid--stats">
      <StatCard label="Jenis bahan" :value="stock.ingredients.length" />
      <StatCard label="Bahan menipis atau habis" :value="stock.lowStock.length" :tone="stock.lowStock.length ? 'warn' : 'ok'" hint="stok di bawah batas minimal" />
    </div>

    <div class="toolbar">
      <BaseButton @click="openMove()">Catat stok masuk atau keluar</BaseButton>
      <BaseButton v-if="isOwner" variant="ghost" @click="openNew">Tambah bahan</BaseButton>
    </div>

    <table class="table">
      <thead>
        <tr><th>Bahan</th><th>Stok</th><th>Batas minimal</th><th>Kondisi</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="i in stock.ingredients" :key="i.id">
          <td>{{ i.name }}</td>
          <td>{{ i.stock }} {{ i.unit }}</td>
          <td>{{ i.minStock }} {{ i.unit }}</td>
          <td><StatusBadge :label="stock.level(i).label" :tone="stock.level(i).tone" /></td>
          <td><BaseButton small variant="ghost" @click="openMove(i)">Catat</BaseButton></td>
        </tr>
      </tbody>
    </table>

    <h2 class="section-title">Riwayat terbaru</h2>
    <ul class="plain-list">
      <li v-for="m in stock.latestMovements" :key="m.id" class="history">
        <span>{{ formatDateTime(m.date) }} - {{ stock.ingredientName(m.ingredientId) }}</span>
        <span>{{ m.type === 'masuk' ? '+' : '-' }}{{ m.qty }} ({{ staff.userName(m.userId) }})<template v-if="m.note"> - {{ m.note }}</template></span>
      </li>
    </ul>

    <BaseModal :open="moveOpen" title="Catat pergerakan stok" @close="moveOpen = false">
      <FormField label="Bahan">
        <select v-model="move.ingredientId" class="input">
          <option value="" disabled>Pilih bahan</option>
          <option v-for="i in stock.ingredients" :key="i.id" :value="i.id">{{ i.name }} ({{ i.stock }} {{ i.unit }})</option>
        </select>
      </FormField>
      <FormField label="Jenis">
        <select v-model="move.type" class="input">
          <option value="masuk">Masuk (belanja)</option>
          <option value="keluar">Keluar (dipakai)</option>
        </select>
      </FormField>
      <FormField v-model="move.qty" label="Jumlah" type="number" />
      <FormField v-model="move.note" label="Catatan" placeholder="contoh: belanja pasar" />
      <AlertMessage type="bad" :message="error" />
      <template #footer>
        <BaseButton variant="ghost" @click="moveOpen = false">Batal</BaseButton>
        <BaseButton @click="saveMove">Simpan</BaseButton>
      </template>
    </BaseModal>

    <BaseModal :open="newOpen" title="Tambah bahan" @close="newOpen = false">
      <FormField v-model="fresh.name" label="Nama bahan" />
      <FormField v-model="fresh.unit" label="Satuan" placeholder="kg, liter, butir" />
      <FormField v-model="fresh.stock" label="Stok awal" type="number" />
      <FormField v-model="fresh.minStock" label="Batas minimal" type="number" />
      <AlertMessage type="bad" :message="error" />
      <template #footer>
        <BaseButton variant="ghost" @click="newOpen = false">Batal</BaseButton>
        <BaseButton @click="saveNew">Simpan</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
