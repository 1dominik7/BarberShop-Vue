<template>
  <div class="h-full w-full relative flex flex-col items-center bg-primary">
    <div
      class="flex items-center justify-around h-[40%] py-4 gap-6 mx-52 bg-white max-sm:mx-6 max-xl:mx-16"
    >
      <div
        class="h-full flex flex-col items-center gap-6 text-center max-sm:hidden max-lg:w-[40%] xl:flex-row"
      >
        <img class="w-full h-full object-contain" src="/barber-pole.gif" alt="" />
        <div class="flex flex-col">
          <span class="text-2xl font-bold max-lg:text-xl">OUR SERVICES</span>
          <span class="text-2xl font-bold max-lg:text-xl">BARBERSHOP</span>
        </div>
      </div>
      <video autoplay loop muted class="w-full h-full max-sm:object-cover">
        <source src="/serviceVideo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="w-full px-20 h-full pt-6 bg-white overflow-y-scroll max-md:px-6 max-md:pt-2">
      <div class="flex items-center">
        <span class="w-72 text-2xl font-bold max-lg:text-xl max-md:text-lg max-md:w-[430px]"
          >BARBER SERVICES</span
        >
        <div class="w-full h-[2px] bg-black" />
      </div>
      <div class="my-6 flex flex-col gap-6 max-md:gap-2 max-md:my-2 max-md:hidden">
        <div
          v-for="service in services"
          :key="service._id"
          class="flex items-center justify-between max-md:border-b-[1px] max-md:border-gray-300"
        >
          <span class="w-[70%] text-2xl max-lg:text-lg max-sm:text-sm max-md:w-[60%]">{{
            service.name
          }}</span>
          <div class="flex gap-4 items-center max-md:flex-col max-md:gap-[1px]">
            <font-awesome-icon :icon="['far', 'clock']" />
            <span class="text-xl max-lg:text-lg max-sm:text-sm"> {{ service.duration }} min</span>
          </div>
          <span class="text-2xl font-bold max-lg:text-lg max-sm:text-sm"
            >from {{ service.price }}$</span
          >
        </div>
      </div>
      <div class="hidden max-md:flex">
        <swiper
          :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
          style="
            --swiper-pagination-color: lightgray;
            --swiper-pagination-bullet-inactive-color: gray;
            --swiper-pagination-bullet-size: 14px;
          "
          :spaceBetween="100"
          :slidesPerView="1"
          :slidesPerGroup="1"
          pagination
          :loop="false"
          class="serviceSwiper"
        >
          <swiper-slide v-for="service in services" :key="service._id" class="swiper">
            <div
              class="flex flex-col gap-6 pb-4 items-center border-b-[1px] border-gray-300"
            >
              <span class="text-lg text-center">{{
                service.name
              }}</span>
              <div class="flex gap-4 items-center max-md:flex-col max-md:gap-[1px]">
                <font-awesome-icon :icon="['far', 'clock']" class="text-xl"/>
                <span class="text-xl">
                  {{ service.duration }} min</span
                >
              </div>
              <span class="text-2xl font-bold"
                >from {{ service.price }}$</span
              >
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Service {
  _id: string
  name: string
  shortcut: string
  price: number
  duration: number
}

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { onMounted, ref } from 'vue'
import client from '../../api/client'
import { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

library.add(faClock)

const isLoading = ref<boolean>(false)
const services = ref<Service[]>([])

const getServices = async (): Promise<void> => {
  isLoading.value = true
  try {
    const res = await client.get('service')
    if (res.status === 200) {
      services.value = res.data
      console.log(services.value)
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
  getServices()
})
</script>

<style>
.serviceSwiper {
  width: 300px;
  height: 300px;
  padding: 25px 0;
}
</style>
