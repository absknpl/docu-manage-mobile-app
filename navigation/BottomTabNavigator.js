import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Platform, View, Text, Animated, Easing } from 'react-native';
import DocumentsScreen from '../screens/DocumentsScreen';
import TimelineScreen from '../screens/TimelineScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useThemeMode } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { colorScheme } = useThemeMode();
  const isDarkMode = colorScheme === 'dark';
  
  // Enhanced animations with spring and timing combinations
  const tabAnimations = React.useRef({}).current;
  const tabNames = ['Documents', 'Timeline', 'Notifications', 'Settings'];
  
  tabNames.forEach(name => {
    if (!tabAnimations[name]) {
      tabAnimations[name] = {
        scale: new Animated.Value(1),
        translateY: new Animated.Value(0),
        opacity: new Animated.Value(0),
        bgScale: new Animated.Value(0),
        indicatorOpacity: new Animated.Value(0)
      };
    }
  });

  const handleTabPress = (route, focused) => {
    const animation = tabAnimations[route.name];
    
    Animated.parallel([
      Animated.spring(animation.scale, {
        toValue: focused ? 1.2 : 1,
        useNativeDriver: true,
        friction: 5,
        tension: 300,
      }),
      Animated.spring(animation.translateY, {
        toValue: focused ? -12 : 0,
        useNativeDriver: true,
        friction: 6,
        tension: 120,
      }),
      Animated.spring(animation.bgScale, {
        toValue: focused ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 80,
      }),
      Animated.timing(animation.indicatorOpacity, {
        toValue: focused ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      })
    ]).start();
  };

  return (
    <View style={[styles.container, isDarkMode && { backgroundColor: '#0f0f17' }]}>
      <Tab.Navigator
        initialRouteName="Documents"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: isDarkMode ? '#8aadf4' : '#6366f1',
          tabBarInactiveTintColor: isDarkMode ? 'rgba(138, 173, 244, 0.5)' : 'rgba(99, 102, 241, 0.5)',
          tabBarStyle: [
            styles.tabBar,
            isDarkMode ? styles.tabBarDark : styles.tabBarLight,
            {
              shadowColor: isDarkMode ? '#8aadf4' : '#6366f1',
              borderTopWidth: 1,
              borderTopColor: isDarkMode ? 'rgba(138, 173, 244, 0.15)' : 'rgba(99, 102, 241, 0.15)',
            }
          ],
          tabBarBackground: () => (
            <BlurView
              intensity={Platform.OS === 'ios' ? 40 : 80}
              tint={isDarkMode ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              <Text style={[
                styles.tabBarLabel,
                { 
                  color: focused ? color : (isDarkMode ? 'rgba(138, 173, 244, 0.7)' : 'rgba(99, 102, 241, 0.7)'),
                  marginTop: 4
                },
                focused && styles.tabBarLabelActive
              ]}>
                {route.name}
              </Text>
            </View>
          ),
          tabBarIcon: ({ focused, color, size }) => {
            React.useEffect(() => {
              handleTabPress(route, focused);
            }, [focused]);
            
            const animation = tabAnimations[route.name];
            const iconSize = focused ? 26 : 22;

            return (
              <View style={styles.iconContainer}>
                {/* Selected tab indicator */}
                <Animated.View
                  style={[
                    styles.selectedIndicator,
                    {
                      opacity: animation.indicatorOpacity,
                      backgroundColor: isDarkMode ? 'rgba(138, 173, 244, 0.2)' : 'rgba(99, 102, 241, 0.15)',
                    }
                  ]}
                />
                
                {/* Icon background */}
                <Animated.View
                  style={[
                    styles.iconBackground,
                    {
                      transform: [{ scale: animation.bgScale }],
                      backgroundColor: focused
                        ? (isDarkMode ? 'rgba(138, 173, 244, 0.18)' : 'rgba(99, 102, 241, 0.13)')
                        : 'transparent',
                    }
                  ]}
                />
                
                {/* Icon */}
                <Animated.View
                  style={{
                    transform: [
                      { scale: animation.scale },
                      { translateY: animation.translateY }
                    ],
                  }}
                >
                  {route.name === 'Documents' && (
                    <MaterialCommunityIcons
                      name="file-document-multiple-outline"
                      size={iconSize}
                      color={color}
                    />
                  )}
                  {route.name === 'Timeline' && (
                    <Ionicons
                      name="time-outline"
                      size={iconSize}
                      color={color}
                    />
                  )}
                  {route.name === 'Notifications' && (
                    <Ionicons
                      name="notifications-outline"
                      size={iconSize}
                      color={color}
                    />
                  )}
                  {route.name === 'Settings' && (
                    <Ionicons
                      name="settings-outline"
                      size={iconSize}
                      color={color}
                    />
                  )}
                </Animated.View>
              </View>
            );
          },
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
    height: Platform.OS === 'ios' ? 96 : 84,
    paddingBottom: Platform.OS === 'ios' ? 32 : 20,
    borderTopWidth: 0,
    marginHorizontal: 24,
    marginBottom: 24,
    borderRadius: 24,
    overflow: 'hidden',
    bottom: 0,
    left: 0,
    right: 0,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 16,
  },
  tabBarLight: {
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    borderColor: 'rgba(99, 102, 241, 0.25)', // More visible border
  },
  tabBarDark: {
    backgroundColor: 'rgba(20, 22, 37, 0.92)',
    borderColor: 'rgba(138, 173, 244, 0.25)', // More visible border
  },
  tabBarItem: {
    height: '100%',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedIndicator: {
    position: 'absolute',
    bottom: 8,
    width: 36,
    height: 4,
    borderRadius: 2,
  },
  iconBackground: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'capitalize',
    includeFontPadding: false,
  },
  tabBarLabelActive: {
    fontWeight: '800',
  },
});