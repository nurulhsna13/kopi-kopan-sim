import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import seed from '../data/seed/menu.json'
import { loadOrSeed, save } from '../utils/storage'

const KEY = 'menu'

export const useMenuStore = defineStore('menu', () => {
  const data = loadOrSeed(KEY, seed)
  const categories = ref(data.categories)
  const products = ref(data.products)

  watch([categories, products], () => save(KEY, { categories: categories.value, products: products.value }), { deep: true })

  const unavailableCount = computed(() => products.value.filter((p) => !p.available).length)
  const categoryName = (id) => categories.value.find((c) => c.id === id)?.name ?? '-'
  const productById = (id) => products.value.find((p) => p.id === id) ?? null

  function validate({ name, price, categoryId }) {
    if (!String(name).trim()) return 'Nama menu wajib diisi'
    if (!categoryId) return 'Pilih kategori menu'
    if (!(Number(price) > 0)) return 'Harga harus lebih dari nol'
    return null
  }
  function addProduct(payload) {
    const error = validate(payload)
    if (error) return { ok: false, message: error }
    const id = products.value.reduce((m, p) => Math.max(m, p.id), 0) + 1
    products.value.push({ id, categoryId: Number(payload.categoryId), name: payload.name.trim(), price: Number(payload.price), available: true })
    return { ok: true }
  }
  function updateProduct(id, payload) {
    const error = validate(payload)
    if (error) return { ok: false, message: error }
    const p = productById(id)
    if (!p) return { ok: false, message: 'Menu tidak ditemukan' }
    Object.assign(p, { categoryId: Number(payload.categoryId), name: payload.name.trim(), price: Number(payload.price) })
    return { ok: true }
  }
  function toggleAvailable(id) {
    const p = productById(id)
    if (p) p.available = !p.available
  }
  function removeProduct(id) {
    products.value = products.value.filter((p) => p.id !== id)
  }

  return { categories, products, unavailableCount, categoryName, productById, addProduct, updateProduct, toggleAvailable, removeProduct }
})
