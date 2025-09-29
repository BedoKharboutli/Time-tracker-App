import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import Button from '../components/Button';
import { theme } from '../styles/theme';

const CustomizationScreen = ({ navigation }) => {
  const [selectedTimerStyle, setSelectedTimerStyle] = useState('classic');
  const [selectedColorTheme, setSelectedColorTheme] = useState('white');
  const [selectedFont, setSelectedFont] = useState('system');

  const timerStyles = [
    { id: 'classic', label: 'Classic' },
    { id: 'modern', label: 'Modern' },
    { id: 'minimalist', label: 'Minimalist' },
  ];

  const colorThemes = [
    { id: 'white', color: '#ffffff', borderColor: '#e5e7eb' },
    { id: 'cyan', color: '#e0f7fa', borderColor: '#e5e7eb' },
    { id: 'orange', color: '#fff3e0', borderColor: '#e5e7eb' },
    { id: 'pink', color: '#fce4ec', borderColor: '#e5e7eb' },
  ];

  const fontOptions = [
    { id: 'system', label: 'System' },
    { id: 'roboto', label: 'Roboto' },
    { id: 'opensans', label: 'Open Sans' },
  ];

  const handleSaveChanges = () => {
    // Save preferences logic here
    console.log('Saving preferences:', {
      timerStyle: selectedTimerStyle,
      colorTheme: selectedColorTheme,
      font: selectedFont,
    });
    navigation.goBack();
  };

  const renderOptionButton = (option, selectedValue, onSelect, isSelected) => (
    <TouchableOpacity
      key={option.id}
      style={[
        styles.optionButton,
        isSelected && styles.selectedOption,
      ]}
      onPress={() => onSelect(option.id)}
    >
      <Text style={[
        styles.optionText,
        isSelected && styles.selectedOptionText,
      ]}>
        {option.label}
      </Text>
    </TouchableOpacity>
  );

  const renderColorOption = (color, isSelected, onSelect) => (
    <TouchableOpacity
      key={color.id}
      style={[
        styles.colorOption,
        { backgroundColor: color.color, borderColor: color.borderColor },
        isSelected && styles.selectedColorOption,
      ]}
      onPress={() => onSelect(color.id)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Timer Design"
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Timer Style Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timer Style</Text>
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

        {/* Color Theme Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Color Theme</Text>
          <View style={styles.colorGrid}>
            {colorThemes.map(color =>
              renderColorOption(
                color,
                selectedColorTheme === color.id,
                setSelectedColorTheme
              )
            )}
          </View>
        </View>

        {/* Font Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Font</Text>
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
      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSaveChanges}
          variant="primary"
          size="large"
          style={styles.saveButton}
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
  colorGrid: {
    flexDirection: 'row',
    gap: theme.spacing.lg,
  },
  colorOption: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
  },
  selectedColorOption: {
    borderColor: '#137fec',
    borderWidth: 2,
    shadowColor: '#137fec',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  footer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  saveButton: {
    backgroundColor: '#FAC638', // Yellow color from original design
  },
});

export default CustomizationScreen;
