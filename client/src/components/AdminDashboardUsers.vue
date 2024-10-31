<template>
  <div class="flex flex-col gap-6">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <AdminDashboardNav />
    <div class="bg-bgSecond rounded-xl min-h-[50vh]">
      <div class="flex items-center text-3xl font-bold gap-4 px-6 py-4 border-b-2 border-black">
        <img src="/user.png" alt="" class="w-12 h-12 max-lg:w-10 max-lg:h-10" />
        <span>Users</span>
      </div>
      <div class="flex flex-col gap-2 overflow-y-scroll p-2">
        <div
          class="relative flex justify-between items-center px-6 rounded-xl border-[1px] border-gray-500"
          v-for="user in usersNotAdmin"
          :key="user._id"
        >
          <div class="flex items-center gap-4 py-4">
            <img
              :src="user.photo ? user?.photo : '/user.png'"
              alt=""
              class="w-16 h-16 rounded-full object-cover max-md:w-12 max-md:h-12"
            />
            <div class="flex flex-col">
              <span class="font-bold text-xl py-[1px] break-words">{{ user.name }}</span>
              <span class="break-words max-sm:w-44">{{ user.email }}</span>
              <span>{{ user.phone }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import LoadingAnimation from './LoadingAnimation.vue'
import client from '../../api/client'
import AdminDashboardNav from './AdminDashboardNav.vue'
import type { User } from '@/types/types'

const users = ref<User[]>([])
const isLoading = ref<boolean>(false)

const usersNotAdmin = computed(() => {
  return users.value.filter((user) => !user.isAdmin)
})

const getUsers = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get('user')
    if (res.status === 200) {
      users.value = res.data
      console.log(res.data)
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting countUsers:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getUsers()
})
</script>

<style></style>
