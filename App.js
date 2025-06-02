import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { DocumentsProvider } from './contexts/DocumentsContext';
import { ThemeProvider, useThemeMode } from './contexts/ThemeContext';
import * as Notifications from 'expo-notifications';
import { NotificationSettingsProvider } from './contexts/NotificationSettingsContext';
import * as SplashScreen from 'expo-splash-screen';

function AppContent() {
  const { theme } = useThemeMode();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <NavigationContainer>
        <NotificationSettingsProvider>
          <DocumentsProvider>
            <AppNavigator />
          </DocumentsProvider>
        </NotificationSettingsProvider>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    SplashScreen.preventAutoHideAsync();
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Enable notifications to get Arkive expiry reminders!');
      }
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
      // Hide splash after app is ready
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 1200); // Show splash for at least 1.2s for a smooth effect
    })();
  }, []);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 70, // Add padding for both Android and iOS
  },
});