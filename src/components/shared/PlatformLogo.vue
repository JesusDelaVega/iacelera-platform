<template>
  <div class="platform-logo">
    <img :src="logoUrl" :alt="`${platformName} Logo`" :class="sizeClass" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'small' | 'medium' | 'large'
  platform?: 'iacelera' | 'ifedem'
}

const props = withDefaults(defineProps<Props>(), {
  size: 'medium',
  platform: undefined
})

const currentPlatform = computed(() => {
  // Use prop platform if provided, otherwise use env variable
  return props.platform || (import.meta.env.VITE_PLATFORM_MODE as 'iacelera' | 'ifedem')
})

const logoUrl = computed(() => {
  // Logos should be in /public/logos/
  return currentPlatform.value === 'iacelera'
    ? '/logos/iacelera-logo.jpg'
    : '/logos/ifedem-logo.jpg'
})

const platformName = computed(() => {
  return currentPlatform.value === 'iacelera' ? 'iAcelera' : 'IFEDEM'
})

const sizeClass = computed(() => `logo-${props.size}`)
</script>

<style scoped>
.platform-logo {
  display: inline-block;
}

.platform-logo img {
  display: block;
  max-width: 100%;
  height: auto;
}

.logo-small {
  max-height: 40px;
}

.logo-medium {
  max-height: 80px;
}

.logo-large {
  max-height: 150px;
}
</style>
