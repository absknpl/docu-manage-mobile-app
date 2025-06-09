import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Image,
  Platform  // Added this import
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeMode } from '../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const logoScale = useState(new Animated.Value(0.9))[0];
  const titleSlide = useState(new Animated.Value(10))[0];
  const subtitleFade = useState(new Animated.Value(0))[0];
  
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';

  useEffect(() => {
    // Smooth animation sequence
    Animated.parallel([
      Animated.sequence([
        Animated.spring(logoScale, {
          toValue: 1.05,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          useNativeDriver: true,
        })
      ]),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(titleSlide, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.back(0.8)),
        useNativeDriver: true,
        delay: 100,
      }),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
        delay: 300,
      })
    ]).start();

    // Navigate after 2.5s (enough time to appreciate the animation)
    const timeout = setTimeout(() => {
      navigation.replace('Main');
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigation]);

  // Background colors
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
          {/* App Icon with subtle animation */}
          <Animated.View style={[styles.logoContainer, { 
            opacity: fadeAnim,
            transform: [{ scale: logoScale }] 
          }]}>
            <Image 
              source={require('../assets/appstore.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>
          
          {/* Main Title */}
          <Animated.Text style={[
            styles.title,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: titleSlide }],
              color: isPop ? theme.text : colorScheme === 'dark' ? '#e2e8f0' : '#1e293b'
            }
          ]}>
            Arkive
          </Animated.Text>
          
          {/* Emotional tagline */}
          <Animated.Text style={[
            styles.subtitle,
            { 
              opacity: subtitleFade,
              color: isPop ? theme.textSecondary : colorScheme === 'dark' ? '#94a3b8' : '#64748b'
            }
          ]}>
            Your documents, handled with care.<Feather name="heart" size={14} color="#f43f5e" />
          </Animated.Text>

          {/* Elegant progress indicator */}
          <Animated.View style={[styles.progressBar, { opacity: subtitleFade }]}>
            <LinearGradient
              colors={isPop ? [theme.accent, theme.primary] : ['#3b82f6', '#6366f1']}
              style={styles.progressFill}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
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
    marginBottom: 16,
  },
  logo: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.3 / 4,
  },
  title: {
    fontSize: 42,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
    lineHeight: 24,
    letterSpacing: 0.3,
  },
  progressBar: {
    width: width * 0.4,
    height: 4,
    backgroundColor: 'rgba(100, 116, 139, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 16,
  },
  progressFill: {
    height: '100%',
    width: '100%',
  },
});