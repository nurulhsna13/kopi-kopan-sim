<script setup>
import { formatRupiah } from '../../utils/format'

defineProps({
  name: String,
  qty: Number,
  subtotal: Number,
  note: String,
  editable: Boolean,
})
const emit = defineEmits(['increment', 'decrement', 'remove'])
</script>

<template>
  <li class="item-row">
    <div class="item-row__info">
      <span class="item-row__name">{{ name }}</span>
      <small v-if="note" class="item-row__note">{{ note }}</small>
    </div>
    <div v-if="editable" class="item-row__qty">
      <button type="button" class="icon-btn" aria-label="Kurangi" @click="emit('decrement')">-</button>
      <span>{{ qty }}</span>
      <button type="button" class="icon-btn" aria-label="Tambah" @click="emit('increment')">+</button>
      <button type="button" class="icon-btn icon-btn--danger" aria-label="Hapus" @click="emit('remove')">&times;</button>
    </div>
    <span v-else class="item-row__qty">{{ qty }}x</span>
    <span class="item-row__sub">{{ formatRupiah(subtotal) }}</span>
  </li>
</template>
