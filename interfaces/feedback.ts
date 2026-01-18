/**
 * Feedback Interfaces
 *
 * Type definitions for the feedback system
 */

/**
 * Feedback type options
 */
export type FeedbackType = 'bug' | 'feature' | 'general';

/**
 * Quick feedback rating
 */
export type QuickFeedbackRating = 'thumbs-up' | 'thumbs-down' | null;

/**
 * Feedback submission payload
 */
export interface FeedbackPayload {
  type: FeedbackType;
  message: string;
  quickRating?: QuickFeedbackRating;
  timestamp: string;
  deviceInfo?: {
    platform: string;
    version: string;
  };
  userEmail?: string;
  screenshot?: string;
}

/**
 * Feedback type option for UI
 */
export interface FeedbackTypeOption {
  type: FeedbackType;
  label: string;
  icon: string;
  description: string;
}

/**
 * Feedback context value
 */
export interface FeedbackContextValue {
  // State
  isModalVisible: boolean;
  selectedType: FeedbackType;
  message: string;
  quickRating: QuickFeedbackRating;
  isSubmitting: boolean;
  
  // Actions
  openFeedbackModal: (initialType?: FeedbackType) => void;
  closeFeedbackModal: () => void;
  setFeedbackType: (type: FeedbackType) => void;
  setMessage: (message: string) => void;
  setQuickRating: (rating: QuickFeedbackRating) => void;
  submitFeedback: () => Promise<boolean>;
  submitQuickFeedback: (rating: QuickFeedbackRating) => Promise<boolean>;
  resetFeedback: () => void;
}

/**
 * Feedback type options configuration
 */
export const FEEDBACK_TYPE_OPTIONS: FeedbackTypeOption[] = [
  {
    type: 'bug',
    label: 'Bug Report',
    icon: 'bug',
    description: 'Report a problem or error',
  },
  {
    type: 'feature',
    label: 'Feature',
    icon: 'bulb',
    description: 'Suggest a new feature',
  },
  {
    type: 'general',
    label: 'General',
    icon: 'chatbubble-ellipses',
    description: 'General feedback or question',
  },
];
