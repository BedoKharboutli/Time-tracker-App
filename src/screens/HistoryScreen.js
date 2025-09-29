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

const HistoryScreen = ({ navigation }) => {
  // Sample history data
  const historyData = {
    today: [
      { duration: 7200, startTime: '10:00 AM', endTime: '12:00 PM' }, // 2h 0m
      { duration: 3600, startTime: '8:00 AM', endTime: '9:00 AM' },   // 1h 0m
    ],
    yesterday: [
      { duration: 7200, startTime: '2:00 PM', endTime: '4:00 PM' },   // 2h 0m
      { duration: 7200, startTime: '10:00 AM', endTime: '12:00 PM' }, // 2h 0m
      { duration: 3600, startTime: '8:00 AM', endTime: '9:00 AM' },   // 1h 0m
    ],
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
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
          {session.startTime} - {session.endTime}
        </Text>
      </View>
    </View>
  );

  const renderDaySection = (title, sessions) => (
    <View style={styles.daySection}>
      <Text style={styles.dayTitle}>{title}</Text>
      <View style={styles.sessionsList}>
        {sessions.map((session, index) => renderSessionItem(session, index))}
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
        {renderDaySection('Today', historyData.today)}
        {renderDaySection('Yesterday', historyData.yesterday)}
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
});

export default HistoryScreen;
