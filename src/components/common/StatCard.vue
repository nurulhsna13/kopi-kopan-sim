<script setup>
defineProps({ label: String, value: [String, Number], hint: String, tone: { type: String, default: 'info' } })
</script>

<template>
  <div class="stat" :class="`stat--${tone}`">
    <span class="stat__label">{{ label }}</span>
    <strong class="stat__value">{{ value }}</strong>
    <span v-if="hint" class="stat__hint">{{ hint }}</span>
  </div>
</template>
