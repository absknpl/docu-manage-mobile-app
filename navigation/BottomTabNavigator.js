import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Platform, View, Text, Animated, Easing } from 'react-native';
import DocumentsScreen from '../screens/DocumentsScreen';
import TimelineScreen from '../screens/TimelineScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useThemeMode } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';
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
    <View style={[styles.container, isPop ? { backgroundColor: theme.faded } : (isDarkMode && { backgroundColor: '#0f0f17' })]}>
      <Tab.Navigator
        initialRouteName="Documents"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: isPop ? theme.accent : (isDarkMode ? '#8aadf4' : '#6366f1'),
          tabBarInactiveTintColor: isPop ? '#fc6076' : (isDarkMode ? 'rgba(138, 173, 244, 0.5)' : 'rgba(99, 102, 241, 0.5)'),
          tabBarStyle: [
            styles.tabBar,
            isPop ? {
              backgroundColor: theme.faded,
              borderColor: theme.accent,
              shadowColor: theme.popShadow,
              borderWidth: 2,
              elevation: 16,
            } : (isDarkMode ? styles.tabBarDark : styles.tabBarLight),
            {
              shadowColor: isPop ? theme.popShadow : (isDarkMode ? '#8aadf4' : '#6366f1'),
              borderTopWidth: 1,
              borderTopColor: isPop ? theme.accent : (isDarkMode ? 'rgba(138, 173, 244, 0.15)' : 'rgba(99, 102, 241, 0.15)'),
            }
          ],
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabel: ({ focused, color }) => (
            <View style={{ alignItems: 'center' }}>
              <Text style={[
                styles.tabBarLabel,
                isPop && { color: focused ? theme.accent : '#fc6076', fontFamily: theme.popFont, fontWeight: 'bold', fontSize: 12, textShadowColor: theme.accent, textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 2 },
                { color: focused ? color : (isPop ? '#fc6076' : (isDarkMode ? 'rgba(138, 173, 244, 0.7)' : 'rgba(99, 102, 241, 0.7)')), marginTop: 4 },
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
            const iconSize = focused ? 30 : 24;
            // Microinteraction: pulse effect on focus
            const pulse = animation && focused ?
              animation.scale.interpolate({
                inputRange: [1, 1.2],
                outputRange: [1, 1.08],
                extrapolate: 'clamp'
              }) : 1;
            return (
              <View style={styles.iconContainer}>
                {/* Selected tab indicator (animated underline) */}
                <Animated.View
                  style={[
                    styles.selectedIndicator,
                    isPop ? { backgroundColor: theme.accent, opacity: focused ? 1 : 0.2 } : {
                      opacity: animation ? animation.indicatorOpacity : 0,
                      backgroundColor: isDarkMode ? 'rgba(138, 173, 244, 0.22)' : 'rgba(99, 102, 241, 0.18)',
                    },
                    { transform: [ { scaleX: animation ? animation.bgScale : 0 } ] }
                  ]}
                />
                {/* Icon background with glass effect and animated scale */}
                <Animated.View
                  style={[
                    styles.iconBackground,
                    isPop ? {
                      backgroundColor: focused ? theme.accent : theme.faded,
                      borderWidth: focused ? 2 : 1,
                      borderColor: theme.accent,
                      shadowColor: theme.popShadow,
                      shadowOpacity: focused ? 0.25 : 0.1,
                      shadowRadius: focused ? 16 : 6,
                      shadowOffset: { width: 0, height: 4 },
                    } : {
                      transform: [ { scale: animation ? animation.bgScale : 0.8 } ],
                      backgroundColor: focused
                        ? (isDarkMode ? 'rgba(138, 173, 244, 0.18)' : 'rgba(99, 102, 241, 0.13)')
                        : 'transparent',
                      borderWidth: focused ? 1.5 : 0,
                      borderColor: focused
                        ? (isDarkMode ? 'rgba(138, 173, 244, 0.25)' : 'rgba(99, 102, 241, 0.18)')
                        : 'transparent',
                      shadowColor: focused ? (isDarkMode ? '#8aadf4' : '#6366f1') : 'transparent',
                      shadowOpacity: focused ? 0.18 : 0,
                      shadowRadius: focused ? 12 : 0,
                      shadowOffset: { width: 0, height: 4 },
                    }
                  ]}
                />
                {/* Icon with microinteraction pulse */}
                <Animated.View
                  style={{
                    transform: [
                      { scale: pulse },
                      { scale: animation ? animation.scale : 1 },
                      { translateY: animation ? animation.translateY : 0 }
                    ],
                  }}
                >
                  {route.name === 'Documents' && (
                    <MaterialCommunityIcons
                      name="file-document-multiple-outline"
                      size={iconSize}
                      color={isPop ? theme.accent : color}
                    />
                  )}
                  {route.name === 'Timeline' && (
                    <Ionicons
                      name="time-outline"
                      size={iconSize}
                      color={isPop ? theme.accent : color}
                    />
                  )}
                  {route.name === 'Notifications' && (
                    <Ionicons
                      name="notifications-outline"
                      size={iconSize}
                      color={isPop ? theme.accent : color}
                    />
                  )}
                  {route.name === 'Settings' && (
                    <Ionicons
                      name="settings-outline"
                      size={iconSize}
                      color={isPop ? theme.accent : color}
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