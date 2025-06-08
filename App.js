import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './navigation/AppNavigator';
import { DocumentsProvider } from './contexts/DocumentsContext';
import { ThemeProvider, useThemeMode } from './contexts/ThemeContext';
import * as Notifications from 'expo-notifications';
import { NotificationSettingsProvider } from './contexts/NotificationSettingsContext';

function AppContent() {
  const { theme } = useThemeMode();
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar translucent backgroundColor="transparent" />
      <NavigationContainer>
        <NotificationSettingsProvider>
          <DocumentsProvider>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Splash" component={CustomSplashScreen} />
              <Stack.Screen name="Main" component={AppNavigator} />
            </Stack.Navigator>
          </DocumentsProvider>
        </NotificationSettingsProvider>
      </NavigationContainer>
    </View>
  );
}

export default function App() {
  useEffect(() => {
    (async () => {
      try {
        // Initialize notifications
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
      } catch (error) {
        console.warn('Error initializing notifications:', error);
      }
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 70,
  },
});