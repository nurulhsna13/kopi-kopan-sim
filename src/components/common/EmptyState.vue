<script setup>
defineProps({ title: String, hint: String })
</script>

<template>
  <div class="empty">
    <strong>{{ title }}</strong>
    <span v-if="hint">{{ hint }}</span>
  </div>
</template>
