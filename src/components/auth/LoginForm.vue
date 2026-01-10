<template>
  <div class="login-form">
    <div class="form-header">
      <PlatformLogo size="large" class="logo" />
      <h2>Iniciar Sesión</h2>
      <p>Accede a tu cuenta de {{ platformName }}</p>
    </div>

    <form @submit.prevent="handleLogin">
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
        <label for="password">Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="••••••••"
          required
          :disabled="loading"
        />
      </div>

      <div class="form-actions">
        <button type="button" class="link-button" @click="$emit('show-reset')">
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
      </button>
    </form>

    <div class="form-footer">
      <p>
        ¿No tienes cuenta?
        <button type="button" class="link-button" @click="$emit('show-register')">
          Regístrate aquí
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
  'show-register': []
  'show-reset': []
}>()

const router = useRouter()
const { login, loading, error } = useAuth()

const form = ref({
  email: '',
  password: ''
})

const platformName = computed(() => {
  const mode = import.meta.env.VITE_PLATFORM_MODE
  return mode === 'iacelera' ? 'iAcelera' : 'IFEDEM'
})

async function handleLogin() {
  try {
    await login(form.value.email, form.value.password)
    // Redirect to dashboard after successful login
    router.push('/dashboard')
  } catch (err) {
    // Error is handled by useAuth
    console.error('Login error:', err)
  }
}
</script>

<style scoped>
.login-form {
  max-width: 400px;
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

.form-actions {
  margin-bottom: 1rem;
  text-align: right;
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
</style>
