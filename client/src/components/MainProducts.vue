<template>
  <div class="h-full w-full flex items-center justify-between">
    <div class="h-full">
      <img src="/pattern1.png" alt="" class="h-full max-md:hidden" />
    </div>
    <div
      class="h-full w-full relative flex flex-col items-center bg-white overflow-hidden max-md:px-6"
    >
      <div
        class="flex pt-10 items-center pb-6 w-[400px] justify-between z-10 max-md:w-max max-md:pt-4 max-md:gap-4"
      >
        <img src="/cleaning-spray.png" alt="" class="w-16 h-16 max-md:w-12 max-md:h-12" />
        <span class="text-3xl font-bold max-md:text-2xl">PRODUCTS</span>
        <img
          src="/cleaning-spray.png"
          alt=""
          class="w-16 h-16 scale-x-[-1] max-md:w-12 max-md:h-12"
        />
      </div>
      <div class="flex flex-col gap-6 items-center mt-6 max-md:px-2">
        <span class="text-3xl font-bold max-md:text-2xl">Brand We Use</span>
        <span class="text-center">You can buy products from these companies in our store</span>
      </div>
      <div
        class="flex flex-wrap justify-center items-center gap-12 mt-12 overflow-y-scroll px-2 max-lg:gap-6 max-md:hidden"
      >
        <img
          v-for="(logo, index) in logos"
          :key="index"
          :src="logo.src"
          :alt="logo.alt"
          class="flex-1 w-52 h-52 object-contain max-lg:w-32 max-lg:h-32 max-md:w-20 max-md:h-20"
        />
      </div>
      <div class="hidden max-md:flex">
        <swiper
          :modules="[Navigation, Pagination, Scrollbar, A11y, Autoplay]"
          style="
            --swiper-pagination-color: lightgray;
            --swiper-pagination-bullet-inactive-color: gray;
            --swiper-pagination-bullet-size: 14px;
          "
          :spaceBetween="20"
          :slidesPerView="2"
          :slidesPerGroup="2"
          pagination
          :loop="true"
          :autoplay="true"
          class="productSwiper"
        >
          <swiper-slide v-for="(logo, index) in logos" :key="index" class="swiper">
            <div>
              <img :src="logo.src" :alt="logo.alt" class="w-40 h-40 object-contain" />
            </div>
          </swiper-slide>
        </swiper>
      </div>
    </div>
    <div class="h-full">
      <img src="/pattern1.png" alt="" class="h-full max-md:hidden" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Swiper as SwiperType } from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/scrollbar'

const logos = [
  { src: '/hordelogo.png', alt: 'Horde Logo' },
  { src: '/zewlogo.png', alt: 'Zew Logo' },
  { src: '/amercianCrewlogo.png', alt: 'American Crew Logo' },
  { src: '/capitanfawcettslogo.png', alt: "Captain Fawcett's Logo" },
  { src: '/pandrawlogo.png', alt: 'Pandraw Logo' },
  { src: '/reuzellogo.png', alt: 'Reuzel Logo' },
  { src: '/upercutlogo.png', alt: 'Upercut Logo' }
]
</script>

<style>
.productSwiper {
  width: 300px;
  height: 300px;
  padding: 25px 0;
}
</style>
