import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import seed from '../data/seed/ingredients.json'
import { loadOrSeed, save } from '../utils/storage'

const KEY = 'stock'

export const useStockStore = defineStore('stock', () => {
  const data = loadOrSeed(KEY, seed)
  const ingredients = ref(data.ingredients)
  const movements = ref(data.movements)

  watch([ingredients, movements], () => save(KEY, { ingredients: ingredients.value, movements: movements.value }), { deep: true })

  function level(item) {
    if (item.stock <= 0) return { label: 'Habis', tone: 'bad' }
    if (item.stock < item.minStock) return { label: 'Menipis', tone: 'warn' }
    return { label: 'Aman', tone: 'ok' }
  }
  const lowStock = computed(() => ingredients.value.filter((i) => i.stock < i.minStock))
  const ingredientName = (id) => ingredients.value.find((i) => i.id === id)?.name ?? '-'
  const latestMovements = computed(() => [...movements.value].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8))

  function addMovement({ ingredientId, type, qty, note, userId }) {
    const item = ingredients.value.find((i) => i.id === Number(ingredientId))
    const amount = Number(qty)
    if (!item) return { ok: false, message: 'Pilih bahan terlebih dahulu' }
    if (!(amount > 0)) return { ok: false, message: 'Jumlah harus lebih dari nol' }
    if (type === 'keluar' && amount > item.stock) return { ok: false, message: 'Stok tidak cukup untuk dikeluarkan' }
    item.stock += type === 'masuk' ? amount : -amount
    const id = movements.value.reduce((m, x) => Math.max(m, x.id), 0) + 1
    movements.value.push({ id, ingredientId: item.id, type, qty: amount, note: note.trim(), date: new Date().toISOString(), userId })
    return { ok: true }
  }
  function addIngredient({ name, unit, stock, minStock }) {
    if (!name.trim() || !unit.trim()) return { ok: false, message: 'Nama bahan dan satuan wajib diisi' }
    if (Number(stock) < 0 || Number(minStock) < 0) return { ok: false, message: 'Stok tidak boleh negatif' }
    const id = ingredients.value.reduce((m, i) => Math.max(m, i.id), 0) + 1
    ingredients.value.push({ id, name: name.trim(), unit: unit.trim(), stock: Number(stock) || 0, minStock: Number(minStock) || 0 })
    return { ok: true }
  }

  return { ingredients, movements, lowStock, latestMovements, level, ingredientName, addMovement, addIngredient }
})
