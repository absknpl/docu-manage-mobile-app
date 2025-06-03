import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
  StatusBar
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useThemeMode } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const [buttonScale] = useState(new Animated.Value(1));
  const fadeAnim = useState(new Animated.Value(0))[0];
  const logoScale = useState(new Animated.Value(0.8))[0];
  const titleSlide = useState(new Animated.Value(20))[0];
  const subtitleFade = useState(new Animated.Value(0))[0];
  const buttonFade = useState(new Animated.Value(0))[0];
  
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';

  useEffect(() => {
    // Animation sequence for splash screen elements
    Animated.parallel([
      // Logo animation (gentle scale + fade)
      Animated.sequence([
        Animated.spring(logoScale, {
          toValue: 1.05,
          friction: 4,
          useNativeDriver: true,
          delay: 100,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        })
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      // Title slide up
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.back(0.8)),
        useNativeDriver: true,
        delay: 150,
      }),
      // Subtitle fade in
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
        delay: 300,
      }),
      // Button fade in
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
        delay: 450,
      })
    ]).start();

    // Always navigate after 1 second
    const timeout = setTimeout(() => {
      if (navigation && typeof navigation.replace === 'function') {
        navigation.replace('Main');
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const handleLetsGo = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.96,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (navigation && typeof navigation.replace === 'function') {
        navigation.replace('Main');
      }
    });
  };

  // Determine background colors
  const safeBg = isPop ? theme.faded : colorScheme === 'dark' ? '#0f172a' : '#f8fafc';
  const statusBarBg = isPop ? theme.primary : colorScheme === 'dark' ? '#0f172a' : '#f8fafc';
  const statusBarStyle = isPop ? 'light' : colorScheme === 'dark' ? 'light' : 'dark';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: safeBg }]}> 
      <StatusBar backgroundColor={statusBarBg} style={statusBarStyle} translucent={false} />
      <LinearGradient
        colors={isPop ? [theme.primary, theme.faded] : colorScheme === 'dark' ? ['#0f172a', '#1e293b'] : ['#f8fafc', '#f1f5f9']}
        style={styles.container}
      >
        <View style={styles.content}>
          {/* Logo with scale animation */}
          <Animated.View style={[styles.logoContainer, { 
            opacity: fadeAnim,
            transform: [{ scale: logoScale }] 
          }]}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.logo}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="box" size={48} color="white" />
            </LinearGradient>
          </Animated.View>
          
          {/* Title with slide up animation */}
          <Animated.Text style={[
            styles.title,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: titleSlide }] 
            }
          ]}>
            Welcome to Arkive
          </Animated.Text>
          
          {/* Subtitle with fade animation */}
          <Animated.Text style={[
            styles.subtitle,
            { 
              opacity: subtitleFade,
            }
          ]}>
            Your personal document fortress
          </Animated.Text>
          
          {/* Button with fade and scale animations */}
          <Animated.View style={{ 
            opacity: buttonFade,
            transform: [{ scale: buttonScale }] 
          }}>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleLetsGo} 
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Get Started</Text>
                <Feather name="arrow-right" size={24} color="white" style={styles.buttonIcon} />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    width: '100%',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: width * 0.35,
    height: width * 0.35,
    marginBottom: 32,
    maxWidth: 220,
    maxHeight: 220,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#6366f1',
    letterSpacing: 1.2,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  button: {
    width: width - 64,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    letterSpacing: 0.5,
  },
  buttonIcon: {
    marginLeft: 10,
  },
});