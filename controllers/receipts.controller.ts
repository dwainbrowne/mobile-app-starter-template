/**
 * Receipts Controller
 * 
 * Handles all receipt-related business logic and API operations.
 * Includes specialized methods for upload and scanning.
 */

import { API_ENDPOINTS, CACHE_CONFIG, CACHE_KEYS } from '@/constants/api';
import type {
    ApiResponse,
    PaginatedResponse,
    PaginationParams,
    UploadOptions,
} from '@/interfaces/api';
import { apiService } from '@/services/api.service';
import { BaseController } from './base.controller';

/**
 * Receipt entity type
 */
export interface Receipt {
  id: string;
  fileName: string;
  fileUrl: string;
  thumbnailUrl?: string;
  merchantName?: string;
  amount?: number;
  date?: string;
  category?: string;
  transactionId?: string;
  status: 'pending' | 'processed' | 'failed';
  ocrData?: ReceiptOCRData;
  createdAt: string;
  updatedAt: string;
}

/**
 * OCR extracted data from receipt
 */
export interface ReceiptOCRData {
  merchantName?: string;
  merchantAddress?: string;
  date?: string;
  total?: number;
  subtotal?: number;
  tax?: number;
  items?: ReceiptItem[];
  paymentMethod?: string;
  confidence: number;
}

/**
 * Receipt line item
 */
export interface ReceiptItem {
  description: string;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
}

/**
 * DTO for creating a receipt (manual entry)
 */
export interface CreateReceiptDTO {
  merchantName?: string;
  amount?: number;
  date?: string;
  category?: string;
  notes?: string;
}

/**
 * DTO for updating a receipt
 */
export interface UpdateReceiptDTO extends Partial<CreateReceiptDTO> {
  transactionId?: string;
}

/**
 * Upload result
 */
export interface UploadReceiptResult {
  receipt: Receipt;
  uploadId: string;
  status: 'uploaded' | 'processing';
}

/**
 * Scan/process result
 */
export interface ProcessReceiptResult {
  receipt: Receipt;
  ocrData: ReceiptOCRData;
  suggestedCategory?: string;
  matchedTransaction?: string;
}

/**
 * Receipts Controller
 */
class ReceiptsController extends BaseController<
  Receipt,
  CreateReceiptDTO,
  UpdateReceiptDTO
> {
  constructor() {
    super({
      baseEndpoint: API_ENDPOINTS.RECEIPTS.BASE,
      cacheKey: CACHE_KEYS.RECEIPTS,
      defaultExpiry: CACHE_CONFIG.EXPIRY.MEDIUM,
      cacheList: true,
      cacheGet: true,
    });
  }

  /**
   * Upload a receipt image
   */
  async upload(
    file: {
      uri: string;
      type: string;
      name: string;
    },
    options?: UploadOptions
  ): Promise<ApiResponse<UploadReceiptResult>> {
    const formData = new FormData();
    
    // Append file - React Native format
    formData.append(options?.fieldName ?? 'file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as unknown as Blob);

    // Append additional data if provided
    if (options?.additionalData) {
      for (const [key, value] of Object.entries(options.additionalData)) {
        formData.append(key, value);
      }
    }

    const response = await apiService.upload<UploadReceiptResult>(
      API_ENDPOINTS.RECEIPTS.UPLOAD,
      formData,
      options
    );

    // Invalidate list cache on successful upload
    if (response.success) {
      await this.invalidateListCache();
    }

    return response;
  }

  /**
   * Upload multiple receipt images
   */
  async uploadMultiple(
    files: Array<{
      uri: string;
      type: string;
      name: string;
    }>,
    options?: UploadOptions
  ): Promise<ApiResponse<UploadReceiptResult[]>> {
    const formData = new FormData();
    
    // Append all files
    files.forEach((file, index) => {
      formData.append(`files`, {
        uri: file.uri,
        type: file.type,
        name: file.name,
      } as unknown as Blob);
    });

    // Append additional data if provided
    if (options?.additionalData) {
      for (const [key, value] of Object.entries(options.additionalData)) {
        formData.append(key, value);
      }
    }

    const response = await apiService.upload<UploadReceiptResult[]>(
      API_ENDPOINTS.RECEIPTS.UPLOAD,
      formData,
      options
    );

    // Invalidate list cache on successful upload
    if (response.success) {
      await this.invalidateListCache();
    }

    return response;
  }

  /**
   * Scan a receipt image (upload and process with OCR)
   */
  async scan(
    file: {
      uri: string;
      type: string;
      name: string;
    }
  ): Promise<ApiResponse<ProcessReceiptResult>> {
    const formData = new FormData();
    
    formData.append('file', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as unknown as Blob);

    const response = await apiService.upload<ProcessReceiptResult>(
      API_ENDPOINTS.RECEIPTS.SCAN,
      formData
    );

    // Invalidate list cache on successful scan
    if (response.success) {
      await this.invalidateListCache();
    }

    return response;
  }

  /**
   * Process/re-process an existing receipt with OCR
   */
  async process(receiptId: string): Promise<ApiResponse<ProcessReceiptResult>> {
    const response = await apiService.post<ProcessReceiptResult>(
      API_ENDPOINTS.RECEIPTS.PROCESS,
      { receiptId }
    );

    // Invalidate caches on successful process
    if (response.success) {
      await this.invalidateItemCache(receiptId);
    }

    return response;
  }

  /**
   * Get receipts by status
   */
  async getByStatus(
    status: Receipt['status'],
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    const queryParams = new URLSearchParams();
    queryParams.set('status', status);
    
    if (params?.page) queryParams.set('page', String(params.page));
    if (params?.pageSize) queryParams.set('pageSize', String(params.pageSize));
    if (params?.sortBy) queryParams.set('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.set('sortOrder', params.sortOrder);

    const queryString = queryParams.toString();
    const endpoint = `${API_ENDPOINTS.RECEIPTS.BASE}?${queryString}`;

    return apiService.get<PaginatedResponse<Receipt>>(endpoint, {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.SHORT,
      cacheKey: this.getCacheKey(`status_${status}_${JSON.stringify(params)}`),
    });
  }

  /**
   * Get unprocessed (pending) receipts
   */
  async getPending(
    params?: PaginationParams
  ): Promise<ApiResponse<PaginatedResponse<Receipt>>> {
    return this.getByStatus('pending', params);
  }

  /**
   * Link receipt to transaction
   */
  async linkToTransaction(
    receiptId: string,
    transactionId: string
  ): Promise<ApiResponse<Receipt>> {
    return this.patch(receiptId, { transactionId });
  }

  /**
   * Get receipts linked to a transaction
   */
  async getByTransaction(
    transactionId: string
  ): Promise<ApiResponse<Receipt[]>> {
    const endpoint = `${API_ENDPOINTS.RECEIPTS.BASE}?transactionId=${transactionId}`;
    
    return apiService.get<Receipt[]>(endpoint, {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.MEDIUM,
      cacheKey: this.getCacheKey(`transaction_${transactionId}`),
    });
  }
}

// Export singleton instance
export const receiptsController = new ReceiptsController();

export default receiptsController;
