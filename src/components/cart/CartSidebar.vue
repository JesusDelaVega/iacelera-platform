<template>
  <div class="cart-overlay" @click="$emit('close')">
    <div class="cart-sidebar" @click.stop>
      <div class="cart-header">
        <h2>Carrito de Compras</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <div v-if="isEmpty" class="cart-empty">
        <p>Tu carrito está vacío</p>
        <button class="btn-continue" @click="$emit('close')">
          Continuar Comprando
        </button>
      </div>

      <div v-else class="cart-content">
        <div class="cart-items">
          <CartItem
            v-for="item in cartItems"
            :key="item.product.id"
            :item="item"
            @update-quantity="updateQuantity"
            @remove="removeFromCart"
          />
        </div>

        <div class="cart-summary">
          <div class="summary-row">
            <span>Subtotal</span>
            <span class="value">${{ subtotal.toFixed(2) }}</span>
          </div>

          <div class="summary-row bv">
            <span>Total BV</span>
            <span class="value">{{ totalBV }} BV</span>
          </div>

          <div v-if="totalCV > 0" class="summary-row cv">
            <span>Total CV</span>
            <span class="value">{{ totalCV }} CV</span>
          </div>

          <div v-if="totalPoints > 0" class="summary-row points">
            <span>Puntos</span>
            <span class="value">{{ totalPoints }} pts</span>
          </div>

          <div class="summary-row total">
            <span>Total</span>
            <span class="value">${{ subtotal.toFixed(2) }}</span>
          </div>

          <button class="btn-checkout" @click="handleCheckout">
            Proceder al Pago
          </button>

          <button class="btn-continue-shopping" @click="$emit('close')">
            Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCart } from '@/shared/composables/useCart'
import CartItem from './CartItem.vue'

const emit = defineEmits<{
  'close': []
}>()

const router = useRouter()
const {
  cartItems,
  isEmpty,
  subtotal,
  totalBV,
  totalCV,
  totalPoints,
  updateQuantity,
  removeFromCart
} = useCart()

function handleCheckout() {
  emit('close')
  router.push('/checkout')
}
</script>

<style scoped>
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
}

.cart-sidebar {
  width: 100%;
  max-width: 450px;
  background: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.cart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #ddd;
}

.cart-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #666;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.close-btn:hover {
  color: #333;
}

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.cart-empty p {
  color: #666;
  margin-bottom: 1.5rem;
}

.cart-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.cart-summary {
  border-top: 1px solid #ddd;
  padding: 1.5rem;
  background: #f9f9f9;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  color: #666;
}

.summary-row.bv,
.summary-row.cv,
.summary-row.points {
  font-size: 0.9rem;
}

.summary-row.total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #ddd;
  font-size: 1.25rem;
  font-weight: 700;
  color: #333;
}

.value {
  font-weight: 600;
}

.btn-checkout,
.btn-continue-shopping,
.btn-continue {
  width: 100%;
  padding: 1rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-checkout {
  background: #0066cc;
  color: white;
  margin-bottom: 0.75rem;
}

.btn-checkout:hover {
  background: #0052a3;
}

.btn-continue-shopping,
.btn-continue {
  background: #f0f0f0;
  color: #333;
}

.btn-continue-shopping:hover,
.btn-continue:hover {
  background: #e0e0e0;
}

@media (max-width: 768px) {
  .cart-sidebar {
    max-width: 100%;
  }
}
</style>
