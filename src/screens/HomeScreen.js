import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import ActivityHeatmap from '../components/ActivityHeatmap';
import { theme } from '../styles/theme';
import { useData } from '../context/DataContext';
import { useCustomization } from '../context/CustomizationContext';

const HomeScreen = ({ navigation }) => {
  const { addSession, getTodayTotalDuration, getSessionsGroupedByDate } = useData();
  const { getCurrentTheme, getCurrentTimerStyle, getCurrentFont } = useCustomization();
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [time, setTime] = useState(0); // Time in seconds
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [todayTotal, setTodayTotal] = useState(0); // Today's total in seconds

  // Get current customization settings
  const currentTheme = getCurrentTheme();
  const currentTimerStyle = getCurrentTimerStyle();
  const currentFont = getCurrentFont();

  // Load today's total when component mounts or data changes
  useEffect(() => {
    const loadTodayTotal = () => {
      const total = getTodayTotalDuration();
      setTodayTotal(total);
    };
    
    loadTodayTotal();
  }, [getTodayTotalDuration]);

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

  const handleTimerToggle = async () => {
    if (isTimerRunning) {
      // Stop timer and save session
      try {
        const endTime = new Date();
        const sessionData = {
          startTime: sessionStartTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: time,
          date: sessionStartTime.getFullYear() + '-' + 
                String(sessionStartTime.getMonth() + 1).padStart(2, '0') + '-' + 
                String(sessionStartTime.getDate()).padStart(2, '0'), // Use local timezone date
        };

        await addSession(sessionData);
        
        // Update today's total and reset timer
        setTodayTotal(prev => prev + time);
        setTime(0);
        setSessionStartTime(null);
      } catch (error) {
        Alert.alert('Error', 'Failed to save session. Please try again.');
        console.error('Error saving session:', error);
      }
    } else {
      // Start timer
      setSessionStartTime(new Date());
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleSettingsPress = () => {
    navigation.navigate('Customization');
  };


  // Get recent days data from real sessions
  const getRecentDays = () => {
    const groupedSessions = getSessionsGroupedByDate();
    const today = new Date();
    const todayString = today.getFullYear() + '-' + 
                       String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0');
    
    // Filter out today and get last 3 days with data
    const recentDays = groupedSessions
      .filter(group => group.date !== todayString)
      .slice(0, 3)
      .map(group => {
        const date = new Date(group.date);
        const totalDuration = group.sessions.reduce((total, session) => total + session.duration, 0);
        
        // Format date display
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        
        let dayLabel;
        const yesterdayString = yesterday.getFullYear() + '-' + 
                               String(yesterday.getMonth() + 1).padStart(2, '0') + '-' + 
                               String(yesterday.getDate()).padStart(2, '0');
        if (group.date === yesterdayString) {
          dayLabel = 'Yesterday';
        } else {
          dayLabel = date.toLocaleDateString('en-US', { weekday: 'long' });
        }
        
        return {
          day: dayLabel,
          date: date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          duration: totalDuration,
        };
      });
    
    return recentDays;
  };

  const recentDays = getRecentDays();

  // Create dynamic styles based on current theme and customization
  const dynamicStyles = createDynamicStyles(currentTheme, currentTimerStyle, currentFont);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.backgroundLight }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.headerTitle, dynamicStyles.headerTitle]}>TidKoll</Text>
            <Text style={[styles.welcomeText, dynamicStyles.welcomeText]}>Track your time efficiently</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.iconButtonNoBg}
              onPress={handleSettingsPress}
            >
              <Ionicons name="settings-outline" size={24} color={currentTheme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Timer Display */}
        <View style={styles.timerSection}>
          <Text style={[styles.timerDisplay, dynamicStyles.timerDisplay]}>
            {formatTime(time)}
          </Text>
          <Text style={[styles.todayTotal, dynamicStyles.todayTotal]}>
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
          <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>Recent Days</Text>
          <View style={styles.recentList}>
            {recentDays.length > 0 ? (
              recentDays.map((item, index) => (
                <View key={index} style={[styles.recentItem, { backgroundColor: currentTheme.colors.cardLight, borderColor: currentTheme.colors.borderLight }]}>
                  <View style={styles.recentItemLeft}>
                    <Text style={[styles.recentDay, dynamicStyles.recentDay]}>{item.day}</Text>
                    <Text style={[styles.recentDate, dynamicStyles.recentDate]}>{item.date}</Text>
                  </View>
                  <Text style={[styles.recentDuration, dynamicStyles.recentDuration]}>
                    {formatDuration(item.duration)}
                  </Text>
                </View>
              ))
            ) : (
              <View style={[styles.emptyState, { backgroundColor: currentTheme.colors.cardLight, borderColor: currentTheme.colors.borderLight }]}>
                <Ionicons name="time-outline" size={48} color={currentTheme.colors.textSecondary} />
                <Text style={[styles.emptyStateText, dynamicStyles.emptyStateText]}>No recent activity</Text>
                <Text style={[styles.emptyStateSubtext, dynamicStyles.emptyStateSubtext]}>Start your first timer session!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Dynamic styles function
const createDynamicStyles = (currentTheme, currentTimerStyle, currentFont) => {
  return StyleSheet.create({
    timerDisplay: {
      fontSize: theme.fontSizes[currentTimerStyle.fontSize] || theme.fontSizes['7xl'],
      fontFamily: currentFont[currentTimerStyle.fontWeight] || currentFont.bold,
      letterSpacing: currentTimerStyle.letterSpacing,
      color: currentTheme.colors.primary,
    },
    todayTotal: {
      fontFamily: currentFont.regular,
      color: currentTheme.colors.primary,
    },
    headerTitle: {
      fontFamily: currentFont.bold,
      color: currentTheme.colors.primary,
    },
    welcomeText: {
      fontFamily: currentFont.regular,
      color: currentTheme.colors.textSecondary,
    },
    sectionTitle: {
      fontFamily: currentFont.medium,
      color: currentTheme.colors.textPrimary,
    },
    recentDay: {
      fontFamily: currentFont.medium,
      color: currentTheme.colors.textPrimary,
    },
    recentDate: {
      fontFamily: currentFont.regular,
      color: currentTheme.colors.textSecondary,
    },
    recentDuration: {
      fontFamily: currentFont.bold,
      color: currentTheme.colors.textPrimary,
    },
    emptyStateText: {
      fontFamily: currentFont.medium,
      color: currentTheme.colors.textSecondary,
    },
    emptyStateSubtext: {
      fontFamily: currentFont.regular,
      color: currentTheme.colors.textLight,
    },
  });
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
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  welcomeText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  iconButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(1, 152, 99, 0.1)',
  },
  iconButtonNoBg: {
    padding: theme.spacing.sm,
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
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  emptyStateText: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  emptyStateSubtext: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
  },
});

export default HomeScreen;
