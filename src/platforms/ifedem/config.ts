import type { Rank } from '@/shared/types/commission'
import { NetworkType } from '@/shared/types/network'

export const IFEDEM_CONFIG = {
  name: 'IFEDEM',
  description: 'Plataforma Educativa',
  networkType: NetworkType.UNILEVEL,

  // Commission settings
  commissions: {
    maxLevels: 3, // Unilevel 2-3 levels
    levels: [
      { level: 1, rate: 0.15 }, // 15% level 1
      { level: 2, rate: 0.08 }, // 8% level 2
      { level: 3, rate: 0.05 } // 5% level 3
    ],
    directSalesRate: 0.2, // 20%
    paymentSchedule: {
      calculation: 'daily',
      payout: 'weekly', // or 'daily' if user chooses
      rankCalculation: 'monthly'
    }
  },

  // Rank settings (simpler than iAcelera)
  ranks: [
    {
      id: 'affiliate',
      name: 'Affiliate',
      level: 1,
      platform: 'ifedem',
      requirements: {
        personalVolume: 50,
        activeReferrals: 1
      },
      benefits: {
        commissionRate: 0.15,
        unlockedBonuses: []
      },
      canDowngrade: true,
      isMeritorious: false,
      color: '#4A90E2'
    },
    {
      id: 'senior_affiliate',
      name: 'Senior Affiliate',
      level: 2,
      platform: 'ifedem',
      requirements: {
        personalVolume: 200,
        teamVolume: 1000,
        activeReferrals: 3
      },
      benefits: {
        commissionRate: 0.18,
        unlockedBonuses: ['performance']
      },
      canDowngrade: true,
      isMeritorious: false,
      color: '#7B68EE'
    },
    {
      id: 'master_educator',
      name: 'Master Educator',
      level: 3,
      platform: 'ifedem',
      requirements: {
        personalVolume: 500,
        teamVolume: 5000,
        activeReferrals: 5
      },
      benefits: {
        commissionRate: 0.2,
        unlockedBonuses: ['performance', 'leadership']
      },
      canDowngrade: false,
      isMeritorious: true,
      color: '#FFD700'
    },
    {
      id: 'elite_mentor',
      name: 'Elite Mentor',
      level: 4,
      platform: 'ifedem',
      requirements: {
        personalVolume: 1000,
        teamVolume: 15000,
        activeReferrals: 8
      },
      benefits: {
        commissionRate: 0.25,
        unlockedBonuses: ['performance', 'leadership', 'pool']
      },
      canDowngrade: false,
      isMeritorious: true,
      color: '#DC143C'
    }
  ] as Rank[],

  // Product categories (educational focus)
  productCategories: ['course', 'membership', 'certification', 'mentorship', 'digital'],

  // Membership options
  memberships: [
    {
      id: 'basic',
      name: 'Basic Membership',
      price: 29,
      bv: 30,
      recurringInterval: 'monthly',
      includes: ['Access to basic courses', 'Community forum', 'Monthly webinar']
    },
    {
      id: 'professional',
      name: 'Professional Membership',
      price: 79,
      bv: 80,
      recurringInterval: 'monthly',
      includes: [
        'Access to all courses',
        'Community forum',
        'Weekly webinars',
        'Certificate of completion',
        'Priority support'
      ]
    },
    {
      id: 'premium',
      name: 'Premium Membership',
      price: 149,
      bv: 150,
      recurringInterval: 'monthly',
      includes: [
        'Access to all courses',
        'Community forum',
        'Weekly webinars',
        'All certifications',
        'Personal mentorship',
        'Exclusive masterclasses'
      ]
    },
    {
      id: 'annual_pro',
      name: 'Annual Professional',
      price: 799,
      bv: 900,
      recurringInterval: 'yearly',
      includes: [
        'All Professional benefits',
        '2 months free',
        'Annual conference ticket',
        'Professional certification'
      ]
    }
  ],

  // Rewards program
  rewardsProgram: {
    enabled: true,
    pointsPerDollar: 1,
    redemptionOptions: [
      { type: 'discount', pointsCost: 100, value: 10 },
      { type: 'course', pointsCost: 500, value: 'Free course' },
      { type: 'upgrade', pointsCost: 1000, value: 'Membership upgrade' }
    ]
  },

  // Withdrawal settings
  withdrawal: {
    minimumAmount: 25, // USD or 500 MXN
    withdrawalFeePercentage: 1.5,
    withdrawalFeeFixed: 0.5,
    processingDays: 5,
    availableMethods: ['stripe', 'bank_transfer', 'wallet'],
    requiresApproval: true,
    autoApproveUnder: 500
  }
}
