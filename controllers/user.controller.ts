/**
 * User Controller
 * 
 * Handles user profile and preferences operations.
 */

import { API_ENDPOINTS, CACHE_CONFIG, CACHE_KEYS } from '@/constants/api';
import type { ApiResponse } from '@/interfaces/api';
import { apiService } from '@/services/api.service';
import { cacheService } from '@/services/cache.service';

/**
 * User profile type
 */
export interface UserProfile {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  phone?: string;
  timezone?: string;
  locale?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * User preferences type
 */
export interface UserPreferences {
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  startOfWeek: 'sunday' | 'monday';
  defaultCategory?: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
}

/**
 * Notification preferences
 */
export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  transactionAlerts: boolean;
  recurringReminders: boolean;
  budgetAlerts: boolean;
  weeklyReport: boolean;
  monthlyReport: boolean;
}

/**
 * Privacy preferences
 */
export interface PrivacyPreferences {
  shareAnalytics: boolean;
  showBalances: boolean;
  biometricLock: boolean;
}

/**
 * DTO for updating profile
 */
export interface UpdateProfileDTO {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phone?: string;
  timezone?: string;
  locale?: string;
}

/**
 * User Controller
 */
class UserController {
  private readonly api = apiService;
  private readonly cache = cacheService;

  /**
   * Get cache key with optional suffix
   */
  private getCacheKey(suffix?: string): string {
    const base = CACHE_KEYS.USER_PROFILE;
    return suffix ? `${base}_${suffix}` : base;
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.api.get<UserProfile>(API_ENDPOINTS.USERS.PROFILE, {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.MEDIUM,
      cacheKey: this.getCacheKey('profile'),
    });
  }

  /**
   * Update user profile
   */
  async updateProfile(data: UpdateProfileDTO): Promise<ApiResponse<UserProfile>> {
    const response = await this.api.put<UserProfile, UpdateProfileDTO>(
      API_ENDPOINTS.USERS.UPDATE_PROFILE,
      data
    );

    // Invalidate profile cache on successful update
    if (response.success) {
      await this.cache.clearKey(this.getCacheKey('profile'));
    }

    return response;
  }

  /**
   * Get user preferences
   */
  async getPreferences(): Promise<ApiResponse<UserPreferences>> {
    return this.api.get<UserPreferences>(API_ENDPOINTS.USERS.PREFERENCES, {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.LONG,
      cacheKey: this.getCacheKey('preferences'),
    });
  }

  /**
   * Update user preferences
   */
  async updatePreferences(
    data: Partial<UserPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    const response = await this.api.patch<UserPreferences, Partial<UserPreferences>>(
      API_ENDPOINTS.USERS.PREFERENCES,
      data
    );

    // Invalidate preferences cache on successful update
    if (response.success) {
      await this.cache.clearKey(this.getCacheKey('preferences'));
    }

    return response;
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    data: Partial<NotificationPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    const currentPrefs = await this.getPreferences();
    
    if (!currentPrefs.success || !currentPrefs.data) {
      return currentPrefs;
    }

    return this.updatePreferences({
      notifications: {
        ...currentPrefs.data.notifications,
        ...data,
      },
    });
  }

  /**
   * Update privacy preferences
   */
  async updatePrivacyPreferences(
    data: Partial<PrivacyPreferences>
  ): Promise<ApiResponse<UserPreferences>> {
    const currentPrefs = await this.getPreferences();
    
    if (!currentPrefs.success || !currentPrefs.data) {
      return currentPrefs;
    }

    return this.updatePreferences({
      privacy: {
        ...currentPrefs.data.privacy,
        ...data,
      },
    });
  }

  /**
   * Upload avatar image
   */
  async uploadAvatar(file: {
    uri: string;
    type: string;
    name: string;
  }): Promise<ApiResponse<UserProfile>> {
    const formData = new FormData();
    
    formData.append('avatar', {
      uri: file.uri,
      type: file.type,
      name: file.name,
    } as unknown as Blob);

    const response = await this.api.upload<UserProfile>(
      `${API_ENDPOINTS.USERS.PROFILE}/avatar`,
      formData
    );

    // Invalidate profile cache on successful upload
    if (response.success) {
      await this.cache.clearKey(this.getCacheKey('profile'));
    }

    return response;
  }

  /**
   * Delete avatar
   */
  async deleteAvatar(): Promise<ApiResponse<UserProfile>> {
    const response = await this.api.delete<UserProfile>(
      `${API_ENDPOINTS.USERS.PROFILE}/avatar`
    );

    // Invalidate profile cache on successful delete
    if (response.success) {
      await this.cache.clearKey(this.getCacheKey('profile'));
    }

    return response;
  }

  /**
   * Get user by ID (for admin/lookup purposes)
   */
  async getUserById(id: string): Promise<ApiResponse<UserProfile>> {
    return this.api.get<UserProfile>(API_ENDPOINTS.USERS.BY_ID(id), {
      useCache: true,
      expiry: CACHE_CONFIG.EXPIRY.SHORT,
      cacheKey: this.getCacheKey(`user_${id}`),
    });
  }

  /**
   * Invalidate all user-related caches
   */
  async invalidateAllCaches(): Promise<void> {
    await this.cache.invalidatePattern(CACHE_KEYS.USER_PROFILE);
    await this.cache.invalidatePattern(CACHE_KEYS.USER_PREFERENCES);
  }

  /**
   * Delete user account
   */
  async deleteAccount(): Promise<ApiResponse<void>> {
    const response = await this.api.delete<void>(API_ENDPOINTS.USERS.PROFILE);

    if (response.success) {
      // Clear all caches on account deletion
      await this.cache.clearCache();
    }

    return response;
  }
}

// Export singleton instance
export const userController = new UserController();

export default userController;
