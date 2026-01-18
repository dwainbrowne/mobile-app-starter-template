import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card, CardSection, ScreenWrapper } from '@/components/ui';
import { spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * Scan Receipt Screen
 *
 * Navigation: Standalone (no bottom tabs)
 * Access: Quick Actions menu → "Scan Receipt"
 *
 * Camera interface for scanning and digitizing receipts.
 */

export default function ScanReceiptScreen() {
  const colors = useThemeColors();

  return (
    <ScreenWrapper
      title="Scan Receipt"
      subtitle="Capture and digitize receipts"
      mode="standalone"
      backIcon="close"
    >
      {/* Camera Placeholder */}
      <Card>
        <View style={[styles.cameraPlaceholder, { backgroundColor: colors.surface }]}>
          <View style={[styles.cameraFrame, { borderColor: colors.border }]}>
            <Ionicons name="camera" size={64} color={colors.textSecondary} />
            <Text style={[styles.cameraText, { color: colors.textSecondary }]}>
              Camera preview would appear here
            </Text>
          </View>
        </View>
      </Card>

      {/* Instructions */}
      <CardSection title="How to Scan">
        <Card>
          <View style={styles.instructionRow}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepText}>1</Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Position the receipt within the frame
            </Text>
          </View>
          <View style={styles.instructionRow}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepText}>2</Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Ensure good lighting and hold steady
            </Text>
          </View>
          <View style={styles.instructionRow}>
            <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepText}>3</Text>
            </View>
            <Text style={[styles.instructionText, { color: colors.text }]}>
              Tap the capture button to scan
            </Text>
          </View>
        </Card>
      </CardSection>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="images" size={24} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Gallery</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.captureButton, { backgroundColor: colors.primary }]}
          activeOpacity={0.7}
        >
          <Ionicons name="camera" size={32} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="flash" size={24} color={colors.text} />
          <Text style={[styles.buttonText, { color: colors.text }]}>Flash</Text>
        </TouchableOpacity>
      </View>

      {/* Recent Scans */}
      <CardSection title="Recent Scans">
        <Card>
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={40} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No recent scans
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Scanned receipts will appear here
            </Text>
          </View>
        </Card>
      </CardSection>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  cameraPlaceholder: {
    borderRadius: 12,
    padding: spacing.lg,
    alignItems: 'center',
  },
  cameraFrame: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraText: {
    fontSize: 14,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    paddingVertical: spacing.lg,
  },
  secondaryButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 10,
    marginTop: 2,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  emptyText: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: spacing.sm,
  },
  emptySubtext: {
    fontSize: 12,
    marginTop: 2,
  },
});
