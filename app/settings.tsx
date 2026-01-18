import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Card, CardSection } from '@/components/ui';
import { appIdentity } from '@/config';
import { getDarkThemeOptions } from '@/constants/themes';
import { useFeedback } from '@/contexts/FeedbackContext';
import { useSettings, useTeam, useUserProfile } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';
import type { ThemeStyle } from '@/interfaces/theme';

// Theme style preview colors for the selector
const themePreviewColors: Record<ThemeStyle, string> = {
  grey: '#334155',
  forest: '#1A2E1F',
  ocean: '#132944',
  midnight: '#000000',
};

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { appName } = appIdentity;

  // Theme context
  const { colors, isDark, style, setStyle, toggleMode } = useTheme();

  // Settings context
  const { settings, updateNotifications, updatePreferences } = useSettings();
  const profile = useUserProfile();
  const team = useTeam();

  // Feedback context
  const { openFeedbackModal } = useFeedback();

  const darkThemeOptions = getDarkThemeOptions();

  // Setting row component
  const SettingRow = ({
    icon,
    title,
    subtitle,
    value,
    onValueChange,
    showChevron = false,
    onPress,
    rightContent,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    showChevron?: boolean;
    onPress?: () => void;
    rightContent?: React.ReactNode;
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress && !onValueChange}
    >
      <View style={styles.settingLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={icon} size={20} color={colors.primary} />
        </View>
        <View style={styles.settingTextContainer}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      {onValueChange !== undefined && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: colors.border, true: colors.accent }}
          thumbColor={value ? '#FFFFFF' : '#F4F3F4'}
        />
      )}
      {showChevron && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
      {rightContent}
    </TouchableOpacity>
  );

  // Theme style button component
  const ThemeStyleButton = ({ themeStyle }: { themeStyle: ThemeStyle }) => {
    const isSelected = style === themeStyle;

    return (
      <TouchableOpacity
        style={[
          styles.themeButton,
          { backgroundColor: themePreviewColors[themeStyle] },
          isSelected && { borderColor: colors.accent, borderWidth: 3 },
        ]}
        onPress={() => setStyle(themeStyle)}
      >
        {isSelected && (
          <View style={[styles.themeCheckmark, { backgroundColor: colors.accent }]}>
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Account Section */}
        <CardSection title="Account">
          {/* User Profile Card */}
          <Card padding="medium">
            <View style={styles.profileHeader}>
              <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                {profile.avatarUrl ? (
                  <Image source={{ uri: profile.avatarUrl }} style={styles.avatarImage} />
                ) : (
                  <Text style={styles.avatarText}>{profile.displayName.charAt(0).toUpperCase()}</Text>
                )}
              </View>
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: colors.text }]}>{profile.displayName}</Text>
                {profile.email && (
                  <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>{profile.email}</Text>
                )}
              </View>
              <TouchableOpacity style={[styles.signOutButton, { backgroundColor: colors.accent }]} onPress={() => {}}>
                <Ionicons name="log-out-outline" size={16} color="#FFFFFF" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.profileRow, { borderTopColor: colors.border }]}>
              <View style={styles.profileRowLeft}>
                <Ionicons name="person-outline" size={18} color={colors.textSecondary} />
                <Text style={[styles.profileRowLabel, { color: colors.textSecondary }]}>Display Name</Text>
              </View>
              <View style={styles.profileRowRight}>
                <Text style={[styles.profileRowValue, { color: colors.text }]}>{profile.displayName}</Text>
                <TouchableOpacity>
                  <Text style={[styles.editText, { color: colors.accent }]}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </CardSection>

        {/* Team Section */}
        <CardSection title="Team">
          {/* Team Members Card */}
          <Card padding="medium">
            <View style={styles.teamHeader}>
              <View style={styles.teamTitleRow}>
                <Ionicons name="people-outline" size={20} color={colors.primary} />
                <Text style={[styles.teamTitle, { color: colors.text }]}>Team Members</Text>
              </View>
              <Text style={[styles.teamSubtitle, { color: colors.textSecondary }]}>
                {team.members.length} / {team.maxMembers} users ({team.plan.charAt(0).toUpperCase() + team.plan.slice(1)} Plan)
              </Text>
              <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]}>
                <Ionicons name="person-add" size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {team.members.length > 0 ? (
              team.members.map((member) => (
                <View key={member.id} style={[styles.memberRow, { borderTopColor: colors.border }]}>
                  <View style={[styles.memberAvatar, { backgroundColor: colors.primaryLight }]}>
                    {member.avatarUrl ? (
                      <Image source={{ uri: member.avatarUrl }} style={styles.memberAvatarImage} />
                    ) : (
                      <Text style={styles.memberAvatarText}>{member.name.charAt(0).toUpperCase()}</Text>
                    )}
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={[styles.memberName, { color: colors.text }]}>{member.name}</Text>
                    <Text style={[styles.memberEmail, { color: colors.textSecondary }]}>{member.email}</Text>
                  </View>
                  <View style={[styles.roleBadge, { backgroundColor: member.role === 'owner' ? colors.accent : colors.primary }]}>
                    <Text style={styles.roleBadgeText}>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>No team members yet</Text>
            )}
          </Card>
        </CardSection>

        {/* Appearance Section */}
        <CardSection title="Appearance">
          {/* Dark Mode Card */}
          <Card padding="medium">
            <View style={styles.appearanceHeader}>
              <Ionicons name="moon-outline" size={20} color={colors.primary} />
              <View style={styles.appearanceTitleContainer}>
                <Text style={[styles.appearanceTitle, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.appearanceSubtitle, { color: colors.textSecondary }]}>Enable dark theme</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={() => toggleMode()}
                trackColor={{ false: colors.border, true: colors.accent }}
                thumbColor={isDark ? '#FFFFFF' : '#F4F3F4'}
              />
            </View>

            {isDark && (
              <>
                <Text style={[styles.themeStyleLabel, { color: colors.textSecondary }]}>THEME STYLE</Text>
                <View style={styles.themeStyleRow}>
                  {(['grey', 'forest', 'ocean', 'midnight'] as ThemeStyle[]).map((themeStyle) => (
                    <View key={themeStyle} style={styles.themeStyleItem}>
                      <ThemeStyleButton themeStyle={themeStyle} />
                      <Text style={[styles.themeStyleName, { color: colors.text }]}>
                        {themeStyle.charAt(0).toUpperCase() + themeStyle.slice(1)}
                      </Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </Card>

          {/* Categories Card */}
          <Card padding="medium">
            <View style={styles.categoriesHeader}>
              <View style={styles.categoriesTitleRow}>
                <Ionicons name="pricetags-outline" size={20} color={colors.primary} />
                <View>
                  <Text style={[styles.categoriesTitle, { color: colors.text }]}>Categories</Text>
                  <Text style={[styles.categoriesSubtitle, { color: colors.textSecondary }]}>
                    Customize which categories you see when adding transactions
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.addButton, { backgroundColor: colors.accent }]}>
                <Ionicons name="add" size={16} color="#FFFFFF" />
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoriesPreview}>
              {settings.categories.slice(0, 4).map((category) => (
                <View key={category.id} style={[styles.categoryChip, { backgroundColor: category.color + '20' }]}>
                  <Ionicons name={category.icon as keyof typeof Ionicons.glyphMap} size={14} color={category.color} />
                  <Text style={[styles.categoryChipText, { color: category.color }]}>{category.name}</Text>
                </View>
              ))}
              {settings.categories.length > 4 && (
                <Text style={[styles.moreCategoriesText, { color: colors.textSecondary }]}>
                  +{settings.categories.length - 4} more
                </Text>
              )}
            </View>
          </Card>
        </CardSection>

        {/* Preferences Section */}
        <CardSection title="Preferences">
          <Card padding="none">
            <SettingRow
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive alerts and updates"
              value={settings.notifications.pushEnabled}
              onValueChange={(value) => updateNotifications({ pushEnabled: value })}
            />
            <SettingRow
              icon="hand-left"
              title="Haptic Feedback"
              subtitle="Vibration on touch"
              value={settings.preferences.hapticFeedback}
              onValueChange={(value) => updatePreferences({ hapticFeedback: value })}
            />
            <View style={styles.lastSettingRow}>
              <SettingRow
                icon="volume-high"
                title="Sound Effects"
                subtitle="Play sounds for actions"
                value={settings.preferences.soundEffects}
                onValueChange={(value) => updatePreferences({ soundEffects: value })}
              />
            </View>
          </Card>
        </CardSection>

        {/* Account Settings Section */}
        <CardSection title="Account Settings">
          <Card padding="none">
            <SettingRow
              icon="person"
              title="Profile"
              showChevron
              onPress={() => {}}
            />
            <SettingRow
              icon="shield-checkmark"
              title="Privacy & Security"
              showChevron
              onPress={() => {}}
            />
            <View style={styles.lastSettingRow}>
              <SettingRow
                icon="card"
                title="Subscription"
                showChevron
                onPress={() => {}}
              />
            </View>
          </Card>
        </CardSection>

        {/* Support Section */}
        <CardSection title="Support">
          <Card padding="none">
            <SettingRow
              icon="help-circle"
              title="Help Center"
              showChevron
              onPress={() => {}}
            />
            <SettingRow
              icon="chatbubble"
              title="Contact Us"
              showChevron
              onPress={() => {}}
            />
            <SettingRow
              icon="send"
              title="Send Feedback"
              subtitle="Report bugs, suggest features"
              showChevron
              onPress={() => openFeedbackModal()}
            />
            <SettingRow
              icon="document-text"
              title="Terms of Service"
              showChevron
              onPress={() => {}}
            />
            <View style={styles.lastSettingRow}>
              <SettingRow
                icon="lock-closed"
                title="Privacy Policy"
                showChevron
                onPress={() => {}}
              />
            </View>
          </Card>
        </CardSection>

        {/* App Info */}
        <View style={styles.footer}>
          <Text style={[styles.appName, { color: colors.primary }]}>{appName}</Text>
          <Text style={[styles.version, { color: colors.textSecondary }]}>Version {appIdentity.version}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 32,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },

  // Profile Card
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  profileRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileRowLabel: {
    fontSize: 14,
  },
  profileRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileRowValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  editText: {
    fontSize: 14,
    fontWeight: '600',
  },

  // Team Section
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  teamTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  teamSubtitle: {
    fontSize: 13,
    width: '100%',
    marginTop: 4,
    marginBottom: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
    marginTop: 12,
    borderTopWidth: 1,
  },
  memberAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberAvatarImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  memberAvatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  memberInfo: {
    flex: 1,
    marginLeft: 12,
  },
  memberName: {
    fontSize: 15,
    fontWeight: '500',
  },
  memberEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 16,
    fontSize: 14,
  },

  // Appearance Section
  appearanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  appearanceTitleContainer: {
    flex: 1,
  },
  appearanceTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  appearanceSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  themeStyleLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  themeStyleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  themeStyleItem: {
    alignItems: 'center',
  },
  themeButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeCheckmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeStyleName: {
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },

  // Categories Section
  categoriesHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  categoriesTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    flex: 1,
    marginRight: 12,
  },
  categoriesTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  categoriesSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  categoriesPreview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreCategoriesText: {
    fontSize: 12,
    paddingVertical: 6,
  },

  // Section Groups (now using CardSection component, keeping setting row styles)
  lastSettingRow: {
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  // Footer
  footer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
  },
  version: {
    fontSize: 13,
    marginTop: 4,
  },
});
