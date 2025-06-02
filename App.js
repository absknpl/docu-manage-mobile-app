import React from 'react';
import { View, StyleSheet, StatusBar, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './navigation/AppNavigator';
import { DocumentsProvider } from './contexts/DocumentsContext';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
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