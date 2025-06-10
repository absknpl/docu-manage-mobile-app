// MascotAnimation.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';

export default function MascotAnimation({ emotion = 'neutral', style }) {
  // Map emotion to Lottie file
  const lottieMap = {
    smile: require('../assets/onboarding/mascot-smile.json'),
    wave: require('../assets/onboarding/mascot-wave.json'),
    cheer: require('../assets/onboarding/mascot-cheer.json'),
    nod: require('../assets/onboarding/mascot-nod.json'),
    neutral: require('../assets/onboarding/mascot-neutral.json'),
  };
  return (
    <View style={[styles.container, style]}>
      <LottieView
        source={lottieMap[emotion] || lottieMap.neutral}
        autoPlay
        loop={true} // Always loop, including for 'cheer'
        style={styles.lottie}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 220,
    height: 220,
  },
});
