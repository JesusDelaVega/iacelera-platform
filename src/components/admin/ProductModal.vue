<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>{{ isEditing ? 'Editar Producto' : 'Crear Producto' }}</h2>
        <button class="close-btn" @click="$emit('close')">×</button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <div class="form-row">
          <div class="form-group">
            <label>Nombre *</label>
            <input v-model="form.name" type="text" required />
          </div>

          <div class="form-group">
            <label>SKU *</label>
            <input v-model="form.sku" type="text" required />
          </div>
        </div>

        <div class="form-group">
          <label>Descripción Corta</label>
          <input v-model="form.shortDescription" type="text" />
        </div>

        <div class="form-group">
          <label>Descripción *</label>
          <textarea v-model="form.description" rows="4" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Tipo *</label>
            <select v-model="form.type" required>
              <option value="physical">Físico</option>
              <option value="digital">Digital</option>
              <option value="membership">Membresía</option>
              <option value="course">Curso</option>
              <option value="bundle">Paquete</option>
              <option value="starter_kit">Kit Inicial</option>
            </select>
          </div>

          <div class="form-group">
            <label>Estado *</label>
            <select v-model="form.status" required>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="draft">Borrador</option>
              <option value="out_of_stock">Agotado</option>
            </select>
          </div>

          <div class="form-group">
            <label>Plataforma *</label>
            <select v-model="form.platform" required>
              <option value="iacelera">iAcelera</option>
              <option value="ifedem">IFEDEM</option>
              <option value="both">Ambas</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Precio (USD) *</label>
            <input v-model.number="form.price" type="number" step="0.01" required />
          </div>

          <div class="form-group">
            <label>Precio Comparación</label>
            <input v-model.number="form.compareAtPrice" type="number" step="0.01" />
          </div>

          <div class="form-group">
            <label>BV (Business Volume) *</label>
            <input v-model.number="form.bv" type="number" required />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>CV (Commissionable Value)</label>
            <input v-model.number="form.cv" type="number" />
          </div>

          <div class="form-group">
            <label>Puntos</label>
            <input v-model.number="form.points" type="number" />
          </div>
        </div>

        <div class="form-group">
          <label>URL de Imagen (Cloudinary)</label>
          <input v-model="imageUrl" type="url" placeholder="https://res.cloudinary.com/..." />
          <small>Sube la imagen a Cloudinary y pega la URL aquí</small>
        </div>

        <div class="form-group">
          <label>Categorías (separadas por coma)</label>
          <input
            v-model="categoriesInput"
            type="text"
            placeholder="memberships, starter-kits"
          />
        </div>

        <div class="form-group">
          <label>
            <input v-model="form.trackInventory" type="checkbox" />
            Rastrear inventario
          </label>
        </div>

        <div v-if="form.trackInventory" class="form-row">
          <div class="form-group">
            <label>Cantidad en Stock</label>
            <input v-model.number="form.inventoryQuantity" type="number" />
          </div>

          <div class="form-group">
            <label>
              <input v-model="form.allowBackorder" type="checkbox" />
              Permitir pedidos sin stock
            </label>
          </div>
        </div>

        <div class="form-group">
          <label>
            <input v-model="form.requiresShipping" type="checkbox" />
            Requiere envío
          </label>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('close')">
            Cancelar
          </button>
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Guardando...' : 'Guardar Producto' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useProductStore } from '@/stores/product'
import type { Product, ProductType, ProductStatus } from '@/shared/types/product'

interface Props {
  product?: Product | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: []
}>()

const productStore = useProductStore()
const loading = ref(false)

const isEditing = computed(() => !!props.product)

const form = ref({
  name: '',
  sku: '',
  description: '',
  shortDescription: '',
  type: 'physical' as ProductType,
  status: 'active' as ProductStatus,
  platform: 'both' as 'iacelera' | 'ifedem' | 'both',
  price: 0,
  compareAtPrice: 0,
  bv: 0,
  cv: 0,
  points: 0,
  trackInventory: false,
  inventoryQuantity: 0,
  allowBackorder: false,
  requiresShipping: false,
  isRecurring: false
})

const imageUrl = ref('')
const categoriesInput = ref('')

// Load existing product data
watch(
  () => props.product,
  (product) => {
    if (product) {
      form.value = {
        name: product.name,
        sku: product.sku,
        description: product.description,
        shortDescription: product.shortDescription || '',
        type: product.type,
        status: product.status,
        platform: product.platform,
        price: product.price,
        compareAtPrice: product.compareAtPrice || 0,
        bv: product.bv,
        cv: product.cv || 0,
        points: product.points || 0,
        trackInventory: product.trackInventory,
        inventoryQuantity: product.inventoryQuantity || 0,
        allowBackorder: product.allowBackorder || false,
        requiresShipping: product.requiresShipping,
        isRecurring: product.isRecurring
      }
      imageUrl.value = product.images[0] || ''
      categoriesInput.value = product.categories.join(', ')
    }
  },
  { immediate: true }
)

async function handleSubmit() {
  loading.value = true

  try {
    const categories = categoriesInput.value
      .split(',')
      .map((c) => c.trim())
      .filter((c) => c)

    const images = imageUrl.value ? [imageUrl.value] : []

    const productData = {
      ...form.value,
      currency: 'USD',
      images,
      thumbnail: imageUrl.value,
      categories,
      tags: categories,
      createdBy: 'admin'
    }

    if (isEditing.value && props.product) {
      await productStore.updateProduct(props.product.id, productData)
    } else {
      await productStore.createProduct(productData as any)
    }

    emit('save')
    emit('close')
  } catch (err) {
    console.error('Error saving product:', err)
    alert('Error al guardar el producto')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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
  font-size: 1.5rem;
  color: #2d3748;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #718096;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

.close-btn:hover {
  color: #2d3748;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input[type='text'],
.form-group input[type='number'],
.form-group input[type='url'],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input[type='checkbox'] {
  margin-right: 0.5rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #718096;
  font-size: 0.85rem;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f7fafc;
  color: #4a5568;
}

.btn-secondary:hover {
  background: #edf2f7;
}

@media (max-width: 640px) {
  .modal-overlay {
    padding: 0;
  }

  .modal-container {
    max-height: 100vh;
    border-radius: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
