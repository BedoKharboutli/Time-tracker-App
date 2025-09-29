import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { useData } from '../context/DataContext';
import { useCustomization } from '../context/CustomizationContext';

const ReportsScreen = () => {
  const { getWeeklyStats } = useData();
  const { getCurrentTheme, getCurrentFont } = useCustomization();
  
  // Get real weekly statistics from user data
  const weeklyStats = getWeeklyStats();
  
  // Get current customization settings
  const currentTheme = getCurrentTheme();
  const currentFont = getCurrentFont();

  const StatCard = ({ icon, title, value, subtitle }) => (
    <View style={[styles.statCard, { backgroundColor: currentTheme.colors.cardLight, borderColor: currentTheme.colors.borderLight }]}>
      <View style={[styles.statIcon, { backgroundColor: `${currentTheme.colors.primary}1A` }]}>
        <Ionicons name={icon} size={24} color={currentTheme.colors.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statValue, { fontFamily: currentFont.bold, color: currentTheme.colors.textPrimary }]}>{value}</Text>
        <Text style={[styles.statTitle, { fontFamily: currentFont.regular, color: currentTheme.colors.textSecondary }]}>{title}</Text>
        {subtitle && <Text style={[styles.statSubtitle, { fontFamily: currentFont.regular, color: currentTheme.colors.textLight }]}>{subtitle}</Text>}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.backgroundLight }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontFamily: currentFont.bold, color: currentTheme.colors.primary }]}>Reports</Text>
      </View>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: currentFont.bold, color: currentTheme.colors.textPrimary }]}>This Week</Text>
          {weeklyStats.totalSessions > 0 ? (
            <View style={styles.statsGrid}>
              <StatCard
                icon="time-outline"
                title="Total Hours"
                value={`${weeklyStats.totalHours}h`}
              />
              <StatCard
                icon="trending-up-outline"
                title="Daily Average"
                value={`${weeklyStats.averageDaily}h`}
              />
              <StatCard
                icon="calendar-outline"
                title="Most Productive"
                value={weeklyStats.mostProductiveDay}
              />
              <StatCard
                icon="play-circle-outline"
                title="Total Sessions"
                value={weeklyStats.totalSessions}
              />
            </View>
          ) : (
            <View style={[styles.emptyStats, { backgroundColor: currentTheme.colors.cardLight, borderColor: currentTheme.colors.borderLight }]}>
              <Ionicons name="bar-chart-outline" size={48} color={currentTheme.colors.textSecondary} />
              <Text style={[styles.emptyStatsText, { fontFamily: currentFont.medium, color: currentTheme.colors.textSecondary }]}>No data this week</Text>
              <Text style={[styles.emptyStatsSubtext, { fontFamily: currentFont.regular, color: currentTheme.colors.textLight }]}>Start tracking time to see your weekly statistics</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: currentFont.bold, color: currentTheme.colors.textPrimary }]}>Weekly Breakdown</Text>
          <View style={[styles.weeklyChart, { backgroundColor: currentTheme.colors.cardLight, borderColor: currentTheme.colors.borderLight }]}>
            <Text style={[styles.chartPlaceholder, { fontFamily: currentFont.regular }]}>
              📊 Weekly chart would go here
            </Text>
            <Text style={[styles.chartDescription, { fontFamily: currentFont.regular, color: currentTheme.colors.textSecondary }]}>
              Visual representation of daily work hours
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { fontFamily: currentFont.bold, color: currentTheme.colors.textPrimary }]}>Productivity Insights</Text>
          <View style={[styles.insightCard, { backgroundColor: currentTheme.colors.cardLight, borderColor: currentTheme.colors.borderLight }]}>
            <Ionicons name="bulb-outline" size={24} color={currentTheme.colors.warning} />
            <View style={styles.insightContent}>
              {weeklyStats.totalSessions > 0 ? (
                <>
                  <Text style={[styles.insightTitle, { fontFamily: currentFont.bold, color: currentTheme.colors.textPrimary }]}>
                    {weeklyStats.totalHours >= 20 ? 'Great week!' : 
                     weeklyStats.totalHours >= 10 ? 'Good progress!' : 
                     'Keep it up!'}
                  </Text>
                  <Text style={[styles.insightText, { fontFamily: currentFont.regular, color: currentTheme.colors.textSecondary }]}>
                    {weeklyStats.totalHours >= 20 
                      ? `You've been consistently productive this week with ${weeklyStats.totalHours} hours tracked. Your ${weeklyStats.mostProductiveDay} sessions were particularly effective.`
                      : weeklyStats.totalHours >= 10
                      ? `You've made good progress this week with ${weeklyStats.totalHours} hours tracked. Try to maintain this momentum!`
                      : `You've started tracking your time with ${weeklyStats.totalHours} hours this week. Keep building this habit for better productivity insights.`
                    }
                  </Text>
                </>
              ) : (
                <>
                  <Text style={[styles.insightTitle, { fontFamily: currentFont.bold, color: currentTheme.colors.textPrimary }]}>Start tracking!</Text>
                  <Text style={[styles.insightText, { fontFamily: currentFont.regular, color: currentTheme.colors.textSecondary }]}>
                    Begin tracking your time to get personalized productivity insights and see your progress over time.
                  </Text>
                </>
              )}
            </View>
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
  header: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  headerTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: 'rgba(1, 152, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.sm,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  statTitle: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statSubtitle: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  weeklyChart: {
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  chartPlaceholder: {
    fontSize: theme.fontSizes['2xl'],
    marginBottom: theme.spacing.sm,
  },
  chartDescription: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  insightContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  insightTitle: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  insightText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  emptyStats: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  emptyStatsText: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyStatsSubtext: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
});

export default ReportsScreen;
