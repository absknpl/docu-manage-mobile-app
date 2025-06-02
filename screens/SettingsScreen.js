import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Switch, 
  TouchableOpacity, 
  Linking,
  Animated,
  Easing,
  Platform,
  ScrollView // Added ScrollView import
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeMode } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const themeOptions = [
  { label: 'Pop', value: 'pop', icon: 'zap' },
  { label: 'Light', value: 'light', icon: 'sun' },
  { label: 'Dark', value: 'dark', icon: 'moon' },
];

const SettingsItem = ({ icon, label, value, onPress, isLast, children }) => {
  const [scaleValue] = useState(new Animated.Value(1));
  const { colorScheme } = useThemeMode();
  
  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={[
      styles.settingItem, 
      colorScheme === 'dark' && styles.settingItemDark,
      !isLast && (colorScheme === 'dark' ? styles.settingItemBorderDark : styles.settingItemBorder),
      { transform: [{ scale: scaleValue }] }
    ]}>
      <TouchableOpacity 
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
        activeOpacity={0.8}
        style={styles.settingItemInner}
      >
        <View style={styles.settingLeft}>
          <View style={[styles.iconContainer, colorScheme === 'dark' && { backgroundColor: 'rgba(138, 173, 244, 0.12)' }] }>
            <Feather name={icon} size={18} color={colorScheme === 'dark' ? '#8aadf4' : '#6366f1'} />
          </View>
          <Text style={[styles.settingText, colorScheme === 'dark' && styles.settingTextDark]}>{label}</Text>
        </View>
        
        <View style={styles.settingRight}>
          {value && <Text style={[styles.settingValue, colorScheme === 'dark' && styles.settingValueDark]}>{value}</Text>}
          {children}
          {onPress && <Feather name="chevron-right" size={18} color={colorScheme === 'dark' ? '#8aadf4' : '#bfc6e6'} />}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ThemeCard = ({ icon, label, value, isSelected, onSelect, previewColors }) => {
  const isPop = value === 'pop';
  return (
    <TouchableOpacity
      onPress={() => {
        Haptics.selectionAsync();
        onSelect();
      }}
      activeOpacity={0.85}
      style={{ flex: 1, marginHorizontal: 6 }}
    >
      <View style={[
        styles.themeCard,
        isPop && styles.themeCardPop,
        isSelected && styles.themeCardSelected,
        { backgroundColor: isPop ? '#ffb347' : previewColors.bg, borderColor: isSelected ? '#ff5e62' : 'transparent' }
      ]}>
        <View style={[styles.themeCardPreview, { backgroundColor: isPop ? '#ff5e62' : previewColors.preview }]} />
        <Feather name={icon} size={22} color={isSelected ? (isPop ? '#fff' : '#6366f1') : (isPop ? '#fff' : '#64748b')} style={{ marginBottom: 8 }} />
        <Text style={[styles.themeCardLabel, isPop && styles.themeCardLabelPop, isSelected && { color: isPop ? '#fff' : '#6366f1' }]}>{label}</Text>
        {isSelected && (
          <View style={[styles.themeCardCheck, isPop && { backgroundColor: '#ff5e62' }]}>
            <Feather name="check" size={16} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [appVersion] = useState('1.0.0');
  const { themeMode, setThemeMode, colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';
  const [headerScale] = useState(new Animated.Value(1));

  const handleSupport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL('mailto:support@example.com?subject=Support%20Request');
  };

  const handlePrivacy = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL('https://yourapp.com/privacy');
  };

  const handleRate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL('https://yourapp.com/rate');
  };

  const toggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications(prev => !prev);
  };

  const animateHeader = () => {
    Animated.sequence([
      Animated.timing(headerScale, {
        toValue: 1.03,
        duration: 100,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(headerScale, {
        toValue: 1,
        duration: 200,
        easing: Easing.elastic(1.5),
        useNativeDriver: true,
      }),
    ]).start();
  };

  React.useEffect(() => {
    animateHeader();
  }, []);

  return (
    <SafeAreaView style={[
      styles.container,
      colorScheme === 'pop'
        ? { backgroundColor: theme.faded }
        : colorScheme === 'dark' && { backgroundColor: '#0f172a' }
    ]}>
      <Animated.View style={[styles.header, colorScheme === 'dark' && { backgroundColor: '#181926' }, { transform: [{ scale: headerScale }] }]}> 
        <Text style={[styles.headerTitle, colorScheme === 'dark' && { color: '#8aadf4' }]}>
          Settings
        </Text>
      </Animated.View>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Appearance Section at the Top */}
        <Text style={[styles.sectionTitle, colorScheme === 'dark' && { color: '#8aadf4' }]}>Appearance</Text>
        <View style={styles.themeCardRow}>
          <ThemeCard
            icon="zap"
            label="Pop"
            value="pop"
            isSelected={themeMode === 'pop'}
            onSelect={() => setThemeMode('pop')}
            previewColors={{
              bg: 'linear-gradient(90deg, #ffb347 0%, #ff5e62 100%)', // fallback for RN: use a bright color
              preview: '#ff5e62',
              // For extra pop, you could use a gradient library for backgrounds
            }}
          />
          <ThemeCard
            icon="sun"
            label="Light"
            value="light"
            isSelected={themeMode === 'light'}
            onSelect={() => setThemeMode('light')}
            previewColors={{ bg: '#fffbe6', preview: '#fef9c3' }}
          />
          <ThemeCard
            icon="moon"
            label="Dark"
            value="dark"
            isSelected={themeMode === 'dark'}
            onSelect={() => setThemeMode('dark')}
            previewColors={{ bg: '#181926', preview: '#232946' }}
          />
        </View>
        {/* Preferences Section (without Appearance) */}
        <Text style={[styles.sectionTitle, colorScheme === 'dark' && { color: '#8aadf4' }]}>Preferences</Text>
        <View style={[styles.settingCard, colorScheme === 'dark' && { backgroundColor: '#232946', shadowColor: '#000' }]}> 
          <SettingsItem 
            icon="bell" 
            label="Notifications" 
            onPress={toggleNotifications}
          >
            <Switch
              value={notifications}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
              thumbColor="#fff"
              ios_backgroundColor="#e2e8f0"
            />
          </SettingsItem>
        </View>
        <Text style={[styles.sectionTitle, colorScheme === 'dark' && { color: '#8aadf4' }]}>About</Text>
        <View style={[styles.settingCard, colorScheme === 'dark' && { backgroundColor: '#232946', shadowColor: '#000' }]}> 
          <SettingsItem 
            icon="info" 
            label="Version" 
            value={appVersion}
          />
          
          <SettingsItem 
            icon="mail" 
            label="Contact Support" 
            onPress={handleSupport}
          />
          
          <SettingsItem 
            icon="shield" 
            label="Privacy Policy" 
            onPress={handlePrivacy}
          />
          
          <SettingsItem 
            icon="star" 
            label="Rate This App" 
            onPress={handleRate}
            isLast={true}
          />
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, colorScheme === 'dark' && { color: '#8aadf4' }]}>Made with <Feather name="heart" size={14} color="#f43f5e" /> by Abhishek</Text>
          <Text style={[styles.footerText, colorScheme === 'dark' && { color: '#8aadf4' }]}>© {new Date().getFullYear()} Abhishek Nepal</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  containerDark: {
    backgroundColor: '#0f172a',
  },
  scrollContainer: {
    padding: 16,
    paddingTop: 0,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6366f1',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    letterSpacing: -0.5,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 24,
    marginBottom: 8,
    marginLeft: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  settingItem: {
    backgroundColor: '#fff',
  },
  settingItemDark: {
    backgroundColor: '#1e293b',
  },
  settingItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingItemBorderDark: {
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingItemInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  settingTextDark: {
    color: '#e2e8f0',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
    marginRight: 8,
  },
  settingValueDark: {
    color: '#94a3b8',
  },
  themeCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    marginBottom: 8,
  },
  themeCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    borderWidth: 2,
    marginHorizontal: 4,
    backgroundColor: '#f4f6fb',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  themeCardPop: {
    backgroundColor: '#ffb347',
    borderColor: '#ff5e62',
    shadowColor: '#ff5e62',
    shadowOpacity: 0.25,
    elevation: 8,
    // Add more poppy/funky effects as desired
    transform: [{ rotate: '-2deg' }],
  },
  themeCardSelected: {
    borderColor: '#6366f1',
    shadowOpacity: 0.18,
    elevation: 6,
  },
  themeCardLabel: {
    fontWeight: '600',
    fontSize: 15,
    color: '#64748b',
    marginTop: 2,
  },
  themeCardLabelPop: {
    color: '#ff5e62',
    textShadowColor: '#fff',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: Platform.OS === 'ios' ? 'Chalkboard SE' : 'monospace',
  },
  themeCardPreview: {
    width: 48,
    height: 12,
    borderRadius: 6,
    marginBottom: 10,
  },
  themeCardCheck: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 2,
  },
  popGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: undefined,
    // This will be replaced by a gradient in the card below
  },
  footer: {
    marginTop: 32,
    marginBottom: 48,
    alignItems: 'center',
  },
  footerText: {
    color: '#94a3b8',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
});