// navigation/BottomTabNavigator.js
import React, { useRef, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Platform, View, Animated, Pressable, Easing } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import DocumentsScreen from '../screens/DocumentsScreen';
import TimelineScreen from '../screens/TimelineScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useThemeMode } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

const ICONS = {
  Documents: { name: 'file-document-multiple-outline', family: 'MaterialCommunityIcons' },
  Timeline: { name: 'time-outline', family: 'Ionicons' },
  Notifications: { name: 'notifications-outline', family: 'Ionicons' },
  Settings: { name: 'settings-outline', family: 'Ionicons' },
};

export default function BottomTabNavigator() {
  const { colorScheme, theme } = useThemeMode();
  const isDarkMode = colorScheme === 'dark';

  // Animation refs for each tab
  const tabAnimations = {
    Documents: useRef(new Animated.Value(1)).current,
    Timeline: useRef(new Animated.Value(1)).current,
    Notifications: useRef(new Animated.Value(1)).current,
    Settings: useRef(new Animated.Value(1)).current,
  };

  const tabGlows = {
    Documents: useRef(new Animated.Value(0)).current,
    Timeline: useRef(new Animated.Value(0)).current,
    Notifications: useRef(new Animated.Value(0)).current,
    Settings: useRef(new Animated.Value(0)).current,
  };

  // Apple-style spring animation for icon selection
  const animateTab = (name, focused) => {
    Animated.parallel([
      Animated.spring(tabAnimations[name], {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
        damping: 7,
        mass: 0.5,
        stiffness: 300,
      }),
      Animated.timing(tabGlows[name], {
        toValue: focused ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false,
      })
    ]).start();
  };

  // Apple-style glassmorphic background
  const GlassTabBarBackground = () => (
    <View style={[StyleSheet.absoluteFill, { borderRadius: 28, overflow: 'hidden' }]}> 
      {/* Base blur layer, more intense for glassmorphism */}
      <BlurView
        intensity={60}
        tint={isDarkMode ? 'systemUltraThinMaterialDark' : 'systemUltraThinMaterialLight'}
        style={StyleSheet.absoluteFill}
      />
      {/* Layered gradients for depth and light reflection */}
      <LinearGradient
        colors={isDarkMode
          ? ['rgba(36,39,58,0.7)', 'rgba(138,173,244,0.13)', 'rgba(255,255,255,0.10)']
          : ['rgba(255,255,255,0.7)', 'rgba(99,102,241,0.08)', 'rgba(255,255,255,0.13)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Subtle top highlight for glass edge */}
      <LinearGradient
        colors={['rgba(255,255,255,0.22)', 'rgba(255,255,255,0.04)', 'transparent']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, { height: '40%', borderTopLeftRadius: 28, borderTopRightRadius: 28 }]}
        pointerEvents="none"
      />
      {/* Soft white border for glass edge */}
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          styles.glassBorder,
          {
            borderColor: 'rgba(255,255,255,0.18)',
            borderWidth: 1.2,
            borderRadius: 28,
            borderTopWidth: 2,
            borderTopColor: 'rgba(255,255,255,0.28)',
          }
        ]}
      />
      {/* Optional: subtle inner shadow for depth */}
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          borderRadius: 28,
          borderWidth: 0,
          shadowColor: isDarkMode ? '#000' : '#6366f1',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        }}
      />
    </View>
  );

  // Custom tab bar button with Apple-style interactions
  const TabBarButton = ({ children, onPress, accessibilityState }) => {
    const scaleValue = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.92,
        useNativeDriver: true,
        damping: 8,
        stiffness: 500,
      }).start();
    };
    
    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        damping: 8,
        stiffness: 500,
      }).start();
    };

    return (
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={styles.tabButton}
        accessibilityRole="button"
        accessibilityState={accessibilityState}
      >
        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          {children}
        </Animated.View>
      </Pressable>
    );
  };

  // Icon renderer with Apple-style animations
  const renderTabIcon = (route, focused) => {
    const iconSize = 28;
    const activeColor = isDarkMode ? '#0A84FF' : '#007AFF';
    const inactiveColor = isDarkMode ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
    const iconConfig = ICONS[route.name];
    return (
      <>
        <View style={styles.iconContainer}>
          {/* Glow effect */}
          <Animated.View
            style={[
              styles.iconGlow,
              {
                opacity: tabGlows[route.name],
                backgroundColor: activeColor,
              }
            ]}
          />
          {/* Icon with scale animation */}
          <Animated.View
            style={{
              transform: [{ scale: tabAnimations[route.name] }],
            }}
          >
            {iconConfig.family === 'MaterialCommunityIcons' ? (
              <MaterialCommunityIcons
                name={iconConfig.name}
                size={iconSize}
                color={focused ? activeColor : inactiveColor}
              />
            ) : (
              <Ionicons
                name={iconConfig.name}
                size={iconSize}
                color={focused ? activeColor : inactiveColor}
              />
            )}
          </Animated.View>
        </View>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <Tab.Navigator
        initialRouteName="Documents"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [
            styles.tabBar,
            {
              left: 40, // Increased space from screen edge
              right: 40,
              bottom: 32, // More bottom margin for floating effect
              borderRadius: 28,
              minHeight: 80,
              height: Platform.OS === 'ios' ? 84 : 74,
              paddingBottom: Platform.OS === 'ios' ? 8 : 10,
              paddingTop: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 18 },
              shadowOpacity: 0.18,
              shadowRadius: 32,
              elevation: 32,
              backgroundColor: 'transparent',
              borderWidth: 0,
            },
          ],
          tabBarItemStyle: {
            height: '100%',
          },
          tabBarButton: (props) => (
            <TabBarButton {...props} />
          ),
          tabBarIcon: ({ focused }) => {
            useEffect(() => {
              animateTab(route.name, focused);
            }, [focused]);
            return renderTabIcon(route, focused);
          },
          tabBarBackground: () => <GlassTabBarBackground />, // keep the glassmorphism
        })}
      >
        <Tab.Screen name="Documents" component={DocumentsScreen} />
        <Tab.Screen name="Timeline" component={TimelineScreen} />
        <Tab.Screen name="Notifications" component={NotificationsScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  tabBar: {
    position: 'absolute',
    // left/right/bottom now set in screenOptions for more control
    borderRadius: 28,
    overflow: 'visible',
    borderWidth: 0,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.18,
    shadowRadius: 32,
    elevation: 32,
    backgroundColor: 'transparent',
  },
  glassBorder: {
    borderRadius: 28,
    borderWidth: 1.2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  iconContainer: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    opacity: 0,
  },
});