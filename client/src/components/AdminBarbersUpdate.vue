<template>
  <div class="flex justify-between items-center w-full max-lg:flex-col">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <div class="w-full flex flex-col">
      <div class="flex flex-col justify-center gap-2 items-center">
        <img
          v-if="editBarberInfo.photo && editBarberInfo.phone.length > 0"
          :src="editBarberInfo.photo"
          alt="Barber photo"
          class="w-20 h-20 rounded-full object-cover"
        />
        <img :src="barber.photo" alt="default" v-else class="w-20 h-20 rounded-full" />
        <input type="file" @change="handleFileUpload" class="my-2 max-md:pl-16" />
      </div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center max-md:flex-col max-md:gap-0 max-md:items-start">
          <span class="font-bold">Name: </span>
          <input v-model="editBarberInfo.name" type="text" name="" id="" class="px-2 max-md:py-2" />
        </div>
        <span v-if="errorMessages.name" class="text-red-500">{{ errorMessages.name }}</span>
        <div class="flex gap-2 items-center max-md:flex-col max-md:gap-0 max-md:items-start">
          <span class="font-bold">Phone: </span>
          <div class="flex gap-2">
            <input v-model="editBarberInfo.phone" type="text" name="" id="" class="px-2 max-md:py-2" />
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
                    v-if="service._id"
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
        v-if="editBarberInfo._id"
        class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
        @click="
          () => {
            if (editBarberInfo._id) {
              addPhoto()
              updateBarber(editBarberInfo._id)
            }
          }
        "
      >
        <font-awesome-icon :icon="['fas', 'check']" class="w-8 h-8 text-green-500" />
      </button>
      <button
        @click="setEditBarberIndex('')"
        class="flex items-center p-2 bg-bgThird rounded-full cursor-pointer hover:opacity-60"
      >
        <font-awesome-icon :icon="['fas', 'xmark']" class="w-8 h-8 text-red-500" />
      </button>
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

import { computed, onMounted, reactive, ref } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons'
import { faPenToSquare as farPenToSquare } from '@fortawesome/free-regular-svg-icons'
import client from '../../api/client'
import { barberValidator, yupValidate } from '@/utils/validator'
import type { ValidationError } from 'yup'
import LoadingAnimation from './LoadingAnimation.vue'
import type { Appointments, BarberErrorMessage, Service } from '@/types/types'

library.add(faCheck, faXmark, farPenToSquare)

const props = defineProps<{
  barber: Barber
  setEditBarberIndex: (id: string) => void
  getBarbers: () => void
  addPhoto: () => void
}>()

const errorMessages = reactive<BarberErrorMessage>({
  name: '',
  phone: ''
})

const isLoading = ref<boolean>(false)
const services = ref<Service[]>([])
const selectedServices = ref<Service[]>(props.barber.serviceDetails || [])

const editBarberInfo = reactive<Barber>({
  _id: props.barber._id,
  name: props.barber.name,
  phone: props.barber.phone,
  photo: props.barber.photo,
  serviceDetails: props.barber.serviceDetails
})

const availableServices = computed(() =>
  services.value.filter(
    (service) => !selectedServices.value.some((selected) => selected._id === service._id)
  )
)

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement

  if (input.files && input.files.length > 0) {
    const file = input.files[0]

    const reader = new FileReader()
    reader.onload = (e) => {
      editBarberInfo.photo = e.target?.result as string
    }

    reader.readAsDataURL(file)
  }
}

const addService = (event: Event) => {
  const selectedServiceId = (event.target as HTMLSelectElement).value
  const selectedService = services.value.find((service) => service._id === selectedServiceId)
  if (selectedService) {
    selectedServices.value.push(selectedService)
  }
}

const removeService = (id: string) => {
  selectedServices.value = selectedServices.value.filter((service) => service._id !== id)
}

const updateBarber = async (id: string): Promise<void> => {
  isLoading.value = true
  errorMessages.name = ''
  errorMessages.phone = ''
  if (!id) {
    console.error('Service ID is missing.')
    return
  }
  try {
    await yupValidate(barberValidator, editBarberInfo)

    editBarberInfo.services = selectedServices.value
      .map((service) => service._id)
      .filter((id): id is string => id !== undefined)

    const res = await client.patch(`barber/${id}`, editBarberInfo)
    props.setEditBarberIndex('')
    props.getBarbers()
    console.log('Barber updated successfully:', res.data)
    editBarberInfo.name = ''
    editBarberInfo.phone = ''
    editBarberInfo.photo = ''
    editBarberInfo.services = []
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
  getServices()
})
</script>

<style></style>
