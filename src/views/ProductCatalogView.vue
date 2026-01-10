<template>
  <div class="product-catalog">
    <div class="catalog-header">
      <PlatformLogo size="small" />
      <h1>Catálogo de Productos</h1>
      <p>Descubre nuestros productos y servicios</p>
    </div>

    <div class="catalog-filters">
      <div class="filter-group">
        <label for="category">Categoría</label>
        <select id="category" v-model="selectedCategory">
          <option value="">Todas las categorías</option>
          <option value="memberships">Membresías</option>
          <option value="courses">Cursos</option>
          <option value="starter-kits">Kits Iniciales</option>
          <option value="digital">Productos Digitales</option>
        </select>
      </div>

      <div class="filter-group">
        <label for="sort">Ordenar por</label>
        <select id="sort" v-model="sortBy">
          <option value="newest">Más recientes</option>
          <option value="price-asc">Precio: Menor a Mayor</option>
          <option value="price-desc">Precio: Mayor a Menor</option>
          <option value="bv-desc">BV: Mayor a Menor</option>
        </select>
      </div>
    </div>

    <ProductList
      :products="filteredProducts"
      :loading="productStore.loading"
      :error="productStore.error"
      @added-to-cart="handleAddedToCart"
    />

    <!-- Cart Button -->
    <button class="cart-fab" @click="toggleCart" :class="{ 'has-items': cartItemCount > 0 }">
      <span class="cart-icon">🛒</span>
      <span v-if="cartItemCount > 0" class="cart-badge">{{ cartItemCount }}</span>
    </button>

    <!-- Cart Sidebar -->
    <CartSidebar v-if="cartOpen" @close="closeCart" />

    <!-- Success Notification -->
    <Transition name="fade">
      <div v-if="showNotification" class="notification">
        Producto agregado al carrito
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useCart } from '@/shared/composables/useCart'
import ProductList from '@/components/products/ProductList.vue'
import CartSidebar from '@/components/cart/CartSidebar.vue'
import PlatformLogo from '@/components/shared/PlatformLogo.vue'
import type { Product } from '@/shared/types/product'

const productStore = useProductStore()
const { itemCount: cartItemCount, cartOpen, toggleCart, closeCart } = useCart()

const selectedCategory = ref('')
const sortBy = ref('newest')
const showNotification = ref(false)

const filteredProducts = computed(() => {
  let products = [...productStore.activePlatformProducts]

  // Filter by category
  if (selectedCategory.value) {
    products = products.filter((p) =>
      p.categories.includes(selectedCategory.value)
    )
  }

  // Sort
  switch (sortBy.value) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.sort((a, b) => b.price - a.price)
      break
    case 'bv-desc':
      products.sort((a, b) => b.bv - a.bv)
      break
    case 'newest':
    default:
      products.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }

  return products
})

function handleAddedToCart(product: Product) {
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}

onMounted(async () => {
  await productStore.fetchProducts({
    status: 'active'
  })
})
</script>

<style scoped>
.product-catalog {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.catalog-header {
  text-align: center;
  margin-bottom: 3rem;
}

.catalog-header h1 {
  margin: 1rem 0 0.5rem;
  color: #333;
}

.catalog-header p {
  color: #666;
  font-size: 1.1rem;
}

.catalog-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.filter-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  background: white;
  cursor: pointer;
}

.filter-group select:focus {
  outline: none;
  border-color: #0066cc;
}

.cart-fab {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #0066cc;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;
  z-index: 100;
}

.cart-fab:hover {
  background: #0052a3;
  transform: scale(1.1);
}

.cart-fab.has-items {
  animation: pulse 2s infinite;
}

.cart-icon {
  font-size: 1.5rem;
}

.cart-badge {
  position: absolute;
  top: 5px;
  right: 5px;
  background: #ff4444;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.notification {
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: #28a745;
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 768px) {
  .product-catalog {
    padding: 1rem;
  }

  .catalog-filters {
    flex-direction: column;
  }

  .cart-fab {
    bottom: 1rem;
    right: 1rem;
  }
}
</style>
