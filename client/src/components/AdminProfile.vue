<template>
  <div class="h-max w-full flex flex-col">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <span class="bg-secondary text-3xl font-bold py-8 px-10 max-md:p-4 max-md:text-2xl">{{ displayText }}</span>
    <div class="flex gap-6 h-full overflow-hidden overflow-y-auto max-md:flex-col-reverse max-md:overflow-scroll">
      <div class="w-full h-full overflow-y-auto flex flex-col gap-4 py-6 px-2">
        <component :is="getComponent" />
      </div>
      <div class="w-[30%] flex flex-col gap-4 mt-6 text-white px-2 max-md:w-full">
        <div class="flex flex-col">
          <span class="text-3xl font-bold">Menu</span>
          <div class="flex flex-col gap-2 mt-2">
            <router-link
              :class="[
                'py-2 px-4 rounded-xl border-2 border-secondary text-center cursor-pointer hover:opacity-60',
                selected === 'profile-dashboard' ||
                selected === 'profile-dashboard-users' ||
                selected === 'profile-dashboard-statistics' ||
                selected === 'profile-dashboard-appointments'
                  ? 'text-white border-secondary border-2 bg-primary'
                  : 'bg-secondary text-black'
              ]"
              :to="{ name: 'profile-dashboard' }"
            >
              Dashboard
            </router-link>
            <router-link
              :class="[
                'py-2 px-4 rounded-xl border-2 border-secondary text-center cursor-pointer hover:opacity-60',
                selected === 'profile-schedule'
                  ? 'text-white border-secondary border-2 bg-primary'
                  : 'bg-secondary text-black'
              ]"
              :to="{ name: 'profile-schedule' }"
            >
              Schedule
            </router-link>
            <router-link
              :class="[
                'py-2 px-4 rounded-xl border-2 border-secondary text-center cursor-pointer hover:opacity-60',
                selected === 'profile-appointments'
                  ? 'text-white border-secondary border-2 bg-primary'
                  : 'bg-secondary text-black'
              ]"
              :to="{ name: 'profile-appointments' }"
            >
              Appointments
            </router-link>
            <router-link
              :class="[
                'py-2 px-4 rounded-xl border-2 border-secondary text-center cursor-pointer hover:opacity-60',
                selected === 'profile-services'
                  ? 'text-white border-secondary border-2 bg-primary'
                  : 'bg-secondary text-black'
              ]"
              :to="{ name: 'profile-services' }"
            >
              Services
            </router-link>
            <router-link
              :class="[
                'py-2 px-4 rounded-xl border-2 border-secondary text-center cursor-pointer hover:opacity-60',
                selected === 'profile-barbers'
                  ? 'text-white border-secondary border-2 bg-primary'
                  : 'bg-secondary text-black'
              ]"
              :to="{ name: 'profile-barbers' }"
            >
              Barbers List
            </router-link>
            <button
              class="bg-secondary text-black py-2 px-4 rounded-xl cursor-pointer hover:opacity-60"
              @click="logoutHandler()"
            >
              Logout
            </button>
          </div>
        </div>
        <div class="flex flex-col mt-6">
          <span class="text-3xl font-bold">Admin Profile</span>
          <div class="flex flex-col" v-if="user">
            <span>{{ user.email }}</span>
            <span>{{ user.name }}</span>
            <span>{{ formattedPhone }}</span>
          </div>
          <div class="mt-4">
            <form class="flex flex-col gap-2">
              <div class="flex flex-col">
                <span class="text-lg">Name</span>
                <input type="text" class="p-2 text-black rounded-lg" v-model="name" />
              </div>
              <div class="flex flex-col">
                <span class="text-lg">Phone</span>
                <input type="text" class="p-2 text-black rounded-lg" v-model="phone" />
              </div>
              <button
                class="bg-secondary text-black py-2 px-4 rounded-xl cursor-pointer mt-2 hover:opacity-60"
                :disabled="isLoading"
                @click="updateUserInfo()"
              >
                Update data
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import client from '@/../api/client'
import AdminDashboard from './AdminDashboard.vue'
import AdminSchedule from './AdminSchedule.vue'
import AdminServices from './AdminServices.vue'
import AdminBarbersList from './AdminBarbersList.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import AdminDashboardUsers from './AdminDashboardUsers.vue'
import AdminDashboardAppointments from './AdminDashboardAppointments.vue'
import AdminAppointments from './AdminAppointments.vue'
import AdminDashboardStatistics from './AdminDashboardStatistics.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user)

const router = useRouter()
const route = useRoute()

const selected = ref<string>((route.name as string) || 'Dashboard')
const name = ref<string>(user.value?.name || '')
const phone = ref<string>(user.value?.phone || '')
const isLoading = ref<boolean>(false)

const routeDisplayMap = {
  'profile-dashboard': 'Dashboard',
  'profile-schedule': 'Schedule',
  'profile-services': 'Services',
  'profile-barbers': 'Barbers List'
}

const displayText = computed(
  () => routeDisplayMap[selected.value as keyof typeof routeDisplayMap] || 'Dashboard'
)

const getComponent = computed(() => {
  switch (selected.value) {
    case 'profile-dashboard':
      return AdminDashboard
    case 'profile-schedule':
      return AdminSchedule
    case 'profile-appointments':
      return AdminAppointments
    case 'profile-services':
      return AdminServices
    case 'profile-barbers':
      return AdminBarbersList
    case 'profile-dashboard-users':
      return AdminDashboardUsers
    case 'profile-dashboard-statistics':
      return AdminDashboardStatistics
    case 'profile-dashboard-appointments':
      return AdminDashboardAppointments
    default:
      return AdminDashboard
  }
})

const formattedPhone = computed(() => {
  const phone = user.value?.phone || ''

  return phone.replace(/(\d{3})(?=\d)/g, '$1 ')
})

const logoutHandler = async (): Promise<void> => {
  try {
    await client.post('user/logout', null)
    authStore.logout()
    router.push('/')
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Error during logout:', err.message)
    } else {
      console.error('Unexpected error during logout:', err)
    }
  }
}

const updateUserInfo = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.patch(`user/${user.value?._id}`, {
      name: name.value,
      phone: phone.value
    })
    if (res.status === 201) {
      authStore.setUser(res.data.user)
      console.log('User updated successfully:', res.data)
    } else {
      console.error('Failed to update user:', res.status, res)
    }
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    isLoading.value = false
  }
}

watch(
  () => router.currentRoute.value.name,
  (routeName) => {
    switch (routeName) {
      case 'profile-dashboard':
        selected.value = 'Dashboard'
        break
      case 'profile-schedule':
        selected.value = 'Schedule'
        break
      case 'profile-appointments':
        selected.value = 'Appointments'
        break
      case 'profile-services':
        selected.value = 'Services'
        break
      case 'profile-barbers':
        selected.value = 'Barbers List'
        break
      default:
        selected.value = 'Dashboard'
    }
  }
)

watch(
  () => route.name,
  (newName) => {
    if (typeof newName === 'string') {
      selected.value = newName
    }
  }
)
</script>

<style scoped></style>
