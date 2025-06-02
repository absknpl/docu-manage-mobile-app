import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Platform, View, Text, Animated } from 'react-native';
import DocumentsScreen from '../screens/DocumentsScreen';
import TimelineScreen from '../screens/TimelineScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useThemeMode } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  const { colorScheme } = useThemeMode();
  // Animated values for each tab
  const tabAnimations = React.useRef({}).current;
  const tabNames = ['Documents', 'Timeline', 'Notifications', 'Settings'];
  tabNames.forEach(name => {
    if (!tabAnimations[name]) {
      tabAnimations[name] = new Animated.Value(0);
    }
  });

  const handleTabPress = (route, focused) => {
    Animated.spring(tabAnimations[route.name], {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      friction: 5,
      tension: 120,
    }).start();
  };

  return (
    <View style={[styles.container, colorScheme === 'dark' && { backgroundColor: '#181926' }]}> 
      <Tab.Navigator
        initialRouteName="Documents"
        backBehavior="history"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#6366f1',
          tabBarInactiveTintColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.6)' : 'rgba(99,102,241,0.6)',
          tabBarStyle: [
            styles.tabBar,
            colorScheme === 'dark' ? { backgroundColor: 'rgba(28,28,40,0.92)' } : { backgroundColor: 'rgba(255,255,255,0.92)' }
          ],
          tabBarBackground: () => (
            <BlurView
              intensity={Platform.OS === 'ios' ? 35 : 60}
              tint={colorScheme === 'dark' ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ),
          tabBarItemStyle: styles.tabBarItem,
          tabBarLabel: ({ focused, color }) =>
            focused ? (
              <Animated.View
                style={{
                  minHeight: 12,
                  opacity: tabAnimations[route.name].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                  }),
                  transform: [{
                    translateY: tabAnimations[route.name].interpolate({
                      inputRange: [0, 1],
                      outputRange: [8, 0],
                    })
                  }],
                }}
              >
                <View style={{
                  backgroundColor: 'rgba(99,102,241,0.10)',
                  borderRadius: 6,
                  paddingHorizontal: 6,
                  alignSelf: 'center',
                }}>
                  <Text style={styles.tabBarLabel}>{route.name}</Text>
                </View>
              </Animated.View>
            ) : null,
          tabBarIcon: ({ focused, color, size }) => {
            React.useEffect(() => {
              handleTabPress(route, focused);
            }, [focused]);
            let iconName;
            const iconSize = focused ? 24 : 22;
            if (route.name === 'Documents') {
              iconName = 'file-text';
            } else if (route.name === 'Timeline') {
              iconName = 'calendar';
            } else if (route.name === 'Notifications') {
              iconName = 'bell';
            } else if (route.name === 'Settings') {
              iconName = 'settings';
            }
            return (
              <Animated.View
                style={{
                  transform: [
                    { scale: tabAnimations[route.name].interpolate({ inputRange: [0, 1], outputRange: [1, 1.22] }) },
                    { translateY: tabAnimations[route.name].interpolate({ inputRange: [0, 1], outputRange: [0, -8] }) },
                  ],
                  shadowColor: focused ? '#6366f1' : 'transparent',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: focused ? 0.18 : 0,
                  shadowRadius: focused ? 8 : 0,
                }}
              >
                <Feather 
                  name={iconName} 
                  size={iconSize} 
                  color={color}
                  style={styles.icon}
                />
              </Animated.View>
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
    height: Platform.OS === 'ios' ? 98 : 88,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    borderTopWidth: 0,
    backgroundColor: 'rgba(28,28,40,0.92)', // Deeper, more elegant dark
    marginHorizontal: 28,
    marginBottom: 28,
    borderRadius: 32,
    overflow: 'hidden',
    bottom: 0,
    left: 0,
    right: 0,
    borderColor: 'rgba(99,102,241,0.22)', // Subtle purple border
    borderWidth: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 24,
  },
  tabBarItem: {
    height: '100%',
    paddingVertical: 10,
    paddingHorizontal: 28, // More space for luxury feel
  },
  tabBarLabel: {
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 0.3,
    marginTop: 2,
    marginBottom: 0,
    color: '#bfc6e6',
    opacity: 0.85,
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  icon: {
    marginBottom: 8,
    transform: [{ translateY: 0 }],
    // Removed textShadowColor, textShadowOffset, textShadowRadius for no shadow
  },
  activeIcon: {
    transform: [{ translateY: -8 }, { scale: 1.22 }],
    // Removed textShadowColor, textShadowOffset, textShadowRadius for no shadow
  },
});