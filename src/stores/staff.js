import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import seed from '../data/seed/users.json'
import { loadOrSeed, save } from '../utils/storage'
import { MIN_STAFF_PER_SHIFT } from '../utils/constants'

const KEY = 'users'

export const useStaffStore = defineStore('staff', () => {
  const data = loadOrSeed(KEY, seed)
  const roles = ref(data.roles)
  const shifts = ref(data.shifts)
  const users = ref(data.users)

  watch([roles, shifts, users], () => save(KEY, { roles: roles.value, shifts: shifts.value, users: users.value }), { deep: true })

  const roleCode = (roleId) => roles.value.find((r) => r.id === roleId)?.code ?? null
  const roleName = (roleId) => roles.value.find((r) => r.id === roleId)?.name ?? '-'
  const shiftName = (shiftId) => shifts.value.find((s) => s.id === shiftId)?.name ?? '-'
  const userName = (id) => users.value.find((u) => u.id === id)?.name ?? '-'

  // Ringkasan man power: jumlah karyawan aktif per shift dibanding kebutuhan minimal
  const staffing = computed(() =>
    shifts.value.map((shift) => ({
      shift,
      rows: Object.entries(MIN_STAFF_PER_SHIFT).map(([code, need]) => {
        const have = users.value.filter((u) => u.active && u.shiftId === shift.id && roleCode(u.roleId) === code).length
        return { code, name: roles.value.find((r) => r.code === code)?.name ?? code, have, need, short: Math.max(need - have, 0) }
      }),
    })),
  )
  const totalShortage = computed(() => staffing.value.reduce((s, sh) => s + sh.rows.reduce((a, r) => a + r.short, 0), 0))
  const activeCount = computed(() => users.value.filter((u) => u.active).length)

  function addUser({ name, username, password, roleId, shiftId }) {
    if (!name.trim() || !username.trim() || !password) return { ok: false, message: 'Nama, username, dan kata sandi wajib diisi' }
    if (users.value.some((u) => u.username === username.trim())) return { ok: false, message: 'Username sudah dipakai' }
    const id = users.value.reduce((m, u) => Math.max(m, u.id), 0) + 1
    users.value.push({ id, roleId: Number(roleId), shiftId: shiftId ? Number(shiftId) : null, name: name.trim(), username: username.trim(), password, phone: '', active: true })
    return { ok: true }
  }
  function toggleActive(id) {
    const u = users.value.find((x) => x.id === id)
    if (u) u.active = !u.active
  }

  return { roles, shifts, users, staffing, totalShortage, activeCount, roleCode, roleName, shiftName, userName, addUser, toggleActive }
})
