import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { read, save } from '../utils/storage'
import { useStaffStore } from './staff'

export const useAuthStore = defineStore('auth', () => {
  const staff = useStaffStore()
  const userId = ref(read('session'))

  const user = computed(() => staff.users.find((u) => u.id === userId.value && u.active) ?? null)
  const role = computed(() => (user.value ? staff.roleCode(user.value.roleId) : null))
  const roleName = computed(() => (user.value ? staff.roleName(user.value.roleId) : ''))
  const isLoggedIn = computed(() => !!user.value)

  function login(username, password) {
    if (!username.trim() || !password) return { ok: false, message: 'Username dan kata sandi wajib diisi' }
    const found = staff.users.find((u) => u.active && u.username === username.trim() && u.password === password)
    if (!found) return { ok: false, message: 'Username atau kata sandi salah' }
    userId.value = found.id
    save('session', found.id)
    return { ok: true }
  }
  function logout() {
    userId.value = null
    localStorage.removeItem('kopan:session')
  }

  return { user, role, roleName, isLoggedIn, login, logout }
})
