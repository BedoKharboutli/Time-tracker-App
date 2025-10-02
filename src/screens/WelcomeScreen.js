import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../components/Button';
import { theme } from '../styles/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ onStartTimer }) => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.colors.primary, theme.colors.primaryDark]}
        style={styles.gradient}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="time" size={48} color={theme.colors.white} />
            </View>
            <Text style={styles.logoText}>Clocked</Text>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          <View style={styles.welcomeSection}>
            
            <Text style={styles.welcomeDescription}>
              Track your work hours efficiently and stay organized. 
              Start your productivity journey with just one tap.
            </Text>
          </View>

          {/* Features List */}
          <View style={styles.featuresContainer}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="timer-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Simple Timer</Text>
                <Text style={styles.featureDescription}>Start and stop with one tap</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="analytics-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Track Progress</Text>
                <Text style={styles.featureDescription}>View your daily and weekly stats</Text>
              </View>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="calendar-outline" size={24} color={theme.colors.primary} />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>History</Text>
                <Text style={styles.featureDescription}>See all your past sessions</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Button
            title="Start My Timer"
            onPress={onStartTimer}
            variant="secondary"
            size="large"
            style={styles.startButton}
          />
          
          <Text style={styles.footerText}>
            Ready to boost your productivity?
          </Text>
        </View>

        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
        <View style={styles.decorativeCircle3} />
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    position: 'relative',
  },
  header: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: theme.spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    ...theme.shadows.lg,
  },
  logoText: {
    fontSize: theme.fontSizes['4xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    marginBottom: theme.spacing.xs,
  },
  tagline: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  mainContent: {
    flex: 0.5,
    paddingHorizontal: theme.spacing.lg,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: theme.fontSizes['3xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.white,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  welcomeDescription: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: theme.spacing.md,
  },
  featuresContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    marginHorizontal: theme.spacing.sm,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    ...theme.shadows.sm,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  bottomSection: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  startButton: {
    width: '100%',
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    ...theme.shadows.lg,
  },
  footerText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  // Decorative elements
  decorativeCircle1: {
    position: 'absolute',
    top: height * 0.1,
    right: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: height * 0.3,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeCircle3: {
    position: 'absolute',
    top: height * 0.6,
    right: width * 0.1,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
});

export default WelcomeScreen;
