<template>
  <div class="h-[100vh] w-full bg-primary items-center flex flex-col gap-36 overflow-y-scroll py-2 max-md:gap-6">
    <div class="flex flex-col gap-2 items-center justify-center py-4">
      <img class="w-36 h-36 pb-2 max-md:h-28 max-md:w-28" src="/logo1.png" alt="" />
      <RouterLink
        class="font-bold text-white border-2 border-secondary py-1 px-8 cursor-pointer hover:bg-secondary"
        to="/"
        >HOME</RouterLink
      >
    </div>
    <div class="flex flex-col items-center gap-4 px-20 py-12 bg-secondary rounded-xl max-md:px-6 max-md:py-6 max-md:mt-6">
      <span class="text-2xl font-bold">Login</span>
      <span class="font-semibold">Please sign in to book appointment</span>
      <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-2 max-md:w-[95%]">
        <div class="w-[100%] flex flex-col gap-1">
          <span class="max-md:text-sm">Email</span>
          <input
            type="text"
            v-model="userInfo.email"
            placeholder="Email"
            class="p-2 border-[1px] text-gray-200 border-black rounded-lg bg-gray-400 placeholder:text-gray-200 max-md:placeholder:text-sm"
          />
        </div>
        <div class="w-[100%] flex flex-col gap-1">
          <span class="max-md:text-sm">Password</span>
          <input
            type="password"
            v-model="userInfo.password"
            placeholder="Password"
            class="p-2 border-[1px] text-gray-200 border-black rounded-lg bg-gray-400 placeholder:text-gray-200 max-md:placeholder:text-sm"
          />
        </div>
        <div v-if="validationErrors.length > 0 || errorMessage.length > 0" class="w-full">
          <p v-for="(error, index) in validationErrors" :key="index" class="text-red-500 max-md:text-sm">
            • {{ error }}
          </p>
          <p v-if="errorMessage" class="text-red-500 w-72">• {{ errorMessage }}</p>
        </div>
        <button
          class="w-full py-2 mt-4 bg-primary text-white font-bold rounded-lg hover:bg-gray-800"
          :disabled="busy"
        >
          Login
        </button>
        <div class="flex gap-2 max-md:gap-[2px]">
          <span class="max-md:text-sm">Don't have account yet?</span>
          <RouterLink to="/register" class="font-bold underline hover:text-gray-500 max-md:text-sm"
            >Register here</RouterLink
          >
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { signInSchema, yupValidate, type SignInUser } from '../utils/validator'
import client from '@/../api/client'
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const errorMessage = ref<string>('')
const validationErrors = ref<string[]>([])
const busy = ref<boolean>(false)

const userInfo = reactive<SignInUser>({
  email: '',
  password: ''
})

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault()

  if (!userInfo.email || !userInfo.password) {
    errorMessage.value = 'Email and password are required.';
    return;
  }
  
  busy.value = true
  validationErrors.value = []

  try {
    await yupValidate(signInSchema, userInfo)
    authStore.loginStart()
    const res = await client.post('user/login', userInfo)

    if (res.status === 200) {
      authStore.loginSuccess(res.data)
      const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/profile/dashboard'
      router.push(redirect)
    } else {
      authStore.loginFailure('Login failed. Please try again.')
    }
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      validationErrors.value = error.errors.map((err: any) => err.message)
    } else if (error.response && error.response.status === 400) {
      errorMessage.value = error.response.data.message || 'Invalid email or password.'
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again later.'
    }
  } finally {
    busy.value = false
  }
}
</script>
