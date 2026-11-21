<script setup>
import { ref, computed, reactive } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useMenuStore } from '../stores/menu'
import MenuCard from '../components/features/MenuCard.vue'
import BaseButton from '../components/common/BaseButton.vue'
import BaseModal from '../components/common/BaseModal.vue'
import FormField from '../components/common/FormField.vue'
import AlertMessage from '../components/common/AlertMessage.vue'
import EmptyState from '../components/common/EmptyState.vue'

const auth = useAuthStore()
const menu = useMenuStore()
const isOwner = computed(() => auth.role === 'owner')

const search = ref('')
const category = ref(0)
const visible = computed(() =>
  menu.products.filter(
    (p) => (!category.value || p.categoryId === category.value) && p.name.toLowerCase().includes(search.value.toLowerCase()),
  ),
)

const modalOpen = ref(false)
const editingId = ref(null)
const form = reactive({ name: '', categoryId: '', price: '' })
const error = ref('')

function openAdd() {
  editingId.value = null
  Object.assign(form, { name: '', categoryId: '', price: '' })
  error.value = ''
  modalOpen.value = true
}
function openEdit(p) {
  editingId.value = p.id
  Object.assign(form, { name: p.name, categoryId: p.categoryId, price: p.price })
  error.value = ''
  modalOpen.value = true
}
function save() {
  const result = editingId.value ? menu.updateProduct(editingId.value, form) : menu.addProduct(form)
  if (!result.ok) {
    error.value = result.message
    return
  }
  modalOpen.value = false
}
const deleting = ref(null)
function confirmRemove() {
  menu.removeProduct(deleting.value.id)
  deleting.value = null
}
</script>

<template>
  <section>
    <div class="toolbar">
      <input v-model="search" class="input toolbar__search" type="search" placeholder="Cari menu" />
      <select v-model.number="category" class="input">
        <option :value="0">Semua kategori</option>
        <option v-for="c in menu.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
      </select>
      <BaseButton v-if="isOwner" @click="openAdd">Tambah menu</BaseButton>
    </div>

    <EmptyState v-if="!visible.length" title="Menu tidak ditemukan" hint="Coba kata kunci atau kategori lain." />
    <div v-else class="grid grid--cards">
      <MenuCard
        v-for="p in visible"
        :key="p.id"
        :product="p"
        :category-name="menu.categoryName(p.categoryId)"
        :mode="isOwner ? 'manage' : 'view'"
        @edit="openEdit"
        @toggle="menu.toggleAvailable($event.id)"
        @remove="deleting = $event"
      />
    </div>

    <BaseModal :open="!!deleting" title="Hapus menu" @close="deleting = null">
      <p>Hapus menu "{{ deleting?.name }}"? Menu yang dihapus tidak bisa dikembalikan.</p>
      <template #footer>
        <BaseButton variant="ghost" @click="deleting = null">Batal</BaseButton>
        <BaseButton variant="danger" @click="confirmRemove">Hapus</BaseButton>
      </template>
    </BaseModal>

    <BaseModal :open="modalOpen" :title="editingId ? 'Ubah menu' : 'Tambah menu'" @close="modalOpen = false">
      <FormField v-model="form.name" label="Nama menu" />
      <FormField label="Kategori">
        <select v-model="form.categoryId" class="input">
          <option value="" disabled>Pilih kategori</option>
          <option v-for="c in menu.categories" :key="c.id" :value="c.id">{{ c.name }}</option>
        </select>
      </FormField>
      <FormField v-model="form.price" label="Harga (Rp)" type="number" />
      <AlertMessage type="bad" :message="error" />
      <template #footer>
        <BaseButton variant="ghost" @click="modalOpen = false">Batal</BaseButton>
        <BaseButton @click="save">Simpan</BaseButton>
      </template>
    </BaseModal>
  </section>
</template>
