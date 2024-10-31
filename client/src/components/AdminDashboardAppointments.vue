<template>
  <div class="flex flex-col gap-6 max-md:overflow-y-scroll">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <AdminDashboardNav />
    <div class="bg-bgSecond rounded-xl min-h-[50vh]">
      <div
        class="flex text-3xl font-bold gap-4 px-6 py-4 border-b-2 border-black max-lg:flex-col"
      >
        <div class="flex gap-4">
          <img src="/time1.png" alt="" class="w-12 h-12 max-lg:w-10 max-lg:h-10" />
          <span>Appointments</span>
        </div>
        <div>
          <div class="flex items-center flex-wrap gap-2 ml-6 max-md:ml-0 max-md:items-start max-md:gap-4">
            <div
              class="relative flex gap-[3px] items-center justify-center cursor-pointer"
              v-for="barber in barbers"
              :key="barber._id"
              @click="barber._id ? toggleBarber(barber._id) : null"
            >
              <div class="w-6 h-6 border-2 border-gray-500 bg-white"></div>
              <span class="text-xl font-bold max-lg:text-base">{{ barber.name }}</span>
              <span
                class="absolute -top-1 left-[1px] w-6 h-6 text-green-500"
                v-if="barber._id && selectedBarber.includes(barber?._id)"
              >
                <font-awesome-icon :icon="['fas', 'check']" />
              </span>
            </div>
            <div class="flex items-center gap-2 ml-4 max-md:ml-0">
              <span class="text-xl font-bold max-lg:text-lg">Data:</span>
              <input
                class="text-base bg-bgSecond cursor-pointer"
                type="date"
                v-model="selectedDate"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-2 p-2">
        <div
          :class="[
            'relative flex justify-between items-center px-6 rounded-xl border-[1px] border-gray-500 max-md:px-2',
            appointment.status === 'Cancelled'
              ? 'bg-red-400'
              : appointment.status === 'Completed'
                ? 'bg-green-400'
                : ''
          ]"
          v-for="appointment in filteredAppointments"
          :key="appointment._id"
        >
          <div class="w-full flex justify-between items-center gap-4 py-4 md:pr-4 max-md:flex-col max-md:items-start">
            <div class="flex gap-2 items-center">
              <img
                :src="appointment.barber?.photo"
                alt=""
                class="w-16 h-16 rounded-full object-cover"
              />
              <div class="flex flex-col">
                <span class="font-bold text-xl py-[1px]">{{ appointment.barber?.name }}</span>
                <span
                  >Booking on {{ formatDate(appointment.appointmentDate) }} -
                  <b> {{ appointment.startTime }}-{{ appointment.endTime }} </b>
                </span>
                <span>{{ appointment.user.name }}</span>
                <span>{{ appointment.user.email }}</span>
                <span>{{ appointment.user.phone }}</span>
              </div>
            </div>
            <div class="flex flex-col">
              <span
                ><b>Status:</b> <b>{{ appointment.status }}</b></span
              >
              <div class="flex flex-col">
                Services:
                <span v-for="(service, index) in appointment.services" :key="service._id">
                  {{ service.shortcut
                  }}<span v-if="index < appointment.services.length - 1">,</span>
                </span>
              </div>
            </div>
          </div>
          <div
            class="p-2 bg-bgThird flex items-center rounded-full hover:opacity-60 cursor-pointer"
            v-if="appointment.status !== 'Cancelled' && appointment.status !== 'Completed'"
            @click="openCancelAlert(appointment._id)"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
          </div>
          <div
            v-if="cancelAlert === appointment._id"
            class="w-full h-full absolute top-0 left-0 flex flex-col gap-2 items-center justify-center"
          >
            <div class="w-full h-full bg-gray-300 opacity-95 absolute"></div>
            <span class="text-black font-bold z-10 max-md:text-center"
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
  </div>
</template>

<script setup lang="ts">

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark, faCheck } from '@fortawesome/free-solid-svg-icons'
import { computed, onMounted, ref } from 'vue'
import LoadingAnimation from './LoadingAnimation.vue'
import client from '../../api/client'
import AdminDashboardNav from './AdminDashboardNav.vue'
import type { Appointment, Barber } from '@/types/types'

library.add(faXmark, faCheck)

const isLoading = ref<boolean>(false)
const latestAppointments = ref<Appointment[]>([])
const cancelAlert = ref<string | null>(null)
const barbers = ref<Barber[]>([])
const selectedBarber = ref<string[]>([])
const selectedDate = ref<string>('')

const openCancelAlert = (id: string | null) => {
  cancelAlert.value = id
}

const toggleBarber = (barberId: string) => {
  const index = selectedBarber.value.indexOf(barberId)

  if (index !== -1) {
    selectedBarber.value.splice(index, 1)
  } else {
    selectedBarber.value.push(barberId)
  }
}

const filteredAppointments = computed(() => {
  return latestAppointments.value.filter((appointment) => {
    const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0]

    const matchBarber = selectedBarber.value.length
      ? selectedBarber.value.includes(appointment.barber._id)
      : true

    const matchDate = selectedDate.value ? appointmentDate === selectedDate.value : true

    return matchBarber && matchDate
  })
})

const getBarbers = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get('barber')
    if (res.status === 200) {
      barbers.value = res.data
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting barbers:', error)
  } finally {
    isLoading.value = false
  }
}

const getAppointments = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get('appointment')
    if (res.status === 200) {
      latestAppointments.value = res.data
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

const cancelAppointment = async (appointmentId: string): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.patch(`appointment/cancel/${appointmentId}`)
    if (res.status === 200) {
      await getAppointments()
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

function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date')
  }

  const day = dateObj.getUTCDate()
  const month = dateObj.toLocaleString('en-US', { month: 'long' })
  const year = dateObj.getUTCFullYear()

  const suffix = (day: number): string => {
    if (day > 3 && day < 21) return 'th'
    switch (day % 10) {
      case 1:
        return 'st'
      case 2:
        return 'nd'
      case 3:
        return 'rd'
      default:
        return 'th'
    }
  }

  return `${day}${suffix(day)} ${month}, ${year}`
}

onMounted(async () => {
  getBarbers()
  getAppointments()
})
</script>

<style></style>
