<script setup>
import { computed } from 'vue'
import { ORDER_STATUS } from '../../utils/constants'

const props = defineProps({ status: String, label: String, tone: String })
const info = computed(() => (props.status ? ORDER_STATUS[props.status] : { label: props.label, tone: props.tone }))
</script>

<template>
  <span class="badge" :class="`badge--${info.tone}`">{{ info.label }}</span>
</template>
