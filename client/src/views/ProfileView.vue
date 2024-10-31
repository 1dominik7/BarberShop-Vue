<template>
  <div class="bg-primary h-full w-full px-52 py-6 max-lg:px-6 max-xl:px-12 max-md:px-2">
    <AdminProfile v-if="isAdmin" />
    <UserProfile v-else />
  </div>
</template>

<script setup lang="ts">
import AdminProfile from '@/components/AdminProfile.vue'
import UserProfile from '@/components/UserProfile.vue'
import { useAuthStore } from '@/stores/auth'
import client from '@/../api/client'
import { ref, watch } from 'vue'

const isAdmin = ref<boolean>(false)
const isLoading = ref<boolean>(true)

const authStore = useAuthStore()
const { user } = authStore

const checkIsAdmin = async (): Promise<void> => {
  if (!user?._id) return
  try {
    const res = await client.get(`user/checkUser/${user._id}`)
    if (res.status === 200) {
      isAdmin.value = res.data.isAdmin
    }
  } catch (error) {
    console.error('Unexpected error during logout:', error)
    isAdmin.value = false
  } finally {
    isLoading.value = false
  }
}

watch(
  () => user,
  (newUser) => {
    if (newUser) {
      isLoading.value = true
      checkIsAdmin()
    } else {
      isAdmin.value = false
    }
  },
  { immediate: true }
)
</script>

<style></style>
