import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp
} from 'firebase/firestore'
import { db } from '@/config/firebase'
import type { Product, ProductStatus } from '@/shared/types/product'

export const useProductStore = defineStore('product', () => {
  // State
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentPlatform = ref<'iacelera' | 'ifedem'>(
    import.meta.env.VITE_PLATFORM_MODE as 'iacelera' | 'ifedem'
  )

  // Getters
  const activeProducts = computed(() =>
    products.value.filter((p) => p.status === 'active')
  )

  const platformProducts = computed(() =>
    products.value.filter(
      (p) => p.platform === currentPlatform.value || p.platform === 'both'
    )
  )

  const activePlatformProducts = computed(() =>
    platformProducts.value.filter((p) => p.status === 'active')
  )

  // Actions
  async function fetchProducts(filters?: {
    platform?: 'iacelera' | 'ifedem' | 'both'
    status?: ProductStatus
    category?: string
  }) {
    try {
      loading.value = true
      error.value = null

      const productsRef = collection(db, 'products')
      let q = query(productsRef, orderBy('createdAt', 'desc'))

      // Apply filters
      if (filters?.status) {
        q = query(q, where('status', '==', filters.status))
      }

      if (filters?.platform) {
        q = query(q, where('platform', 'in', [filters.platform, 'both']))
      }

      if (filters?.category) {
        q = query(q, where('categories', 'array-contains', filters.category))
      }

      const snapshot = await getDocs(q)
      products.value = snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
        } as Product
      })
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching products:', err)
    } finally {
      loading.value = false
    }
  }

  async function fetchProductById(productId: string) {
    try {
      loading.value = true
      error.value = null

      const productDoc = await getDoc(doc(db, 'products', productId))

      if (productDoc.exists()) {
        const data = productDoc.data()
        currentProduct.value = {
          ...data,
          id: productDoc.id,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
        } as Product
        return currentProduct.value
      } else {
        error.value = 'Producto no encontrado'
        return null
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching product:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      loading.value = true
      error.value = null

      const productRef = doc(collection(db, 'products'))
      const newProduct = {
        ...productData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(productRef, newProduct)

      // Fetch the created product to get timestamps
      const createdDoc = await getDoc(productRef)
      const data = createdDoc.data()!
      const product: Product = {
        ...data,
        id: productRef.id,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
        updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
      } as Product

      products.value.unshift(product)
      return product
    } catch (err: any) {
      error.value = err.message
      console.error('Error creating product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateProduct(productId: string, updates: Partial<Product>) {
    try {
      loading.value = true
      error.value = null

      const productRef = doc(db, 'products', productId)
      await updateDoc(productRef, {
        ...updates,
        updatedAt: serverTimestamp()
      })

      // Update local state
      const index = products.value.findIndex((p) => p.id === productId)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          ...updates,
          updatedAt: new Date()
        }
      }

      if (currentProduct.value?.id === productId) {
        currentProduct.value = {
          ...currentProduct.value,
          ...updates,
          updatedAt: new Date()
        }
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Error updating product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteProduct(productId: string) {
    try {
      loading.value = true
      error.value = null

      await deleteDoc(doc(db, 'products', productId))

      // Remove from local state
      products.value = products.value.filter((p) => p.id !== productId)

      if (currentProduct.value?.id === productId) {
        currentProduct.value = null
      }
    } catch (err: any) {
      error.value = err.message
      console.error('Error deleting product:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchFeaturedProducts(limitCount = 6) {
    try {
      loading.value = true
      error.value = null

      const productsRef = collection(db, 'products')
      const q = query(
        productsRef,
        where('status', '==', 'active'),
        where('platform', 'in', [currentPlatform.value, 'both']),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )

      const snapshot = await getDocs(q)
      return snapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
          updatedAt: (data.updatedAt as Timestamp)?.toDate() || new Date()
        } as Product
      })
    } catch (err: any) {
      error.value = err.message
      console.error('Error fetching featured products:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    products,
    currentProduct,
    loading,
    error,
    currentPlatform,

    // Getters
    activeProducts,
    platformProducts,
    activePlatformProducts,

    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchFeaturedProducts
  }
})
