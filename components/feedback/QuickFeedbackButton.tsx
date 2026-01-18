/**
 * Quick Feedback Button Component
 *
 * A floating button or inline component for quick thumbs up/down feedback.
 * Can be used standalone or as a supplement to the full feedback modal.
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { QuickFeedbackRating } from '@/interfaces/feedback';

interface QuickFeedbackButtonProps {
  /** Style variant */
  variant?: 'floating' | 'inline' | 'compact';
  /** Show label text */
  showLabel?: boolean;
  /** Custom label text */
  label?: string;
  /** Callback after successful submission */
  onSubmitted?: (rating: QuickFeedbackRating) => void;
}

export function QuickFeedbackButton({
  variant = 'inline',
  showLabel = true,
  label = 'Was this helpful?',
  onSubmitted,
}: QuickFeedbackButtonProps) {
  const { colors } = useTheme();
  const { submitQuickFeedback, openFeedbackModal } = useFeedback();
  const [selectedRating, setSelectedRating] = useState<QuickFeedbackRating>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRating = async (rating: QuickFeedbackRating) => {
    if (isSubmitted) return;
    
    setSelectedRating(rating);
    const success = await submitQuickFeedback(rating);
    
    if (success) {
      setIsSubmitted(true);
      onSubmitted?.(rating);
    }
  };

  const handleMoreFeedback = () => {
    openFeedbackModal('general');
  };

  if (isSubmitted) {
    return (
      <View style={[styles.container, styles[`${variant}Container`]]}>
        <View style={styles.thankYouContainer}>
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          <Text style={[styles.thankYouText, { color: colors.text }]}>
            Thanks for your feedback!
          </Text>
        </View>
        <TouchableOpacity onPress={handleMoreFeedback} activeOpacity={0.7}>
          <Text style={[styles.moreLink, { color: colors.primary }]}>
            Want to tell us more?
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (variant === 'floating') {
    return (
      <View style={[styles.floatingContainer, { backgroundColor: colors.surface }]}>
        <Text style={[styles.floatingLabel, { color: colors.text }]}>
          {label}
        </Text>
        <View style={styles.floatingButtons}>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              selectedRating === 'thumbs-up' && styles.selectedPositive,
            ]}
            onPress={() => handleRating('thumbs-up')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="thumbs-up"
              size={18}
              color={selectedRating === 'thumbs-up' ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.floatingButton,
              selectedRating === 'thumbs-down' && styles.selectedNegative,
            ]}
            onPress={() => handleRating('thumbs-down')}
            activeOpacity={0.7}
          >
            <Ionicons
              name="thumbs-down"
              size={18}
              color={selectedRating === 'thumbs-down' ? '#FFFFFF' : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (variant === 'compact') {
    return (
      <View style={styles.compactContainer}>
        <TouchableOpacity
          style={[
            styles.compactButton,
            { borderColor: colors.border },
            selectedRating === 'thumbs-up' && styles.selectedPositive,
          ]}
          onPress={() => handleRating('thumbs-up')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="thumbs-up-outline"
            size={16}
            color={selectedRating === 'thumbs-up' ? '#FFFFFF' : colors.textSecondary}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.compactButton,
            { borderColor: colors.border },
            selectedRating === 'thumbs-down' && styles.selectedNegative,
          ]}
          onPress={() => handleRating('thumbs-down')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="thumbs-down-outline"
            size={16}
            color={selectedRating === 'thumbs-down' ? '#FFFFFF' : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    );
  }

  // Default inline variant
  return (
    <View style={[styles.container, styles.inlineContainer]}>
      {showLabel && (
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          {label}
        </Text>
      )}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.inlineButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
            selectedRating === 'thumbs-up' && styles.selectedPositive,
          ]}
          onPress={() => handleRating('thumbs-up')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="thumbs-up"
            size={20}
            color={selectedRating === 'thumbs-up' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.buttonLabel,
              {
                color: selectedRating === 'thumbs-up' ? '#FFFFFF' : colors.text,
              },
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.inlineButton,
            { backgroundColor: colors.surface, borderColor: colors.border },
            selectedRating === 'thumbs-down' && styles.selectedNegative,
          ]}
          onPress={() => handleRating('thumbs-down')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="thumbs-down"
            size={20}
            color={selectedRating === 'thumbs-down' ? '#FFFFFF' : colors.textSecondary}
          />
          <Text
            style={[
              styles.buttonLabel,
              {
                color: selectedRating === 'thumbs-down' ? '#FFFFFF' : colors.text,
              },
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  inlineContainer: {
    paddingVertical: 16,
  },
  floatingContainer: {
    position: 'absolute',
    bottom: 100,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 10,
  },
  floatingLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  floatingButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  floatingButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  compactContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  compactButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectedPositive: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  selectedNegative: {
    backgroundColor: '#EF4444',
    borderColor: '#EF4444',
  },
  thankYouContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  thankYouText: {
    fontSize: 14,
    fontWeight: '500',
  },
  moreLink: {
    fontSize: 13,
    fontWeight: '500',
  },
});

export default QuickFeedbackButton;
