<script setup>
import { ref, reactive } from 'vue'
import { useStaffStore } from '../stores/staff'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import FormField from '../components/common/FormField.vue'
import StatusBadge from '../components/common/StatusBadge.vue'
import AlertMessage from '../components/common/AlertMessage.vue'

const staff = useStaffStore()
const open = ref(false)
const form = reactive({ name: '', username: '', password: '', roleId: '', shiftId: '' })
const error = ref('')

function openAdd() {
  Object.assign(form, { name: '', username: '', password: '', roleId: '', shiftId: '' })
  error.value = ''
  open.value = true
}
function save() {
  if (!form.roleId) {
    error.value = 'Pilih role karyawan'
    return
  }
  const result = staff.addUser(form)
  if (!result.ok) {
    error.value = result.message
    return
  }
  open.value = false
}
</script>

<template>
  <section>
    <div class="grid grid--cards">
      <article v-for="sh in staff.staffing" :key="sh.shift.id" class="panel">
        <h2>Shift {{ sh.shift.name }}</h2>
        <p class="muted">{{ sh.shift.startTime }} - {{ sh.shift.endTime }}</p>
        <ul class="plain-list">
          <li v-for="r in sh.rows" :key="r.code" class="history">
            <span>{{ r.name }}: {{ r.have }} dari {{ r.need }}</span>
            <StatusBadge :label="r.short ? `Kurang ${r.short}` : 'Cukup'" :tone="r.short ? 'warn' : 'ok'" />
          </li>
        </ul>
      </article>
    </div>

    <div class="toolbar">
      <h2 class="section-title">Daftar karyawan</h2>
      <BaseButton @click="openAdd">Tambah karyawan</BaseButton>
    </div>
    <table class="table">
      <thead>
        <tr><th>Nama</th><th>Role</th><th>Shift</th><th>Status</th><th></th></tr>
      </thead>
      <tbody>
        <tr v-for="u in staff.users" :key="u.id">
          <td>{{ u.name }}</td>
          <td>{{ staff.roleName(u.roleId) }}</td>
          <td>{{ staff.shiftName(u.shiftId) }}</td>
          <td><StatusBadge :label="u.active ? 'Aktif' : 'Nonaktif'" :tone="u.active ? 'ok' : 'muted'" /></td>
          <td>
            <BaseButton v-if="u.roleId !== 1" small variant="ghost" @click="staff.toggleActive(u.id)">
              {{ u.active ? 'Nonaktifkan' : 'Aktifkan' }}
            </BaseButton>
          </td>
        </tr>
      </tbody>
    </table>

    <BaseModal :open="open" title="Tambah karyawan" @close="open = false">
      <FormField v-model="form.name" label="Nama" />
      <FormField v-model="form.username" label="Username" />
      <FormField v-model="form.password" label="Kata sandi" type="password" />
      <FormField label="Role">
        <select v-model="form.roleId" class="input">
          <option value="" disabled>Pilih role</option>
          <option v-for="r in staff.roles" :key="r.id" :value="r.id">{{ r.name }}</option>
        </select>
      </FormField>
      <FormField label="Shift">
        <select v-model="form.shiftId" class="input">
          <option value="">Tanpa shift</option>
          <option v-for="s in staff.shifts" :key="s.id" :value="s.id">{{ s.name }} ({{ s.startTime }}-{{ s.endTime }})</option>
        </select>
      </FormField>
      <AlertMessage type="bad" :message="error" />
      <template #footer>
        <BaseButton variant="ghost" @click="open = false">Batal</BaseButton>
        <BaseButton @click="save">Simpan</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
