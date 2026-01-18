/**
 * Mock Transaction Data
 *
 * Sample transactions for UI testing and development.
 */

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  type: 'income' | 'expense';
  merchant?: string;
  icon?: string;
}

export const mockTransactions: Transaction[] = [
  {
    id: 'txn-001',
    description: 'Grocery Store',
    amount: -127.45,
    date: '2026-01-18',
    category: 'Groceries',
    type: 'expense',
    merchant: 'Whole Foods Market',
    icon: 'cart',
  },
  {
    id: 'txn-002',
    description: 'Salary Deposit',
    amount: 4250.00,
    date: '2026-01-15',
    category: 'Income',
    type: 'income',
    merchant: 'Acme Corp',
    icon: 'briefcase',
  },
  {
    id: 'txn-003',
    description: 'Electric Bill',
    amount: -145.23,
    date: '2026-01-14',
    category: 'Utilities',
    type: 'expense',
    merchant: 'City Power',
    icon: 'bolt',
  },
  {
    id: 'txn-004',
    description: 'Coffee Shop',
    amount: -6.75,
    date: '2026-01-14',
    category: 'Dining',
    type: 'expense',
    merchant: 'Blue Bottle Coffee',
    icon: 'cup.and.saucer',
  },
  {
    id: 'txn-005',
    description: 'Gas Station',
    amount: -52.30,
    date: '2026-01-13',
    category: 'Transportation',
    type: 'expense',
    merchant: 'Shell',
    icon: 'car',
  },
  {
    id: 'txn-006',
    description: 'Online Shopping',
    amount: -89.99,
    date: '2026-01-12',
    category: 'Shopping',
    type: 'expense',
    merchant: 'Amazon',
    icon: 'bag',
  },
  {
    id: 'txn-007',
    description: 'Freelance Payment',
    amount: 750.00,
    date: '2026-01-10',
    category: 'Income',
    type: 'income',
    merchant: 'Client XYZ',
    icon: 'dollarsign.circle',
  },
  {
    id: 'txn-008',
    description: 'Restaurant',
    amount: -68.50,
    date: '2026-01-09',
    category: 'Dining',
    type: 'expense',
    merchant: 'The Italian Place',
    icon: 'fork.knife',
  },
  {
    id: 'txn-009',
    description: 'Gym Membership',
    amount: -49.99,
    date: '2026-01-08',
    category: 'Health & Fitness',
    type: 'expense',
    merchant: 'Planet Fitness',
    icon: 'figure.run',
  },
  {
    id: 'txn-010',
    description: 'Streaming Service',
    amount: -15.99,
    date: '2026-01-07',
    category: 'Entertainment',
    type: 'expense',
    merchant: 'Netflix',
    icon: 'play.tv',
  },
];

/**
 * Get transactions by category
 */
export function getTransactionsByCategory(category: string): Transaction[] {
  return mockTransactions.filter((t) => t.category === category);
}

/**
 * Get recent transactions (last N)
 */
export function getRecentTransactions(count: number = 5): Transaction[] {
  return [...mockTransactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * Calculate total balance from transactions
 */
export function calculateBalance(): number {
  return mockTransactions.reduce((sum, t) => sum + t.amount, 0);
}

/**
 * Get spending by category
 */
export function getSpendingByCategory(): Record<string, number> {
  return mockTransactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
      return acc;
    }, {} as Record<string, number>);
}
