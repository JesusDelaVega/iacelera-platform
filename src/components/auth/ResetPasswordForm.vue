<template>
  <div class="reset-form">
    <div class="form-header">
      <PlatformLogo size="large" class="logo" />
      <h2>Recuperar Contraseña</h2>
      <p>Te enviaremos un link para resetear tu contraseña</p>
    </div>

    <form v-if="!success" @submit.prevent="handleReset">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model="email"
          type="email"
          placeholder="tu@email.com"
          required
          :disabled="loading"
        />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="btn-primary" :disabled="loading">
        {{ loading ? 'Enviando...' : 'Enviar Link de Recuperación' }}
      </button>
    </form>

    <div v-else class="success-message">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M5 13l4 4L19 7"
        />
      </svg>
      <h3>¡Email enviado!</h3>
      <p>Revisa tu bandeja de entrada y sigue las instrucciones para resetear tu contraseña.</p>
    </div>

    <div class="form-footer">
      <button type="button" class="link-button" @click="$emit('show-login')">
        ← Volver al inicio de sesión
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/shared/composables/useAuth'
import PlatformLogo from '@/components/shared/PlatformLogo.vue'

defineEmits<{
  'show-login': []
}>()

const { resetPassword, loading, error } = useAuth()
const email = ref('')
const success = ref(false)

async function handleReset() {
  try {
    await resetPassword(email.value)
    success.value = true
  } catch (err) {
    // Error is handled by useAuth
    console.error('Reset password error:', err)
  }
}
</script>

<style scoped>
.reset-form {
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

.error-message {
  padding: 0.75rem;
  background: #fee;
  color: #c00;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.success-message {
  text-align: center;
  padding: 2rem 0;
}

.success-message svg {
  width: 64px;
  height: 64px;
  color: #0a0;
  margin: 0 auto 1rem;
}

.success-message h3 {
  margin: 0 0 1rem 0;
  color: #0a0;
}

.success-message p {
  margin: 0;
  color: #666;
  line-height: 1.6;
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
}

.link-button {
  background: none;
  border: none;
  color: #0066cc;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: none;
}

.link-button:hover {
  text-decoration: underline;
}
</style>
