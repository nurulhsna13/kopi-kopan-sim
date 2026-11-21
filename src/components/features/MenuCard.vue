<script setup>
import { formatRupiah } from '../../utils/format'
import BaseButton from '../common/BaseButton.vue'
import StatusBadge from '../common/StatusBadge.vue'

// mode: 'pick' (pelayan memilih), 'manage' (pemilik mengelola), 'view' (hanya lihat)
defineProps({
  product: { type: Object, required: true },
  categoryName: String,
  mode: { type: String, default: 'view' },
})
const emit = defineEmits(['add', 'edit', 'toggle', 'remove'])
</script>

<template>
  <article class="menu-card" :class="{ 'menu-card--off': !product.available }">
    <div>
      <span class="menu-card__cat">{{ categoryName }}</span>
      <h3 class="menu-card__name">{{ product.name }}</h3>
      <p class="menu-card__price">{{ formatRupiah(product.price) }}</p>
    </div>
    <div class="menu-card__foot">
      <StatusBadge v-if="!product.available" label="Habis" tone="bad" />
      <BaseButton v-if="mode === 'pick'" small :disabled="!product.available" @click="emit('add', product)">Tambah</BaseButton>
      <template v-if="mode === 'manage'">
        <BaseButton small variant="ghost" @click="emit('edit', product)">Ubah</BaseButton>
        <BaseButton small variant="ghost" @click="emit('toggle', product)">{{ product.available ? 'Tandai habis' : 'Tersedia' }}</BaseButton>
        <BaseButton small variant="danger" @click="emit('remove', product)">Hapus</BaseButton>
      </template>
    </div>
  </article>
</template>
