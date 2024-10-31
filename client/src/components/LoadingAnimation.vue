<template>
  <div ref="lottieContainer" class="lottie-animation"></div>
</template>

<script setup lang="ts">
import AnimationLoading from '../../animation/AnimationLoading.json'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import lottie, { type AnimationItem } from 'lottie-web'

const lottieContainer = ref<HTMLDivElement | null>(null)
let lottieInstance: AnimationItem | null = null

onMounted(() => {
  if (lottieContainer.value) {
    lottieInstance = lottie.loadAnimation({
      container: lottieContainer.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: AnimationLoading
    })

    lottieInstance.setSpeed(1)
  }
})

onBeforeUnmount(() => {
  if (lottieInstance) {
    lottieInstance.destroy()
  }
})
</script>

<style scoped>
.lottie-animation {
  width: 300px;
  height: 300px;
}
</style>
