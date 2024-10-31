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
      :time-from="8 * 60"
      :time-to="20 * 60"
      :min-cell-width="70"
      small
      @cell-click="onTimeSlotClick"
      :editable-events="{ title: true, drag: false, resize: false, delete: true, create: false }"
      :events="events"
      style="height: 700px"
      class="text-white max-md:text-xs"
      >
    </vue-cal>
    <div v-if="dialog" class="dialog-overlay text-black z-10">
      <div class="dialog">
        <h3>Set Availability for {{ selectedDate }}</h3>

        <label for="start-time">Start Time:</label>
        <input type="time" v-model="startTime" id="start-time" />

        <label for="end-time">End Time:</label>
        <input type="time" v-model="endTime" id="end-time" />

        <div class="dialog-actions">
          <button @click="saveAvailability">Save</button>
          <button @click="dialog = false">Cancel</button>
          <button
            v-if="selectedAvailabilityId !== null"
            @click="deleteAvailability(selectedAvailabilityId)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import client from '../../api/client'
import LoadingAnimation from './LoadingAnimation.vue'
import type { AvailabilitySlot, Barber } from '@/types/types'

library.add(faChevronLeft, faChevronRight)

const selectedDate = ref<string>('')
const dialog = ref(false)
const startTime = ref<string>('08:00')
const endTime = ref<string>('17:00')
const isLoading = ref<boolean>(false)
const barbers = ref<Barber[]>([])
const selectedBarberIndex = ref<number>(0)
const selectedBarber = ref<Barber | null>(null)
const availability = ref<AvailabilitySlot[]>(selectedBarber?.value?.availability || [])
const isFirstLoad = ref<boolean>(true)
const selectedAvailabilityId = ref<string | null>(null)

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
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting barbers:', error)
  } finally {
    isLoading.value = false
  }
}

const getBarber = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get(`barber/${selectedBarber?.value?._id}`)
    if (res.status === 200) {
      availability.value = res.data.availability || []
      console.log('Updated availability:', availability.value)
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
  return availability.value.map((slot) => {
    const dateObj = new Date(slot.date)
    const datePart = dateObj.toISOString().split('T')[0]
    return {
      start: `${datePart} ${slot.startTime}:00`,
      end: `${datePart} ${slot.endTime}:00`,
      title: 'Available Slot',
      content: '',
      background: false,
      allDay: false,
      deletable: true,
      class:'p-2'
    }
  })
})

const onTimeSlotClick = (data: Date) => {
  if (data instanceof Date) {
    const clickedDate = data.toISOString().substring(0, 10)
    const matchingSlot = availability.value.find((slot) => {
      const slotDate = new Date(slot.date).toISOString().substring(0, 10)
      return slotDate === clickedDate
    })

    if (matchingSlot) {
      selectedAvailabilityId.value = matchingSlot._id || null
    } else {
      selectedAvailabilityId.value = null
    }
    selectedDate.value = clickedDate

    dialog.value = true
  } else {
    console.error('Unexpected data structure:', data)
  }
}

const updateSelectedBarber = () => {
  selectedBarber.value = barbers.value[selectedBarberIndex.value]
  if (selectedBarber.value) {
    getBarbers()
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

const saveAvailability = async (): Promise<void> => {
  if (!startTime.value || !endTime.value) {
    alert('Please set both start and end times.')
    return
  }

  if (startTime.value >= endTime.value) {
    alert('End time must be after start time.')
    return
  }

  if (!selectedDate.value) {
    console.error('Selected date is not defined')
    return
  }

  const newSlot: AvailabilitySlot = {
    date: selectedDate.value,
    startTime: startTime.value,
    endTime: endTime.value
  }

  const exists = availability.value.some((slot) => {
    return (
      slot.date === newSlot.date &&
      slot.startTime === newSlot.startTime &&
      slot.endTime === newSlot.endTime
    )
  })

  if (!exists) {
    isLoading.value = true
    const date = selectedDate.value.split(' ')[0]
    const start = startTime.value
    const end = endTime.value
    const payload = { date, start, end }

    try {
      const res = await client.post(`barber/setHours/${selectedBarber?.value?._id}`, payload)
      if (res.status === 200) {
        getBarber()
      } else {
        console.warn('Unexpected response status:', res.status)
      }
    } catch (error) {
      console.error('Unexpected error during getting barbers:', error)
    } finally {
      isLoading.value = false
    }
  } else {
    alert('This time slot is already set.')
  }

  dialog.value = false

  startTime.value = '08:00'
  endTime.value = '17:00'
}

const deleteAvailability = async (id: string | null): Promise<void> => {
  if (!id) {
    console.error('No availability ID provided for deletion.')
    return
  }

  isLoading.value = true

  try {
    const res = await client.delete(`barber/setHours/${selectedBarber?.value?._id}/${id}`)
    if (res.status === 200) {
      getBarber()
      dialog.value = false
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting barbers:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  getBarbers().then(() => {
    if (barbers.value.length > 0) {
      selectedBarber.value = barbers.value[0]
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
    console.log('Updated availability:', availability.value)
  } else {
    availability.value = []
  }
})

</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
}

.dialog-actions {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}
</style>
