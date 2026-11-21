<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  type: { type: String, default: 'button' },
  disabled: Boolean,
  small: Boolean,
})
</script>

<template>
  <button :type="type" class="btn" :class="[`btn--${variant}`, { 'btn--small': small }]" :disabled="disabled">
    <slot />
  </button>
</template>
