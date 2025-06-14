import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { DocumentsProvider } from './contexts/DocumentsContext';
import { ThemeProvider, useThemeMode } from './contexts/ThemeContext';
import * as Notifications from 'expo-notifications';
import { NotificationSettingsProvider } from './contexts/NotificationSettingsContext';
import { Camera } from 'expo-camera';
import { scheduleWeeklyEngagementNotification } from './utils/engagementNotification';

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
    (async () => {
      try {
        // Initialize notifications
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          alert('Enable notifications to get Arkive expiry reminders!');
        }
        // Request camera permission
        const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
        if (cameraStatus !== 'granted') {
          alert('Enable camera access to upload photos or scan documents!');
        }
        Notifications.setNotificationHandler({
          handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }),
        });
        // Schedule weekly engagement notification (does not repeat if already scheduled)
        await scheduleWeeklyEngagementNotification();
      } catch (error) {
        console.warn('Error initializing notifications or camera permissions:', error);
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