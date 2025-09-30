import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { DataProvider } from './src/context/DataContext';
import { CustomizationProvider } from './src/context/CustomizationContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import CustomizationScreen from './src/screens/CustomizationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [hasSeenWelcome, setHasSeenWelcome] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user has seen welcome screen before
  useEffect(() => {
    const checkWelcomeStatus = async () => {
      try {
        const welcomeStatus = await AsyncStorage.getItem('@has_seen_welcome');
        if (welcomeStatus === 'true') {
          setHasSeenWelcome(true);
        }
      } catch (error) {
        console.error('Error checking welcome status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkWelcomeStatus();
  }, []);

  const handleStartTimer = async () => {
    try {
      await AsyncStorage.setItem('@has_seen_welcome', 'true');
      setHasSeenWelcome(true);
    } catch (error) {
      console.error('Error saving welcome status:', error);
      setHasSeenWelcome(true); // Continue anyway
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
    >
      {hasSeenWelcome ? (
        <>
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen name="Customization" component={CustomizationScreen} />
        </>
      ) : (
        <Stack.Screen name="Welcome">
          {() => <WelcomeScreen onStartTimer={handleStartTimer} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <DataProvider>
      <CustomizationProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <AppNavigator />
        </NavigationContainer>
      </CustomizationProvider>
    </DataProvider>
  );
}
