// OnboardingProgressBar.js
import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export default function OnboardingProgressBar({ step, total }) {
  const progress = (step + 1) / total;
  return (
    <View style={styles.barBg}>
      <Animated.View style={[styles.barFill, { width: `${progress * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  barBg: {
    height: 8,
    width: '80%',
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 32,
    marginBottom: 24,
    alignSelf: 'center',
    overflow: 'hidden',
  },
  barFill: {
    height: 8,
    backgroundColor: '#6366F1',
    borderRadius: 8,
    transition: 'width 0.3s',
  },
});
