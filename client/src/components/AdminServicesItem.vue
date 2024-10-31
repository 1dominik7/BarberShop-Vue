<template>
  <div class="w-full flex items-center justify-between max-md:flex-col">
  <div class="flex flex-col gap-2 max-lg:gap-[1px]">
    <div class="flex">
      <span class="font-bold">Name: </span>
      <span class="px-2">{{ service.name }}</span>
    </div>
    <div class="flex gap-2">
      <span class="font-bold">Duration: </span>
      <div class="flex">
        <span>{{ service.duration }} min</span>
      </div>
    </div>
    <div class="flex gap-2">
      <span class="font-bold">Price: </span>
      <div class="flex">
        <span>{{ service.price }} $</span>
      </div>
    </div>
    <div class="flex">
      <span class="font-bold">Shortcut: </span>
      <span class="px-2">{{ service.shortcut }}</span>
    </div>
  </div>
  <div class="flex gap-4 pr-4 max-lg:flex-col max-md:flex-row max-md:mt-2 max-md:pr-0">
    <button
      v-if="service._id"
      class="flex items-center p-3 bg-bgThird rounded-full cursor-pointer hover:opacity-60 h-12"
      @click="setEditServiceIndex(service._id)"
    >
      <font-awesome-icon :icon="['far', 'pen-to-square']" class="w-6 h-6" />
    </button>
    <button
      v-if="service._id"
      class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60 h-12"
      @click="windowConfirmingDeletion(service._id)"
    >
      <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
    </button>
  </div>
  <div
    v-if="openConfirmationDeleteWindow === service._id"
    class="absolute w-full h-full top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gray-400"
  >
    <div class="z-20 w-full h-full flex flex-col items-center justify-center">
      <span class="text-xl font-bold max-md:text-center max-md:text-lg">Are you sure to delete this service?</span>
      <div class="flex gap-6 max-md:mt-2">
        <button
          class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
          @click="deleteService(service._id)"
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
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare as farPenToSquare } from '@fortawesome/free-regular-svg-icons'
import type { Service } from '@/types/types';

library.add(faCheck, faXmark, farPenToSquare)

defineProps<{
  service: Service
  openConfirmationDeleteWindow: string
  setEditServiceIndex: (id: string) => void
  windowConfirmingDeletion: (id: string) => void
  deleteService: (id: string) => Promise<void>
}>()
</script>

<style></style>
