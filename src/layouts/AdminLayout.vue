<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ collapsed: sidebarCollapsed }">
      <div class="sidebar-header">
        <PlatformLogo size="small" />
        <h2 v-if="!sidebarCollapsed">Admin Panel</h2>
        <button class="collapse-btn" @click="toggleSidebar">
          {{ sidebarCollapsed ? '→' : '←' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <router-link to="/admin" class="nav-item" exact-active-class="active">
          <span class="nav-icon">📊</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Dashboard</span>
        </router-link>

        <router-link to="/admin/products" class="nav-item" active-class="active">
          <span class="nav-icon">📦</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Productos</span>
        </router-link>

        <router-link to="/admin/orders" class="nav-item" active-class="active">
          <span class="nav-icon">🛒</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Órdenes</span>
        </router-link>

        <router-link to="/admin/users" class="nav-item" active-class="active">
          <span class="nav-icon">👥</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Usuarios</span>
        </router-link>

        <router-link to="/admin/commissions" class="nav-item" active-class="active">
          <span class="nav-icon">💰</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Comisiones</span>
        </router-link>

        <router-link to="/admin/reports" class="nav-item" active-class="active">
          <span class="nav-icon">📈</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Reportes</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item" @click="goToDashboard">
          <span class="nav-icon">🏠</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Ver Sitio</span>
        </button>

        <button class="nav-item logout" @click="handleLogout">
          <span class="nav-icon">🚪</span>
          <span v-if="!sidebarCollapsed" class="nav-label">Cerrar Sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="admin-main">
      <!-- Top Bar -->
      <header class="admin-header">
        <div class="header-left">
          <h1>{{ pageTitle }}</h1>
        </div>

        <div class="header-right">
          <span class="platform-badge">{{ platformName }}</span>
          <div class="user-info">
            <span class="user-name">{{ userStore.fullName }}</span>
            <span class="user-role">{{ userStore.user?.role }}</span>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="admin-content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAuth } from '@/shared/composables/useAuth'
import PlatformLogo from '@/components/shared/PlatformLogo.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const { logout } = useAuth()

const sidebarCollapsed = ref(false)

const platformName = computed(() => {
  const mode = import.meta.env.VITE_PLATFORM_MODE
  return mode === 'iacelera' ? 'iAcelera' : 'IFEDEM'
})

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/admin': 'Dashboard',
    '/admin/products': 'Gestión de Productos',
    '/admin/orders': 'Gestión de Órdenes',
    '/admin/users': 'Gestión de Usuarios',
    '/admin/commissions': 'Comisiones',
    '/admin/reports': 'Reportes'
  }
  return titles[route.path] || 'Admin Panel'
})

function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

function goToDashboard() {
  router.push('/dashboard')
}

async function handleLogout() {
  if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
    await logout()
    router.push('/auth')
  }
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}

/* Sidebar */
.admin-sidebar {
  width: 260px;
  background: #2d3748;
  color: white;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  position: fixed;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 100;
}

.admin-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 1.25rem;
  white-space: nowrap;
}

.collapse-btn {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.collapse-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
}

.collapsed .nav-item {
  justify-content: center;
  padding: 1rem;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border-left: 3px solid #667eea;
}

.nav-icon {
  font-size: 1.25rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-label {
  white-space: nowrap;
  font-size: 0.95rem;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem 0;
}

.nav-item.logout {
  color: #fc8181;
}

.nav-item.logout:hover {
  background: rgba(252, 129, 129, 0.1);
}

/* Main Content */
.admin-main {
  flex: 1;
  margin-left: 260px;
  transition: margin-left 0.3s;
  display: flex;
  flex-direction: column;
}

.admin-sidebar.collapsed + .admin-main {
  margin-left: 80px;
}

/* Header */
.admin-header {
  background: white;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #2d3748;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.platform-badge {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 600;
  color: #2d3748;
}

.user-role {
  font-size: 0.85rem;
  color: #718096;
  text-transform: capitalize;
}

/* Content */
.admin-content {
  flex: 1;
  padding: 2rem;
}

/* Responsive */
@media (max-width: 968px) {
  .admin-sidebar {
    width: 80px;
  }

  .admin-sidebar.collapsed {
    width: 0;
    overflow: hidden;
  }

  .admin-main {
    margin-left: 80px;
  }

  .admin-sidebar.collapsed + .admin-main {
    margin-left: 0;
  }

  .sidebar-header h2,
  .nav-label {
    display: none;
  }

  .collapse-btn {
    display: none;
  }
}

@media (max-width: 640px) {
  .admin-header {
    padding: 1rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .header-right {
    width: 100%;
    justify-content: space-between;
  }

  .admin-content {
    padding: 1rem;
  }
}
</style>
