import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen(props) {
  const navigation = useNavigation();
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

    // Navigate after 1.2s (matches native splash duration)
    const timeout = setTimeout(() => {
      if (navigation && typeof navigation.replace === 'function') {
        navigation.replace('Main');
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [navigation]);

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
            <View style={styles.logo}>
              <Image
                source={require('../assets/appstore.png')}
                style={{ width: width * 0.35, height: width * 0.35, maxWidth: 220, maxHeight: 220, borderRadius: 24 }}
                resizeMode="contain"
              />
            </View>
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
          {/* Removed Get Started button for splash auto-navigation */}
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
});