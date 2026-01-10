<template>
  <div class="users-management">
    <div class="page-header">
      <div>
        <h1>Gestión de Usuarios</h1>
        <p>Administra los usuarios de la plataforma</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filter-group">
        <label>Rol:</label>
        <select v-model="filters.role">
          <option value="">Todos</option>
          <option value="affiliate">Afiliados</option>
          <option value="admin">Administradores</option>
          <option value="support">Soporte</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Estado:</label>
        <select v-model="filters.status">
          <option value="">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="suspended">Suspendidos</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Buscar:</label>
        <input v-model="searchQuery" type="text" placeholder="Nombre o email..." />
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-card">
      <div v-if="loading" class="loading">Cargando usuarios...</div>

      <div v-else-if="filteredUsers.length === 0" class="empty">
        No se encontraron usuarios
      </div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Plataformas</th>
              <th>Estado</th>
              <th>Código Referido</th>
              <th>Fecha Registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id">
              <td>
                <strong>{{ user.firstName }} {{ user.lastName }}</strong>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge">{{ translateRole(user.role) }}</span>
              </td>
              <td>
                <div class="platforms">
                  <span
                    v-for="platform in user.platforms"
                    :key="platform"
                    class="platform-tag"
                  >
                    {{ platform }}
                  </span>
                </div>
              </td>
              <td>
                <span :class="`status-badge ${user.status}`">
                  {{ translateStatus(user.status) }}
                </span>
              </td>
              <td>
                <code>{{ user.referralCode }}</code>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { User } from '@/shared/types/user'

const loading = ref(false)
const users = ref<User[]>([])
const searchQuery = ref('')
const filters = ref({
  role: '',
  status: ''
})

const filteredUsers = computed(() => {
  let result = [...users.value]

  if (filters.value.role) {
    result = result.filter((u) => u.role === filters.value.role)
  }

  if (filters.value.status) {
    result = result.filter((u) => u.status === filters.value.status)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (u) =>
        u.firstName.toLowerCase().includes(query) ||
        u.lastName.toLowerCase().includes(query) ||
        u.email.toLowerCase().includes(query)
    )
  }

  return result
})

async function loadUsers() {
  try {
    loading.value = true
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    users.value = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        lastLogin: data.lastLogin?.toDate?.() || null
      } as User
    })
  } catch (err) {
    console.error('Error loading users:', err)
  } finally {
    loading.value = false
  }
}

function translateRole(role: string): string {
  const translations: Record<string, string> = {
    affiliate: 'Afiliado',
    admin: 'Administrador',
    support: 'Soporte'
  }
  return translations[role] || role
}

function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    suspended: 'Suspendido'
  }
  return translations[status] || status
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.users-management {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: #2d3748;
}

.page-header p {
  margin: 0;
  color: #718096;
}

.filters-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.filter-group {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-size: 0.9rem;
  color: #4a5568;
  font-weight: 500;
}

.filter-group select,
.filter-group input {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f7fafc;
}

th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  font-size: 0.85rem;
  text-transform: uppercase;
}

td {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.role-badge {
  padding: 0.25rem 0.75rem;
  background: #e0e7ff;
  color: #3730a3;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.platforms {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.platform-tag {
  padding: 0.25rem 0.5rem;
  background: #f7fafc;
  border-radius: 6px;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #4a5568;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: #d1fae5;
  color: #065f46;
}

.status-badge.inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-badge.suspended {
  background: #fef3c7;
  color: #92400e;
}

code {
  padding: 0.25rem 0.5rem;
  background: #f7fafc;
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #667eea;
}

.loading,
.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}
</style>
