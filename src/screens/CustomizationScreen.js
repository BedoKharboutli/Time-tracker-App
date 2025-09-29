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
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { useCustomization } from '../context/CustomizationContext';

const CustomizationScreen = ({ navigation }) => {
  const {
    timerStyle,
    themeMode,
    font,
    saveAllPreferences,
    getCurrentTheme,
    TIMER_STYLES,
    THEME_MODES,
    FONT_OPTIONS,
  } = useCustomization();

  const [selectedTimerStyle, setSelectedTimerStyle] = useState(timerStyle);
  const [selectedThemeMode, setSelectedThemeMode] = useState(themeMode);
  const [selectedFont, setSelectedFont] = useState(font);

  // Update local state when context values change
  useEffect(() => {
    setSelectedTimerStyle(timerStyle);
    setSelectedThemeMode(themeMode);
    setSelectedFont(font);
  }, [timerStyle, themeMode, font]);

  // Convert context data to arrays for rendering
  const timerStyles = Object.values(TIMER_STYLES).map(style => ({
    id: style.id,
    label: style.name,
  }));

  const themeModes = Object.values(THEME_MODES).map(mode => ({
    id: mode.id,
    label: mode.name,
  }));

  const fontOptions = Object.values(FONT_OPTIONS).map(fontOption => ({
    id: fontOption.id,
    label: fontOption.name,
  }));

  const handleSaveChanges = async () => {
    try {
      const preferences = {
        timerStyle: selectedTimerStyle,
        themeMode: selectedThemeMode,
        font: selectedFont,
      };

      await saveAllPreferences(preferences);
      
      Alert.alert(
        'Success',
        'Your customization preferences have been saved!',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save preferences. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const renderOptionButton = (option, selectedValue, onSelect, isSelected) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionButton,
        { 
          backgroundColor: currentTheme.colors.cardLight, 
          borderColor: currentTheme.colors.borderLight 
        },
        isSelected && { 
          borderColor: currentTheme.colors.primary,
          borderWidth: 2,
        },
      ]}
      onPress={() => onSelect(option.id)}
    >
      <Text style={[
        styles.optionText,
        { color: currentTheme.colors.textPrimary },
        isSelected && { 
          color: currentTheme.colors.primary,
          fontFamily: theme.fonts.medium,
        },
      ]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  // Get current theme for dynamic styling
  const currentTheme = getCurrentTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.backgroundLight }]}>
      <Header
        title="Timer Design"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Timer Style Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.textPrimary }]}>Timer Style</Text>
          <View style={styles.optionsGrid}>
            {timerStyles.map(style => 
              renderOptionButton(
                style,
                selectedTimerStyle,
                setSelectedTimerStyle,
                selectedTimerStyle === style.id
              )
            )}
          </View>
        </View>

        {/* Theme Mode Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.textPrimary }]}>Theme Mode</Text>
          <View style={styles.optionsGrid}>
            {themeModes.map(mode =>
              renderOptionButton(
                mode,
                selectedThemeMode,
                setSelectedThemeMode,
                selectedThemeMode === mode.id
              )
            )}
          </View>
        </View>

        {/* Font Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: currentTheme.colors.textPrimary }]}>Font</Text>
          <View style={styles.optionsGrid}>
            {fontOptions.map(font =>
              renderOptionButton(
                font,
                selectedFont,
                setSelectedFont,
                selectedFont === font.id
              )
            )}
          </View>
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={[styles.footer, { backgroundColor: currentTheme.colors.backgroundLight, borderTopColor: currentTheme.colors.borderLight }]}>
        <Button
          title="Save Changes"
          onPress={handleSaveChanges}
          variant="primary"
          size="large"
          style={[styles.saveButton, { backgroundColor: currentTheme.colors.primary }]}
        />
      </View>
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
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  optionButton: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  selectedOption: {
    borderColor: '#137fec',
    borderWidth: 2,
  },
  optionText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textPrimary,
  },
  selectedOptionText: {
    color: '#137fec',
    fontFamily: theme.fonts.medium,
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  saveButton: {
    // Background color will be overridden by dynamic styling
  },
});

export default CustomizationScreen;
