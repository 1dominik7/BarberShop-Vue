<template>
  <div class="w-full flex items-center justify-between gap-2 max-md:flex-col">
  <div class="flex items-center gap-2 max-md:w-full max-md:items-start max-md:flex-col">
    <img :src="barber.photo" alt="" class="w-20 h-20 object-contain rounded-full" />
    <div class="flex flex-col gap-2 max-md:gap-[1px]">
      <div class="flex">
        <span class="font-bold">Name: </span>
        <span class="px-2">{{ barber.name }}</span>
      </div>
      <div class="flex gap-2">
        <span class="font-bold">Phone: </span>
        <div class="flex">
          <span>{{ barber.phone }}</span>
        </div>
      </div>
      <div class="flex max-lg:flex-col max-md:flex-row max-md:flex-wrap" v-if="barber.serviceDetails && barber.serviceDetails.length">
        <span class="font-bold">Services: </span>
        <span class="px-[1px]" v-for="(service, index) in barber.serviceDetails" :key="service._id">
          {{ service.shortcut }}<span v-if="index < barber.serviceDetails.length - 1">, </span>
        </span>
      </div>
    </div>
  </div>
  <div class="flex gap-4 pr-4 max-lg:flex-col max-md:flex-row max-md:pr-0 max-md:pt-4">
    <button
      v-if="barber._id"
      class="flex items-center p-3 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
      @click="setEditBarberIndex(barber._id)"
    >
      <font-awesome-icon :icon="['far', 'pen-to-square']" class="w-6 h-6" />
    </button>
    <button
      v-if="barber._id"
      class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
      @click="windowConfirmingDeletion(barber._id)"
    >
      <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
    </button>
  </div>
  <div
    v-if="openConfirmationDeleteWindow === barber._id"
    class="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-400 rounded-xl"
  >
    <div class="z-20 w-full h-full flex flex-col items-center justify-center max-md:p-2 max-md:text-center">
      <span class="text-xl font-bold max-md:text-lg">Are you sure to delete this barber?</span>
      <div class="flex gap-6 max-md:mt-4">
        <button
          class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
          @click="deleteBarber(barber._id)"
        >
          <font-awesome-icon :icon="['fas', 'check']" class="w-8 h-8 text-green-500" />
        </button>
        <button
          class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
          @click="windowConfirmingDeletion('')"
        >
          <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
interface Barber {
  _id?: string
  name: string
  phone: string
  photo?: string
  services?: string[]
  serviceDetails?: Service[]
  availability?: {
    date: string
    startTime: string
    endTime: string
  }[]
  appointments?: Appointments[]
}

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare as farPenToSquare } from '@fortawesome/free-regular-svg-icons'
import type { Appointments, Service } from '@/types/types';

library.add(faCheck, faXmark, farPenToSquare)

defineProps<{
  barber: Barber
  openConfirmationDeleteWindow: string
  setEditBarberIndex: (id: string) => void
  windowConfirmingDeletion: (id: string) => void
  deleteBarber: (id: string) => Promise<void>
}>()
</script>

<style></style>
