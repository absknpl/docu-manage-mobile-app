import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Platform,
  Animated,
  Easing,
  Dimensions,
  SafeAreaView,
  Image,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { useThemeMode } from '../contexts/ThemeContext';

const { width, height } = Dimensions.get('window');
const FEATURES = [
  { icon: 'lock', text: 'Bank-grade encryption for all documents' },
  { icon: 'bell', text: 'Smart expiry reminders & notifications' },
  { icon: 'search', text: 'Instant search with AI suggestions' },
  { icon: 'tag', text: 'Organize with custom tags & categories' },
  { icon: 'bar-chart-2', text: 'Visual analytics & document timelines' },
];

export default function SplashScreen({ navigation, forceShow }) {
  const [buttonScale] = useState(new Animated.Value(1));
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideUpAnim = useState(new Animated.Value(30))[0];
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        if (forceShow) {
          setIsFirstLaunch(true);
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.back(1)),
              useNativeDriver: true,
            })
          ]).start();
          return;
        }
        // Always check AsyncStorage for first launch on every mount
        const hasLaunched = await AsyncStorage.getItem('@hasLaunched');
        if (hasLaunched === null) {
          // First launch on any OS: show splash
          setIsFirstLaunch(true);
          await AsyncStorage.setItem('@hasLaunched', 'true');
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(slideUpAnim, {
              toValue: 0,
              duration: 1000,
              easing: Easing.out(Easing.back(1)),
              useNativeDriver: true,
            })
          ]).start();
        } else {
          // Not first launch: skip splash
          if (navigation && typeof navigation.replace === 'function') {
            navigation.replace('Main');
          }
        }
      } catch (error) {
        console.error('Error checking first launch:', error);
        setIsFirstLaunch(true); // Default to showing welcome screen if error occurs
      }
    };

    checkFirstLaunch();
  }, [navigation, forceShow]);

  const handleLetsGo = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
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

  const renderFeatureItem = ({ item }) => (
    <View style={styles.featureItem}>
      <View style={styles.featureIconContainer}>
        <Feather name={item.icon} size={20} color="#3b82f6" />
      </View>
      <Text style={styles.featureText}>{item.text}</Text>
    </View>
  );

  if (isFirstLaunch === null) {
    return null; // Show nothing while checking first launch status
  }

  if (!isFirstLaunch) {
    return null; // Will be quickly replaced by navigation
  }

  // Determine background color for SafeAreaView and StatusBar
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
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideUpAnim }] }]}> 
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.logo}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Feather name="box" size={48} color="white" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>Welcome to Arkive</Text>
          <Text style={styles.subtitle}>Your personal document fortress</Text>
          
          <Animated.View style={{ transform: [{ scale: buttonScale }], marginTop: -8 }}>
            <TouchableOpacity 
              style={[styles.button, { marginTop: 0 }]} 
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
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // will be overridden dynamically
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    width: '100%',
    height: '100%',
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
  featuresBox: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
    width: '94%', // Increased width for better readability
    alignSelf: 'center', // Center the box
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 4,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
    lineHeight: 24,
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
  footerText: {
    position: 'absolute',
    bottom: 40,
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
});