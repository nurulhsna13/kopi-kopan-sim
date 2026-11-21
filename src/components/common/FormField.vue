<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  error: String,
})
const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <label class="field">
    <span class="field__label">{{ label }}</span>
    <slot>
      <input class="input" :type="type" :value="modelValue" :placeholder="placeholder" @input="emit('update:modelValue', $event.target.value)" />
    </slot>
    <span v-if="error" class="field__error">{{ error }}</span>
  </label>
</template>
