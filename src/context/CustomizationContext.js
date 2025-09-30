import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CustomizationContext = createContext();

// Customization actions
const CUSTOMIZATION_ACTIONS = {
  LOAD_PREFERENCES: 'LOAD_PREFERENCES',
  SET_TIMER_STYLE: 'SET_TIMER_STYLE',
  SET_THEME_MODE: 'SET_THEME_MODE',
  SET_FONT: 'SET_FONT',
  SET_LOADING: 'SET_LOADING',
};

// Theme modes
export const THEME_MODES = {
  light: {
    id: 'light',
    name: 'Light Mode',
    colors: {
      primary: '#019863',
      secondary: '#01A96A',
      background: '#ffffff',
      backgroundLight: '#f8f9fa',
      cardLight: '#ffffff',
      borderLight: '#e5e7eb',
      accent: '#FAC638',
      textPrimary: '#1f2937',
      textSecondary: '#6b7280',
      textLight: '#9ca3af',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#10b981',
      gray200: '#e5e7eb',
    },
  },
  dark: {
    id: 'dark',
    name: 'Dark Mode',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      background: '#111827',
      backgroundLight: '#1f2937',
      cardLight: '#374151',
      borderLight: '#4b5563',
      accent: '#fbbf24',
      textPrimary: '#f9fafb',
      textSecondary: '#d1d5db',
      textLight: '#9ca3af',
      error: '#f87171',
      warning: '#fbbf24',
      success: '#34d399',
      gray200: '#4b5563',
    },
  },
};

// Timer styles
export const TIMER_STYLES = {
  classic: {
    id: 'classic',
    name: 'Classic',
    fontSize: '7xl',
    fontWeight: 'bold',
    letterSpacing: -2,
    padding: 'xl',
    borderRadius: 'lg',
    shadow: 'sm',
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    fontSize: '6xl',
    fontWeight: 'medium',
    letterSpacing: -1,
    padding: 'lg',
    borderRadius: 'full',
    shadow: 'lg',
  },
  minimalist: {
    id: 'minimalist',
    name: 'Minimalist',
    fontSize: '5xl',
    fontWeight: 'light',
    letterSpacing: 0,
    padding: 'md',
    borderRadius: 'sm',
    shadow: 'none',
  },
};

// Font options
export const FONT_OPTIONS = {
  system: {
    id: 'system',
    name: 'System',
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  roboto: {
    id: 'roboto',
    name: 'Roboto',
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
  opensans: {
    id: 'opensans',
    name: 'Open Sans',
    regular: 'OpenSans-Regular',
    medium: 'OpenSans-Medium',
    bold: 'OpenSans-Bold',
  },
};

// Initial state
const initialState = {
  timerStyle: 'classic',
  themeMode: 'light',
  font: 'system',
  isLoading: false,
};

// Customization reducer
const customizationReducer = (state, action) => {
  switch (action.type) {
    case CUSTOMIZATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    case CUSTOMIZATION_ACTIONS.LOAD_PREFERENCES:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    case CUSTOMIZATION_ACTIONS.SET_TIMER_STYLE:
      return {
        ...state,
        timerStyle: action.payload,
      };
    case CUSTOMIZATION_ACTIONS.SET_THEME_MODE:
      return {
        ...state,
        themeMode: action.payload,
      };
    case CUSTOMIZATION_ACTIONS.SET_FONT:
      return {
        ...state,
        font: action.payload,
      };
    default:
      return state;
  }
};

// Storage key for app customization
const APP_CUSTOMIZATION_KEY = '@app_customization';

export const CustomizationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(customizationReducer, initialState);

  // Load app customization when component mounts
  useEffect(() => {
    loadAppCustomization();
  }, []);

  // Load app customization from AsyncStorage
  const loadAppCustomization = async () => {
    try {
      dispatch({ type: CUSTOMIZATION_ACTIONS.SET_LOADING, payload: true });
      
      const customizationData = await AsyncStorage.getItem(APP_CUSTOMIZATION_KEY);
      
      if (customizationData) {
        const parsedData = JSON.parse(customizationData);
        dispatch({
          type: CUSTOMIZATION_ACTIONS.LOAD_PREFERENCES,
          payload: parsedData,
        });
      } else {
        // Initialize with defaults for first time use
        dispatch({
          type: CUSTOMIZATION_ACTIONS.LOAD_PREFERENCES,
          payload: initialState,
        });
      }
    } catch (error) {
      console.error('Error loading app customization:', error);
      dispatch({
        type: CUSTOMIZATION_ACTIONS.LOAD_PREFERENCES,
        payload: initialState,
      });
    }
  };

  // Save app customization to AsyncStorage
  const saveAppCustomization = async (customizationData) => {
    try {
      await AsyncStorage.setItem(APP_CUSTOMIZATION_KEY, JSON.stringify(customizationData));
    } catch (error) {
      console.error('Error saving app customization:', error);
      throw error;
    }
  };

  // Set timer style
  const setTimerStyle = async (style) => {
    try {
      dispatch({
        type: CUSTOMIZATION_ACTIONS.SET_TIMER_STYLE,
        payload: style,
      });

      const updatedState = { ...state, timerStyle: style };
      await saveAppCustomization(updatedState);
    } catch (error) {
      console.error('Error setting timer style:', error);
    }
  };

  // Set theme mode
  const setThemeMode = async (mode) => {
    try {
      dispatch({
        type: CUSTOMIZATION_ACTIONS.SET_THEME_MODE,
        payload: mode,
      });

      const updatedState = { ...state, themeMode: mode };
      await saveAppCustomization(updatedState);
    } catch (error) {
      console.error('Error setting theme mode:', error);
    }
  };

  // Set font
  const setFont = async (font) => {
    try {
      dispatch({
        type: CUSTOMIZATION_ACTIONS.SET_FONT,
        payload: font,
      });

      const updatedState = { ...state, font: font };
      await saveAppCustomization(updatedState);
    } catch (error) {
      console.error('Error setting font:', error);
    }
  };

  // Get current theme colors
  const getCurrentTheme = () => {
    return THEME_MODES[state.themeMode] || THEME_MODES.light;
  };

  // Get current timer style
  const getCurrentTimerStyle = () => {
    return TIMER_STYLES[state.timerStyle] || TIMER_STYLES.classic;
  };

  // Get current font
  const getCurrentFont = () => {
    return FONT_OPTIONS[state.font] || FONT_OPTIONS.system;
  };

  // Save all preferences at once
  const saveAllPreferences = async (preferences) => {
    try {
      dispatch({
        type: CUSTOMIZATION_ACTIONS.LOAD_PREFERENCES,
        payload: preferences,
      });

      await saveAppCustomization(preferences);
    } catch (error) {
      console.error('Error saving all preferences:', error);
      throw error;
    }
  };

  const value = {
    ...state,
    setTimerStyle,
    setThemeMode,
    setFont,
    getCurrentTheme,
    getCurrentTimerStyle,
    getCurrentFont,
    saveAllPreferences,
    THEME_MODES,
    TIMER_STYLES,
    FONT_OPTIONS,
  };

  return (
    <CustomizationContext.Provider value={value}>
      {children}
    </CustomizationContext.Provider>
  );
};

export const useCustomization = () => {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
};
