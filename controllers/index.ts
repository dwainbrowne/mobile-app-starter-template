/**
 * Controllers Index
 * 
 * Barrel export for all controllers.
 */

// Base controller
export { BaseController } from './base.controller';
export type { ControllerConfig } from './base.controller';

// Domain controllers
export { transactionsController } from './transactions.controller';
export type {
    CreateTransactionDTO, Transaction, TransactionFilters, TransactionSummary, UpdateTransactionDTO
} from './transactions.controller';

export { receiptsController } from './receipts.controller';
export type {
    CreateReceiptDTO, ProcessReceiptResult, Receipt, ReceiptItem, ReceiptOCRData, UpdateReceiptDTO,
    UploadReceiptResult
} from './receipts.controller';

export { userController } from './user.controller';
export type {
    NotificationPreferences,
    PrivacyPreferences,
    UpdateProfileDTO, UserPreferences, UserProfile
} from './user.controller';

