<template>
  <div class="flex justify-between items-center w-full max-md:flex-col">
    <div class="w-full flex flex-col gap-2">
      <div class="flex gap-2 max-md:flex-col max-md:gap-0">
        <span class="font-bold">Name: </span>
        <input v-model="editServiceInfo.name" type="text" name="" id="" class="px-2 max-md:py-2" />
      </div>
      <div class="flex gap-2 max-md:flex-col max-md:gap-0">
        <span class="font-bold">Duration: </span>
        <div class="flex gap-2 items-center">
          <input
            v-model="editServiceInfo.duration"
            type="number"
            name=""
            id=""
            min="0"
            step="1"
            class="px-2 max-md:py-2"
          />
          <span>min</span>
        </div>
      </div>
      <div class="flex gap-2 max-md:flex-col max-md:gap-0">
        <span class="font-bold">Price: </span>
        <div class="flex gap-2 items-center">
          <input
            v-model="editServiceInfo.price"
            type="number"
            name=""
            id=""
            min="0"
            step="1"
            class="px-2 max-md:py-2"
          />
          <span>$</span>
        </div>
      </div>
      <div class="flex gap-2 max-md:flex-col max-md:gap-0">
        <span class="font-bold">Shortcut: </span>
        <input v-model="editServiceInfo.shortcut" type="text" name="" id="" class="px-2 max-md:py-2" />
      </div>
    </div>
    <div class="flex gap-4 pr-4 max-lg:flex-col max-md:flex-row max-md:mt-4">
      <button
        v-if="editServiceInfo._id"
        class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
        @click="updateService(editServiceInfo._id)"
      >
        <font-awesome-icon :icon="['fas', 'check']" class="w-8 h-8 text-green-500" />
      </button>
      <button
        @click="setEditServiceIndex('')"
        class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare as farPenToSquare } from '@fortawesome/free-regular-svg-icons'
import client from '../../api/client'
import type { Service } from '@/types/types'

library.add(faCheck, faXmark, farPenToSquare)

const props = defineProps<{
  service: Service;
  setEditServiceIndex: (id: string) => void;
  getServices: () => void;
}>()

const editServiceInfo = reactive<Service>({
  _id: props.service._id,
  name: props.service.name,
  duration: props.service.duration,
  price: props.service.price,
  shortcut: props.service.shortcut
})

const updateService = async (id: string): Promise<void> => {
  if (!id) {
    console.error('Service ID is missing.')
    return
  }
  try {
    const res = await client.patch(`service/${id}`, editServiceInfo)
    props.setEditServiceIndex('')
    props.getServices()
    console.log('Service updated successfully:', res.data)
  } catch (error) {
    console.error('Unexpected error during updating service:', error)
  }
}
</script>

<style></style>
