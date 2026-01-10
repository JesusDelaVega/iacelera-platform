<template>
  <div class="product-list">
    <div v-if="loading" class="loading-state">
      <p>Cargando productos...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Error: {{ error }}</p>
    </div>

    <div v-else-if="displayProducts.length === 0" class="empty-state">
      <p>No hay productos disponibles</p>
    </div>

    <div v-else class="products-grid">
      <ProductCard
        v-for="product in displayProducts"
        :key="product.id"
        :product="product"
        :show-add-to-cart="showAddToCart"
        :show-details="showDetails"
        :show-edit="showEdit"
        @view-details="handleViewDetails"
        @edit="handleEdit"
        @added-to-cart="handleAddedToCart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ProductCard from './ProductCard.vue'
import type { Product } from '@/shared/types/product'

interface Props {
  products: Product[]
  loading?: boolean
  error?: string | null
  showAddToCart?: boolean
  showDetails?: boolean
  showEdit?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  error: null,
  showAddToCart: true,
  showDetails: true,
  showEdit: false
})

const emit = defineEmits<{
  'view-details': [product: Product]
  'edit': [product: Product]
  'added-to-cart': [product: Product]
}>()

const displayProducts = computed(() => props.products)

function handleViewDetails(product: Product) {
  emit('view-details', product)
}

function handleEdit(product: Product) {
  emit('edit', product)
}

function handleAddedToCart(product: Product) {
  emit('added-to-cart', product)
}
</script>

<style scoped>
.product-list {
  width: 100%;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-state {
  color: #c00;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>
