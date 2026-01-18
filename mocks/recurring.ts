/**
 * Mock Recurring Transaction Data
 *
 * Sample subscriptions and recurring bills for UI testing.
 */

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'yearly';
export type RecurringStatus = 'active' | 'paused' | 'cancelled';

export interface RecurringTransaction {
  id: string;
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  nextDate: string;
  category: string;
  status: RecurringStatus;
  icon?: string;
  merchant?: string;
  startDate: string;
}

export const mockRecurringTransactions: RecurringTransaction[] = [
  {
    id: 'rec-001',
    name: 'Netflix',
    amount: 15.99,
    frequency: 'monthly',
    nextDate: '2026-02-07',
    category: 'Entertainment',
    status: 'active',
    icon: 'play.tv',
    merchant: 'Netflix Inc.',
    startDate: '2023-03-15',
  },
  {
    id: 'rec-002',
    name: 'Spotify Premium',
    amount: 10.99,
    frequency: 'monthly',
    nextDate: '2026-02-01',
    category: 'Entertainment',
    status: 'active',
    icon: 'music.note',
    merchant: 'Spotify AB',
    startDate: '2022-08-01',
  },
  {
    id: 'rec-003',
    name: 'Planet Fitness',
    amount: 49.99,
    frequency: 'monthly',
    nextDate: '2026-02-08',
    category: 'Health & Fitness',
    status: 'active',
    icon: 'figure.run',
    merchant: 'Planet Fitness',
    startDate: '2025-01-01',
  },
  {
    id: 'rec-004',
    name: 'Electric Bill',
    amount: 145.00,
    frequency: 'monthly',
    nextDate: '2026-02-14',
    category: 'Utilities',
    status: 'active',
    icon: 'bolt',
    merchant: 'City Power',
    startDate: '2020-06-01',
  },
  {
    id: 'rec-005',
    name: 'Internet',
    amount: 79.99,
    frequency: 'monthly',
    nextDate: '2026-02-05',
    category: 'Utilities',
    status: 'active',
    icon: 'wifi',
    merchant: 'Comcast',
    startDate: '2021-01-15',
  },
  {
    id: 'rec-006',
    name: 'Car Insurance',
    amount: 125.00,
    frequency: 'monthly',
    nextDate: '2026-02-01',
    category: 'Insurance',
    status: 'active',
    icon: 'car',
    merchant: 'State Farm',
    startDate: '2022-04-01',
  },
  {
    id: 'rec-007',
    name: 'Adobe Creative Cloud',
    amount: 54.99,
    frequency: 'monthly',
    nextDate: '2026-02-12',
    category: 'Software',
    status: 'active',
    icon: 'paintbrush',
    merchant: 'Adobe Inc.',
    startDate: '2024-02-12',
  },
  {
    id: 'rec-008',
    name: 'iCloud Storage',
    amount: 2.99,
    frequency: 'monthly',
    nextDate: '2026-02-20',
    category: 'Software',
    status: 'active',
    icon: 'icloud',
    merchant: 'Apple',
    startDate: '2019-10-20',
  },
  {
    id: 'rec-009',
    name: 'Rent',
    amount: 1850.00,
    frequency: 'monthly',
    nextDate: '2026-02-01',
    category: 'Housing',
    status: 'active',
    icon: 'house',
    merchant: 'Property Management LLC',
    startDate: '2024-01-01',
  },
  {
    id: 'rec-010',
    name: 'Phone Bill',
    amount: 85.00,
    frequency: 'monthly',
    nextDate: '2026-02-10',
    category: 'Utilities',
    status: 'active',
    icon: 'phone',
    merchant: 'Verizon',
    startDate: '2020-03-10',
  },
];

/**
 * Get recurring transactions by status
 */
export function getRecurringByStatus(status: RecurringStatus): RecurringTransaction[] {
  return mockRecurringTransactions.filter((r) => r.status === status);
}

/**
 * Get recurring transactions by category
 */
export function getRecurringByCategory(category: string): RecurringTransaction[] {
  return mockRecurringTransactions.filter((r) => r.category === category);
}

/**
 * Calculate monthly recurring total
 */
export function calculateMonthlyRecurringTotal(): number {
  return mockRecurringTransactions
    .filter((r) => r.status === 'active')
    .reduce((sum, r) => {
      // Normalize to monthly amount
      switch (r.frequency) {
        case 'weekly':
          return sum + r.amount * 4.33;
        case 'biweekly':
          return sum + r.amount * 2.17;
        case 'monthly':
          return sum + r.amount;
        case 'quarterly':
          return sum + r.amount / 3;
        case 'yearly':
          return sum + r.amount / 12;
        default:
          return sum + r.amount;
      }
    }, 0);
}

/**
 * Get upcoming recurring transactions (next 30 days)
 */
export function getUpcomingRecurring(): RecurringTransaction[] {
  const today = new Date();
  const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  return mockRecurringTransactions
    .filter((r) => {
      const nextDate = new Date(r.nextDate);
      return r.status === 'active' && nextDate >= today && nextDate <= thirtyDaysLater;
    })
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());
}
