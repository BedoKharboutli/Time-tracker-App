import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { theme } from '../styles/theme';
import { useData } from '../context/DataContext';

const HistoryScreen = ({ navigation }) => {
  const { getSessionsGroupedByDate } = useData();
  
  // Get real session data grouped by date
  const sessionGroups = getSessionsGroupedByDate();

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDateLabel = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const dateOnly = date.toISOString().split('T')[0];
    const todayOnly = today.toISOString().split('T')[0];
    const yesterdayOnly = yesterday.toISOString().split('T')[0];
    
    if (dateOnly === todayOnly) {
      return 'Today';
    } else if (dateOnly === yesterdayOnly) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        month: 'long',
        day: 'numeric'
      });
    }
  };

  const renderSessionItem = (session, index) => (
    <View key={index} style={styles.sessionItem}>
      <View style={styles.sessionIcon}>
        <Ionicons name="time" size={24} color={theme.colors.primary} />
      </View>
      <View style={styles.sessionContent}>
        <Text style={styles.sessionDuration}>
          {formatDuration(session.duration)}
        </Text>
        <Text style={styles.sessionTime}>
          {formatTime(session.startTime)} - {formatTime(session.endTime)}
        </Text>
      </View>
    </View>
  );

  const renderDaySection = (dateGroup) => (
    <View key={dateGroup.date} style={styles.daySection}>
      <Text style={styles.dayTitle}>{formatDateLabel(dateGroup.date)}</Text>
      <View style={styles.sessionsList}>
        {dateGroup.sessions.map((session, index) => renderSessionItem(session, index))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="History"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {sessionGroups.length > 0 ? (
          sessionGroups.map(dateGroup => renderDaySection(dateGroup))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="time-outline" size={64} color={theme.colors.textSecondary} />
            <Text style={styles.emptyStateText}>No session history</Text>
            <Text style={styles.emptyStateSubtext}>
              Start tracking your time to see your session history here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  daySection: {
    marginBottom: theme.spacing.xl,
  },
  dayTitle: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
  },
  sessionsList: {
    gap: theme.spacing.sm,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  sessionIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(1, 152, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  sessionContent: {
    flex: 1,
  },
  sessionDuration: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  sessionTime: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
  emptyStateSubtext: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default HistoryScreen;
