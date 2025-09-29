import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

const ActivityHeatmap = () => {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Sample data for heatmap - in real app, this would come from props or state
  const heatmapData = [
    [0, 0, 0.2, 0.4, 0.6, 0.2, 0],
    [0.8, 1, 0.6, 0.4, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ];

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return theme.colors.gray200;
    if (intensity <= 0.2) return `${theme.colors.primary}33`; // 20% opacity
    if (intensity <= 0.4) return `${theme.colors.primary}66`; // 40% opacity
    if (intensity <= 0.6) return `${theme.colors.primary}99`; // 60% opacity
    if (intensity <= 0.8) return `${theme.colors.primary}CC`; // 80% opacity
    return theme.colors.primary; // 100% opacity
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Heatmap</Text>
      <View style={styles.heatmapContainer}>
        {/* Days of week header */}
        <View style={styles.daysHeader}>
          {daysOfWeek.map((day, index) => (
            <Text key={index} style={styles.dayText}>
              {day}
            </Text>
          ))}
        </View>
        
        {/* Heatmap grid */}
        <View style={styles.grid}>
          {heatmapData.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.week}>
              {week.map((intensity, dayIndex) => (
                <View
                  key={dayIndex}
                  style={[
                    styles.cell,
                    { backgroundColor: getIntensityColor(intensity) }
                  ]}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  heatmapContainer: {
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.md,
    ...theme.shadows.sm,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  daysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.sm,
  },
  dayText: {
    fontSize: theme.fontSizes.xs,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    flex: 1,
    textAlign: 'center',
  },
  grid: {
    gap: theme.spacing.xs,
  },
  week: {
    flexDirection: 'row',
    gap: theme.spacing.xs,
  },
  cell: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: theme.borderRadius.sm,
  },
});

export default ActivityHeatmap;
