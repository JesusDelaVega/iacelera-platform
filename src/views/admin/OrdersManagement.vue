<template>
  <div class="orders-management">
    <div class="page-header">
      <div>
        <h1>Gestión de Órdenes</h1>
        <p>Administra todas las órdenes de la plataforma</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-card">
      <div class="filter-group">
        <label>Estado:</label>
        <select v-model="filters.status">
          <option value="">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="processing">Procesando</option>
          <option value="paid">Pagado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
          <option value="refunded">Reembolsado</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Buscar:</label>
        <input v-model="searchQuery" type="text" placeholder="Número de orden..." />
      </div>
    </div>

    <!-- Orders Table -->
    <div class="table-card">
      <div v-if="loading" class="loading">Cargando órdenes...</div>

      <div v-else-if="filteredOrders.length === 0" class="empty">
        No se encontraron órdenes
      </div>

      <div v-else class="table-container">
        <table>
          <thead>
            <tr>
              <th>Orden</th>
              <th>Cliente</th>
              <th>Fecha</th>
              <th>Items</th>
              <th>Total</th>
              <th>BV</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders" :key="order.id">
              <td>
                <strong>{{ order.orderNumber }}</strong>
              </td>
              <td>{{ order.customerId }}</td>
              <td>{{ formatDate(order.createdAt) }}</td>
              <td>{{ order.items.length }}</td>
              <td>${{ order.total.toFixed(2) }}</td>
              <td>{{ order.totalBV }}</td>
              <td>
                <select
                  :value="order.status"
                  @change="updateStatus(order, ($event.target as HTMLSelectElement).value)"
                  class="status-select"
                >
                  <option value="pending">Pendiente</option>
                  <option value="processing">Procesando</option>
                  <option value="paid">Pagado</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                  <option value="refunded">Reembolsado</option>
                </select>
              </td>
              <td>
                <button class="btn-icon" @click="viewOrder(order)" title="Ver detalles">
                  👁️
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="modal-overlay" @click="selectedOrder = null">
      <div class="modal-container" @click.stop>
        <div class="modal-header">
          <h2>Orden {{ selectedOrder.orderNumber }}</h2>
          <button class="close-btn" @click="selectedOrder = null">×</button>
        </div>

        <div class="modal-body">
          <div class="detail-section">
            <h3>Información del Cliente</h3>
            <p><strong>ID:</strong> {{ selectedOrder.customerId }}</p>
            <p><strong>Email:</strong> {{ selectedOrder.userId }}</p>
          </div>

          <div class="detail-section">
            <h3>Dirección de Envío</h3>
            <p>{{ selectedOrder.shippingAddress?.firstName }} {{ selectedOrder.shippingAddress?.lastName }}</p>
            <p>{{ selectedOrder.shippingAddress?.address1 }}</p>
            <p v-if="selectedOrder.shippingAddress?.address2">{{ selectedOrder.shippingAddress.address2 }}</p>
            <p>{{ selectedOrder.shippingAddress?.city }}, {{ selectedOrder.shippingAddress?.state }} {{ selectedOrder.shippingAddress?.postalCode }}</p>
            <p>{{ selectedOrder.shippingAddress?.country }}</p>
          </div>

          <div class="detail-section">
            <h3>Productos</h3>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedOrder.items" :key="item.productId">
                  <td>{{ item.name }}</td>
                  <td>{{ item.quantity }}</td>
                  <td>${{ item.price.toFixed(2) }}</td>
                  <td>${{ item.total.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="detail-section">
            <h3>Totales</h3>
            <div class="totals">
              <div><span>Subtotal:</span> <strong>${{ selectedOrder.subtotal.toFixed(2) }}</strong></div>
              <div><span>IVA (16%):</span> <strong>${{ selectedOrder.tax.toFixed(2) }}</strong></div>
              <div><span>Envío:</span> <strong>${{ selectedOrder.shipping.toFixed(2) }}</strong></div>
              <div class="total-row"><span>Total:</span> <strong>${{ selectedOrder.total.toFixed(2) }}</strong></div>
              <div><span>Total BV:</span> <strong>{{ selectedOrder.totalBV }} BV</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Order, OrderStatus } from '@/shared/types/product'

const loading = ref(false)
const orders = ref<Order[]>([])
const selectedOrder = ref<Order | null>(null)
const searchQuery = ref('')
const filters = ref({
  status: ''
})

const filteredOrders = computed(() => {
  let result = [...orders.value]

  if (filters.value.status) {
    result = result.filter((o) => o.status === filters.value.status)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter((o) => o.orderNumber.toLowerCase().includes(query))
  }

  return result
})

async function loadOrders() {
  try {
    loading.value = true
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
    const snapshot = await getDocs(q)

    orders.value = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date()
      } as Order
    })
  } catch (err) {
    console.error('Error loading orders:', err)
  } finally {
    loading.value = false
  }
}

async function updateStatus(order: Order, newStatus: string) {
  if (confirm(`¿Cambiar estado de ${order.orderNumber} a "${newStatus}"?`)) {
    try {
      const orderRef = doc(db, 'orders', order.id)
      await updateDoc(orderRef, {
        status: newStatus,
        updatedAt: new Date()
      })

      const index = orders.value.findIndex((o) => o.id === order.id)
      if (index !== -1) {
        orders.value[index].status = newStatus as OrderStatus
      }

      alert('Estado actualizado correctamente')
    } catch (err) {
      console.error('Error updating order status:', err)
      alert('Error al actualizar el estado')
    }
  }
}

function viewOrder(order: Order) {
  selectedOrder.value = order
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.orders-management {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.status-select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  padding: 0.25rem;
}

.btn-icon:hover {
  transform: scale(1.2);
}

.loading,
.empty {
  text-align: center;
  padding: 4rem 2rem;
  color: #718096;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
}

.modal-container {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.detail-section {
  margin-bottom: 2rem;
}

.detail-section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #2d3748;
}

.detail-section p {
  margin: 0.5rem 0;
  color: #4a5568;
}

.items-table {
  width: 100%;
  margin-top: 1rem;
}

.items-table th,
.items-table td {
  padding: 0.75rem;
  text-align: left;
}

.totals {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.totals div {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.total-row {
  border-top: 2px solid #e2e8f0;
  margin-top: 0.5rem;
  padding-top: 1rem !important;
  font-size: 1.2rem;
}
</style>
