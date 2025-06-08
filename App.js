import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AppNavigator from './navigation/AppNavigator';
import { DocumentsProvider } from './contexts/DocumentsContext';
import { ThemeProvider, useThemeMode } from './contexts/ThemeContext';
import * as Notifications from 'expo-notifications';
import { NotificationSettingsProvider } from './contexts/NotificationSettingsContext';
import * as SplashScreen from 'expo-splash-screen';
import CustomSplashScreen from './components/SplashScreen'; // Adjust path as needed

const Stack = createStackNavigator();

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
    // Prevent native splash screen from auto-hiding
    SplashScreen.preventAutoHideAsync();
    
    const prepare = async () => {
      try {
        // Request notification permissions
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
        
        // Wait for 1.2s to ensure smooth splash experience
        await new Promise(resolve => setTimeout(resolve, 1200));
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the native splash screen
        await SplashScreen.hideAsync();
      }
    };

    prepare();
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