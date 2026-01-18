import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Card, CardSection, ScreenWrapper } from '@/components/ui';
import { spacing } from '@/config';
import { useThemeColors } from '@/contexts/ThemeContext';

/**
 * My Documents Screen
 *
 * Navigation: Standalone (no bottom tabs)
 * Access: Drawer menu → "My Documents"
 *
 * Document management and file storage.
 */

interface DocumentFolder {
  id: string;
  name: string;
  count: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const folders: DocumentFolder[] = [
  { id: '1', name: 'Receipts', count: 24, icon: 'receipt', color: '#6366F1' },
  { id: '2', name: 'Tax Documents', count: 8, icon: 'document-text', color: '#10B981' },
  { id: '3', name: 'Bank Statements', count: 12, icon: 'business', color: '#3B82F6' },
  { id: '4', name: 'Invoices', count: 5, icon: 'newspaper', color: '#F59E0B' },
];

const recentDocuments = [
  { id: '1', name: 'January_Statement.pdf', date: 'Jan 15, 2026', size: '245 KB' },
  { id: '2', name: 'Receipt_WholeFoods.jpg', date: 'Jan 14, 2026', size: '1.2 MB' },
  { id: '3', name: 'W2_2025.pdf', date: 'Jan 10, 2026', size: '89 KB' },
];

export default function DocumentsScreen() {
  const colors = useThemeColors();

  return (
    <ScreenWrapper
      title="My Documents"
      subtitle="Manage your files and receipts"
      mode="standalone"
      backIcon="back"
    >
      <CardSection title="Folders">
        <View style={styles.folderGrid}>
          {folders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              style={[styles.folderCard, { backgroundColor: colors.background }]}
              activeOpacity={0.7}
            >
              <View style={[styles.folderIcon, { backgroundColor: folder.color + '20' }]}>
                <Ionicons name={folder.icon} size={28} color={folder.color} />
              </View>
              <Text style={[styles.folderName, { color: colors.text }]}>{folder.name}</Text>
              <Text style={[styles.folderCount, { color: colors.textSecondary }]}>
                {folder.count} files
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </CardSection>

      <CardSection title="Recent Documents">
        {recentDocuments.map((doc, index) => (
          <Card key={doc.id} style={index < recentDocuments.length - 1 ? styles.docCard : undefined}>
            <TouchableOpacity style={styles.docRow} activeOpacity={0.7}>
              <View style={[styles.docIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="document" size={20} color={colors.primary} />
              </View>
              <View style={styles.docInfo}>
                <Text style={[styles.docName, { color: colors.text }]} numberOfLines={1}>
                  {doc.name}
                </Text>
                <Text style={[styles.docMeta, { color: colors.textSecondary }]}>
                  {doc.date} • {doc.size}
                </Text>
              </View>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        ))}
      </CardSection>

      <Card>
        <TouchableOpacity style={styles.uploadButton} activeOpacity={0.7}>
          <View style={[styles.uploadIcon, { backgroundColor: colors.accent + '20' }]}>
            <Ionicons name="cloud-upload" size={24} color={colors.accent} />
          </View>
          <View style={styles.uploadText}>
            <Text style={[styles.uploadTitle, { color: colors.text }]}>Upload Document</Text>
            <Text style={[styles.uploadDescription, { color: colors.textSecondary }]}>
              Add files from your device or cloud storage
            </Text>
          </View>
        </TouchableOpacity>
      </Card>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  folderGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  folderCard: {
    width: '47%',
    padding: spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  folderIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  folderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  folderCount: {
    fontSize: 12,
    marginTop: 2,
  },
  docCard: {
    marginBottom: spacing.sm,
  },
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  docIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  docName: {
    fontSize: 14,
    fontWeight: '500',
  },
  docMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  uploadTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  uploadDescription: {
    fontSize: 13,
    marginTop: 2,
  },
});
