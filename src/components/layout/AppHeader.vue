<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import BaseButton from '../common/BaseButton.vue'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

function logout() {
  auth.logout()
  router.push({ name: 'login' })
}
</script>

<template>
  <header class="topbar">
    <h1 class="topbar__title">{{ route.meta.title }}</h1>
    <div class="topbar__user">
      <span><strong>{{ auth.user?.name }}</strong> ({{ auth.roleName }})</span>
      <BaseButton variant="ghost" small @click="logout">Keluar</BaseButton>
    </div>
  </header>
</template>
