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
      <span class="text-2xl font-bold">Create Account</span>
      <span class="font-semibold">Please sign up to book appointment</span>
      <form @submit.prevent="handleSubmit" class="w-full flex flex-col gap-2 max-md:w-[95%]">
        <div class="w-[100%] flex flex-col gap-1">
          <span class="max-md:text-sm">Name</span>
          <input
            type="text"
            v-model="userInfo.name"
            placeholder="Name"
            class="p-2 border-[1px] text-gray-200 border-black rounded-lg bg-gray-400 placeholder:text-gray-200 max-md:placeholder:text-sm"
          />
        </div>
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
        <div v-if="validationErrors.length > 0 || errorMessage.length > 0">
          <p v-for="(error, index) in validationErrors" :key="index" class="text-red-500 max-md:text-sm">
            • {{ error }}
          </p>
          <p v-if="errorMessage" class="text-red-500">• {{ errorMessage }}</p>
        </div>
        <button
          type="submit"
          :disabled="busy"
          class="w-full py-2 mt-4 bg-primary text-white font-bold rounded-lg hover:bg-gray-800"
        >
          Create account
        </button>
      </form>
      <div class="flex gap-2 max-md:gap-[2px]">
        <span class="max-md:text-sm">Already have an account?</span>
        <RouterLink to="/login" class="font-bold underline hover:text-gray-500 max-md:text-sm"
          >Login here</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { newUserSchema, yupValidate, type NewUser } from '@/utils/validator'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import client from '@/../api/client'

const errorMessage = ref<string>('')
const validationErrors = ref<string[]>([])
const busy = ref<boolean>(false)

const userInfo = reactive<NewUser>({
  name: '',
  email: '',
  password: ''
})

const router = useRouter()

const handleSubmit = async (e: Event): Promise<void> => {
  e.preventDefault()
  busy.value = true
  validationErrors.value = []

  try {
    await yupValidate(newUserSchema, userInfo)

    await client.post('user/register', userInfo)
    userInfo.name = ''
    userInfo.email = ''
    userInfo.password = ''

    router.push('/login')
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      validationErrors.value = error.errors.map((err: any) => err.message)
    } else if (error.response && error.response.status === 400) {
      errorMessage.value = error.response.data.message || 'User with this email already exists.'
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  } finally {
    busy.value = false
  }
}
</script>
