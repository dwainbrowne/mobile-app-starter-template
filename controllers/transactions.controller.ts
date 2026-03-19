/**
 * Transactions Controller
 * 
 * Handles all transaction-related business logic and API operations.
 */

import { API_ENDPOINTS, CACHE_CONFIG, CACHE_KEYS } from '@/constants/api';
import type {
    ApiResponse,
    PaginatedResponse,
    PaginationParams,
    SearchParams,
} from '@/interfaces/api';
import { apiService } from '@/services/api.service';
import { BaseController } from './base.controller';

/**
 * Transaction entity type
 * Define your actual transaction structure here
 */
export interface Transaction {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  accountId?: string;
  tags?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * DTO for creating a transaction
 */
export interface CreateTransactionDTO {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'income' | 'expense';
  accountId?: string;
  tags?: string[];
  notes?: string;
}

/**
 * DTO for updating a transaction
 */
export interface UpdateTransactionDTO extends Partial<CreateTransactionDTO> {}

/**
 * Transaction summary response
 */
export interface TransactionSummary {
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  byCategory: Record<string, number>;
  periodStart: string;
  periodEnd: string;
}

/**
 * Transaction search filters
 */
export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

/**
 * Transactions Controller
 */
class TransactionsController extends BaseController<
  Transaction,
  CreateTransactionDTO,
  UpdateTransactionDTO
> {
  constructor() {
    super({
      baseEndpoint: API_ENDPOINTS.TRANSACTIONS.BASE,
      cacheKey: CACHE_KEYS.TRANSACTIONS,
      defaultExpiry: CACHE_CONFIG.EXPIRY.SHORT,
      cacheList: true,
      cacheGet: true,
    });
  }

  /**
   * Search transactions with filters
   */
  async search(
    params: SearchParams & TransactionFilters
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    const queryParams = new URLSearchParams();

    // Pagination
    if (params.page) queryParams.set('page', String(params.page));
    if (params.pageSize) queryParams.set('pageSize', String(params.pageSize));
    if (params.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    // Search
    if (params.query) queryParams.set('q', params.query);

    // Filters
    if (params.type) queryParams.set('type', params.type);
    if (params.category) queryParams.set('category', params.category);
    if (params.minAmount) queryParams.set('minAmount', String(params.minAmount));
    if (params.maxAmount) queryParams.set('maxAmount', String(params.maxAmount));
    if (params.startDate) queryParams.set('startDate', params.startDate);
    if (params.endDate) queryParams.set('endDate', params.endDate);
    if (params.tags?.length) queryParams.set('tags', params.tags.join(','));

    const queryString = queryParams.toString();
    const endpoint = queryString 
      ? `${API_ENDPOINTS.TRANSACTIONS.SEARCH}?${queryString}`
      : API_ENDPOINTS.TRANSACTIONS.SEARCH;

    return apiService.get<PaginatedResponse<Transaction>>(endpoint, {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.SHORT,
      cacheKey: this.getCacheKey(`search_${queryString}`),
    });
  }

  /**
   * Get transaction summary for a period
   */
  async getSummary(
    startDate?: string,
    endDate?: string
  ): Promise<ApiResponse<TransactionSummary>> {
    const queryParams = new URLSearchParams();
    if (startDate) queryParams.set('startDate', startDate);
    if (endDate) queryParams.set('endDate', endDate);

    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.TRANSACTIONS.SUMMARY}?${queryString}`
      : API_ENDPOINTS.TRANSACTIONS.SUMMARY;

    return apiService.get<TransactionSummary>(endpoint, {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.SHORT,
      cacheKey: this.getCacheKey(`summary_${startDate}_${endDate}`),
    });
  }

  /**
   * Get transactions by category
   */
  async getByCategory(
    category: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return this.search({ ...params, category });
  }

  /**
   * Get transactions by type (income/expense)
   */
  async getByType(
    type: 'income' | 'expense',
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return this.search({ ...params, type });
  }

  /**
   * Get transactions for a date range
   */
  async getByDateRange(
    startDate: string,
    endDate: string,
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Transaction>>> {
    return this.search({ ...params, startDate, endDate });
  }

  /**
   * Get all transaction categories
   */
  async getCategories(): Promise<ApiResponse<string[]>> {
    return apiService.get<string[]>(API_ENDPOINTS.TRANSACTIONS.CATEGORIES, {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.LONG,
      cacheKey: this.getCacheKey('categories'),
    });
  }

  /**
   * Get recent transactions
   */
  async getRecent(limit: number = 10): Promise<ApiResponse<Transaction[]>> {
    const response = await this.getAll({
      page: 1,
      pageSize: limit,
      sortBy: 'date',
      sortOrder: 'desc',
    });

    // Transform paginated response to simple array
    return {
      ...response,
      data: response.data?.items ?? null,
    } as ApiResponse<Transaction[]>;
  }
}

// Export singleton instance
export const transactionsController = new TransactionsController();

export default transactionsController;
