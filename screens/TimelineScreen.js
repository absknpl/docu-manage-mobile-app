import React from 'react';
import { View, StyleSheet } from 'react-native';
import TimelineView from '../components/TimelineView';
import FloatingActionButton from '../components/FloatingActionButton';
import { useThemeMode } from '../contexts/ThemeContext';

export default function TimelineScreen() {
  const { colorScheme } = useThemeMode();

  return (
    <View style={[
      styles.container, 
      colorScheme === 'dark' && { backgroundColor: '#181926' }
    ]}>
      <TimelineView />
      <FloatingActionButton onPress={() => console.log('Timeline FAB pressed')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc', // Light mode background
  },
});