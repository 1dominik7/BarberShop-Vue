<template>
  <div class="flex flex-col gap-6">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <div class="flex justify-between max-lg:hidden max-md:flex-col max-md:justify-center">
      <div
        :class="[
          'flex items-center bg-bgSecond w-[32%] py-4 px-6 gap-2 rounded-xl cursor-pointer hover:opacity-60',
          selected === 'profile-dashboard-statistics' ? 'opacity-60' : ''
        ]"
        @click="navigateTo('profile-dashboard-statistics')"
      >
        <div class="p-2 bg-bgThird rounded-xl">
          <img src="/statistics.png" alt="" class="w-12 h-12" />
        </div>
        <div class="flex flex-col">
          <span class="text-3xl font-bold">3</span>
          <span class="text-lg">Statistics</span>
        </div>
      </div>
      <div
        :class="[
          'flex items-center bg-bgSecond w-[32%] py-4 px-2 gap-2 rounded-xl cursor-pointer hover:opacity-60',
          isActive('profile-dashboard-appointments') ? 'opacity-60' : ''
        ]"
        @click="navigateTo('profile-dashboard-appointments')"
      >
        <div class="p-2 bg-bgThird rounded-xl">
          <img src="/time.png" alt="" class="w-12 h-12" />
        </div>
        <div class="flex flex-col cursor-pointer">
          <span class="text-3xl font-bold">{{ countAppointments }}</span>
          <span class="text-lg">Appointments</span>
        </div>
      </div>
      <div
        :class="[
          'flex items-center bg-bgSecond w-[32%] py-4 px-6 gap-2 rounded-xl cursor-pointer hover:opacity-60',
          selected === 'profile-dashboard-users' ? 'opacity-60' : ''
        ]"
        @click="navigateTo('profile-dashboard-users')"
      >
        <div class="p-2 bg-bgThird rounded-xl">
          <img src="/user.png" alt="" class="w-12 h-12" />
        </div>
        <div class="flex flex-col cursor-pointer">
          <span class="text-3xl font-bold">{{ countUsers }}</span>
          <span class="text-lg">Users</span>
        </div>
      </div>
    </div>
    <div class="hidden justify-between max-lg:flex max-md:flex-col max-md:gap-2">
      <div
        :class="[
          'flex flex-col items-center bg-bgSecond w-[32%] py-4 px-6 gap-2 rounded-xl cursor-pointer hover:opacity-60 max-md:w-full max-md:py-2',
          selected === 'profile-dashboard-statistics' ? 'opacity-60' : ''
        ]"
        @click="navigateTo('profile-dashboard-statistics')"
      >
        <div class="flex gap-4 items-center p-2 bg-bgThird rounded-xl w-max">
          <img src="/statistics.png" alt="" class="w-12 h-12" />
          <span class="text-3xl font-bold">3</span>
        </div>
        <div class="flex flex-col">
          <span class="text-lg max-md:text-sm">Statistics</span>
        </div>
      </div>
      <div
        :class="[
          'flex flex-col items-center bg-bgSecond w-[32%] py-4 px-2 gap-2 rounded-xl cursor-pointer hover:opacity-60 max-md:w-full max-md:py-2',
          isActive('profile-dashboard-appointments') ? 'opacity-60' : ''
        ]"
        @click="navigateTo('profile-dashboard-appointments')"
      >
        <div class="flex gap-4 items-center p-2 bg-bgThird rounded-xl w-max">
          <img src="/time.png" alt="" class="w-12 h-12" />
          <span class="text-3xl font-bold">{{ countAppointments }}</span>
        </div>
        <div class="flex flex-col cursor-pointer">
          <span class="text-lg max-md:text-sm">Appointments</span>
        </div>
      </div>
      <div
        :class="[
          'flex flex-col items-center bg-bgSecond w-[32%] py-4 px-6 gap-2 rounded-xl cursor-pointer hover:opacity-60 max-md:w-full max-md:py-2',
          selected === 'profile-dashboard-users' ? 'opacity-60' : ''
        ]"
        @click="navigateTo('profile-dashboard-users')"
      >
        <div class="flex gap-4 items-center p-2 bg-bgThird rounded-xl w-max">
          <img src="/user.png" alt="" class="w-12 h-12" />
          <span class="text-3xl font-bold">{{ countUsers }}</span>
        </div>
        <div class="flex flex-col cursor-pointer">
          <span class="text-lg max-md:text-sm">Users</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { onMounted, ref } from 'vue'
import LoadingAnimation from './LoadingAnimation.vue'
import client from '../../api/client'
import { useRoute, useRouter } from 'vue-router'

library.add(faXmark)

const router = useRouter()
const route = useRoute()

const isLoading = ref<boolean>(false)
const countBarbers = ref<Number>(0)
const countAppointments = ref<Number>(0)
const countUsers = ref<Number>(0)
const selected = ref<string>(route.name as string)

const navigateTo = (route: string) => {
  router.push({ name: route })
}

const isActive = (routeName: string) => {
  return (
    route.name === routeName ||
    (route.name === 'profile-dashboard' && routeName === 'profile-dashboard-appointments')
  )
}

const getCountBarbers = async (): Promise<void> => {
  try {
    const res = await client.get('barber/count/countBarbers')
    if (res.status === 200) {
      countBarbers.value = res.data.count
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting countBarbers:', error)
  }
}

const getCountAppointments = async (): Promise<void> => {
  try {
    const res = await client.get('appointment/count/countAppointments')
    if (res.status === 200) {
      countAppointments.value = res.data.count
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting countAppointments:', error)
  }
}

const getCountUsers = async (): Promise<void> => {
  try {
    const res = await client.get('user/count/countUsers')
    if (res.status === 200) {
      countUsers.value = res.data.count
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting countUsers:', error)
  }
}

onMounted(async () => {
  isLoading.value = true
  try {
    await Promise.all([getCountUsers(), getCountBarbers(), getCountAppointments()])
  } catch (error) {
    console.log('Error during API calls', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style></style>
