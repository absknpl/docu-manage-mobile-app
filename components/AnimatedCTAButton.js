// AnimatedCTAButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import * as Haptics from 'expo-haptics';

export default function AnimatedCTAButton({ label, onPress, hapticType }) {
  // Determine haptic feedback type based on prop or default to success for onboarding
  const handlePress = () => {
    if (hapticType === 'success') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (hapticType === 'warning') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else if (hapticType === 'error') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (hapticType === 'selection') {
      Haptics.selectionAsync();
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (onPress) onPress();
  };
  return (
    <Animatable.View animation="pulse" iterationCount="infinite" duration={1200} style={styles.glowWrap}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.85}
        onPress={handlePress}
        accessibilityRole="button"
      >
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  glowWrap: {
    shadowColor: '#6366F1',
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderRadius: 32,
  },
  button: {
    backgroundColor: '#6366F1',
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 180,
  },
  label: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.2,
  },
});
