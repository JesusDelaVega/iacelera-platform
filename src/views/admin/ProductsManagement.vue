<template>
  <div class="products-management">
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1>Gestión de Productos</h1>
        <p>Administra los productos de {{ platformName }}</p>
      </div>
      <button class="btn-primary" @click="showCreateModal = true">
        ➕ Crear Producto
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filter-group">
        <label>Estado:</label>
        <select v-model="filters.status">
          <option value="">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="draft">Borrador</option>
          <option value="out_of_stock">Agotados</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Tipo:</label>
        <select v-model="filters.type">
          <option value="">Todos</option>
          <option value="physical">Físico</option>
          <option value="digital">Digital</option>
          <option value="membership">Membresía</option>
          <option value="course">Curso</option>
          <option value="bundle">Paquete</option>
          <option value="starter_kit">Kit Inicial</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Buscar:</label>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Nombre o SKU..."
        />
      </div>
    </div>

    <!-- Products Table -->
    <div class="table-card">
      <div v-if="productStore.loading" class="loading">Cargando productos...</div>

      <div v-else-if="filteredProducts.length === 0" class="empty">
        No se encontraron productos
      </div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>SKU</th>
              <th>Precio</th>
              <th>BV</th>
              <th>Estado</th>
              <th>Plataforma</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in filteredProducts" :key="product.id">
              <td>
                <div class="product-cell">
                  <img
                    :src="product.thumbnail || product.images[0] || '/placeholder.jpg'"
                    :alt="product.name"
                    class="product-thumb"
                  />
                  <div>
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-type">{{ translateType(product.type) }}</div>
                  </div>
                </div>
              </td>
              <td>{{ product.sku }}</td>
              <td>${{ product.price.toFixed(2) }}</td>
              <td>{{ product.bv }}</td>
              <td>
                <span :class="`status-badge ${product.status}`">
                  {{ translateStatus(product.status) }}
                </span>
              </td>
              <td>
                <span class="platform-badge">{{ product.platform }}</span>
              </td>
              <td>
                <div class="actions">
                  <button
                    class="btn-icon"
                    @click="editProduct(product)"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    class="btn-icon danger"
                    @click="deleteProduct(product)"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <ProductModal
      v-if="showCreateModal || showEditModal"
      :product="editingProduct"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductModal from '@/components/admin/ProductModal.vue'
import type { Product } from '@/shared/types/product'

const productStore = useProductStore()

const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingProduct = ref<Product | null>(null)

const searchQuery = ref('')
const filters = ref({
  status: '',
  type: ''
})

const platformName = computed(() => {
  const mode = import.meta.env.VITE_PLATFORM_MODE
  return mode === 'iacelera' ? 'iAcelera' : 'IFEDEM'
})

const filteredProducts = computed(() => {
  let products = [...productStore.products]

  // Filter by status
  if (filters.value.status) {
    products = products.filter((p) => p.status === filters.value.status)
  }

  // Filter by type
  if (filters.value.type) {
    products = products.filter((p) => p.type === filters.value.type)
  }

  // Search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
    )
  }

  return products
})

function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    active: 'Activo',
    inactive: 'Inactivo',
    draft: 'Borrador',
    out_of_stock: 'Agotado'
  }
  return translations[status] || status
}

function translateType(type: string): string {
  const translations: Record<string, string> = {
    physical: 'Físico',
    digital: 'Digital',
    membership: 'Membresía',
    course: 'Curso',
    bundle: 'Paquete',
    starter_kit: 'Kit Inicial'
  }
  return translations[type] || type
}

function editProduct(product: Product) {
  editingProduct.value = { ...product }
  showEditModal.value = true
}

async function deleteProduct(product: Product) {
  if (
    confirm(
      `¿Estás seguro de que quieres eliminar "${product.name}"?\n\nEsta acción no se puede deshacer.`
    )
  ) {
    try {
      await productStore.deleteProduct(product.id)
      alert('Producto eliminado exitosamente')
    } catch (err) {
      alert('Error al eliminar el producto')
      console.error(err)
    }
  }
}

function closeModal() {
  showCreateModal.value = false
  showEditModal.value = false
  editingProduct.value = null
}

async function handleSave() {
  await productStore.fetchProducts()
  closeModal()
}

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<style scoped>
.products-management {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
  white-space: nowrap;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Filters */
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

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: #667eea;
}

/* Table */
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
  letter-spacing: 0.05em;
}

td {
  padding: 1rem;
  border-top: 1px solid #e2e8f0;
}

.product-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.product-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  background: #f7fafc;
}

.product-name {
  font-weight: 500;
  color: #2d3748;
  margin-bottom: 0.25rem;
}

.product-type {
  font-size: 0.85rem;
  color: #718096;
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

.status-badge.draft {
  background: #e0e7ff;
  color: #3730a3;
}

.status-badge.out_of_stock {
  background: #fef3c7;
  color: #92400e;
}

.platform-badge {
  padding: 0.25rem 0.75rem;
  background: #f7fafc;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #4a5568;
  text-transform: uppercase;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
  transition: transform 0.2s;
}

.btn-icon:hover {
  transform: scale(1.2);
}

.btn-icon.danger:hover {
  filter: brightness(1.2);
}

/* Loading & Empty */
.loading,
.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

/* Responsive */
@media (max-width: 968px) {
  .page-header {
    flex-direction: column;
  }

  .btn-primary {
    width: 100%;
  }

  .filters-card {
    flex-direction: column;
  }

  .filter-group {
    min-width: 100%;
  }
}
</style>
