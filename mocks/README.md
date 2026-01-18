# Mock Data

Sample data for UI testing and development. Import from `@/mocks` to use.

## Available Mock Data

### Transactions (`transactions.ts`)
- `mockTransactions` - Array of sample transactions
- `getTransactionsByCategory(category)` - Filter by category
- `getRecentTransactions(count)` - Get most recent N transactions
- `calculateBalance()` - Sum of all transactions
- `getSpendingByCategory()` - Spending breakdown by category

### Receipts (`receipts.ts`)
- `mockReceipts` - Array of sample receipts with line items
- `getReceiptsByCategory(category)` - Filter by category
- `getRecentReceipts(count)` - Get most recent N receipts
- `calculateReceiptTotal()` - Sum of all receipt totals

### Recurring (`recurring.ts`)
- `mockRecurringTransactions` - Array of subscriptions/bills
- `getRecurringByStatus(status)` - Filter by active/paused/cancelled
- `getRecurringByCategory(category)` - Filter by category
- `calculateMonthlyRecurringTotal()` - Total monthly recurring costs
- `getUpcomingRecurring()` - Bills due in next 30 days

### User (`user.ts`)
- `mockUser` - Sample authenticated user profile
- `mockGuestUser` - Guest user profile
- `mockBankAccounts` - Array of connected accounts
- `mockBudgets` - Array of budget categories
- `getTotalBalance()` - Sum across all accounts
- `getBudgetProgress(id)` - Percentage of budget used
- `getOverspentBudgets()` - Budgets at >80% spent
- `getDashboardSummary()` - Quick stats for dashboard

## Usage Example

```typescript
import { 
  mockTransactions,
  getRecentTransactions,
  mockUser,
  getDashboardSummary 
} from '@/mocks';

// Use in components
const recent = getRecentTransactions(5);
const summary = getDashboardSummary();
```

## Adding New Mock Data

1. Create a new file in `/mocks` (e.g., `goals.ts`)
2. Define interfaces and mock data arrays
3. Add helper functions for common operations
4. Export from `index.ts`
