export enum BonusType {
  FAST_START = 'fast_start',
  LEADERSHIP = 'leadership',
  RANK_ADVANCEMENT = 'rank_advancement',
  CAR = 'car',
  TRAVEL = 'travel',
  POOL = 'pool',
  INFINITY = 'infinity',
  MATCHING = 'matching',
  GENERATION = 'generation',
  PERFORMANCE = 'performance',
  SPECIAL = 'special'
}

export enum BonusStatus {
  PENDING = 'pending',
  QUALIFIED = 'qualified',
  APPROVED = 'approved',
  PAID = 'paid',
  CANCELLED = 'cancelled',
  FORFEITED = 'forfeited'
}

export enum BonusFrequency {
  ONE_TIME = 'one_time',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual'
}

export interface Bonus {
  id: string
  userId: string

  type: BonusType
  name: string
  description: string

  amount: number
  currency: string

  status: BonusStatus
  frequency: BonusFrequency

  // Qualification
  qualifiedAt?: Date
  qualificationPeriod?: {
    start: Date
    end: Date
  }

  // Requirements met
  requirementsMet: Record<string, boolean>
  qualificationData?: Record<string, any>

  // Payment
  approvedAt?: Date
  paidAt?: Date
  paymentId?: string

  // Metadata
  notes?: string
  metadata?: Record<string, any>

  createdAt: Date
  updatedAt: Date
}

export interface BonusProgram {
  id: string
  name: string
  type: BonusType
  description: string
  platform: 'iacelera' | 'ifedem' | 'both'

  // Status
  isActive: boolean
  startDate: Date
  endDate?: Date

  // Frequency
  frequency: BonusFrequency
  isRecurring: boolean

  // Requirements
  requirements: BonusRequirement[]
  minimumRank?: string

  // Reward
  rewardType: 'cash' | 'points' | 'product' | 'travel' | 'other'
  rewardAmount?: number
  rewardCurrency?: string
  rewardDescription?: string

  // Pool bonus specific
  isPoolBonus?: boolean
  poolPercentage?: number
  poolDistribution?: 'equal' | 'ranked' | 'volume_weighted'

  // Limits
  maxWinnersPerPeriod?: number
  maxPayoutPerPerson?: number

  // Rules
  rules?: string[]
  terms?: string

  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface BonusRequirement {
  id: string
  type: 'rank' | 'volume' | 'sales' | 'referrals' | 'team_size' | 'custom'
  description: string

  // Values
  minimumValue?: number
  targetValue?: number

  // Time frame
  timeframe?: 'current_period' | 'last_30_days' | 'last_90_days' | 'lifetime'

  // Custom evaluation
  customEvaluationFunction?: string
}

export interface BonusEligibility {
  userId: string
  bonusProgramId: string
  isEligible: boolean

  requirementsMet: Record<string, boolean>
  missingRequirements: string[]

  projectedAmount?: number
  qualificationProgress: Record<string, number>

  evaluatedAt: Date
}

export interface PoolBonusDistribution {
  bonusProgramId: string
  period: string

  totalPool: number
  totalQualified: number
  distributedAmount: number

  participants: PoolParticipant[]

  calculatedAt: Date
  distributedAt?: Date
}

export interface PoolParticipant {
  userId: string
  userName: string
  rank: string

  qualificationMetric: number
  sharePercentage: number
  bonusAmount: number

  status: BonusStatus
}
