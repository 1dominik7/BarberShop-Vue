<template>
  <div class="relative min-h-[50vh] flex flex-col gap-4 bg-bgSecond p-6 rounded-xl overflow-y-auto">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <div
      class="border-2 border-bgThird p-2 rounded-xl"
      v-for="service in services"
      :key="service?._id"
    >
      <div
        class="relative flex justify-between items-center"
        v-if="editService !== service._id && service._id"
      >
        <AdminServicesItem
          :service="service"
          :setEditServiceIndex="setEditServiceIndex"
          :windowConfirmingDeletion="windowConfirmingDeletion"
          :openConfirmationDeleteWindow="openConfirmationDeleteWindow"
          :deleteService="deleteService"
        />
      </div>
      <div class="flex justify-between items-center" v-else>
        <AdminUpdateService
          :service="service"
          :setEditServiceIndex="setEditServiceIndex"
          :getServices="getServices"
        />
      </div>
    </div>
    <div class="border-2 border-bgThird p-2 rounded-xl">
      <div v-if="!newServiceActive" class="py-2 flex items-center justify-center">
        <button
          class="bg-secondary border-2 font-bold rounded-full px-6 py-2 border-primary hover:opacity-60"
          @click="openNewService"
        >
          Add New Service
        </button>
      </div>
      <form v-else class="flex justify-between items-center max-md:flex-col" @submit.prevent="addService">
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 max-md:flex-col max-md:gap-0">
            <span class="font-bold">Name: </span>
            <input v-model="service.name" type="text" name="" id="" class="px-2 max-md:py-2" />
          </div>
          <span v-if="errorMessages.name" class="text-red-500">{{ errorMessages.name }}</span>
          <div class="flex gap-2 max-md:flex-col max-md:gap-0">
            <span class="font-bold">Duration: </span>
            <div class="flex gap-2 items-center">
              <input
                v-model="service.duration"
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
          <span v-if="errorMessages.duration" class="text-red-500">{{
            errorMessages.duration
          }}</span>
          <div class="flex gap-2 max-md:flex-col max-md:gap-0">
            <span class="font-bold">Price: </span>
            <div class="flex gap-2 items-center">
              <input
                v-model="service.price"
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
          <span v-if="errorMessages.price">{{ errorMessages.price }}</span>
          <div class="flex gap- max-md:flex-col max-md:gap-0">
            <span class="font-bold">Shortcut: </span>
            <input v-model="service.shortcut" type="text" name="" id="" class="px-2 max-md:py-2" />
          </div>
          <span v-if="errorMessages.shortcut">{{ errorMessages.shortcut }}</span>
        </div>
        <div class="flex gap-4 pr-4 max-lg:flex-col max-md:flex-row max-md:mt-4">
          <button
            class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
            type="submit"
          >
            <font-awesome-icon :icon="['fas', 'check']" class="w-8 h-8 text-green-500" />
          </button>
          <button
            class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
            @click="openNewService"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface ServiceErrorMessage {
  name: string
  duration: string
  price: string
  shortcut: string
}

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare as farPenToSquare } from '@fortawesome/free-regular-svg-icons'
import { onMounted, reactive, ref } from 'vue'
import client from '../../api/client'
import AdminUpdateService from './AdminUpdateService.vue'
import { serviceValidator, yupValidate } from '@/utils/validator'
import { ValidationError } from 'yup'
import AdminServicesItem from './AdminServicesItem.vue'
import LoadingAnimation from './LoadingAnimation.vue'
import type { Service } from '@/types/types'

library.add(faCheck, faXmark, farPenToSquare)

const service = reactive<Service>({
  name: '',
  duration: 0,
  price: 0,
  shortcut: ''
})

const errorMessages = reactive<ServiceErrorMessage>({
  name: '',
  duration: '',
  price: '',
  shortcut: ''
})

const services = ref<Service[]>([])
const editService = ref<string>('')
const newServiceActive = ref<boolean>(false)
const openConfirmationDeleteWindow = ref<string>('')
const isLoading = ref<boolean>(false)

const windowConfirmingDeletion = (id: string) => {
  openConfirmationDeleteWindow.value = id
}

const openNewService = () => {
  newServiceActive.value = !newServiceActive.value
}

const setEditServiceIndex = (id: string) => {
  editService.value = id
}

const addService = async (): Promise<void> => {
  errorMessages.name = ''
  errorMessages.duration = ''
  errorMessages.price = ''

  isLoading.value = true

  try {
    await yupValidate(serviceValidator, service)
    const res = await client.post('service', service)
    if (res.status === 201) {
      console.log('Service created successfully:', res.data)
      newServiceActive.value = false
      getServices()
    } else {
      console.warn('Unexpected response status:', res.status)
    }
    service.name = ''
    service.duration = 0
    service.price = 0
    service.shortcut = ''
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      error.errors.forEach((err: ValidationError) => {
        if (err.message.includes('Name')) {
          errorMessages.name = err.message
        } else if (err.message.includes('Duration')) {
          errorMessages.duration = err.message
        } else if (err.message.includes('Price')) {
          errorMessages.price = err.message
        } else if (err.message.includes('Shortcut')) {
          errorMessages.shortcut = err.message
        }
      })
    } else {
      console.error('Unexpected error during creating service:', error)
    }
  } finally {
    isLoading.value = false
  }
}

const deleteService = async (id: string): Promise<void> => {
  try {
    const res = await client.delete(`service/${id}`)
    if (res.status === 200) {
      windowConfirmingDeletion('')
      getServices()
      console.log('Service deleted successfully')
    } else {
      console.warn('Unexpected response status during deletion:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during deleting services:', error)
  }
}

const getServices = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get('service')
    if (res.status === 200) {
      services.value = res.data
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting services:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getServices()
})
</script>

<style scoped>
input[type='number'] {
  -moz-appearance: textfield;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
