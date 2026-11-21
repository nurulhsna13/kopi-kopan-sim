<script setup>
defineProps({ open: Boolean, title: String })
const emit = defineEmits(['close'])
</script>

<template>
  <div v-if="open" class="modal-backdrop" @click.self="emit('close')">
    <div class="modal" role="dialog" aria-modal="true" :aria-label="title">
      <header class="modal__head">
        <h3>{{ title }}</h3>
        <button class="icon-btn" type="button" aria-label="Tutup" @click="emit('close')">&times;</button>
      </header>
      <div class="modal__body"><slot /></div>
      <footer v-if="$slots.footer" class="modal__foot"><slot name="footer" /></footer>
    </div>
  </div>
</template>
