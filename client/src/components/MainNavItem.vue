<template>
  <a
    :href="href"
    class="flex flex-col items-center p-4 cursor-pointer"
    @click="onClick"
  >
    <img class="w-16 h-16 pb-2" :src="`/${icon}.png`" alt="" />
    <span class="font-bold text-black">{{ label }}</span>
  </a>
</template>

<script setup lang="ts">
interface NavItemProps {
  href: string
  icon: string
  label: string
  onClick: () => void
}

const { href, icon, label,onClick } = defineProps<NavItemProps>()
</script>
