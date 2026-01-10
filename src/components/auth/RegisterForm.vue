<template>
  <div class="register-form">
    <div class="form-header">
      <PlatformLogo size="large" class="logo" />
      <h2>Crear Cuenta</h2>
      <p>Únete a {{ platformName }}</p>
    </div>

    <form @submit.prevent="handleRegister">
      <div class="form-row">
        <div class="form-group">
          <label for="firstName">Nombre</label>
          <input
            id="firstName"
            v-model="form.firstName"
            type="text"
            placeholder="Juan"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Apellido</label>
          <input
            id="lastName"
            v-model="form.lastName"
            type="text"
            placeholder="Pérez"
            required
            :disabled="loading"
          />
        </div>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="tu@email.com"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="phone">Teléfono (opcional)</label>
        <input
          id="phone"
          v-model="form.phone"
          type="tel"
          placeholder="+52 123 456 7890"
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          required
          minlength="6"
          :disabled="loading"
        />
        <small>Mínimo 6 caracteres</small>
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirmar Contraseña</label>
        <input
          id="confirmPassword"
          v-model="form.confirmPassword"
          type="password"
          placeholder="••••••••"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-group">
        <label for="referralCode">Código de Referido (opcional)</label>
        <input
          id="referralCode"
          v-model="form.referralCode"
          type="text"
          placeholder="ABC1234"
          :disabled="loading"
        />
        <small>Si alguien te invitó, ingresa su código aquí</small>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="btn-primary" :disabled="loading || !isValid">
        {{ loading ? 'Creando cuenta...' : 'Crear Cuenta' }}
      </button>
    </form>

    <div class="form-footer">
      <p>
        ¿Ya tienes cuenta?
        <button type="button" class="link-button" @click="$emit('show-login')">
          Inicia sesión aquí
        </button>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/shared/composables/useAuth'
import PlatformLogo from '@/components/shared/PlatformLogo.vue'

const emit = defineEmits<{
  'show-login': []
}>()

const router = useRouter()
const { register, loading, error } = useAuth()

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  referralCode: ''
})

const platformName = computed(() => {
  const mode = import.meta.env.VITE_PLATFORM_MODE
  return mode === 'iacelera' ? 'iAcelera' : 'IFEDEM'
})

const platform = computed(() => {
  return import.meta.env.VITE_PLATFORM_MODE as 'iacelera' | 'ifedem'
})

const isValid = computed(() => {
  return (
    form.value.firstName &&
    form.value.lastName &&
    form.value.email &&
    form.value.password &&
    form.value.password === form.value.confirmPassword
  )
})

async function handleRegister() {
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }

  try {
    const result = await register(form.value.email, form.value.password, {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      phone: form.value.phone || undefined,
      platform: platform.value,
      referralCode: form.value.referralCode || undefined
    })

    // Check if user joined a new platform
    if ((result as any).isNewPlatform) {
      alert(`¡Bienvenido a ${platformName.value}! Has sido agregado exitosamente.`)
    }

    // Redirect to dashboard after successful registration
    router.push('/dashboard')
  } catch (err) {
    // Error is handled by useAuth
    console.error('Registration error:', err)
  }
}
</script>

<style scoped>
.register-form {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header .logo {
  margin-bottom: 1.5rem;
}

.form-header h2 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.form-header p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #0066cc;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.error-message {
  padding: 0.75rem;
  background: #fee;
  color: #c00;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #0052a3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: #666;
  font-size: 0.9rem;
}

.form-footer p {
  margin: 0;
}

.link-button {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;
}

.link-button:hover {
  color: #0052a3;
}
</style>
