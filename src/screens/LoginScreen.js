import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { theme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';

const LoginScreen = () => {
  const { signIn, signUp, isLoading, error } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return false;
    }

    if (!formData.password.trim()) {
      Alert.alert('Error', 'Password is required');
      return false;
    }

    if (isSignUp) {
      if (!formData.name.trim()) {
        Alert.alert('Error', 'Name is required');
        return false;
      }

      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match');
        return false;
      }

      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      let result;
      if (isSignUp) {
        result = await signUp(formData.email, formData.password, formData.name);
      } else {
        result = await signIn(formData.email, formData.password);
      }

      if (!result.success) {
        Alert.alert('Error', result.error);
      }
    } catch (err) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    });
  };

  const handleGoogleLogin = () => {
    Alert.alert('Coming Soon', 'Google login will be available in a future update.');
  };

  const handleGitHubLogin = () => {
    Alert.alert('Coming Soon', 'GitHub login will be available in a future update.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header with Logo */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="time-outline" size={32} color={theme.colors.primary} />
              <Text style={styles.logoText}>TidKoll</Text>
            </View>
          </View>

          {/* Main Content */}
          <View style={styles.mainContent}>
            <View style={styles.welcomeSection}>
              <Text style={styles.welcomeTitle}>
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text style={styles.welcomeSubtitle}>
                {isSignUp 
                  ? 'Join TidKoll to start tracking your work hours efficiently.'
                  : 'Track your work hours efficiently and stay organized.'
                }
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              {isSignUp && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.colors.textLight}
                    value={formData.name}
                    onChangeText={(value) => handleInputChange('name', value)}
                    autoCapitalize="words"
                    autoCorrect={false}
                    textContentType="name"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    editable={true}
                    selectTextOnFocus={true}
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter your email"
                  placeholderTextColor={theme.colors.textLight}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  textContentType="emailAddress"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  editable={true}
                  selectTextOnFocus={true}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password"
                    placeholderTextColor={theme.colors.textLight}
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="password"
                    returnKeyType="done"
                    blurOnSubmit={false}
                    editable={true}
                    selectTextOnFocus={true}
                  />
                  <TouchableOpacity
                    style={styles.eyeButton}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {isSignUp && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      style={styles.passwordInput}
                      placeholder="Confirm your password"
                      placeholderTextColor={theme.colors.textLight}
                      value={formData.confirmPassword}
                      onChangeText={(value) => handleInputChange('confirmPassword', value)}
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      textContentType="password"
                      returnKeyType="done"
                      blurOnSubmit={false}
                      editable={true}
                      selectTextOnFocus={true}
                    />
                    <TouchableOpacity
                      style={styles.eyeButton}
                      onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={theme.colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <Button
                title={isSignUp ? 'Create Account' : 'Sign In'}
                onPress={handleSubmit}
                variant="primary"
                size="large"
                style={styles.submitButton}
                loading={isLoading}
              />

              <TouchableOpacity onPress={toggleMode} style={styles.toggleButton}>
                <Text style={styles.toggleText}>
                  {isSignUp 
                    ? 'Already have an account? Sign In'
                    : "Don't have an account? Sign Up"
                  }
                </Text>
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Buttons */}
            <View style={styles.socialSection}>
              <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
                <Ionicons name="logo-google" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.socialButtonText}>Continue with Google</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton} onPress={handleGitHubLogin}>
                <Ionicons name="logo-github" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.socialButtonText}>Continue with GitHub</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    fontSize: theme.fontSizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginLeft: theme.spacing.sm,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    justifyContent: 'center',
  },
  welcomeSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  welcomeTitle: {
    fontSize: theme.fontSizes['3xl'],
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 24,
  },
  formSection: {
    marginBottom: theme.spacing.xl,
  },
  inputContainer: {
    marginBottom: theme.spacing.md,
  },
  inputLabel: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  textInput: {
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textPrimary,
    ...theme.shadows.sm,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.cardLight,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.sm,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textPrimary,
  },
  eyeButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  submitButton: {
    width: '100%',
    marginTop: theme.spacing.md,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  toggleText: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: theme.spacing.xl,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.colors.borderLight,
  },
  dividerText: {
    marginHorizontal: theme.spacing.md,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textLight,
    fontFamily: theme.fonts.regular,
  },
  socialSection: {
    gap: theme.spacing.md,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.cardLight,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
    ...theme.shadows.sm,
  },
  socialButtonText: {
    fontSize: theme.fontSizes.base,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  versionText: {
    fontSize: theme.fontSizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
});

export default LoginScreen;
