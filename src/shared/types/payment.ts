export enum PaymentMethod {
  STRIPE = 'stripe',
  CRYPTO = 'crypto',
  BANK_TRANSFER = 'bank_transfer',
  WALLET = 'wallet',
  CASH = 'cash'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

export enum WithdrawalStatus {
  REQUESTED = 'requested',
  PENDING = 'pending',
  APPROVED = 'approved',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled'
}

export interface Payment {
  id: string
  userId: string
  orderId?: string

  amount: number
  currency: string
  fee: number
  netAmount: number

  method: PaymentMethod
  status: PaymentStatus

  // Provider specific
  providerId?: string
  providerData?: Record<string, any>

  // Crypto specific
  cryptoAddress?: string
  cryptoTxHash?: string
  cryptoNetwork?: string

  // Bank transfer
  bankAccount?: string
  bankReference?: string

  // Metadata
  description?: string
  metadata?: Record<string, any>

  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

export interface Withdrawal {
  id: string
  userId: string
  withdrawalNumber: string

  amount: number
  currency: string
  fee: number
  netAmount: number

  method: PaymentMethod
  status: WithdrawalStatus

  // Destination
  destination: WithdrawalDestination

  // Approval
  requestedAt: Date
  approvedAt?: Date
  approvedBy?: string
  rejectedAt?: Date
  rejectedBy?: string
  rejectionReason?: string

  // Processing
  processingAt?: Date
  processedBy?: string
  completedAt?: Date

  // Provider
  providerId?: string
  providerData?: Record<string, any>

  // Tax withholding
  taxWithheld?: number
  taxRate?: number

  // Notes
  notes?: string
  metadata?: Record<string, any>

  createdAt: Date
  updatedAt: Date
}

export interface WithdrawalDestination {
  type: PaymentMethod

  // Bank details
  bankName?: string
  accountHolder?: string
  accountNumber?: string
  routingNumber?: string
  swiftCode?: string
  iban?: string

  // Crypto
  cryptoAddress?: string
  cryptoNetwork?: string

  // Wallet
  walletId?: string
  walletEmail?: string
  walletPhone?: string
}

export interface WalletBalance {
  userId: string

  availableBalance: number
  pendingBalance: number
  totalEarnings: number
  totalWithdrawals: number

  currency: string

  lastUpdated: Date
}

export interface WalletTransaction {
  id: string
  userId: string

  type: 'credit' | 'debit'
  amount: number
  currency: string

  balanceBefore: number
  balanceAfter: number

  // Source
  sourceType: 'commission' | 'bonus' | 'withdrawal' | 'refund' | 'adjustment' | 'purchase'
  sourceId?: string
  description: string

  // Metadata
  metadata?: Record<string, any>

  createdAt: Date
}

export interface WithdrawalSettings {
  minimumAmount: number
  maximumAmount?: number
  withdrawalFeePercentage: number
  withdrawalFeeFixed: number
  processingDays: number
  availableMethods: PaymentMethod[]
  requiresApproval: boolean
  autoApproveUnder?: number
}
