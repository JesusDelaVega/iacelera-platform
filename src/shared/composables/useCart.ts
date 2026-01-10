import { ref, computed } from 'vue'
import type { Product } from '@/shared/types/product'

export interface CartItem {
  product: Product
  quantity: number
}

const cartItems = ref<CartItem[]>([])
const cartOpen = ref(false)

export function useCart() {
  // Getters
  const itemCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const subtotal = computed(() => {
    return cartItems.value.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )
  })

  const totalBV = computed(() => {
    return cartItems.value.reduce(
      (total, item) => total + item.product.bv * item.quantity,
      0
    )
  })

  const totalCV = computed(() => {
    return cartItems.value.reduce(
      (total, item) => total + (item.product.cv || 0) * item.quantity,
      0
    )
  })

  const totalPoints = computed(() => {
    return cartItems.value.reduce(
      (total, item) => total + (item.product.points || 0) * item.quantity,
      0
    )
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  // Actions
  function addToCart(product: Product, quantity = 1) {
    const existingItem = cartItems.value.find((item) => item.product.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cartItems.value.push({ product, quantity })
    }

    // Save to localStorage
    saveCart()
  }

  function removeFromCart(productId: string) {
    cartItems.value = cartItems.value.filter((item) => item.product.id !== productId)
    saveCart()
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    const item = cartItems.value.find((item) => item.product.id === productId)
    if (item) {
      item.quantity = quantity
      saveCart()
    }
  }

  function clearCart() {
    cartItems.value = []
    saveCart()
  }

  function toggleCart() {
    cartOpen.value = !cartOpen.value
  }

  function openCart() {
    cartOpen.value = true
  }

  function closeCart() {
    cartOpen.value = false
  }

  // Persistence
  function saveCart() {
    try {
      const platform = import.meta.env.VITE_PLATFORM_MODE
      localStorage.setItem(`cart_${platform}`, JSON.stringify(cartItems.value))
    } catch (err) {
      console.error('Error saving cart:', err)
    }
  }

  function loadCart() {
    try {
      const platform = import.meta.env.VITE_PLATFORM_MODE
      const saved = localStorage.getItem(`cart_${platform}`)
      if (saved) {
        cartItems.value = JSON.parse(saved)
      }
    } catch (err) {
      console.error('Error loading cart:', err)
      cartItems.value = []
    }
  }

  // Initialize cart from localStorage
  if (cartItems.value.length === 0) {
    loadCart()
  }

  return {
    // State
    cartItems,
    cartOpen,

    // Getters
    itemCount,
    subtotal,
    totalBV,
    totalCV,
    totalPoints,
    isEmpty,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    loadCart,
    saveCart
  }
}
