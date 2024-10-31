import { createRouter, createWebHistory } from 'vue-router'

import RegisterView from '@/views/RegisterView.vue'
import LoginView from '@/views/LoginView.vue'
import HomeView from '@/views/HomeView.vue'
import ProfileView from '@/views/ProfileView.vue'
import { useAuthStore } from '@/stores/auth'
import BarberView from '@/views/BarberView.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'
import AdminSchedule from '@/components/AdminSchedule.vue'
import AdminServices from '@/components/AdminServices.vue'
import AdminBarbersList from '@/components/AdminBarbersList.vue'
import AdminDashboardUsers from '@/components/AdminDashboardUsers.vue'
import AdminDashboardAppointments from '@/components/AdminDashboardAppointments.vue'
import AdminAppointments from '@/components/AdminAppointments.vue'
import AdminDashboardStatistics from '@/components/AdminDashboardStatistics.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { hideNavbar: true }
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { hideNavbar: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.user) {
          next()
        } else {
          next({ name: 'login' })
        }
      },
      children: [
        {
          path: 'dashboard',
          name: 'profile-dashboard',
          component: AdminDashboard,
          children: [
            {
              path: 'users',
              name: 'profile-dashboard-users',
              component: AdminDashboardUsers
            },
            {
              path: 'statistics',
              name: 'profile-dashboard-statistics',
              component: AdminDashboardStatistics
            },
            {
              path: 'appointments',
              name: 'profile-dashboard-appointments',
              component: AdminDashboardAppointments
            }
          ]
        },
        {
          path: 'schedule',
          name: 'profile-schedule',
          component: AdminSchedule
        },
        {
          path: 'appointments',
          name: 'profile-appointments',
          component: AdminAppointments
        },
        {
          path: 'services',
          name: 'profile-services',
          component: AdminServices
        },
        {
          path: 'barbers',
          name: 'profile-barbers',
          component: AdminBarbersList
        }
      ]
    },
    {
      path: '/barber/:id',
      name: 'barber',
      component: BarberView,
      beforeEnter: (to, from, next) => {
        const authStore = useAuthStore()
        if (authStore.user) {
          next()
        } else {
          next({ name: 'login', query: { redirect: to.fullPath } })
        }
      }
    }
  ]
})

export default router
