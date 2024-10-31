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
      v-for="barber in barbers"
      :key="barber?._id"
    >
      <div
        class="relative flex justify-between items-center"
        v-if="editBarber !== barber._id && barber._id"
      >
        <AdminBarbersItem
          :barber="barber"
          :setEditBarberIndex="setEditBarberIndex"
          :windowConfirmingDeletion="windowConfirmingDeletion"
          :openConfirmationDeleteWindow="openConfirmationDeleteWindow"
          :deleteBarber="deleteBarber"
        />
      </div>
      <div class="flex justify-between items-center" v-else>
        <AdminBarbersUpdate
          :barber="barber"
          :setEditBarberIndex="setEditBarberIndex"
          :addPhoto="addPhoto"
          :getBarbers="getBarbers"
        />
      </div>
    </div>
    <div class="border-2 border-bgThird p-2 rounded-xl">
      <div v-if="!newBarberActive" class="py-2 flex items-center justify-center">
        <button
          class="bg-secondary border-2 font-bold rounded-full px-6 py-2 border-primary hover:opacity-60"
          @click="openNewBarber"
        >
          Add New Barber
        </button>
      </div>
      <form v-else class="flex justify-between items-center max-lg:flex-col" @submit.prevent="addBarber">
        <div class="flex items-center gap-4 max-lg:flex-col">
          <div class="flex flex-col justify-center gap-2 items-center">
            <img
              v-if="barber.photo"
              :src="barber.photo"
              alt="Barber photo"
              class="w-20 h-20 rounded-full object-cover"
            />
            <img src="/user.png" alt="default" v-else class="w-20 h-20 rounded-full" />
            <input type="file" @change="handleFileUpload" class="my-2 max-md:pl-12" />
          </div>
          <div class="flex flex-col gap-2">
            <div class="flex gap-2 max-md:flex-col max-md:gap-0">
              <span class="font-bold">Name: </span>
              <input
                v-model="barber.name"
                type="text"
                name=""
                id=""
                class="px-2 max-md:py-2"
                placeholder="Enter name"
              />
            </div>
            <span v-if="errorMessages.name" class="text-red-500">{{ errorMessages.name }}</span>
            <div class="flex gap-2 max-md:flex-col max-md:gap-0">
              <span class="font-bold">Phone: </span>
              <div class="flex gap-2">
                <input
                  v-model="barber.phone"
                  type="text"
                  placeholder="Enter phone number"
                  class="px-2 max-md:py-2"
                />
              </div>
            </div>
            <span v-if="errorMessages.phone" class="text-red-500">{{ errorMessages.phone }}</span>
            <div class="flex gap-4">
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2 max-md:flex-col max-md:gap-0 max-md:items-start">
                  <span class="font-bold">Services: </span>
                  <div class="flex gap-2">
                    <select
                      @change="addService($event)"
                      class="h-10 px-2 flex items-center justify-center"
                    >
                      <option value="" hidden>Select a service</option>
                      <option
                        v-for="service in availableServices"
                        :key="service._id"
                        :value="service._id"
                      >
                        {{ service.shortcut }}
                      </option>
                    </select>
                  </div>
                </div>
                <div>
                  <span v-if="selectedServices.length === 0">No services selected</span>
                  <ul v-else class="flex flex-col gap-2">
                    <li
                      v-for="service in selectedServices"
                      :key="service._id"
                      class="flex justify-between items-center rounded-xl gap-2 bg-bgThird p-2"
                    >
                      {{ service.shortcut }}
                      <button
                        @click="removeService(service._id)"
                        class="py-[1px] px-2 bg-secondary rounded-full border-2 border-black hover:opacity-60"
                      >
                        Remove
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-4 pr-4 max-lg:mt-4">
          <button
            class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
            type="submit"
          >
            <font-awesome-icon :icon="['fas', 'check']" class="w-8 h-8 text-green-500" />
          </button>
          <button
            class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
            @click.prevent="openNewBarber"
          >
            <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
          </button>
        </div>
      </form>
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
import { computed, onMounted, reactive, ref } from 'vue'
import client from '../../api/client'
import { barberValidator, yupValidate } from '@/utils/validator'
import { ValidationError } from 'yup'
import LoadingAnimation from './LoadingAnimation.vue'
import axios from 'axios'
import AdminBarbersItem from './AdminBarbersItem.vue'
import AdminBarbersUpdate from './AdminBarbersUpdate.vue'
import type { Appointments, BarberErrorMessage, Service } from '@/types/types'

library.add(faCheck, faXmark, farPenToSquare)

const barber = reactive<Barber>({
  name: '',
  phone: '',
  photo: '',
  services: [],
  serviceDetails: [],
  availability: [],
  appointments: []
})

const errorMessages = reactive<BarberErrorMessage>({
  name: '',
  phone: ''
})

const services = ref<Service[]>([])
const selectedServices = ref<{ _id: string; shortcut: string }[]>([])
const barbers = ref<Barber[]>([])
const editBarber = ref<string>('')
const newBarberActive = ref<boolean>(false)
const openConfirmationDeleteWindow = ref<string>('')
const isLoading = ref<boolean>(false)
const photoFile = ref<File | null>(null)

const openNewBarber = () => {
  newBarberActive.value = !newBarberActive.value
}

const windowConfirmingDeletion = (id: string) => {
  openConfirmationDeleteWindow.value = id
}

const setEditBarberIndex = (id: string) => {
  editBarber.value = id
}

const availableServices = computed(() => {
  return services.value.filter(
    (service) => !selectedServices.value.some((selected) => selected._id === service._id)
  )
})

const addService = (event: Event) => {
  const selectedServiceId = (event.target as HTMLSelectElement).value

  const selectedService = services.value.find((service) => service._id === selectedServiceId)

  if (selectedService && selectedService._id) {
    const serviceToAdd = {
      _id: selectedService._id,
      shortcut: selectedService.shortcut
    }

    selectedServices.value.push(serviceToAdd)
  } else {
    console.error('Service not found or missing _id:', selectedService)
  }
}

const removeService = (id: string) => {
  selectedServices.value = selectedServices.value.filter((service) => service._id !== id)
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement

  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    console.log(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      barber.photo = e.target?.result as string
    }

    reader.readAsDataURL(file)
    photoFile.value = file;
  }
}

const addPhoto = async (): Promise<void> => {
  // @ts-ignore
  const cloudinaryUrl = import.meta.env.VITE_CLOUDINARY_URL
  // @ts-ignore
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET

  if (!cloudinaryUrl || !uploadPreset) {
    console.error('Cloudinary URL or upload preset not set in environment variables')
    return
  }

  if (photoFile.value) {
    const formData = new FormData()
    formData.append('file', photoFile.value)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'barberShop')

    try {
      const response = await axios.post(cloudinaryUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      barber.photo = response.data.secure_url
      console.log('Photo uploaded successfully:', response.data)
    } catch (error) {
      console.error('Error uploading photo:', error)
    }
  } else {
    console.error('No photo file selected')
  }
}

const addBarber = async (): Promise<void> => {
  errorMessages.name = ''
  errorMessages.phone = ''

  try {
    await yupValidate(barberValidator, barber)

    await addPhoto()
    barber.services = selectedServices.value.map((service) => service._id)
    console.log('Barber after adding photo:', barber)

    const res = await client.post('barber', barber)
    if (res.status === 201) {
      console.log('Barber created successfully:', res.data)
      newBarberActive.value = false

      getBarbers()
    } else {
      console.warn('Unexpected response status:', res.status)
    }
    barber.name = ''
    barber.phone = ''
    barber.photo = ''
    barber.services = []
    selectedServices.value = []
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      error.errors.forEach((err: ValidationError) => {
        if (err.message.includes('Name')) {
          errorMessages.name = err.message
        } else if (err.message.includes('Phone')) {
          errorMessages.phone = err.message
        }
      })
    } else {
      console.error('Unexpected error during creating service:', error)
    }
  }
}

const deleteBarber = async (id: string): Promise<void> => {
  try {
    const res = await client.delete(`barber/${id}`)
    if (res.status === 200) {
      windowConfirmingDeletion('')
      getBarbers()
      console.log('Barber deleted successfully')
    } else {
      console.warn('Unexpected response status during deletion:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during deleting barber:', error)
  }
}

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

const getServices = async (): Promise<void> => {
  try {
    const res = await client.get('service')
    if (res.status === 200) {
      services.value = res.data
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting services:', error)
  }
}

onMounted(() => {
  getBarbers()
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
