<template>
  <div
    class="bg-primary max-h-[100vh] overflow-y-scroll w-full px-52 py-6 flex flex-col items-center max-md:max-h-full max-md:px-6"
  >
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <div
      class="px-6 w-full h-full py-6 flex flex-col justify-center items-center max-md:px-0"
      v-else
    >
      <div
        class="relative w-[350px] h-[350px] items-center flex justify-center border-[1px] border-secondary cursor-pointer max-md:w-[270px] max-md:h-[320px]"
      >
        <div class="h-[80%] w-[80%] border-[1px] border-secondary" />
        <img
          :src="barber?.photo"
          alt=""
          class="absolute h-full w-full object-contain -bottom-12 z-10 transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <div class="absolute -bottom-2 flex flex-col gap-2 items-center z-20">
          <span class="text-3xl font-bold text-white">{{ barber?.name }}</span>
        </div>
      </div>
      <div
        class="flex flex-col items-center justify-center mt-6 z-10 cursor-pointer"
        @click="toggleReview()"
      >
        <div class="flex flex-col hover:opacity-60">
          <span class="text-white font-bold text-sm"
            >Rating: {{ averageRating }} ({{ reviews.length }} reviews)</span
          >
          <div class="flex items-center justify-center gap-2">
            <span class="text-xl text-yellow-400" v-for="index in 5" :key="index"
              ><font-awesome-icon :icon="index <= Math.floor(averageRating) ? fasStar : farStar"
            /></span>
          </div>
        </div>
        <div
          v-if="openReview"
          class="flex flex-col items-center px-2 gap-4 max-h-72 mt-2 text-white overflow-y-scroll"
        >
          <div
            class="w-[600px] h-full border-b-[1px] border-gray-500 flex flex-col max-md:w-[300px]"
          >
            <div class="flex w-full mb-2 gap-2 flex-col justify-between items-center">
              <span>Add Comment:</span>
              <div class="flex items-center">
                <span
                  class="text-xl text-yellow-400"
                  v-for="star in 5"
                  :key="star"
                  @click.stop="setRating(star)"
                  ><font-awesome-icon :icon="star <= newReview.rating ? fasStar : farStar"
                /></span>
              </div>
              <textarea
                @click.stop
                class="w-full text-black p-2"
                name=""
                id=""
                v-model="newReview.comment"
                placeholder="Write a comment..."
              ></textarea>
              <div v-if="error" class="text-red-500 mt-2 text-sm">
                <p v-if="errors.rating">Please select a rating.</p>
                <p v-if="errors.comment">Write something</p>
              </div>
              <p v-if="errorMessage" class="text-red-500 mt-2 text-sm">{{ errorMessage }}</p>
              <button
                class="my-2 py-2 px-4 bg-bgSecond rounded-xl text-black font-bold hover:opacity-60"
                @click.stop="addReview()"
              >
                Add Review
              </button>
            </div>
          </div>
          <div
            v-for="review in reviews"
            :key="review._id"
            class="w-[600px] h-full flex flex-col border-b-[1px] border-gray-500"
          >
            <div class="flex justify-between items-center">
              <div class="flex gap-2">
                <span>{{ review.user.name }},</span>
                <span>Rating: {{ review.rating }}</span>
              </div>
              <span>{{ formatDate(review.createdAt) }}</span>
            </div>
            <span class="mt-2 break-words">Comment: {{ review.comment }}</span>
            <div class="flex items-center justify-center">
              <button
                class="w-36 p-2 bg-red-400 m-2 rounded-xl hover:opacity-60"
                v-if="user?.isAdmin && review._id"
                @click.stop="deleteReview(review._id)"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-2 flex flex-col gap-2 justify-center items-center">
        <h1 class="text-2xl font-bold text-white max-md:text-xl">Choose service:</h1>
        <select
          placeholder="Please choose"
          class="w-[600px] py-4 px-2 flex items-center justify-center max-md:w-[300px]"
          @change="addService($event)"
        >
          <option class="px-2" value="" hidden>Select a service...</option>
          <option
            class="px-2"
            v-for="service in availableServices"
            :key="service._id"
            :value="service._id"
          >
            {{ service.name }} - {{ service.price }} $
          </option>
        </select>
        <div>
          <span
            v-if="selectedServices.length === 0"
            class="text-white font-bold text-xl max-md:text-lg"
            >No services selected</span
          >
          <ul v-else class="flex flex-col gap-2">
            <li
              v-for="service in selectedServices"
              :key="service._id"
              class="flex justify-between items-center rounded-xl gap-2 bg-bgThird p-2"
            >
              {{ service.name }} - {{ service.price }} $
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
      <div
        class="flex flex-col justify-center items-center gap-2"
        v-if="selectedServices.length > 0"
      >
        <div class="flex flex-col items-center justify-center">
          <div class="flex items-center justify-center py-6 gap-4 mt-10">
            <img
              src="/chevron.png"
              alt=""
              class="w-24 h-24 cursor-pointer hover:opacity-60 max-md:w-16 max-md:h-16"
              @click="moveDay(-1)"
            />
            <div class="w-full h-full flex gap-2 justify-center max-md:flex-wrap">
              <div v-for="(day, index) in visibleDays" :key="index" @click="selectDay(day)">
                <div
                  :class="[
                    'flex h-24 w-20 flex-col items-center justify-center gap-[1px] p-4 border-2 border-secondary bg-secondary rounded-full cursor-pointer hover:opacity-60 max-lgx:h-20 max-lg:w-16',
                    selectedDay === day ? 'opacity-60' : ''
                  ]"
                >
                  <span class="text-xl font-bold text-primary max-md:text-base">{{
                    day.dayOfWeek
                  }}</span>
                  <span class="text-xl font-bold text-primary max-md:text-base"
                    >{{ day.dayOfMonth }}.{{ day.month }}</span
                  >
                </div>
              </div>
            </div>

            <img
              src="/chevron.png"
              alt=""
              class="scale-x-[-1] w-24 h-24 cursor-pointer hover:opacity-60 max-md:w-16 max-md:h-16"
              @click="moveDay(+1)"
            />
          </div>
          <div v-if="selectedDay" class="w-full flex-wrap flex gap-4 justify-center">
            <span
              v-for="(hour, index) in selectedDay.availableHours"
              :key="index"
              :class="[
                'px-6 py-2 border-2 text-xl font-bold border-secondary bg-secondary text-primary rounded-full hover:opacity-60 cursor-pointer max-lg:px-4',
                selectedHour === hour ? 'opacity-60' : ''
              ]"
              @click="selectHour(hour)"
            >
              {{ hour }}
            </span>
          </div>
          <div
            v-if="selectDay !== null && selectedHour !== null"
            class="flex gap-2 mt-4"
          >
            <span class="text-white text-2xl font-bold">Selected Date: </span>
            <span class="text-white text-2xl">
              {{ selectedDay?.dayOfMonth }}.{{ selectedDay?.month }} -
              {{ selectedHour }}
            </span>
          </div>
          <div
            v-if="selectedDay && selectedDay.availableHours.length === 0"
            class="text-white font-bold text-xl"
          >
            No available hours for this day
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-center">
            <span class="text-2xl text-white font-bold" v-if="isDisabled">Select day and hour</span>
            <button
              v-else
              :class="[
                'py-4 px-24 text-primary bg-secondary font-bold text-xl rounded-full mt-6 hover:opacity-60 max-md:text-lg max-md:px-6 max-md:py-3',
                isDisabled ? 'bg-gray-500 hover:cursor-none hover:opacity-100' : ''
              ]"
              :disabled="isDisabled"
              @click="bookAppointment"
              :isDisabled="isBusy"
            >
              Book an appointment
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import client from '@/../api/client'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingAnimation from '@/components/LoadingAnimation.vue'
import { useAuthStore } from '@/stores/auth'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons'
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons'
import type { Appointment, Barber, DayInfo, Review, Service } from '@/types/types'

library.add(farStar, fasStar)

const route = useRoute()

const authStore = useAuthStore()
const { user } = authStore
const router = useRouter()

const selectedServices = ref<Service[]>([])
const isLoading = ref<boolean>(false)
const isBusy = ref<boolean>(false)
const barber = ref<Barber | null>(null)
const upcomingDays = ref<any[]>([])
const selectedDay = ref<DayInfo | null>(null)
const selectedHour = ref<string | null>(null)
const startDayIndex = ref<number>(0)
const daysToDisplay = 7
const openReview = ref<boolean>(false)
const reviews = ref<Review[]>([])
const newReview = ref<{ rating: number; comment: string }>({
  rating: 0,
  comment: ''
})
const error = ref<boolean>(false)
const errors = ref<{ rating: boolean; comment: boolean }>({
  rating: false,
  comment: false
})
const errorMessage = ref<string>('')

const setRating = (star: number) => {
  newReview.value.rating = star
}

const toggleReview = () => {
  openReview.value = !openReview.value
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
  return formattedDate
}

function validateReview() {
  error.value = false
  errors.value.rating = newReview.value.rating === 0
  errors.value.comment = newReview.value.comment.length <= 3

  if (errors.value.rating || errors.value.comment) {
    error.value = true
    return false
  }
  return true
}

const addReview = async (): Promise<void> => {
  isLoading.value = true
  try {
    if (!validateReview() || !barber.value) {
      isLoading.value = false
      console.error('Validation failed or missing barber/user ID')
      return
    }

    const res = await client.post(`review`, {
      barber: barber.value._id,
      user: user?._id,
      rating: newReview.value.rating,
      comment: newReview.value.comment
    })
    if (res.status === 201) {
      getBarber(barber.value?._id)
      newReview.value.comment = ''
      newReview.value.rating = 0
      getBarberReviews(barber.value._id)
    }
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      errorMessage.value = error.response.data.message
    } else {
      errorMessage.value = 'An unexpected error occurred.'
    }
  } finally {
    isLoading.value = false
  }
}

const deleteReview = async (id: string): Promise<void> => {
  isLoading.value = true
  try {
    if (!barber.value) {
      isLoading.value = false
      console.error('Validation failed or missing barber ID')
      return
    }

    const res = await client.delete(`review/${id}`)
    if (res.status === 200) {
      getBarberReviews(barber.value._id)
    }
  } catch (error: any) {
    console.error('Unexpected error during deleting barber review:', error)
  } finally {
    isLoading.value = false
  }
}

const getBarberReviews = async (id: string): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get(`review/${id}`)
    if (res.status === 200) {
      reviews.value = res.data
    } else if (res.status === 404) {
      console.warn('No reviews found for this barber.')
      reviews.value = []
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting barber reviews:', error)
  } finally {
    isLoading.value = false
  }
}

const getBarber = async (id: string): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get(`barber/${id}`)
    if (res.status === 200) {
      barber.value = res.data
      fetchAvailability()
      console.log('barber', barber.value)
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during getting barbers:', error)
  } finally {
    isLoading.value = false
  }
}

const availableServices = computed(() => {
  return (
    barber.value?.services.filter(
      (service) => !selectedServices.value.some((selected) => selected._id === service._id)
    ) || []
  )
})

const totalSelectedDuration = computed(() => {
  return selectedServices.value.reduce((total, service) => total + service.duration, 0)
})

const addService = (event: Event) => {
  const selectedServiceId = (event.target as HTMLSelectElement).value

  const selectedService = barber.value?.services.find(
    (service) => service._id === selectedServiceId
  )

  if (selectedService && selectedService._id) {
    const serviceExists = selectedServices.value.some(
      (service) => service._id === selectedService._id
    )

    if (serviceExists) {
      console.warn('Service already added:', selectedService.name)
      return
    }

    const serviceToAdd: Service = {
      _id: selectedService._id,
      name: selectedService.name,
      duration: selectedService.duration,
      price: selectedService.price,
      shortcut: selectedService.shortcut
    }

    selectedServices.value.push(serviceToAdd)
    fetchAvailability()

    selectedDay.value = null
    selectedHour.value = null
  } else {
    console.error('Service not found or missing _id:', selectedService)
  }
}

const removeService = (id: string) => {
  selectedServices.value = selectedServices.value.filter((service) => service._id !== id)
  fetchAvailability()
  selectedDay.value = null
  selectedHour.value = null
}

const fetchAvailability = () => {
  const today = new Date()
  const totalDays = 30
  upcomingDays.value = []

  for (let i = 0; i < totalDays; i++) {
    const futureDate = new Date(today)
    futureDate.setDate(today.getDate() + i)

    const availabilityForDay = barber.value?.availability.find((availability) => {
      const slotDate = new Date(availability.date).toISOString().split('T')[0]
      const futureDateString = futureDate.toISOString().split('T')[0]
      return slotDate === futureDateString
    })

    if (availabilityForDay) {
      const dateString = availabilityForDay.date.split('T')[0]
      const startTime = new Date(`${dateString}T${availabilityForDay.startTime}:00Z`)
      const endTime = new Date(`${dateString}T${availabilityForDay.endTime}:00Z`)

      const appointmentsForDay = (barber.value?.appointments || []).filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentDate).toISOString().split('T')[0]

        return appointmentDate === futureDate.toISOString().split('T')[0]
      })

      const totalDuration = totalSelectedDuration.value

      const availableHours = generateAvailableHours(
        startTime,
        endTime,
        totalDuration,
        appointmentsForDay
      )

      upcomingDays.value.push({
        dayOfWeek: futureDate.toLocaleString('en-US', { weekday: 'short' }),
        dayOfMonth: futureDate.getDate(),
        month: futureDate.getMonth() + 1,
        availableHours
      })
    } else {
      upcomingDays.value.push({
        dayOfWeek: futureDate.toLocaleString('en-US', { weekday: 'short' }),
        dayOfMonth: futureDate.getDate(),
        month: futureDate.getMonth() + 1,
        availableHours: []
      })
    }
  }

  upcomingDays.value = upcomingDays.value.map((day) => ({
    ...day,
    formattedDate: `${day.dayOfWeek} ${String(day.dayOfMonth).padStart(2, '0')}.${String(day.month).padStart(2, '0')}`
  }))
}

const generateAvailableHours = (
  startTime: Date,
  endTime: Date,
  totalSelectedDuration: number,
  appointmentsForDay: Appointment[]
): string[] => {
  const availableHours: string[] = []
  const durationInMilliseconds = totalSelectedDuration * 60 * 1000
  let currentTime = startTime.getTime()
  const endTimestamp = endTime.getTime()

  const busySlots: { start: number; end: number }[] = appointmentsForDay.map((appointment) => {
    const appointmentStart =
      new Date(appointment.appointmentDate).getTime() + parseTime(appointment.startTime)
    const appointmentEnd =
      new Date(appointment.appointmentDate).getTime() + parseTime(appointment.endTime)
    return { start: appointmentStart, end: appointmentEnd }
  })

  while (currentTime + durationInMilliseconds <= endTimestamp) {
    const nextBusySlot = busySlots.find(
      (slot) => currentTime < slot.end && currentTime + durationInMilliseconds > slot.start
    )

    if (nextBusySlot) {
      currentTime = nextBusySlot.end
    } else {
      availableHours.push(new Date(currentTime).toISOString().substring(11, 16))

      currentTime += 30 * 60 * 1000
    }
  }

  return availableHours
}

const parseTime = (timeString: string) => {
  const [hours, minutes] = timeString.split(':').map(Number)
  return (hours * 60 + minutes) * 60 * 1000
}

const selectDay = (day: DayInfo) => {
  selectedDay.value = day
}

const selectHour = (hour: string) => {
  selectedHour.value = hour
}

const moveDay = (direction: number) => {
  const newIndex = startDayIndex.value + direction

  if (newIndex >= 0 && newIndex + daysToDisplay <= upcomingDays.value.length) {
    startDayIndex.value = newIndex
  }
}

const updateUserInfo = async (): Promise<void> => {
  isLoading.value = true
  if (!user) {
    console.error('No user found')
    isLoading.value = false
    return
  }
  try {
    const res = await client.patch(`user/${user._id}`, { name: user.name, phone: user.phone })
    if (res.status === 201) {
      authStore.setUser(res.data.user)
      console.log('User updated successfully:', res.data)
    } else {
      console.error('Failed to fetch user data:', res.status, res)
    }
  } catch (error) {
    console.error('Error fetching updated user:', error)
  } finally {
    isLoading.value = false
  }
}

const bookAppointment = async (): Promise<void> => {
  isBusy.value= true
  if (!selectedDay.value || !selectedHour.value) {
    console.error('Please select a day and hours before booking')
    return
  }

  const appointmentDate = new Date(
    Date.UTC(
      2024,
      Number(selectedDay.value.month) - 1,
      selectedDay.value.dayOfMonth,
      ...selectedHour.value.split(':').map(Number)
    )
  )
  const totalDuration = selectedServices.value.reduce(
    (total, service) => total + service.duration,
    0
  )
  const endTime = new Date(appointmentDate.getTime() + totalDuration * 60000)

  if (!barber.value) {
    return
  }

  try {
    const plainSelectedServices = selectedServices.value.map((service) => ({
      _id: service._id,
      name: service.name,
      price: service.price,
      shortcut: service.shortcut,
      duration: service.duration
    }))

    const requestBody = {
      services: plainSelectedServices,
      userId: user?._id,
      barberId: barber.value?._id,
      appointmentDate: appointmentDate.toISOString().split('T')[0],
      startTime: selectedHour.value,
      endTime: endTime.toISOString().substring(11, 16)
    }

    const res = await client.post('appointment', requestBody)
    if (res.status === 201) {
      console.log('Appointment created successfully:', res.data)
      await updateUserInfo()
      getBarber(barber.value?._id)
      router.push('/profile')
    } else {
      console.warn('Unexpected response status:', res.status)
    }
  } catch (error) {
    console.error('Unexpected error during creating appointment:', error)
  } finally{
    isBusy.value= false
  }
}

const visibleDays = computed(() => {
  return upcomingDays.value.slice(startDayIndex.value, startDayIndex.value + daysToDisplay)
})

const isDisabled = computed(() => {
  return !selectedDay.value || !selectedHour.value
})

const averageRating = computed(() => {
  if (reviews.value.length === 0) return 0
  const totalRating = reviews.value.reduce((acc, review) => acc + review.rating, 0)
  return totalRating / reviews.value.length
})

onMounted(() => {
  const barberId = route.params.id as string
  if (barberId) {
    getBarber(barberId)
    getBarberReviews(barberId)
  }
})

watch(selectedServices, (newValue, oldValue) => {
  fetchAvailability()
})
</script>

<style></style>
