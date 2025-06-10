// OnboardingStep.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function OnboardingStep({ headline, description, illustration, mascot, ctaButton }) {
  return (
    <Animatable.View animation="fadeInUp" duration={400} style={styles.container}>
      {mascot && <View style={styles.mascot}>{mascot}</View>}
      {illustration && <View style={styles.illustration}>{illustration}</View>}
      <Text style={styles.headline}>{headline}</Text>
      <Text style={styles.description}>{description}</Text>
      <View style={styles.ctaContainer}>{ctaButton}</View>
    </Animatable.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    width: '100%',
  },
  mascot: {
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    // Make mascot much larger
    width: 220,
    height: 220,
  },
  illustration: {
    marginBottom: 24,
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#232946',
    textAlign: 'center',
    marginBottom: 12,
  },
  description: {
    fontSize: 17,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 28,
  },
  ctaContainer: {
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
});
