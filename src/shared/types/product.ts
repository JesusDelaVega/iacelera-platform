export enum ProductType {
  PHYSICAL = 'physical',
  DIGITAL = 'digital',
  MEMBERSHIP = 'membership',
  COURSE = 'course',
  BUNDLE = 'bundle',
  STARTER_KIT = 'starter_kit'
}

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  OUT_OF_STOCK = 'out_of_stock'
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  shortDescription?: string

  type: ProductType
  status: ProductStatus
  platform: 'iacelera' | 'ifedem' | 'both'

  // Pricing
  price: number
  currency: string
  compareAtPrice?: number

  // Commissionable values
  bv: number // Business Volume
  cv?: number // Commissionable Value
  points?: number

  // Inventory (for physical products)
  trackInventory: boolean
  inventoryQuantity?: number
  allowBackorder?: boolean

  // Subscription
  isRecurring: boolean
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly'
  recurringIntervalCount?: number

  // Media
  images: string[]
  thumbnail?: string
  video?: string

  // Categories
  categories: string[]
  tags: string[]

  // Shipping (for physical)
  requiresShipping: boolean
  weight?: number
  dimensions?: {
    length: number
    width: number
    height: number
    unit: 'cm' | 'in'
  }

  // Digital delivery
  downloadUrl?: string
  accessUrl?: string

  // Requirements
  requiresQualification: boolean
  minimumRank?: string

  // Metadata
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed'
}

export interface Order {
  id: string
  orderNumber: string

  userId: string
  customerId: string

  // Items
  items: OrderItem[]

  // Pricing
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string

  // Commissions
  totalBV: number
  totalCV: number
  totalPoints: number

  // Payment
  paymentMethod: string
  paymentStatus: string
  paymentId?: string

  // Shipping
  shippingAddress?: Address
  billingAddress?: Address
  shippingMethod?: string
  trackingNumber?: string

  // Status
  status: OrderStatus
  statusHistory: OrderStatusHistory[]

  // Referral
  referrerId?: string

  // Metadata
  notes?: string
  metadata?: Record<string, any>

  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  productId: string
  sku: string
  name: string
  quantity: number
  price: number
  bv: number
  cv: number
  points: number
  total: number
}

export interface Address {
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: Date
  note?: string
  updatedBy?: string
}
