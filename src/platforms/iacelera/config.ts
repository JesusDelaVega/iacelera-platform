import type { Rank } from '@/shared/types/commission'
import type { BonusProgram } from '@/shared/types/bonus'
import { NetworkType } from '@/shared/types/network'

export const IACELERA_CONFIG = {
  name: 'iAcelera',
  description: 'Incubadora de Emprendedores',
  networkType: NetworkType.BINARY, // or TRINITY

  // Commission settings
  commissions: {
    maxLevels: Infinity, // Infinite with binary matching
    directSalesRate: 0.1, // 10%
    binaryMatchRate: 0.1, // 10%
    paymentSchedule: {
      calculation: 'daily',
      payout: 'weekly', // or 'daily' if user chooses
      rankCalculation: 'monthly'
    }
  },

  // Rank settings
  ranks: [
    {
      id: 'bronze',
      name: 'Bronze',
      level: 1,
      platform: 'iacelera',
      requirements: {
        personalVolume: 100,
        teamVolume: 0,
        activeReferrals: 2
      },
      benefits: {
        commissionRate: 0.05,
        unlockedBonuses: ['fast_start']
      },
      canDowngrade: true,
      isMeritorious: false,
      color: '#CD7F32'
    },
    {
      id: 'silver',
      name: 'Silver',
      level: 2,
      platform: 'iacelera',
      requirements: {
        personalVolume: 300,
        teamVolume: 1000,
        activeReferrals: 4
      },
      benefits: {
        commissionRate: 0.08,
        unlockedBonuses: ['fast_start', 'leadership']
      },
      canDowngrade: true,
      isMeritorious: false,
      color: '#C0C0C0'
    },
    {
      id: 'gold',
      name: 'Gold',
      level: 3,
      platform: 'iacelera',
      requirements: {
        personalVolume: 500,
        teamVolume: 5000,
        activeReferrals: 6
      },
      benefits: {
        commissionRate: 0.1,
        unlockedBonuses: ['fast_start', 'leadership', 'car']
      },
      canDowngrade: true,
      isMeritorious: false,
      color: '#FFD700'
    },
    {
      id: 'platinum',
      name: 'Platinum',
      level: 4,
      platform: 'iacelera',
      requirements: {
        personalVolume: 1000,
        teamVolume: 15000,
        activeReferrals: 8
      },
      benefits: {
        commissionRate: 0.12,
        unlockedBonuses: ['fast_start', 'leadership', 'car', 'travel']
      },
      canDowngrade: true,
      isMeritorious: false,
      color: '#E5E4E2'
    },
    {
      id: 'ruby',
      name: 'Ruby',
      level: 5,
      platform: 'iacelera',
      requirements: {
        personalVolume: 2000,
        teamVolume: 50000,
        activeReferrals: 10
      },
      benefits: {
        commissionRate: 0.15,
        unlockedBonuses: ['fast_start', 'leadership', 'car', 'travel', 'pool']
      },
      canDowngrade: false,
      isMeritorious: true,
      color: '#E0115F'
    },
    {
      id: 'emerald',
      name: 'Emerald',
      level: 6,
      platform: 'iacelera',
      requirements: {
        personalVolume: 3000,
        teamVolume: 100000,
        activeReferrals: 12
      },
      benefits: {
        commissionRate: 0.18,
        unlockedBonuses: ['fast_start', 'leadership', 'car', 'travel', 'pool', 'infinity']
      },
      canDowngrade: false,
      isMeritorious: true,
      color: '#50C878'
    },
    {
      id: 'diamond',
      name: 'Diamond',
      level: 7,
      platform: 'iacelera',
      requirements: {
        personalVolume: 5000,
        teamVolume: 250000,
        activeReferrals: 15
      },
      benefits: {
        commissionRate: 0.2,
        unlockedBonuses: ['fast_start', 'leadership', 'car', 'travel', 'pool', 'infinity', 'matching']
      },
      canDowngrade: false,
      isMeritorious: true,
      color: '#B9F2FF'
    },
    {
      id: 'crown_diamond',
      name: 'Crown Diamond',
      level: 8,
      platform: 'iacelera',
      requirements: {
        personalVolume: 10000,
        teamVolume: 500000,
        activeReferrals: 20
      },
      benefits: {
        commissionRate: 0.25,
        unlockedBonuses: ['fast_start', 'leadership', 'car', 'travel', 'pool', 'infinity', 'matching', 'generation']
      },
      canDowngrade: false,
      isMeritorious: true,
      color: '#6A0DAD'
    }
  ] as Rank[],

  // Product categories
  productCategories: ['physical', 'digital', 'membership', 'course', 'bundle', 'starter_kit'],

  // Starter kits
  starterKits: [
    {
      id: 'basic',
      name: 'Basic Starter Kit',
      price: 99,
      bv: 100,
      includes: ['Affiliate license', 'Basic training', 'Marketing materials']
    },
    {
      id: 'professional',
      name: 'Professional Starter Kit',
      price: 299,
      bv: 300,
      includes: ['Affiliate license', 'Advanced training', 'Premium marketing materials', 'Product samples']
    },
    {
      id: 'executive',
      name: 'Executive Starter Kit',
      price: 999,
      bv: 1000,
      includes: [
        'Affiliate license',
        'Complete training package',
        'Premium marketing materials',
        'Product bundle',
        'Personal mentorship'
      ]
    }
  ],

  // Withdrawal settings
  withdrawal: {
    minimumAmount: 25, // USD or 500 MXN
    withdrawalFeePercentage: 2,
    withdrawalFeeFixed: 1,
    processingDays: 7,
    availableMethods: ['stripe', 'bank_transfer', 'wallet', 'crypto', 'cash'],
    requiresApproval: true,
    autoApproveUnder: 500
  }
}
