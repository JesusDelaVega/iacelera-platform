<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4 md:p-8">
    <div class="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-2xl min-h-[600px]">
      <!-- Left Side - Info -->
      <div class="bg-gradient-to-br from-primary-500 to-secondary-500 p-8 lg:p-12 flex flex-col text-white relative">
        <button
          class="bg-white/20 text-white px-4 py-2 rounded-lg cursor-pointer text-sm self-start mb-8 hover:bg-white/30 transition-colors"
          @click="$router.push('/')"
        >
          ← Volver al Inicio
        </button>

        <div class="flex-1 flex flex-col justify-center items-center text-center">
          <PlatformLogo size="large" />
          <h1 class="text-4xl lg:text-5xl font-bold mt-6 mb-2">{{ platformName }}</h1>
          <p class="text-lg lg:text-xl mb-12 opacity-95">{{ tagline }}</p>

          <div class="flex flex-col gap-6 w-full max-w-sm">
            <div class="flex items-center gap-4 text-left">
              <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                ✓
              </span>
              <span class="text-base lg:text-lg">{{ feature1 }}</span>
            </div>
            <div class="flex items-center gap-4 text-left">
              <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                ✓
              </span>
              <span class="text-base lg:text-lg">{{ feature2 }}</span>
            </div>
            <div class="flex items-center gap-4 text-left">
              <span class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                ✓
              </span>
              <span class="text-base lg:text-lg">{{ feature3 }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Side - Forms -->
      <div class="p-8 lg:p-12 flex items-center justify-center bg-white">
        <LoginForm
          v-if="mode === 'login'"
          @show-register="mode = 'register'"
          @show-reset="mode = 'reset'"
        />

        <RegisterForm v-else-if="mode === 'register'" @show-login="mode = 'login'" />

        <ResetPasswordForm v-else-if="mode === 'reset'" @show-login="mode = 'login'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import RegisterForm from '@/components/auth/RegisterForm.vue'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm.vue'
import PlatformLogo from '@/components/shared/PlatformLogo.vue'

const mode = ref<'login' | 'register' | 'reset'>('login')

const platformName = computed(() => {
  const platformMode = import.meta.env.VITE_PLATFORM_MODE
  return platformMode === 'iacelera' ? 'iAcelera' : 'IFEDEM'
})

const tagline = computed(() => {
  const platformMode = import.meta.env.VITE_PLATFORM_MODE
  return platformMode === 'iacelera'
    ? 'Impulsa tu éxito emprendedor'
    : 'Educación de excelencia para todos'
})

const feature1 = computed(() => {
  const platformMode = import.meta.env.VITE_PLATFORM_MODE
  return platformMode === 'iacelera'
    ? 'Sistema de recompensas multinivel'
    : 'Cursos certificados de calidad'
})

const feature2 = computed(() => {
  const platformMode = import.meta.env.VITE_PLATFORM_MODE
  return platformMode === 'iacelera'
    ? 'Comisiones ilimitadas'
    : 'Aprende a tu propio ritmo'
})

const feature3 = computed(() => {
  const platformMode = import.meta.env.VITE_PLATFORM_MODE
  return platformMode === 'iacelera'
    ? 'Red de emprendedores activa'
    : 'Acceso a expertos de la industria'
})
</script>
