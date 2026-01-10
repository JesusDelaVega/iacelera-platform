export enum NetworkType {
  BINARY = 'binary',
  TRINIRY = 'trinity',
  UNILEVEL = 'unilevel',
  MATRIX = 'matrix'
}

export enum LegPosition {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center'
}

export interface NetworkNode {
  id: string
  userId: string
  userName: string
  email: string

  // Hierarchy
  parentId?: string
  sponsorId: string
  level: number
  position?: LegPosition

  // Network type specific
  networkType: NetworkType

  // Performance
  personalVolume: number
  teamVolume: number
  leftLegVolume?: number // Binary/Trinity
  rightLegVolume?: number // Binary/Trinity
  centerLegVolume?: number // Trinity

  personalSales: number
  teamSales: number

  // Status
  rank: string
  status: string
  isActive: boolean

  // Counts
  directReferrals: number
  totalDownline: number
  activeDownline: number

  // Dates
  joinedAt: Date
  lastActivityAt: Date
}

export interface NetworkTree {
  rootNode: NetworkNode
  children: NetworkTree[]
  depth: number
}

export interface NetworkStats {
  userId: string

  // Structure
  totalLevels: number
  totalMembers: number
  activeMembers: number

  // Performance
  totalVolume: number
  totalSales: number

  // Binary specific
  leftLegCount?: number
  rightLegCount?: number
  leftLegVolume?: number
  rightLegVolume?: number
  carryOverLeft?: number
  carryOverRight?: number

  // By level
  membersByLevel: Record<number, number>
  volumeByLevel: Record<number, number>

  generatedAt: Date
}

export interface Placement {
  userId: string
  parentId: string
  sponsorId: string
  position?: LegPosition
  networkType: NetworkType
  autoPlacement: boolean
  placementStrategy?: 'left_fill' | 'right_fill' | 'balanced' | 'power_leg'
  createdAt: Date
}

export interface BinaryMatch {
  id: string
  userId: string

  leftLegVolume: number
  rightLegVolume: number
  matchedVolume: number

  carryOverLeft: number
  carryOverRight: number

  commissionAmount: number
  commissionRate: number

  period: string
  calculatedAt: Date
}
