<template>
  <div class="dashboard">
    <div class="container">
      <header class="dashboard-header">
        <div class="welcome">
          <PlatformLogo size="small" />
          <h1>¡Bienvenido, {{ userStore.fullName || 'Usuario' }}!</h1>
        </div>
        <button class="btn-logout" @click="handleLogout">Cerrar Sesión</button>
      </header>

      <div v-if="userStore.loading" class="loading">
        Cargando...
      </div>

      <div v-else-if="userStore.user" class="dashboard-content">
        <div class="info-card">
          <h2>Información de tu Cuenta</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Email:</label>
              <span>{{ userStore.user.email }}</span>
            </div>
            <div class="info-item">
              <label>Plataforma:</label>
              <span class="badge">{{ userStore.user.platform?.toUpperCase() }}</span>
            </div>
            <div class="info-item">
              <label>Rol:</label>
              <span class="badge">{{ userStore.user.role }}</span>
            </div>
            <div class="info-item">
              <label>Código de Referido:</label>
              <span class="code">{{ userStore.user.referralCode }}</span>
            </div>
            <div class="info-item">
              <label>Estado:</label>
              <span :class="`status-${userStore.user.status}`">
                {{ userStore.user.status }}
              </span>
            </div>
          </div>
        </div>

        <div v-if="userStore.affiliateProfile" class="info-card">
          <h2>Perfil de Afiliado</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-value">{{ userStore.affiliateProfile.currentRank }}</div>
              <div class="stat-label">Rango Actual</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ userStore.affiliateProfile.totalReferrals }}</div>
              <div class="stat-label">Total Referidos</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${{ userStore.affiliateProfile.availableBalance.toFixed(2) }}</div>
              <div class="stat-label">Balance Disponible</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">${{ userStore.affiliateProfile.totalEarnings.toFixed(2) }}</div>
              <div class="stat-label">Total Ganado</div>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h2>Acciones Rápidas</h2>
          <div class="actions-grid">
            <button class="action-btn" disabled>
              <span>📊</span>
              <span>Ver Red</span>
            </button>
            <button class="action-btn" disabled>
              <span>💰</span>
              <span>Comisiones</span>
            </button>
            <button class="action-btn" @click="router.push('/products')">
              <span>🛒</span>
              <span>Productos</span>
            </button>
            <button class="action-btn" disabled>
              <span>👥</span>
              <span>Referidos</span>
            </button>
          </div>
          <p class="note">Panel completo próximamente...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuth } from '@/shared/composables/useAuth'
import PlatformLogo from '@/components/shared/PlatformLogo.vue'

const router = useRouter()
const userStore = useUserStore()
const { logout } = useAuth()

onMounted(() => {
  if (!userStore.user) {
    router.push('/auth')
  }
})

async function handleLogout() {
  try {
    await logout()
    router.push('/auth')
  } catch (err) {
    console.error('Logout error:', err)
  }
}
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.welcome h1 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.btn-logout {
  padding: 0.5rem 1.5rem;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-logout:hover {
  background: #c82333;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-card h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.info-item span {
  color: #333;
  font-size: 1rem;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #0066cc;
  color: white;
  border-radius: 4px;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.code {
  font-family: monospace;
  font-size: 1.1rem;
  font-weight: bold;
  color: #0066cc;
}

.status-active {
  color: #28a745;
  font-weight: 600;
  text-transform: uppercase;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  text-align: center;
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #0066cc;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

.quick-actions h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem;
  background: white;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:not(:disabled):hover {
  border-color: #0066cc;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.action-btn span:first-child {
  font-size: 2rem;
}

.action-btn span:last-child {
  font-weight: 500;
  color: #333;
}

.note {
  text-align: center;
  color: #999;
  font-style: italic;
  margin: 1rem 0 0 0;
}
</style>
