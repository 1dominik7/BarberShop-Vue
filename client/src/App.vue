<template>
  <div class="h-screen flex flex-col overflow-hidden">
    <MainNavbar v-if="!$route.meta.hideNavbar" />
    <div class="flex-1 overflow-y-auto">
    <RouterView />
  </div>
  </div>
</template>

<script setup lang="ts">
import MainNavbar from './components/MainNavbar.vue'

</script>
<style scoped>
</style>
