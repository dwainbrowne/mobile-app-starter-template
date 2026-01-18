/**
 * Modal Demo Screen - Showcases the reusable AppModal component
 *
 * Navigation: Tabbed (keeps bottom tabs visible)
 * Access: Drawer menu → "Modal Examples"
 *
 * Demonstrates:
 * - Medium and Tall modal sizes
 * - Dynamic content swapping
 * - OK/Cancel button configurations
 * - Blur background effect
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppModal, Card, CardSection } from '@/components/ui';
import { layout, spacing } from '@/config';
import { useTheme } from '@/contexts/ThemeContext';

export default function ModalScreen() {
  const { colors } = useTheme();

  // Modal states
  const [showMediumModal, setShowMediumModal] = useState(false);
  const [showTallModal, setShowTallModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const handleConfirm = () => {
    setShowConfirmModal(false);
    Alert.alert('Success', 'Action confirmed!');
  };

  const handleFormSubmit = () => {
    setShowFormModal(false);
    Alert.alert('Success', 'Form submitted successfully!');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
      >
        {/* Page Header */}
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Modal Examples</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            Tap buttons to see different modal configurations
          </Text>
        </View>

        <Text style={[styles.description, { color: colors.textSecondary }]}>
          The modal component features a blur background, animated entrance/exit, and supports dynamic content.
        </Text>

        {/* Modal Size Examples */}
        <CardSection title="Modal Sizes">
          <Card>
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: colors.primary }]}
              onPress={() => setShowMediumModal(true)}
            >
              <Ionicons name="resize-outline" size={20} color="#FFFFFF" />
              <Text style={styles.demoButtonText}>Medium Modal (60%)</Text>
            </TouchableOpacity>

            <View style={styles.buttonSpacer} />

            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: colors.accent }]}
              onPress={() => setShowTallModal(true)}
            >
              <Ionicons name="expand-outline" size={20} color="#FFFFFF" />
              <Text style={styles.demoButtonText}>Tall Modal (85%)</Text>
            </TouchableOpacity>
          </Card>
        </CardSection>

        {/* Use Case Examples */}
        <CardSection title="Use Case Examples">
          <Card>
            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#EF4444' }]}
              onPress={() => setShowConfirmModal(true)}
            >
              <Ionicons name="warning-outline" size={20} color="#FFFFFF" />
              <Text style={styles.demoButtonText}>Confirmation Dialog</Text>
            </TouchableOpacity>

            <View style={styles.buttonSpacer} />

            <TouchableOpacity
              style={[styles.demoButton, { backgroundColor: '#10B981' }]}
              onPress={() => setShowFormModal(true)}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.demoButtonText}>Form Modal</Text>
            </TouchableOpacity>
          </Card>
        </CardSection>

        {/* Info Card */}
        <Card>
          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Buttons are part of the internal component. The modal supports scrollable content for longer forms.
            </Text>
          </View>
        </Card>
      </ScrollView>

      {/* Medium Modal */}
      <AppModal
        visible={showMediumModal}
        onClose={() => setShowMediumModal(false)}
        size="medium"
        title="Medium Modal"
        primaryButton={{
          label: 'Got it',
          onPress: () => setShowMediumModal(false),
        }}
      >
        <View style={styles.modalContent}>
          <View style={[styles.modalIcon, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="resize-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Medium Size Modal</Text>
          <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
            This modal takes up 60% of the screen height. It&apos;s perfect for simple confirmations, brief information displays, or quick actions.
          </Text>
        </View>
      </AppModal>

      {/* Tall Modal */}
      <AppModal
        visible={showTallModal}
        onClose={() => setShowTallModal(false)}
        size="tall"
        title="Tall Modal"
        primaryButton={{
          label: 'Close',
          onPress: () => setShowTallModal(false),
        }}
        secondaryButton={{
          label: 'Cancel',
          onPress: () => setShowTallModal(false),
        }}
      >
        <View style={styles.modalContent}>
          <View style={[styles.modalIcon, { backgroundColor: colors.accent + '15' }]}>
            <Ionicons name="expand-outline" size={48} color={colors.accent} />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Tall Size Modal</Text>
          <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
            This modal takes up 85% of the screen height. It&apos;s ideal for forms, detailed content, lists, or any content that needs more space.
          </Text>

          <View style={styles.featureList}>
            <Text style={[styles.featureHeader, { color: colors.text }]}>Features:</Text>
            {['Blur background overlay', 'Animated entrance/exit', 'Scrollable content', 'Dynamic sizing', 'Customizable buttons'].map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
              </View>
            ))}
          </View>
        </View>
      </AppModal>

      {/* Confirmation Modal */}
      <AppModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        size="medium"
        title="Confirm Action"
        primaryButton={{
          label: 'Delete',
          onPress: handleConfirm,
          variant: 'danger',
        }}
        secondaryButton={{
          label: 'Cancel',
          onPress: () => setShowConfirmModal(false),
        }}
      >
        <View style={styles.modalContent}>
          <View style={[styles.modalIcon, { backgroundColor: '#EF444415' }]}>
            <Ionicons name="trash-outline" size={48} color="#EF4444" />
          </View>
          <Text style={[styles.modalTitle, { color: colors.text }]}>Delete Item?</Text>
          <Text style={[styles.modalDescription, { color: colors.textSecondary }]}>
            Are you sure you want to delete this item? This action cannot be undone.
          </Text>
        </View>
      </AppModal>

      {/* Form Modal */}
      <AppModal
        visible={showFormModal}
        onClose={() => setShowFormModal(false)}
        size="tall"
        title="Add New Item"
        primaryButton={{
          label: 'Save',
          onPress: handleFormSubmit,
        }}
        secondaryButton={{
          label: 'Cancel',
          onPress: () => setShowFormModal(false),
        }}
      >
        <View style={styles.modalContent}>
          <Text style={[styles.formLabel, { color: colors.textSecondary }]}>ITEM NAME</Text>
          <View style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formPlaceholder, { color: colors.textMuted }]}>Enter item name...</Text>
          </View>

          <Text style={[styles.formLabel, { color: colors.textSecondary }]}>DESCRIPTION</Text>
          <View style={[styles.formInput, styles.formTextarea, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formPlaceholder, { color: colors.textMuted }]}>Enter description...</Text>
          </View>

          <Text style={[styles.formLabel, { color: colors.textSecondary }]}>CATEGORY</Text>
          <View style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formPlaceholder, { color: colors.textMuted }]}>Select category...</Text>
            <Ionicons name="chevron-down" size={20} color={colors.textSecondary} />
          </View>

          <Text style={[styles.formLabel, { color: colors.textSecondary }]}>AMOUNT</Text>
          <View style={[styles.formInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.formPlaceholder, { color: colors.textMuted }]}>$0.00</Text>
          </View>
        </View>
      </AppModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: layout.screenPadding,
    paddingBottom: layout.tabBarPadding,
    gap: layout.listItemGap,
  },
  header: {
    marginBottom: spacing.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSpacer: {
    height: 12,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },

  // Modal Content Styles
  modalContent: {
    alignItems: 'center',
  },
  modalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  featureList: {
    width: '100%',
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  featureHeader: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
  },

  // Form Styles
  formLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  formInput: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 16,
  },
  formTextarea: {
    minHeight: 80,
    alignItems: 'flex-start',
    paddingTop: 12,
  },
  formPlaceholder: {
    fontSize: 15,
  },
});
