<template>
  <div class="cart-item">
    <div class="item-image">
      <img
        :src="item.product.thumbnail || item.product.images[0] || '/placeholder-product.jpg'"
        :alt="item.product.name"
      />
    </div>

    <div class="item-details">
      <h4 class="item-name">{{ item.product.name }}</h4>
      <p class="item-price">${{ item.product.price.toFixed(2) }}</p>
      <p v-if="item.product.bv" class="item-bv">{{ item.product.bv }} BV</p>

      <div class="item-quantity">
        <button class="qty-btn" @click="decreaseQuantity" :disabled="item.quantity <= 1">
          -
        </button>
        <input
          type="number"
          :value="item.quantity"
          @input="handleQuantityInput"
          min="1"
          class="qty-input"
        />
        <button class="qty-btn" @click="increaseQuantity">+</button>
      </div>
    </div>

    <div class="item-actions">
      <p class="item-total">${{ itemTotal.toFixed(2) }}</p>
      <button class="remove-btn" @click="$emit('remove', item.product.id)" title="Eliminar">
        🗑️
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '@/shared/composables/useCart'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update-quantity': [productId: string, quantity: number]
  'remove': [productId: string]
}>()

const itemTotal = computed(() => props.item.product.price * props.item.quantity)

function increaseQuantity() {
  emit('update-quantity', props.item.product.id, props.item.quantity + 1)
}

function decreaseQuantity() {
  if (props.item.quantity > 1) {
    emit('update-quantity', props.item.product.id, props.item.quantity - 1)
  }
}

function handleQuantityInput(event: Event) {
  const input = event.target as HTMLInputElement
  const quantity = parseInt(input.value) || 1
  emit('update-quantity', props.item.product.id, Math.max(1, quantity))
}
</script>

<style scoped>
.cart-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.item-image {
  width: 80px;
  height: 80px;
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

.item-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.item-name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.item-price {
  margin: 0;
  font-size: 1rem;
  font-weight: 700;
  color: #0066cc;
}

.item-bv {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
}

.item-quantity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.qty-btn {
  width: 28px;
  height: 28px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.qty-btn:hover:not(:disabled) {
  background: #f0f0f0;
}

.qty-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty-input {
  width: 50px;
  height: 28px;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 0.9rem;
}

.qty-input:focus {
  outline: none;
  border-color: #0066cc;
}

.item-actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.item-total {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.25rem;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.remove-btn:hover {
  opacity: 1;
}
</style>
