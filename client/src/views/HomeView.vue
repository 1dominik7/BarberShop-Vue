<template>
  <div class="scroll-container">
    <section id="Home" class="h-full bg-primary section px-6 lg:px-24 xl:px-52 max-md:px-2">
      <MainHome />
    </section>
    <section id="Services" class="h-full bg-primary section max-md:px-2">
      <MainServices />
    </section>
    <section id="Barbers" class="h-full px-52 bg-primary max-lg:px-24 section max-md:px-2">
      <MainBarbers />
    </section>
    <section id="Products" class="h-full px-52 bg-primary max-lg:px-24 section max-md:px-0">
      <MainProducts />
    </section>
    <section id="Location" class="h-full bg-primary max-lg:px-24 section max-md:px-2">
      <MainLocation />
    </section>
    <ScrollHome />
  </div>
</template>

<script setup lang="ts">
import MainBarbers from '@/components/MainBarbers.vue'
import MainHome from '@/components/MainHome.vue'
import MainLocation from '@/components/MainLocation.vue'
import MainProducts from '@/components/MainProducts.vue'
import ScrollHome from '@/components/ScrollHome.vue'
import MainServices from '@/components/MainServices.vue'
</script>

<style scoped>
.scroll-container {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
  scroll-behavior: smooth;
  height: 100%;
}

.section {
  scroll-snap-align: start;
}
</style>
