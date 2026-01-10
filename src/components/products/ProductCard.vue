<template>
  <div class="product-card">
    <div class="product-image">
      <img :src="product.thumbnail || product.images[0] || '/placeholder-product.jpg'" :alt="product.name" />
      <div v-if="product.status !== 'active'" class="status-badge">
        {{ statusLabel }}
      </div>
    </div>

    <div class="product-info">
      <h3 class="product-name">{{ product.name }}</h3>
      <p v-if="product.shortDescription" class="product-description">
        {{ product.shortDescription }}
      </p>

      <div class="product-meta">
        <span class="product-type">{{ typeLabel }}</span>
        <span v-if="product.bv" class="product-bv">{{ product.bv }} BV</span>
      </div>

      <div class="product-pricing">
        <span class="product-price">${{ product.price.toFixed(2) }}</span>
        <span v-if="product.compareAtPrice" class="product-compare-price">
          ${{ product.compareAtPrice.toFixed(2) }}
        </span>
      </div>

      <div class="product-actions">
        <button
          v-if="showAddToCart && product.status === 'active'"
          class="btn-add-cart"
          @click="handleAddToCart"
          :disabled="!canPurchase"
        >
          <span>🛒</span>
          Agregar al Carrito
        </button>

        <button v-if="showDetails" class="btn-details" @click="$emit('view-details', product)">
          Ver Detalles
        </button>

        <button v-if="showEdit" class="btn-edit" @click="$emit('edit', product)">
          Editar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCart } from '@/shared/composables/useCart'
import { useUserStore } from '@/stores/user'
import type { Product } from '@/shared/types/product'

interface Props {
  product: Product
  showAddToCart?: boolean
  showDetails?: boolean
  showEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showAddToCart: true,
  showDetails: true,
  showEdit: false
})

const emit = defineEmits<{
  'view-details': [product: Product]
  'edit': [product: Product]
  'added-to-cart': [product: Product]
}>()

const { addToCart } = useCart()
const userStore = useUserStore()

const statusLabel = computed(() => {
  const labels: Record<string, string> = {
    draft: 'Borrador',
    inactive: 'Inactivo',
    out_of_stock: 'Agotado'
  }
  return labels[props.product.status] || props.product.status
})

const typeLabel = computed(() => {
  const labels: Record<string, string> = {
    physical: 'Físico',
    digital: 'Digital',
    membership: 'Membresía',
    course: 'Curso',
    bundle: 'Paquete',
    starter_kit: 'Kit Inicial'
  }
  return labels[props.product.type] || props.product.type
})

const canPurchase = computed(() => {
  if (!props.product.requiresQualification) return true

  const currentRank = userStore.affiliateProfile?.currentRank
  if (!currentRank || !props.product.minimumRank) return true

  // TODO: Implement rank comparison logic
  return true
})

function handleAddToCart() {
  addToCart(props.product)
  emit('added-to-cart', props.product)
}
</script>

<style scoped>
.product-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.product-image {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.status-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.product-info {
  padding: 1rem;
}

.product-name {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-description {
  margin: 0 0 0.75rem 0;
  color: #666;
  font-size: 0.9rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.product-type,
.product-bv {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: 4px;
  background: #f0f0f0;
  color: #666;
}

.product-pricing {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.product-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0066cc;
}

.product-compare-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.btn-add-cart,
.btn-details,
.btn-edit {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add-cart {
  background: #0066cc;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-add-cart:hover:not(:disabled) {
  background: #0052a3;
}

.btn-add-cart:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-details {
  background: #f0f0f0;
  color: #333;
}

.btn-details:hover {
  background: #e0e0e0;
}

.btn-edit {
  background: #f0f0f0;
  color: #333;
}

.btn-edit:hover {
  background: #e0e0e0;
}
</style>
