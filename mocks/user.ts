/**
 * Mock User Data
 *
 * Sample user profiles and account data for UI testing.
 */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  currency: string;
  locale: string;
  notifications: boolean;
  biometricAuth: boolean;
  darkMode: 'auto' | 'light' | 'dark';
}

export interface BankAccount {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit';
  balance: number;
  institution: string;
  lastFour: string;
  isDefault: boolean;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly' | 'yearly';
}

// Sample authenticated user
export const mockUser: UserProfile = {
  id: 'user-001',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  phone: '+1 (555) 123-4567',
  createdAt: '2024-06-15T10:30:00Z',
  preferences: {
    currency: 'USD',
    locale: 'en-US',
    notifications: true,
    biometricAuth: true,
    darkMode: 'auto',
  },
};

// Sample guest user
export const mockGuestUser: UserProfile = {
  id: 'guest',
  name: 'Guest User',
  email: '',
  createdAt: new Date().toISOString(),
  preferences: {
    currency: 'USD',
    locale: 'en-US',
    notifications: false,
    biometricAuth: false,
    darkMode: 'auto',
  },
};

// Sample bank accounts
export const mockBankAccounts: BankAccount[] = [
  {
    id: 'acct-001',
    name: 'Primary Checking',
    type: 'checking',
    balance: 4523.67,
    institution: 'Chase Bank',
    lastFour: '4521',
    isDefault: true,
  },
  {
    id: 'acct-002',
    name: 'Savings',
    type: 'savings',
    balance: 12450.00,
    institution: 'Chase Bank',
    lastFour: '8832',
    isDefault: false,
  },
  {
    id: 'acct-003',
    name: 'Credit Card',
    type: 'credit',
    balance: -1245.89,
    institution: 'American Express',
    lastFour: '1001',
    isDefault: false,
  },
];

// Sample budgets
export const mockBudgets: Budget[] = [
  {
    id: 'budget-001',
    category: 'Groceries',
    limit: 600,
    spent: 427.45,
    period: 'monthly',
  },
  {
    id: 'budget-002',
    category: 'Dining',
    limit: 300,
    spent: 175.25,
    period: 'monthly',
  },
  {
    id: 'budget-003',
    category: 'Entertainment',
    limit: 150,
    spent: 65.98,
    period: 'monthly',
  },
  {
    id: 'budget-004',
    category: 'Transportation',
    limit: 400,
    spent: 252.30,
    period: 'monthly',
  },
  {
    id: 'budget-005',
    category: 'Shopping',
    limit: 200,
    spent: 189.99,
    period: 'monthly',
  },
];

/**
 * Get total balance across all accounts
 */
export function getTotalBalance(): number {
  return mockBankAccounts.reduce((sum, acct) => sum + acct.balance, 0);
}

/**
 * Get budget progress (percentage spent)
 */
export function getBudgetProgress(budgetId: string): number {
  const budget = mockBudgets.find((b) => b.id === budgetId);
  if (!budget) return 0;
  return Math.min((budget.spent / budget.limit) * 100, 100);
}

/**
 * Get budgets that are over or near limit (>80%)
 */
export function getOverspentBudgets(): Budget[] {
  return mockBudgets.filter((b) => b.spent / b.limit >= 0.8);
}

/**
 * Summary statistics for dashboard
 */
export interface DashboardSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savingsRate: number;
  upcomingBills: number;
  budgetsOnTrack: number;
  budgetsOverspent: number;
}

export function getDashboardSummary(): DashboardSummary {
  const overspent = getOverspentBudgets().length;
  return {
    totalBalance: getTotalBalance(),
    monthlyIncome: 5000.00,
    monthlyExpenses: 3456.78,
    savingsRate: 30.86,
    upcomingBills: 8,
    budgetsOnTrack: mockBudgets.length - overspent,
    budgetsOverspent: overspent,
  };
}
