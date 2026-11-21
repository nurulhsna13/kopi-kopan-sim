<script setup>
import { computed } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()

// Menu samping dibuat dari meta route, jadi otomatis ikut role yang login
const items = computed(() =>
  router
    .getRoutes()
    .filter((r) => r.meta.nav && r.meta.roles?.includes(auth.role))
    .sort((a, b) => a.meta.order - b.meta.order),
)
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__brand">
      <span class="sidebar__name">Kopi Kopan</span>
      <span class="sidebar__tag">Waisan Tanah Melayu</span>
    </div>
    <nav class="sidebar__nav" aria-label="Menu utama">
      <RouterLink v-for="item in items" :key="item.name" :to="{ name: item.name }" class="sidebar__link">
        {{ item.meta.title }}
      </RouterLink>
    </nav>
    <div class="sidebar__motif" aria-hidden="true"></div>
  </aside>
</template>
