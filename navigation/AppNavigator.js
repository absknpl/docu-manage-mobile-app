import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import BottomTabNavigator from './BottomTabNavigator';
import FloatingActionButton from '../components/FloatingActionButton';
import { useThemeMode } from '../contexts/ThemeContext';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { colorScheme } = useThemeMode();
  return (
    <View style={[styles.container, colorScheme === 'dark' && { backgroundColor: '#181926' }]}> 
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          cardStyle: { 
            backgroundColor: 'transparent',
            paddingTop: 0 // Ensures no top spacing
          }
        }}
      >
        <Stack.Screen name="Main" component={BottomTabNavigator} />
      </Stack.Navigator>
      <FloatingActionButton />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    marginTop: 0, // Explicitly remove top margin
  },
});