<template>
  <div class="checkout-view">
    <div class="checkout-container">
      <div class="checkout-header">
        <button class="back-btn" @click="router.back()">← Volver</button>
        <h1>Checkout</h1>
      </div>

      <div v-if="isEmpty" class="empty-cart">
        <p>Tu carrito está vacío</p>
        <button class="btn-primary" @click="router.push('/products')">
          Ver Productos
        </button>
      </div>

      <div v-else class="checkout-content">
        <!-- Order Summary -->
        <div class="checkout-section">
          <h2>Resumen del Pedido</h2>
          <div class="order-items">
            <div v-for="item in cartItems" :key="item.product.id" class="order-item">
              <div class="item-image">
                <img
                  :src="
                    item.product.thumbnail || item.product.images[0] || '/placeholder-product.jpg'
                  "
                  :alt="item.product.name"
                />
              </div>
              <div class="item-info">
                <h4>{{ item.product.name }}</h4>
                <p>Cantidad: {{ item.quantity }}</p>
              </div>
              <div class="item-price">
                ${{ (item.product.price * item.quantity).toFixed(2) }}
              </div>
            </div>
          </div>

          <div class="order-totals">
            <div class="total-row">
              <span>Subtotal</span>
              <span>${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>IVA (16%)</span>
              <span>${{ tax.toFixed(2) }}</span>
            </div>
            <div class="total-row">
              <span>Envío</span>
              <span>Gratis</span>
            </div>
            <div class="total-row bv">
              <span>Total BV</span>
              <span>{{ totalBV }} BV</span>
            </div>
            <div class="total-row total">
              <span>Total</span>
              <span>${{ total.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- Shipping Address -->
        <div class="checkout-section">
          <h2>Dirección de Envío</h2>
          <form class="address-form">
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">Nombre</label>
                <input
                  id="firstName"
                  v-model="shippingAddress.firstName"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="lastName">Apellido</label>
                <input
                  id="lastName"
                  v-model="shippingAddress.lastName"
                  type="text"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="address1">Dirección</label>
              <input
                id="address1"
                v-model="shippingAddress.address1"
                type="text"
                required
              />
            </div>

            <div class="form-group">
              <label for="address2">Dirección 2 (Opcional)</label>
              <input id="address2" v-model="shippingAddress.address2" type="text" />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="city">Ciudad</label>
                <input
                  id="city"
                  v-model="shippingAddress.city"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="state">Estado</label>
                <input
                  id="state"
                  v-model="shippingAddress.state"
                  type="text"
                  required
                />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="postalCode">Código Postal</label>
                <input
                  id="postalCode"
                  v-model="shippingAddress.postalCode"
                  type="text"
                  required
                />
              </div>
              <div class="form-group">
                <label for="country">País</label>
                <input
                  id="country"
                  v-model="shippingAddress.country"
                  type="text"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label for="phone">Teléfono</label>
              <input
                id="phone"
                v-model="shippingAddress.phone"
                type="tel"
              />
            </div>
          </form>
        </div>

        <!-- Payment Method -->
        <div class="checkout-section">
          <h2>Método de Pago</h2>
          <div class="payment-methods">
            <label class="payment-option">
              <input
                type="radio"
                name="payment"
                value="transfer"
                v-model="paymentMethod"
              />
              <span>Transferencia Bancaria</span>
            </label>
            <label class="payment-option">
              <input
                type="radio"
                name="payment"
                value="cash"
                v-model="paymentMethod"
              />
              <span>Efectivo</span>
            </label>
            <label class="payment-option disabled">
              <input
                type="radio"
                name="payment"
                value="stripe"
                disabled
              />
              <span>Tarjeta de Crédito/Débito (Próximamente)</span>
            </label>
          </div>

          <div v-if="paymentMethod === 'transfer'" class="payment-info">
            <p><strong>Información de transferencia:</strong></p>
            <p>Banco: BBVA</p>
            <p>Cuenta: 1234567890</p>
            <p>CLABE: 012345678901234567</p>
            <p>Referencia: Tu código de afiliado</p>
            <small>Una vez realizada la transferencia, envía tu comprobante al administrador.</small>
          </div>
        </div>

        <!-- Place Order Button -->
        <div class="checkout-actions">
          <button
            class="btn-place-order"
            @click="handlePlaceOrder"
            :disabled="!canPlaceOrder || ordersService.loading.value"
          >
            {{ ordersService.loading.value ? 'Procesando...' : 'Realizar Pedido' }}
          </button>
        </div>

        <div v-if="ordersService.error.value" class="error-message">
          {{ ordersService.error.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/shared/composables/useCart'
import { useOrders } from '@/shared/composables/useOrders'
import { useUserStore } from '@/stores/user'
import type { Address } from '@/shared/types/product'

const router = useRouter()
const { cartItems, isEmpty, subtotal, totalBV, clearCart } = useCart()
const ordersService = useOrders()
const userStore = useUserStore()

const shippingAddress = ref<Address>({
  firstName: userStore.user?.firstName || '',
  lastName: userStore.user?.lastName || '',
  company: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'México',
  phone: userStore.user?.phone || ''
})

const billingAddress = ref<Address>({ ...shippingAddress.value })
const paymentMethod = ref('transfer')

const tax = computed(() => subtotal.value * 0.16)
const shipping = computed(() => 0)
const total = computed(() => subtotal.value + tax.value + shipping.value)

const canPlaceOrder = computed(() => {
  return (
    !isEmpty.value &&
    shippingAddress.value.firstName &&
    shippingAddress.value.lastName &&
    shippingAddress.value.address1 &&
    shippingAddress.value.city &&
    shippingAddress.value.state &&
    shippingAddress.value.postalCode &&
    shippingAddress.value.country &&
    paymentMethod.value
  )
})

async function handlePlaceOrder() {
  if (!userStore.user) {
    alert('Debes iniciar sesión para realizar un pedido')
    return
  }

  if (!canPlaceOrder.value) {
    alert('Por favor completa todos los campos requeridos')
    return
  }

  const order = await ordersService.createOrder(
    userStore.user.id,
    cartItems.value,
    shippingAddress.value,
    billingAddress.value,
    paymentMethod.value
  )

  if (order) {
    clearCart()
    alert(`¡Pedido realizado exitosamente!\n\nNúmero de orden: ${order.orderNumber}\n\nTotal: $${order.total.toFixed(2)}\n\nRecibirás un correo con los detalles de tu pedido.`)
    router.push('/dashboard')
  }
}
</script>

<style scoped>
.checkout-view {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 2rem;
}

.checkout-container {
  max-width: 900px;
  margin: 0 auto;
}

.checkout-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  font-size: 1rem;
  color: #0066cc;
  cursor: pointer;
  padding: 0.5rem;
}

.back-btn:hover {
  text-decoration: underline;
}

.checkout-header h1 {
  margin: 0;
  color: #333;
}

.empty-cart {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  text-align: center;
}

.empty-cart p {
  color: #666;
  margin-bottom: 1.5rem;
}

.checkout-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.checkout-section {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.checkout-section h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.order-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.order-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
}

.item-image {
  width: 60px;
  height: 60px;
  flex-shrink: 0;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h4 {
  margin: 0 0 0.25rem 0;
  font-size: 0.95rem;
  color: #333;
}

.item-info p {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.item-price {
  font-weight: 700;
  color: #333;
}

.order-totals {
  border-top: 1px solid #ddd;
  padding-top: 1rem;
}

.total-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #666;
}

.total-row.bv {
  font-size: 0.9rem;
}

.total-row.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #ddd;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.address-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #0066cc;
}

.payment-methods {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.payment-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.payment-option:has(input:checked) {
  border-color: #0066cc;
  background: #f0f7ff;
}

.payment-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.payment-option input[type='radio'] {
  cursor: pointer;
}

.payment-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 4px;
  font-size: 0.9rem;
}

.payment-info p {
  margin: 0.25rem 0;
}

.payment-info small {
  display: block;
  margin-top: 0.75rem;
  color: #666;
}

.checkout-actions {
  text-align: center;
}

.btn-place-order,
.btn-primary {
  width: 100%;
  max-width: 400px;
  padding: 1rem 2rem;
  background: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-place-order:hover:not(:disabled),
.btn-primary:hover:not(:disabled) {
  background: #0052a3;
}

.btn-place-order:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  text-align: center;
  padding: 1rem;
  background: #fee;
  color: #c00;
  border-radius: 4px;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .checkout-view {
    padding: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
