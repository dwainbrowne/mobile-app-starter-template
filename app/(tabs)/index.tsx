import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { layout } from '@/config';
import { useAuth } from '@/contexts/AuthContext';

interface ActionCard {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  badge?: number;
  badgeColor?: string;
  route?: string;
}

const actionCards: ActionCard[] = [
  { id: 'new-job', title: 'New Job', icon: 'add', color: '#3B82F6', route: '/(tabs)/webview' },
  { id: 'open-jobs', title: 'Open Jobs', icon: 'shield', color: '#9333EA', badge: 12, badgeColor: '#EF4444', route: '/(tabs)/webview' },
  { id: 'my-schedule', title: 'My Schedule', icon: 'calendar', color: '#10B981', route: '/(tabs)/webview' },
  { id: 'closed-jobs', title: 'Closed Jobs', icon: 'folder', color: '#F97316', badge: 47, badgeColor: '#22C55E', route: '/(tabs)/webview' },
  { id: 'notifications', title: 'Notifications', icon: 'notifications', color: '#4B5563', route: '/notifications' },
  { id: 'search', title: 'Search', icon: 'search', color: '#2563EB' },
];

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const userName = user?.name || 'SnapSuite User';

  const handleCardPress = (card: ActionCard) => {
    if (card.route) {
      router.push(card.route as any);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* Welcome Hero */}
      <LinearGradient
        colors={['#9333EA', '#3B82F6']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.hero}
      >
        <Text style={styles.heroWelcome}>Welcome {userName}!</Text>
        <Text style={styles.heroSubtitle}>You currently have 12 open jobs</Text>
      </LinearGradient>

      {/* Action Cards Grid */}
      <View style={styles.cardGrid}>
        {actionCards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[styles.card, { backgroundColor: card.color }]}
            activeOpacity={0.7}
            onPress={() => handleCardPress(card)}
          >
            <Ionicons 
              name={card.icon} 
              size={card.id === 'new-job' ? 56 : 48} 
              color="#FFFFFF" 
              style={[
                styles.cardIcon,
                card.id === 'open-jobs' && { transform: [{ scaleX: 0.85 }] },
                card.id === 'new-job' && { marginBottom: 2 }
              ]} 
            />
            <Text style={styles.cardTitle}>{card.title}</Text>
            {card.badge !== undefined && (
              <View style={[styles.badge, { backgroundColor: card.badgeColor || '#EF4444' }]}>
                <Text style={styles.badgeText}>{card.badge}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  content: {
    paddingBottom: layout.tabBarPadding,
  },
  hero: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
  },
  heroWelcome: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  card: {
    width: '47%',
    borderRadius: layout.cardRadius,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cardIcon: {
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
