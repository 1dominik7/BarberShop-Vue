<template>
  <div class="h-full max-w-full relative flex flex-col items-center justify-between">
    <div class="flex flex-col items-center justify-between">
      <div class="relative w-full rounded-b-xl">
        <div class="absolute top-12 left-6 z-40 max-md:top-2 max-md:left-8 ">
          <div class="relative w-56 h-56 flex items-center justify-center">
            <img
              src="/compass1.png"
              alt="compassImg1"
              class="compass1 absolute right-[37px] top-[38px] w-36 h-36 max-md:top-[23px] max-md:w-16 max-md:h-16 max-md:left-[25px]"
            />
            <img
              src="/compass2.png"
              alt="compassImg2"
              class="compass2 absolute w-56 h-56 max-md:w-28 max-md:h-28 max-md:left-0 max-md:top-0"
            />
          </div>
        </div>
          <LeafletMap :center="center" :zoom="15" :markers="markers"/>
      </div>
      <div
        class="w-full flex items-center py-12 px-24 gap-24 max-lg:gap-0 max-lg:justify-between max-md:px-6 max-md:justify-around max-md:py-6"
      >
        <img
          src="/logo1.png"
          alt="logoImg1"
          class="w-64 h-64 gap-6 max-lg:h-48 max-lg:w-48 max-md:w-24 max-md:h-24"
        />
        <div class="h-full w-[50%] flex flex-col justify-between">
          <div class="flex items-center justify-between gap-24 max-md:gap-12">
            <div class="h-full flex flex-col">
              <span class="text-2xl text-white font-bold max-md:text-lg">BARBERSHOP SANBER</span>
              <span class="text-lg font-bold text-white mt-4 max-md:text-base max-md:mt-2">ul. Srebrna 11</span>
              <span class="text-lg font-bold text-white max-md:text-base">00-810 Warszawa</span>
              <span class="text-lg font-bold text-white mt-4 max-md:text-base max-md:mt-2"
                >+48 555 222 111</span
              >
              <span class="text-lg font-bold text-white max-md:text-base">info@sanbarber.pl</span>
            </div>
            <div class="h-full flex flex-col gap-1 max-md:hidden">
              <span class="text-2xl text-white font-bold max-md:text-lg">Menu</span>
              <a
                href="#Services"
                class="text-lg font-bold text-white mt-4 cursor-pointer hover:text-secondary max-md:text-base"
                >Services</a
              >
              <a
                href="#Barbers"
                class="text-lg font-bold text-white cursor-pointer hover:text-secondary max-md:text-base"
                >Barbers</a
              >
              <a
                href="#Products"
                class="text-lg font-bold text-white cursor-pointer hover:text-secondary max-md:text-base"
                >Products</a
              >
              <a
                href="#Location"
                class="text-lg font-bold text-white cursor-pointer hover:text-secondary max-md:text-base"
                >Location</a
              >
            </div>
          </div>
          <div
            class="w-72 flex justify-between items-center max-md:w-46 max-md:mt-2 max-md:w-0 max-md:gap-6"
          >
            <a class="animated-border max-md:hidden" href="https://www.facebook.com" target="_blank"
              >facebook</a
            >
            <font-awesome-icon
              :icon="['fab', 'facebook']"
              class="hidden text-white text-3xl max-md:flex cursor-pointer"
            />
            <a
              class="animated-border max-md:hidden"
              href="https://www.instagram.com"
              target="_blank"
              >instagram</a
            >
            <font-awesome-icon
              :icon="['fab', 'instagram']"
              class="hidden text-white text-3xl max-md:flex cursor-pointer"
            />

            <a class="animated-border max-md:hidden" href="https://www.youtube.com" target="_blank"
              >youtube</a
            >
            <font-awesome-icon
              :icon="['fab', 'youtube']"
              class="hidden text-white text-3xl max-md:flex cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
    <MainFooter />
  </div>
</template>

<script setup lang="ts">
import MainFooter from '@/components/MainFooter.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { fab } from '@fortawesome/free-brands-svg-icons'
import LeafletMap from './LeafletMap.vue'

library.add(fab)

const center: [number, number] = [51.505, -0.09];
const markers: { position: [number, number] }[] = [
  { position: [52.2268452, -0.09] },
  { position: [20.9881006, -0.1] },
];  

</script>

<style>
.animated-border {
  position: relative;
  color: white;
  font-weight: bold;
  font-size: 1.125rem;
  cursor: pointer;
  border-bottom: 1px solid white;
}

.animated-border::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: white;
  transition: width 0.3s ease-in-out;
}

.animated-border:hover::after {
  width: 100%;
}

@keyframes smoothRotate {
  0% {
    transform: rotate(45deg);
  }
  50% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(45deg);
  }
}

@keyframes smoothRotateReverse {
  0% {
    transform: rotate(-45deg);
  }
  50% {
    transform: rotate(45deg);
  }
  100% {
    transform: rotate(-45deg);
  }
}

.compass1 {
  animation: smoothRotate 2s ease-in-out infinite;
}

.compass2 {
  animation: smoothRotateReverse 2s ease-in-out infinite;
}
</style>
