<script setup>
defineProps({ table: { type: Object, required: true }, occupied: Boolean, selected: Boolean, badge: String })
const emit = defineEmits(['select'])
</script>

<template>
  <button type="button" class="table-btn" :class="{ 'table-btn--busy': occupied, 'table-btn--on': selected }" @click="emit('select', table)">
    <strong>Meja {{ table.number }}</strong>
    <small>{{ table.capacity }} kursi</small>
    <span v-if="badge" class="table-btn__badge">{{ badge }}</span>
  </button>
</template>
