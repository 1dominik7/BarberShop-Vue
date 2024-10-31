<template>
  <div class="w-full bg-primary h-62 px-6 lg:px-24 xl:px-52 overflow-x-hidden">
    <div class="w-full py-8 flex justify-between items-center">
      <div class="w-12 h-12 max-sm:hidden"></div>
      <div class="flex flex-col items-center">
        <img class="w-20 h-20 pb-2" src="/logo1.png" alt="" />
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
      <button class="lg:hidden text-white" @click="toggleNavbar">
        <svg
          class="w-12 h-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="3"
            d="M4 6h16M4 12h16m-7 6h7"
          />
        </svg>
      </button>
    </div>
    <div
      :class="['navbar', { visible: isNavbarOpen }]"
      class="flex justify-center flex-col z-50 bg-secondary transition"
    >
      <nav class="flex flex-col gap-6 lg:flex-row bg-secondary">
        <MainNavItem
          href="#Services"
          icon="haircut"
          label="Services"
          @click.prevent="navigateToSection('#Services')"
        />
        <MainNavItem
          href="#Barbers"
          icon="moustache"
          label="Barbers"
          @click.prevent="navigateToSection('#Barbers')"
        />
        <MainNavItem
          href="#Products"
          icon="cleaning-spray"
          label="Products"
          @click.prevent="navigateToSection('#Products')"
        />
        <MainNavItem
          href="#Location"
          icon="pin"
          label="Location"
          @click.prevent="navigateToSection('#Location')"
        />
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { computed, nextTick, ref } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import MainNavItem from './MainNavItem.vue'

const isNavbarOpen = ref(false)

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

const toggleNavbar = () => {
  if (isNavbarOpen.value) {
    setTimeout(() => {
      isNavbarOpen.value = false
    }, 200)
  } else {
    isNavbarOpen.value = true
  }
}

const scrollToSection = (hash: string) => {
  const element = document.querySelector(hash)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<style>

.navbar {
  height: calc(100vh - 180px);
  width: 320px;
  position: absolute;
  flex-direction: column;
  right: -320px;
  padding: 30px 0px;
  opacity: 0;
  visibility: hidden;
  transition:
    right 0.7s ease-in-out,
    opacity 0.7s ease-in-out    
}

.navbar.visible {
  opacity: 1;
  right: 0px;
  visibility: visible;
}
</style>
