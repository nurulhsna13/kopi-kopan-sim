<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useStaffStore } from '../stores/staff'
import FormField from '../components/common/FormField.vue'
import BaseButton from '../components/common/BaseButton.vue'
import AlertMessage from '../components/common/AlertMessage.vue'

const auth = useAuthStore()
const staff = useStaffStore()
const router = useRouter()
const route = useRoute()

const username = ref('')
const password = ref('')
const error = ref('')

// Satu akun demo per role, diambil dari data karyawan (bukan ditulis manual)
const demoAccounts = computed(() =>
  staff.roles.map((r) => staff.users.find((u) => u.roleId === r.id && u.active)).filter(Boolean),
)

function submit() {
  const result = auth.login(username.value, password.value)
  if (!result.ok) {
    error.value = result.message
    return
  }
  router.push(route.query.redirect || { name: 'dashboard' })
}
function fill(user) {
  username.value = user.username
  password.value = user.password
  error.value = ''
}
</script>

<template>
  <div class="login">
    <section class="login__brand">
      <h1>Kopi Kopan</h1>
      <p class="login__tag">Waisan Tanah Melayu</p>
      <p class="login__lead">Pesanan meja, antrian dapur, kasir, dan stok bahan dalam satu layar.</p>
      <div class="login__motif" aria-hidden="true"></div>
    </section>
    <section class="login__panel">
      <form class="login__form" @submit.prevent="submit">
        <h2>Masuk ke sistem</h2>
        <FormField v-model="username" label="Username" placeholder="contoh: kasir" />
        <FormField v-model="password" label="Kata sandi" type="password" placeholder="Kata sandi" />
        <AlertMessage type="bad" :message="error" />
        <BaseButton type="submit">Masuk</BaseButton>
      </form>
      <div class="login__demo">
        <p>Akun demo (klik untuk mengisi otomatis)</p>
        <div class="login__chips">
          <button v-for="u in demoAccounts" :key="u.id" type="button" class="chip" @click="fill(u)">
            {{ staff.roleName(u.roleId) }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
