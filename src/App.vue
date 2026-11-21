<script setup>
import { useRoute, RouterView } from 'vue-router'
import AppSidebar from './components/layout/AppSidebar.vue'
import AppHeader from './components/layout/AppHeader.vue'

const route = useRoute()
</script>

<template>
  <RouterView v-if="route.meta.public" />
  <div v-else class="shell">
    <AppSidebar />
    <div class="shell__main">
      <AppHeader />
      <main class="content"><RouterView /></main>
    </div>
  </div>
</template>
