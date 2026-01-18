/**
 * Feedback Modal Component
 *
 * A modal for submitting feedback including bug reports,
 * feature requests, and general feedback with optional quick ratings.
 */

import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { layout, spacing } from '@/config';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useTheme } from '@/contexts/ThemeContext';
import { FEEDBACK_TYPE_OPTIONS, FeedbackType } from '@/interfaces/feedback';

import { AppModal } from '../ui/Modal';

interface FeedbackTypeButtonProps {
  type: FeedbackType;
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}

function FeedbackTypeButton({ type, label, icon, isSelected, onPress }: FeedbackTypeButtonProps) {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity
      style={[
        styles.typeButton,
        {
          backgroundColor: isSelected ? `${colors.primary}15` : colors.surface,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.typeIconContainer,
          { backgroundColor: isSelected ? colors.primary : colors.surface },
        ]}
      >
        <Ionicons
          name={icon as any}
          size={20}
          color={isSelected ? '#FFFFFF' : colors.textSecondary}
        />
      </View>
      <Text
        style={[
          styles.typeLabel,
          { color: isSelected ? colors.primary : colors.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface QuickRatingButtonProps {
  rating: 'thumbs-up' | 'thumbs-down';
  isSelected: boolean;
  onPress: () => void;
}

function QuickRatingButton({ rating, isSelected, onPress }: QuickRatingButtonProps) {
  const { colors } = useTheme();
  const isPositive = rating === 'thumbs-up';
  const activeColor = isPositive ? '#22C55E' : '#EF4444';
  
  return (
    <TouchableOpacity
      style={[
        styles.ratingButton,
        {
          backgroundColor: isSelected ? `${activeColor}15` : colors.surface,
          borderColor: isSelected ? activeColor : colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons
        name={isPositive ? 'thumbs-up' : 'thumbs-down'}
        size={24}
        color={isSelected ? activeColor : colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

export function FeedbackModal() {
  const { colors } = useTheme();
  const {
    isModalVisible,
    selectedType,
    message,
    quickRating,
    isSubmitting,
    closeFeedbackModal,
    setFeedbackType,
    setMessage,
    setQuickRating,
    submitFeedback,
  } = useFeedback();

  const handleTypePress = (type: FeedbackType) => {
    setFeedbackType(type);
  };

  const handleQuickRating = (rating: 'thumbs-up' | 'thumbs-down') => {
    setQuickRating(quickRating === rating ? null : rating);
  };

  const handleSubmit = async () => {
    await submitFeedback();
  };

  return (
    <AppModal
      visible={isModalVisible}
      onClose={closeFeedbackModal}
      size="medium"
      title="Send Feedback"
      scrollable={true}
      primaryButton={{
        label: isSubmitting ? 'Submitting...' : 'Submit Feedback',
        onPress: handleSubmit,
        disabled: isSubmitting || !message.trim(),
      }}
    >
      <ScrollView 
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Feedback Type Selection */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Feedback Type
          </Text>
          <View style={styles.typeContainer}>
            {FEEDBACK_TYPE_OPTIONS.map((option) => (
              <FeedbackTypeButton
                key={option.type}
                type={option.type}
                label={option.label}
                icon={option.icon}
                isSelected={selectedType === option.type}
                onPress={() => handleTypePress(option.type)}
              />
            ))}
          </View>
        </View>

        {/* Message Input */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Message
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            placeholder="Tell us what's on your mind..."
            placeholderTextColor={colors.textMuted}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Quick Rating */}
        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            Quick Rating (Optional)
          </Text>
          <View style={styles.ratingContainer}>
            <QuickRatingButton
              rating="thumbs-up"
              isSelected={quickRating === 'thumbs-up'}
              onPress={() => handleQuickRating('thumbs-up')}
            />
            <QuickRatingButton
              rating="thumbs-down"
              isSelected={quickRating === 'thumbs-down'}
              onPress={() => handleQuickRating('thumbs-down')}
            />
          </View>
          <View style={styles.ratingHint}>
            <Text style={[styles.ratingHintText, { color: colors.textMuted }]}>
              {quickRating === 'thumbs-up'
                ? "Great! We're glad you're enjoying the app!"
                : quickRating === 'thumbs-down'
                ? "We're sorry to hear that. Your feedback helps us improve!"
                : 'How is your experience so far?'}
            </Text>
          </View>
        </View>

        {/* Loading Overlay */}
        {isSubmitting && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        )}
      </ScrollView>
    </AppModal>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flex: 1,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  typeContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: layout.inputRadius,
    borderWidth: 1.5,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    borderWidth: 1,
    borderRadius: layout.inputRadius,
    padding: 14,
    minHeight: 100,
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  ratingButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  ratingHint: {
    marginTop: spacing.sm,
  },
  ratingHintText: {
    fontSize: 13,
    lineHeight: 18,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: layout.cardRadius,
  },
});

export default FeedbackModal;
