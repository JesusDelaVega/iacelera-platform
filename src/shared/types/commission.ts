export enum CommissionType {
  DIRECT_SALE = 'direct_sale',
  NETWORK = 'network',
  BINARY_MATCH = 'binary_match',
  UNILEVEL = 'unilevel',
  BONUS = 'bonus',
  RESIDUAL = 'residual',
  LEADERSHIP = 'leadership',
  FAST_START = 'fast_start'
}

export enum CommissionStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  PROCESSING = 'processing'
}

export interface Commission {
  id: string
  userId: string
  type: CommissionType
  amount: number
  currency: string

  // Source
  sourceOrderId?: string
  sourceUserId?: string
  sourceType: string

  // Details
  level?: number
  percentage?: number
  points?: number
  volume?: number

  // Status
  status: CommissionStatus
  calculatedAt: Date
  approvedAt?: Date
  paidAt?: Date
  cancelledAt?: Date

  // Period
  periodStart: Date
  periodEnd: Date

  // Notes
  notes?: string
  metadata?: Record<string, any>
}

export interface CommissionSummary {
  userId: string
  period: string

  totalCommissions: number
  totalPaid: number
  totalPending: number

  byType: Record<CommissionType, number>
  byLevel: Record<number, number>

  generatedAt: Date
}

export interface Rank {
  id: string
  name: string
  level: number
  platform: 'iacelera' | 'ifedem'

  // Requirements
  requirements: {
    personalVolume?: number
    teamVolume?: number
    personalSales?: number
    teamSales?: number
    activeReferrals?: number
    specificLevelReferrals?: Record<string, number>
    points?: number
  }

  // Benefits
  benefits: {
    commissionRate?: number
    bonusRate?: number
    unlockedBonuses?: string[]
    perks?: string[]
  }

  // Settings
  canDowngrade: boolean
  isMeritorious: boolean
  color?: string
  icon?: string

  createdAt: Date
  updatedAt: Date
}
