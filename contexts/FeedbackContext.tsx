/**
 * Feedback Context
 *
 * Provides feedback modal management and submission logic.
 * Handles bug reports, feature requests, and general feedback.
 */

import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react';
import { Alert, Platform } from 'react-native';

import type {
    FeedbackContextValue,
    FeedbackPayload,
    FeedbackType,
    QuickFeedbackRating,
} from '@/interfaces/feedback';

const FeedbackContext = createContext<FeedbackContextValue | undefined>(undefined);

interface FeedbackProviderProps {
  children: ReactNode;
}

export function FeedbackProvider({ children }: FeedbackProviderProps) {
  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState<FeedbackType>('bug');
  const [message, setMessage] = useState('');
  const [quickRating, setQuickRating] = useState<QuickFeedbackRating>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Open feedback modal
  const openFeedbackModal = useCallback((initialType: FeedbackType = 'bug') => {
    setSelectedType(initialType);
    setMessage('');
    setQuickRating(null);
    setIsModalVisible(true);
  }, []);

  // Close feedback modal
  const closeFeedbackModal = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  // Set feedback type
  const setFeedbackType = useCallback((type: FeedbackType) => {
    setSelectedType(type);
  }, []);

  // Reset feedback state
  const resetFeedback = useCallback(() => {
    setSelectedType('bug');
    setMessage('');
    setQuickRating(null);
    setIsSubmitting(false);
  }, []);

  // Submit full feedback
  const submitFeedback = useCallback(async (): Promise<boolean> => {
    if (!message.trim()) {
      Alert.alert('Missing Message', 'Please enter your feedback message.');
      return false;
    }

    setIsSubmitting(true);

    try {
      const payload: FeedbackPayload = {
        type: selectedType,
        message: message.trim(),
        quickRating,
        timestamp: new Date().toISOString(),
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version?.toString() || 'unknown',
        },
      };

      // TODO: Replace with actual API call
      console.log('Submitting feedback:', payload);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success
      Alert.alert(
        'Thank You!',
        'Your feedback has been submitted successfully. We appreciate your input!',
        [{ text: 'OK', onPress: closeFeedbackModal }]
      );
      
      resetFeedback();
      return true;
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      Alert.alert(
        'Submission Failed',
        'Unable to submit your feedback. Please try again later.'
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [message, selectedType, quickRating, closeFeedbackModal, resetFeedback]);

  // Submit quick feedback (thumbs up/down only)
  const submitQuickFeedback = useCallback(async (rating: QuickFeedbackRating): Promise<boolean> => {
    if (!rating) return false;

    try {
      const payload: FeedbackPayload = {
        type: 'general',
        message: rating === 'thumbs-up' ? 'Quick positive feedback' : 'Quick negative feedback',
        quickRating: rating,
        timestamp: new Date().toISOString(),
        deviceInfo: {
          platform: Platform.OS,
          version: Platform.Version?.toString() || 'unknown',
        },
      };

      // TODO: Replace with actual API call
      console.log('Submitting quick feedback:', payload);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Success - show brief toast or notification
      Alert.alert('Thanks!', 'Your feedback has been recorded.');
      
      return true;
    } catch (error) {
      console.error('Failed to submit quick feedback:', error);
      return false;
    }
  }, []);

  const value: FeedbackContextValue = {
    // State
    isModalVisible,
    selectedType,
    message,
    quickRating,
    isSubmitting,
    // Actions
    openFeedbackModal,
    closeFeedbackModal,
    setFeedbackType,
    setMessage,
    setQuickRating,
    submitFeedback,
    submitQuickFeedback,
    resetFeedback,
  };

  return (
    <FeedbackContext.Provider value={value}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback(): FeedbackContextValue {
  const context = useContext(FeedbackContext);
  if (!context) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
}

export default FeedbackContext;
