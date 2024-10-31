<template>
  <div
    class="py-4 flex justify-between items-center bg-primary h-62 px-6 lg:px-24 xl:px-52 max-md:hidden"
  >
    <div class="w-4 h-4 bg-secondary rounded-full max-md:hidden"></div>
    <a
      href="#Services"
      class="flex flex-col items-center p-4 cursor-pointer"
      @mouseover="isHoveredService = true"
      @mouseleave="isHoveredService = false"
      @click.prevent="navigateToSection('#Services')"
    >
      <img
        class="w-12 h-12 pb-2 bg-transparent"
        :src="isHoveredService ? '/haircut1.gif' : '/haircut.png'"
        alt="serviceIcon"
      />
      <span class="font-bold text-white">Services</span>
    </a>
    <a
      href="#Barbers"
      class="flex flex-col items-center p-4 cursor-pointer"
      @mouseover="isHoveredBarbers = true"
      @mouseleave="isHoveredBarbers = false"
      @click.prevent="navigateToSection('#Barbers')"
    >
      <img
        class="w-12 h-12 pb-2"
        :src="isHoveredBarbers ? '/moustache.gif' : '/moustache.png'"
      alt="barberIcon"
      />
      <span class="font-bold text-white">Barbers</span>
    </a>
    <div class="flex flex-col items-center p-4">
      <img class="w-20 h-20 pb-2" src="/logo1.png" alt="logoImg" />
      <RouterLink
        v-if="!user"
        class="font-bold text-white border-2 border-secondary py-1 px-4 cursor-pointer hover:bg-secondary"
        to="/login"
        >SIGN IN</RouterLink
      >
      <RouterLink
        v-else
        class="font-bold text-white border-2 border-secondary py-1 px-4 cursor-pointer hover:bg-secondary"
        to="/profile/dashboard"
        >PROFILE</RouterLink
      >
    </div>
    <a
      href="#Products"
      class="flex flex-col items-center p-4 cursor-pointer"
      @mouseover="isHoveredProducts = true"
      @mouseleave="isHoveredProducts = false"
      @click.prevent="navigateToSection('#Products')"
    >
      <img
        class="w-12 h-12 pb-2"
        :src="isHoveredProducts ? '/cleaning-spray.gif' : '/cleaning-spray.png' "
     alt="productsIcon"
      />
      <span class="font-bold text-white">Products</span>
    </a>
    <a
      href="#Location"
      class="flex flex-col items-center p-4 cursor-pointer"
      @mouseover="isHoveredLocation = true"
      @mouseleave="isHoveredLocation = false"
      @click.prevent="navigateToSection('#Location')"
    >
      <img class="w-12 h-12 pb-2" :src="isHoveredLocation ? '/pin.gif' : '/pin.png'"         alt="locationIcon" />
      <span class="font-bold text-white">Location</span>
    </a>
    <div class="w-4 h-4 bg-secondary rounded-full max-md:hidden"></div>
  </div>
  <div class="hidden max-md:flex relative">
    <MainNavbarMobile />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, nextTick, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MainNavbarMobile from './MainNavbarMobile.vue'

const isHoveredService = ref<Boolean>(false)
const isHoveredBarbers = ref<Boolean>(false)
const isHoveredProducts = ref<Boolean>(false)
const isHoveredLocation = ref<Boolean>(false)

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const user = computed(() => authStore.user)

const navigateToSection = async (hash: string) => {
  if (route.path === '/') {
    scrollToSection(hash)
  } else {
    await router.push({ path: '/', hash })
    await nextTick()
    scrollToSection(hash)
  }
}

const scrollToSection = (hash: string) => {
  const element = document.querySelector(hash)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style></style>
