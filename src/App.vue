<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onMounted(() => {
  // Initialize auth listener
  userStore.initAuthListener()
})
</script>

<template>
  <RouterView />
</template>
