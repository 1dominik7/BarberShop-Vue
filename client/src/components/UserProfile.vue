<template>
  <div class="h-full w-full flex flex-col">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <span class="bg-secondary text-3xl font-bold py-8 px-10 max-md:p-4 max-md:text-2xl"
      >Visit history</span
    >
    <div class="flex gap-6 max-md:flex-col-reverse">
      <div class="w-full flex flex-col py-6">
        <div
          class="w-full border-2 border-secondary"
          v-if="user?.appointments && user?.appointments?.length > 0"
        >
          <div v-for="appointment in sortedAppointments" :key="appointment._id">
            <div
              :class="[
                'px-6 py-3 flex justify-between max-md:px-4',
                appointment.status === 'Cancelled'
                  ? 'bg-red-400'
                  : appointment.status === 'Completed'
                    ? 'bg-green-400'
                    : 'bg-secondary'
              ]"
            >
              <span>{{ formatAppointmentDate(appointment.appointmentDate) }}</span>
              <span
                >Status: {{ appointment.status }}, Visit:
                {{ getTimeUntilOrSince(appointment.appointmentDate, appointment.startTime) }}</span
              >
            </div>
            <div class="relative flex justify-between p-4 text-white max-md:flex-col">
              <div class="flex flex-col">
                <div>
                  <span class="font-bold">Time: </span>
                  <span> {{ appointment.startTime }} - {{ appointment.endTime }}</span>
                </div>
                <div class="flex gap-2 flex-grow max-md:flex-col max-md:gap-0">
                  <span class="font-bold max-md:h-max"> Services:</span>
                  <span v-for="(service, index) in appointment.services" :key="index"
                    >{{ service.name
                    }}<span v-if="index < appointment.services.length - 1">, </span></span
                  >
                </div>
              </div>
              <div
                class="flex w-40 flex-col items-center justify-center max-md:w-full max-md:items-start"
              >
                <div class="flex gap-2">
                  <span class="font-bold">Barber:</span>
                  <span>{{ appointment.barber.name }}</span>
                </div>
                <div class="flex gap-2">
                  <span class="font-bold">Price:</span>
                  <span>$ {{ totalPrice(appointment.services) }}</span>
                </div>
              </div>
              <div
                class="flex justify-self-end items-center"
                v-if="appointment.status !== 'Cancelled' && appointment.status !== 'Completed'"
              >
                <button
                  class="h-10 w-24 font-bold bg-red-500 rounded-full hover:opacity-60 max-md:mt-2"
                  @click="openCancelAlert(appointment._id)"
                >
                  Cancel
                </button>
              </div>
              <div
                v-if="cancelAlert === appointment._id"
                class="w-full h-full absolute top-0 left-0 flex flex-col gap-2 items-center justify-center"
              >
                <div class="w-full h-full bg-gray-300 opacity-95 absolute"></div>
                <span class="text-black font-bold z-10"
                  >Are you sure you want to cancel this appointment?</span
                >
                <div class="text-black z-10 flex items-center justify-center gap-4">
                  <button
                    class="bg-gray-500 py-2 px-6 rounded-full text-white font-bold hover:opacity-60"
                    @click="cancelAppointment(appointment._id)"
                  >
                    Yes
                  </button>
                  <button
                    class="bg-gray-400 py-2 px-6 rounded-full font-bold hover:opacity-60"
                    @click="openCancelAlert(null)"
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-white font-bold text-3xl" v-else>There is no reservation</div>
      </div>
      <div class="w-[30%] flex flex-col gap-4 mt-6 text-white px-2 max-md:w-full">
        <div class="flex flex-col">
          <span class="text-3xl font-bold">Menu</span>
          <div class="flex flex-col gap-2 mt-2">
            <button
              class="bg-secondary text-black py-2 px-4 rounded-xl cursor-pointer hover:opacity-60"
              @click="logoutHandler()"
            >
              Logout
            </button>
          </div>
        </div>
        <div class="flex flex-col mt-6 max-md:mt-0">
          <span class="text-3xl font-bold">Profile</span>
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
                :disabled="busy"
                @click="updateUserInfo()"
              >
                Update date
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
type UserWithAppointments = User & {
  appointments?: Appointment[]
}

import { useRouter } from 'vue-router'
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import client from '@/../api/client'
import { format } from 'date-fns'
import LoadingAnimation from './LoadingAnimation.vue'
import type { Appointment, Service, User } from '@/types/types'

const authStore = useAuthStore()
const user = computed<UserWithAppointments | null>(() => authStore.user)

const router = useRouter()

const name = ref<string>(user.value?.name || '')
const phone = ref<string>(user.value?.phone || '')
const busy = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const cancelAlert = ref<string | null>(null)

const openCancelAlert = (id: string | null) => {
  cancelAlert.value = id
}

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
  busy.value = true
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
    busy.value = false
  }
}

const cancelAppointment = async (appointmentId: string): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.patch(`appointment/cancel/${appointmentId}`)
    if (res.status === 200) {
      await updateUserInfo()
      openCancelAlert(null)
    } else {
      console.error('Failed to update user:', res.status, res)
    }
  } catch (error) {
    console.error('Error updating user:', error)
  } finally {
    isLoading.value = false
  }
}

const totalPrice = (services: Service[]) => {
  return services.reduce((total, service) => total + service.price, 0)
}

const formatAppointmentDate = (date: Date): string => {
  return format(date, 'EEEE, dd MMMM yyyy')
}

const getTimeUntilOrSince = (appointmentDate: Date, startTime: string): string => {
  const now = new Date()
  const appointmentTime = new Date(appointmentDate)

  const [hours, minutes] = startTime.split(':').map(Number)
  appointmentTime.setHours(hours, minutes, 0, 0)

  const diffTime = appointmentTime.getTime() - now.getTime()
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (diffDays > 0) {
    return `In ${diffDays} day${diffDays > 1 ? 's' : ''}`
  } else if (diffDays === 0 && diffHours > 0) {
    return `In ${diffHours} hour${diffHours > 1 ? 's' : ''}`
  } else if (diffDays === 0 && diffHours <= 0) {
    const absoluteDiffHours = Math.abs(diffHours)
    return `${absoluteDiffHours} hour${absoluteDiffHours > 1 ? 's' : ''} ago`
  } else {
    const absoluteDiffDays = Math.abs(diffDays)
    return `${absoluteDiffDays} day${absoluteDiffDays > 1 ? 's' : ''} ago`
  }
}

const sortedAppointments = computed(() => {
  return user?.value?.appointments?.slice().sort((a, b) => {
    const appointmentA = a as unknown as Appointment
    const appointmentB = b as unknown as Appointment

    return (
      new Date(appointmentB.appointmentDate).getTime() -
      new Date(appointmentA.appointmentDate).getTime()
    )
  })
})
</script>

<style scoped></style>
