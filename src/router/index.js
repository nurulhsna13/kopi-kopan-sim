import { createRouter, createWebHashHistory, createMemoryHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ALL_ROLES } from '../utils/constants'

const routes = [
  { path: '/login', name: 'login', component: () => import('../views/LoginView.vue'), meta: { public: true, title: 'Masuk' } },
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: () => import('../views/DashboardView.vue'), meta: { title: 'Beranda', nav: true, order: 1, roles: ALL_ROLES } },
  { path: '/pesanan', name: 'pesanan', component: () => import('../views/OrderView.vue'), meta: { title: 'Pesanan Meja', nav: true, order: 2, roles: ['pelayan'] } },
  { path: '/dapur', name: 'dapur', component: () => import('../views/KitchenView.vue'), meta: { title: 'Antrian Dapur', nav: true, order: 3, roles: ['dapur'] } },
  { path: '/kasir', name: 'kasir', component: () => import('../views/CashierView.vue'), meta: { title: 'Kasir', nav: true, order: 4, roles: ['kasir'] } },
  { path: '/menu', name: 'menu', component: () => import('../views/MenuView.vue'), meta: { title: 'Daftar Menu', nav: true, order: 5, roles: ['owner', 'pelayan'] } },
  { path: '/stok', name: 'stok', component: () => import('../views/StockView.vue'), meta: { title: 'Stok Bahan', nav: true, order: 6, roles: ['owner', 'dapur'] } },
  { path: '/karyawan', name: 'karyawan', component: () => import('../views/StaffView.vue'), meta: { title: 'Karyawan dan Shift', nav: true, order: 7, roles: ['owner'] } },
  { path: '/laporan', name: 'laporan', component: () => import('../views/ReportView.vue'), meta: { title: 'Laporan', nav: true, order: 8, roles: ['owner'] } },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
]

// Build khusus halaman online memakai memory history; selain itu pakai hash (#/) supaya file HTML bisa dibuka langsung
const history = import.meta.env.VITE_MEMORY_ROUTER ? createMemoryHistory() : createWebHashHistory()
const router = createRouter({ history, routes })

// Penjaga akses: harus login, dan role harus termasuk daftar meta.roles
router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.public) return auth.isLoggedIn && to.name === 'login' ? { name: 'dashboard' } : true
  if (!auth.isLoggedIn) return { name: 'login', query: { redirect: to.fullPath } }
  if (to.meta.roles && !to.meta.roles.includes(auth.role)) return { name: 'dashboard', query: { denied: to.path } }
  return true
})

export default router
