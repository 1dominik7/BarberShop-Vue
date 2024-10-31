<template>
  <div class="h-full w-full relative flex flex-col items-center overflow-hidden">
    <div
      v-if="isLoading"
      class="flex justify-center items-center w-full h-full absolute top-0 left-0 z-50 bg-black opacity-60"
    >
      <LoadingAnimation />
    </div>
    <div
      class="h-[10%] pt-10 pb-6 flex w-[400px] items-center justify-between z-10 max-md:w-max max-md:pt-0 max-md:gap-4"
    >
      <img src="/scissor1.png" alt="scissor1" class="rotate-[135deg] w-20 h-20 max-md:w-12 max-md:h-12" />
      <span class="text-white text-3xl font-bold max-md:text-2xl">BARBERS</span>
      <img src="/scissor1.png" alt="scissor1" class="rotate-[315deg] w-20 h-20 max-md:w-12 max-md:h-12" />
    </div>
    <div
      class="h-full pb-6 px-3 flex flex-wrap items-center justify-center gap-12 z-10 overflow-y-auto max-md:gap-10 max-md:hidden"
    >
      <div
        v-for="barber in barbers"
        :key="barber._id"
        class="h-[380px] w-[300px] relative items-center flex justify-center border-[1px] border-secondary cursor-pointer max-lg:h-[300px] max-lg:w-[250px]"
      >
        <div class="h-[80%] w-[80%] border-[1px] border-secondary" />
        <img
          :src="barber?.photo"
          alt="barberPhoto {{ barber.name }}"
          class="absolute -bottom-10 h-full w-full object-contain z-10 transition-transform duration-300 ease-in-out hover:scale-105"
        />
        <div class="absolute -bottom-2 flex flex-col gap-2 items-center z-20">
          <span class="text-3xl font-bold text-white max-md:text-xl">{{ barber.name }}</span>
          <span
            class="py-1 px-6 border-2 bg-primary border-white rounded-xl text-white hover:text-black hover:bg-white max-md:text-sm max-md:px-4"
            @click="navigateTo(`${barber._id}`)"
            >Book a visit</span
          >
        </div>
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
        class="barberSwiper"
      >
        <swiper-slide v-for="barber in barbers" :key="barber._id" class="swiper">
          <div
            class="w-[300px] h-[370px] relative items-center flex justify-center border-[1px] border-secondary cursor-pointer mt-6"
          >
            <div class="h-[80%] w-[80%] border-[1px] border-secondary" />
            <img
              :src="barber?.photo"
              alt="barberPhoto {{ barber.name }}"
              class="absolute -bottom-10 h-full w-full object-contain z-10 transition-transform duration-300 ease-in-out"
            />
            <div class="absolute -bottom-2 flex flex-col gap-2 items-center z-20">
              <span class="text-3xl font-bold text-white">{{ barber.name }}</span>
              <span
                class="py-1 px-6 border-2 bg-primary border-white rounded-xl text-white hover:text-black hover:bg-white"
                @click="navigateTo(`${barber._id}`)"
              >
                Book a visit
              </span>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <div class="absolute inset-0 flex justify-center items-center">
      <img src="/logobg.png" alt="logoBg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { onMounted, ref } from 'vue'
import client from '../../api/client'
import LoadingAnimation from './LoadingAnimation.vue'
import { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'
import type { Barber } from '@/types/types'

const router = useRouter()

const isLoading = ref<boolean>(false)
const barbers = ref<Barber[]>([])

const navigateTo = (id: string) => {
  router.push(`/barber/${id}`)
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

onMounted(() => {
  getBarbers()
})
</script>

<style>
.barberSwiper {
  width: 300px;
  height: 500px;
  padding: 25px 0;
}
</style>
