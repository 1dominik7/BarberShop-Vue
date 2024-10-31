<template>
  <div class="h-full w-full">
    <div class="h-full relative flex flex-col items-center gap-24 justify-center">
      <img class="w-full h-full object-contain xl:object-cover max-md:object-cover object-right" src="/homebgImg.png" alt="homeBgImg" />
      <img class="w-16 h-16 animated-scroll max-md:w-12 max-md:h-12" src="/scroll.png" alt="Scroll" />
      <div
        class="absolute bottom-64 flex items-center justify-between w-[90%] max-md:flex-col max-md:gap-5"
      >
        <div class="flex flex-col w-52 max-md:items-center">
          <span class="text-white text-xl font-bold">--Sanber Barber Shop</span>
          <span class="text-white text-4xl font-bold max-md:text-center">Where Men Get Ready</span>
        </div>
        <RouterLink
          v-if="!user"
          to="/register"
          class="border-2 border-secondary text-lg font-bold text-white py-2 px-10 cursor-pointer hover:bg-secondary hover:text-black"
          >SIGN UP</RouterLink
        >
        <div class="flex flex-col gap-4 max-md:items-center">
          <span class="text-white text-lg font-bold">Warsaw, Srebrna 11</span>
          <span class="text-white text-lg font-bold">+48 555 222 111</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
</script>

<style scoped>
.animated-scroll {
  animation: fadeInUp 2s ease-in-out infinite;
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
}
</style>
