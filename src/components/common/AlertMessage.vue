<script setup>
defineProps({ type: { type: String, default: 'info' }, message: String })
</script>

<template>
  <p v-if="message" class="alert" :class="`alert--${type}`" role="alert">{{ message }}</p>
</template>
