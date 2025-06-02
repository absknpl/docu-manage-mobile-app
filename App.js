import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { DocumentsProvider } from './contexts/DocumentsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import * as Notifications from 'expo-notifications';

export default function App() {
  useEffect(() => {
    (async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Enable notifications to get document expiry reminders!');
      }
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }),
      });
    })();
  }, []);

  return (
    <ThemeProvider>
      <View style={styles.container}>
        <StatusBar translucent backgroundColor="transparent" />
        <NavigationContainer>
          <DocumentsProvider>
            <AppNavigator />
          </DocumentsProvider>
        </NavigationContainer>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Match your screen background
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 70, // Add padding for both Android and iOS
  },
});