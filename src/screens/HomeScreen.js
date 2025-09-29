import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { theme } from '../styles/theme';

const HomeScreen = ({ navigation }) => {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in seconds
  const [todayTotal, setTodayTotal] = useState(0); // Today's total in seconds

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTime(time => time + 1);
      }, 1000);
    } else if (!isTimerRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, time]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const handleTimerToggle = () => {
    if (isTimerRunning) {
      // Stop timer and add to today's total
      setTodayTotal(prev => prev + time);
      setTime(0);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Customization');
  };

  // Sample recent days data
  const recentDays = [
    { day: 'Yesterday', date: 'May 20, 2024', duration: 29700 }, // 8h 15m in seconds
    { day: 'Friday', date: 'May 19, 2024', duration: 27900 }, // 7h 45m in seconds
    { day: 'Thursday', date: 'May 18, 2024', duration: 28800 }, // 8h 0m in seconds
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>TidKoll</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={handleSettingsPress}
          >
            <Ionicons name="settings-outline" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Timer Display */}
        <View style={styles.timerSection}>
          <Text style={styles.timerDisplay}>{formatTime(time)}</Text>
          <Text style={styles.todayTotal}>
            Today's total: {formatDuration(todayTotal + time)}
          </Text>
        </View>

        {/* Start/Stop Button */}
        <View style={styles.buttonContainer}>
          <Button
            title={isTimerRunning ? 'Stop Timer' : 'Start Timer'}
            onPress={handleTimerToggle}
            variant="primary"
            size="large"
            style={[
              styles.timerButton,
              isTimerRunning && styles.stopButton
            ]}
          />
        </View>

        {/* Activity Heatmap */}
        <ActivityHeatmap />

        {/* Recent Days */}
        <View style={styles.recentSection}>
          <Text style={styles.sectionTitle}>Recent Days</Text>
          <View style={styles.recentList}>
            {recentDays.map((item, index) => (
              <View key={index} style={styles.recentItem}>
                <View style={styles.recentItemLeft}>
                  <Text style={styles.recentDay}>{item.day}</Text>
                  <Text style={styles.recentDate}>{item.date}</Text>
                </View>
                <Text style={styles.recentDuration}>
                  {formatDuration(item.duration)}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(1, 152, 99, 0.1)',
  },
  timerSection: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  timerDisplay: {
    fontSize: theme.fontSizes['7xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    letterSpacing: -2,
  },
  todayTotal: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  buttonContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  timerButton: {
    borderRadius: theme.borderRadius.full,
    paddingVertical: theme.spacing.lg,
    ...theme.shadows.lg,
    shadowColor: theme.colors.primary,
  },
  stopButton: {
    backgroundColor: theme.colors.error,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  recentSection: {
    marginTop: theme.spacing.md,
  },
  recentList: {
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  recentItemLeft: {
    flex: 1,
  },
  recentDay: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textPrimary,
  },
  recentDate: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  recentDuration: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
});

export default HomeScreen;
