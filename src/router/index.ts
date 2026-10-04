import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import MainLayout from '../components/MainLayout.vue'
import AdminDashboard from '../views/admin/DashboardView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    // Rute yang dibungkus oleh MainLayout untuk Admin
    {
      path: '/admin',
      component: MainLayout,
      meta: { requiresAuth: true, role: 'admin' },
      children: [
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          component: AdminDashboard
        },
        {
          path: 'departments',
          name: 'admin-departments',
          component: () => import('../views/admin/DepartmentView.vue')
        },
        {
          path: 'folders',
          name: 'folders',
          component: () => import('../views/admin/FolderView.vue')
        },
                {
          path: 'files',
          name: 'files',
          component: () => import('../views/admin/FileView.vue')
        },

      ]
    },
    // Rute untuk Viewer
    {
      path: '/viewer',
      component: MainLayout,
      meta: { requiresAuth: true, role: 'viewer' },
      children: [
        {
          path: 'dashboard',
          name: 'viewer-dashboard',
          component: AdminDashboard // atau ViewerDashboard khusus
        }
      ]
    }
  ]
})

export default router