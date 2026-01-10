export enum UserRole {
  ADMIN = 'admin',
  AFFILIATE = 'affiliate',
  CUSTOMER = 'customer',
  SUPPORT = 'support'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: UserRole
  status: UserStatus

  // Multi-platform support
  platforms: Array<'iacelera' | 'ifedem'>  // Array de plataformas donde está registrado
  primaryPlatform: 'iacelera' | 'ifedem'   // Plataforma donde se registró primero

  // Affiliate specific
  referralCode?: string  // Código global compartido entre plataformas
  referrerId?: string
  sponsorId?: string

  // Dates
  createdAt: Date
  updatedAt: Date
  lastLogin?: Date
  renewalDate?: Date

  // KYC
  isVerified: boolean
  verificationData?: {
    idDocument?: string
    address?: string
    verifiedAt?: Date
  }
}

export interface AffiliateProfile {
  userId: string
  platform: 'iacelera' | 'ifedem'  // Plataforma de este perfil

  // Network info
  networkLevel: number
  totalReferrals: number
  activeReferrals: number

  // Performance
  personalSales: number
  teamSales: number
  personalVolume: number
  teamVolume: number

  // Status
  currentRank: string
  lifetimeRank: string
  rankHistory: RankHistory[]

  // Retention
  retentionRate: number
  churnRate: number

  // Financial
  totalEarnings: number
  pendingCommissions: number
  paidCommissions: number
  availableBalance: number

  // Tax info
  taxId?: string
  taxDocuments?: string[]

  updatedAt: Date
}

export interface RankHistory {
  rank: string
  achievedAt: Date
  maintainedUntil?: Date
  isMeritorious: boolean
}
