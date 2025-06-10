// OnboardingScreen.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';
import OnboardingStep from '../components/OnboardingStep';
import OnboardingProgressBar from '../components/OnboardingProgressBar';
import CelebrationAnimation from '../components/CelebrationAnimation';
import MascotAnimation from '../components/MascotAnimation';
import AnimatedCTAButton from '../components/AnimatedCTAButton';
import { onboardingSteps } from '../assets/onboarding/onboardingData';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const ONBOARDING_KEY = 'arkive_onboarding_complete';

export default function OnboardingScreen({ navigation: navProp, route: navRoute, onFinish }) {
  // Use navigation and route only if provided as props (from navigator)
  const navigation = navProp;
  const route = navRoute;
  const replay = route?.params?.replay;
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState(false);
  const totalSteps = onboardingSteps.length;

  // Adapt onboarding steps for replay mode
  const steps = onboardingSteps.map((stepObj, idx) => {
    if (replay) {
      // Change headline and description for returning users
      if (idx === 0) {
        return {
          ...stepObj,
          headline: 'Explore Arkive’s features again!',
          description: 'Here’s a refresher on what makes Arkive magical. Discover new tips and features below.',
          ctaLabel: 'Next',
        };
      }
      if (idx === onboardingSteps.length - 1) {
        return {
          ...stepObj,
          headline: 'You’re all caught up!',
          description: 'Thanks for revisiting onboarding. Check out new features and tips anytime.',
          ctaLabel: 'Back to App',
        };
      }
      // Optionally highlight new features for experienced users
      if (stepObj.headline === 'Smart Reminders') {
        return {
          ...stepObj,
          description: stepObj.description + '\n✨ New: Custom reminder times and advanced notification options!',
        };
      }
      return stepObj;
    }
    return stepObj;
  });

  const handleNext = async () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      setCompleted(true);
      // Persist onboarding completion
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setTimeout(() => {
        if (typeof onFinish === 'function') {
          onFinish();
        } else if (replay && navigation && navigation.goBack) {
          navigation.goBack();
        } else if (navigation && navigation.replace) {
          navigation.replace('Main'); // Ensure this matches the stack name
        }
        // If navigation is not available, do nothing
      }, 1200);
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingProgressBar step={step} total={totalSteps} />
      <Animatable.View
        key={step}
        animation="fadeInRight"
        duration={400}
        style={styles.stepContainer}
      >
        <OnboardingStep
          {...steps[step]}
          mascot={<MascotAnimation emotion={steps[step].mascotEmotion} />}
          ctaButton={
            <AnimatedCTAButton
              label={step === totalSteps - 1 ? (replay ? 'Back to App' : 'Let’s Go!') : steps[step].ctaLabel}
              onPress={handleNext}
              hapticType="success"
            />
          }
        />
      </Animatable.View>
      {completed && <CelebrationAnimation />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 40 : 0,
  },
  stepContainer: {
    flex: 1,
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
