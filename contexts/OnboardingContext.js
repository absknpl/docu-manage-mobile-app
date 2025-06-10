// OnboardingContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingContext = createContext();

export function OnboardingProvider({ children }) {
  const [step, setStep] = useState(0);
  const [userName, setUserName] = useState('');
  const [completed, setCompleted] = useState(false);

  // Persist onboarding completion
  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('onboardingCompleted');
      if (stored === 'true') setCompleted(true);
    })();
  }, []);

  useEffect(() => {
    if (completed) {
      AsyncStorage.setItem('onboardingCompleted', 'true');
    }
  }, [completed]);

  return (
    <OnboardingContext.Provider value={{ step, setStep, userName, setUserName, completed, setCompleted }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  return useContext(OnboardingContext);
}
