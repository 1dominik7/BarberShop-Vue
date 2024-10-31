<template>
  <div>
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <div class="mb-4">
      <div class="flex justify-center items-center">
        <font-awesome-icon
          class="text-white cursor-pointer h-16 w-16 hover:opacity-60"
          :icon="['fas', 'chevron-left']"
          @click="prevChevron"
        />
        <div class="flex flex-col items-center">
          <img class="h-56 w-56 object-cover" :src="selectedBarber?.photo" alt="" />
          <span class="text-2xl font-bold text-white">{{ selectedBarber?.name }}</span>
        </div>
        <font-awesome-icon
          class="text-white cursor-pointer h-16 w-16 hover:opacity-60"
          :icon="['fas', 'chevron-right']"
          @click="nextChevron"
        />
      </div>
    </div>
    <vue-cal
      :time="true"
      small
      :time-from="8 * 60"
      :time-to="20 * 60"
      :time-cell-height="80"
      :min-cell-width="70"
      :editable-events="{ title: false, drag: false, resize: false, delete: true, create: false }"
      :events="events"
      style="height"
      class="text-white max-md:text-xs"
    >
    </vue-cal
    >>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import client from '../../api/client'
import LoadingAnimation from './LoadingAnimation.vue'
import type { AvailabilitySlot, Barber } from '@/types/types'

library.add(faChevronLeft, faChevronRight)

const isLoading = ref<boolean>(false)
const barbers = ref<Barber[]>([])
const selectedBarberIndex = ref<number>(0)
const selectedBarber = ref<Barber | null>(null)
const availability = ref<AvailabilitySlot[]>(selectedBarber?.value?.availability || [])
const isFirstLoad = ref<boolean>(true)
const barbersAppointments = ref<Barber | null>(null)

const getBarbers = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get('barber')
    if (res.status === 200) {
      barbers.value = res.data
      if (isFirstLoad.value && barbers.value.length > 0) {
        selectedBarber.value = barbers.value[0]
        isFirstLoad.value = false
      }
      console.log('Barbers', barbers.value)
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting barbers:', error)
  } finally {
    isLoading.value = false
  }
}

const getBarberAppointment = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get(`barber/barberAppointments/${selectedBarber?.value?._id}`)
    if (res.status === 200) {
      barbersAppointments.value = res.data
      console.log('Barber appointments:', barbersAppointments.value)
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting barbers:', error)
  } finally {
    isLoading.value = false
  }
}

const events = computed(() => {
  return barbersAppointments.value?.appointments?.map((slot) => {
    const dateObj = new Date(slot.appointmentDate)
    const datePart = dateObj.toISOString().split('T')[0]
    return {
      start: `${datePart} ${slot.startTime}:00`,
      end: `${datePart} ${slot.endTime}:00`,
      title: slot.user.name,
      content: slot.services.map((item) => item.shortcut),
      allDay: false,
      deletable: true,
      class: slot.status === 'Cancelled' ? 'vueCallRedBG' : 'normal'
    }
  })
})

const updateSelectedBarber = () => {
  selectedBarber.value = barbers.value[selectedBarberIndex.value]
  if (selectedBarber.value) {
    getBarberAppointment()
  }
}

const nextChevron = () => {
  if (selectedBarberIndex.value < barbers.value.length - 1) {
    selectedBarberIndex.value += 1
  } else {
    selectedBarberIndex.value = 0
  }
  updateSelectedBarber()
}

const prevChevron = () => {
  if (selectedBarberIndex.value > 0) {
    selectedBarberIndex.value -= 1
  } else {
    selectedBarberIndex.value = barbers.value.length - 1
  }
  updateSelectedBarber()
}

onMounted(() => {
  getBarbers().then(() => {
    if (barbers.value.length > 0) {
      selectedBarber.value = barbers.value[0]
      getBarberAppointment()
    }
  })
})

watch(barbers, (newBarbers) => {
  console.log('Barbers updated:', newBarbers)
  if (newBarbers.length > 0 && !selectedBarber.value) {
    selectedBarber.value = newBarbers[0]
  }
})

watch(selectedBarber, (newBarber) => {
  if (newBarber) {
    availability.value = newBarber.availability || []
    getBarberAppointment()
  } else {
    availability.value = []
    barbersAppointments.value = null
  }
})
</script>

<style>
input[type='number'] {
  -moz-appearance: textfield;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.vueCallRedBG {
  background-color: rgb(231, 104, 104);
  border-bottom: 1px solid red;
}
.normal {
  border-bottom: 2px solid beige;
}
</style>
