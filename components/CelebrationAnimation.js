// CelebrationAnimation.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function CelebrationAnimation() {
  return (
    <View style={styles.container} pointerEvents="none">
      <LottieView
        source={require('../assets/onboarding/celebration.json')}
        autoPlay
        loop={false}
        style={styles.lottie}
        speed={1.2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  lottie: {
    width: 320,
    height: 320,
  },
});
