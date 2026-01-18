/**
 * Mock Receipt Data
 *
 * Sample receipts for UI testing and development.
 */

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Receipt {
  id: string;
  merchant: string;
  date: string;
  total: number;
  tax: number;
  items: ReceiptItem[];
  category: string;
  imageUrl?: string;
  scannedAt?: string;
}

export const mockReceipts: Receipt[] = [
  {
    id: 'rcpt-001',
    merchant: 'Whole Foods Market',
    date: '2026-01-18',
    total: 127.45,
    tax: 8.75,
    category: 'Groceries',
    scannedAt: '2026-01-18T14:32:00Z',
    items: [
      { name: 'Organic Bananas', quantity: 1, price: 2.49 },
      { name: 'Almond Milk', quantity: 2, price: 7.98 },
      { name: 'Chicken Breast', quantity: 1, price: 12.99 },
      { name: 'Avocados (4 pack)', quantity: 1, price: 5.99 },
      { name: 'Greek Yogurt', quantity: 3, price: 8.97 },
      { name: 'Mixed Greens', quantity: 2, price: 9.98 },
      { name: 'Pasta', quantity: 2, price: 5.98 },
      { name: 'Olive Oil', quantity: 1, price: 14.99 },
      { name: 'Fresh Bread', quantity: 1, price: 4.99 },
      { name: 'Cheese Selection', quantity: 1, price: 18.99 },
      { name: 'Other Items', quantity: 1, price: 25.35 },
    ],
  },
  {
    id: 'rcpt-002',
    merchant: 'Target',
    date: '2026-01-15',
    total: 89.99,
    tax: 6.30,
    category: 'Shopping',
    scannedAt: '2026-01-15T11:20:00Z',
    items: [
      { name: 'Household Supplies', quantity: 3, price: 24.97 },
      { name: 'Personal Care', quantity: 2, price: 15.98 },
      { name: 'Snacks', quantity: 4, price: 19.96 },
      { name: 'Cleaning Products', quantity: 2, price: 22.78 },
    ],
  },
  {
    id: 'rcpt-003',
    merchant: 'Shell Gas Station',
    date: '2026-01-13',
    total: 52.30,
    tax: 0,
    category: 'Transportation',
    scannedAt: '2026-01-13T08:45:00Z',
    items: [
      { name: 'Regular Unleaded (12.5 gal)', quantity: 1, price: 52.30 },
    ],
  },
  {
    id: 'rcpt-004',
    merchant: 'The Italian Place',
    date: '2026-01-09',
    total: 68.50,
    tax: 5.12,
    category: 'Dining',
    scannedAt: '2026-01-09T20:15:00Z',
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 18.00 },
      { name: 'Chicken Parmesan', quantity: 1, price: 24.00 },
      { name: 'Caesar Salad', quantity: 1, price: 12.00 },
      { name: 'Tiramisu', quantity: 1, price: 9.38 },
    ],
  },
  {
    id: 'rcpt-005',
    merchant: 'CVS Pharmacy',
    date: '2026-01-05',
    total: 34.67,
    tax: 2.43,
    category: 'Health',
    scannedAt: '2026-01-05T16:30:00Z',
    items: [
      { name: 'Vitamins', quantity: 1, price: 15.99 },
      { name: 'Pain Relief', quantity: 1, price: 8.49 },
      { name: 'Band-Aids', quantity: 1, price: 7.76 },
    ],
  },
];

/**
 * Get receipts by category
 */
export function getReceiptsByCategory(category: string): Receipt[] {
  return mockReceipts.filter((r) => r.category === category);
}

/**
 * Get recent receipts
 */
export function getRecentReceipts(count: number = 5): Receipt[] {
  return [...mockReceipts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, count);
}

/**
 * Calculate total spending from receipts
 */
export function calculateReceiptTotal(): number {
  return mockReceipts.reduce((sum, r) => sum + r.total, 0);
}
