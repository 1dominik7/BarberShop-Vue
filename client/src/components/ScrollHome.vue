<template>
  <a href="#Home"
    class="fixed bottom-12 right-12 w-12 h-12 flex items-center justify-center rounded-full border-2 border-secondary cursor-pointer
     hover:bg-secondary group max-md:right-4 max-md:bottom-8 max-md:w-10 max-md:h-10"
  >
    <font-awesome-icon class="text-secondary group-hover:text-black" :icon="['fas', 'chevron-up']" />
  </a>
</template>

<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'

library.add(faChevronUp)
</script>

<style></style>
