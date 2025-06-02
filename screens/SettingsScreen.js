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
  ScrollView,
  StatusBar
} from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useThemeMode } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationSettings } from '../contexts/NotificationSettingsContext';
import SplashScreenComponent from '../components/SplashScreen';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useDocuments } from '../contexts/DocumentsContext';
import * as Notifications from 'expo-notifications';

const themeOptions = [
  { label: 'Pop', value: 'pop', icon: 'zap' },
  { label: 'Light', value: 'light', icon: 'sun' },
  { label: 'Dark', value: 'dark', icon: 'moon' },
];

const REMIND_OPTIONS = [
  { label: 'On the day', value: 0 },
  { label: '1 day before', value: 1 },
  { label: '3 days before', value: 3 },
  { label: '1 week before', value: 7 },
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

const RemindMeBeforeSelector = ({ value, onChange, options, onConfirm, onCancel, visible, colorScheme }) => {
  if (!visible) return null;
  return (
    <View style={styles.remindModalOverlay}>
      <View style={[styles.remindModal, colorScheme === 'dark' && { backgroundColor: '#181926' }]}> 
        <Text style={[styles.remindModalTitle, colorScheme === 'dark' && { color: '#8aadf4' }]}>Remind Me Before</Text>
        {options.map(opt => (
          <TouchableOpacity
            key={opt.value}
            style={[
              styles.remindModalOption,
              value === opt.value && styles.remindModalOptionSelected
            ]}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.8}
          >
            <Text style={[
              styles.remindModalOptionText,
              value === opt.value && styles.remindModalOptionTextSelected
            ]}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.remindModalActions}>
          <TouchableOpacity style={styles.remindModalButton} onPress={onCancel}>
            <Text style={styles.remindModalButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.remindModalButton, styles.remindModalButtonConfirm]} onPress={onConfirm}>
            <Text style={[styles.remindModalButtonText, styles.remindModalButtonConfirmText]}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function SettingsScreen() {
  const [appVersion] = useState('1.0.0');
  const { themeMode, setThemeMode, colorScheme, theme, getStatusBarStyle } = useThemeMode();
  const { notificationEnabled, setNotificationEnabled, notificationTime, setNotificationTime, remindBefore, setRemindBefore } = useNotificationSettings();
  const { documents } = useDocuments();
  const isPop = colorScheme === 'pop';
  const [headerScale] = useState(new Animated.Value(1));
  const [tempNotificationTime, setTempNotificationTime] = useState(new Date(0,0,0,notificationTime.hour, notificationTime.minute));
  const [tempRemindBefore, setTempRemindBefore] = useState(remindBefore);
  const [showRemindConfirm, setShowRemindConfirm] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [versionTapCount, setVersionTapCount] = useState(0);

  const handleSupport = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL('mailto:contact@abisek.dev?subject=Support%20Request');
  };

  const handlePrivacy = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL('https://abisek.dev/arkive/privacy');
  };

  const handleRate = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Linking.openURL('https://abisek.dev/arkive/rate');
  };

  const toggleNotifications = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotificationEnabled && setNotificationEnabled(prev => !prev);
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

  // Version tap handler
  const handleVersionPress = () => {
    setVersionTapCount(count => {
      if (count + 1 >= 3) {
        setShowSplash(true);
        setTimeout(() => setShowSplash(false), 1800); // Show splash for 1.8s
        return 0;
      }
      return count + 1;
    });
  };

  // Export documents as CSV (title, expiration date, tag, etc.)
  const handleExportCSV = async () => {
    if (!documents || documents.length === 0) {
      alert('No documents to export.');
      return;
    }
    // Prepare CSV header and rows
    const header = ['Title', 'Expiration Date', 'Tag'];
    const rows = documents.map(doc => [
      `"${doc.title || ''}"`,
      doc.expirationDate ? new Date(doc.expirationDate).toISOString().split('T')[0] : '',
      doc.tag || ''
    ]);
    const csv = [header, ...rows].map(row => row.join(',')).join('\n');
    // Write to a temporary file
    const fileUri = FileSystem.cacheDirectory + `arkive_export_${Date.now()}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
    // Share the file
    await Sharing.shareAsync(fileUri, { mimeType: 'text/csv', dialogTitle: 'Export Documents CSV' });
  };

  React.useEffect(() => {
    animateHeader();
  }, []);

  // Dynamic background colors
  const safeBg = isPop ? theme.faded : theme.background;
  const statusBarStyle = getStatusBarStyle(safeBg);

  // Helper function to set notification time
  function setUserNotificationTime(hour, minute) {
    setTempNotificationTime(new Date(0, 0, 0, hour, minute));
    setNotificationTime({ hour, minute });
    setShowTimePicker(false);
    if (notificationEnabled) {
      scheduleNextNotification(hour, minute);
    }
  }

  // Helper: schedule or update the next notification
  async function scheduleNextNotification(hour, minute) {
    // Remove all previous scheduled notifications
    await Notifications.cancelAllScheduledNotificationsAsync();
    // Find the next document to expire
    const now = new Date();
    const upcomingDocs = documents
      .filter(doc => doc.expirationDate)
      .map(doc => ({ ...doc, expirationDate: new Date(doc.expirationDate) }))
      .filter(doc => doc.expirationDate > now)
      .sort((a, b) => a.expirationDate - b.expirationDate);
    if (upcomingDocs.length === 0) return;
    const nextDoc = upcomingDocs[0];
    // Schedule notification for the selected time on the day of expiration minus remindBefore
    const notifyDate = new Date(nextDoc.expirationDate);
    notifyDate.setDate(notifyDate.getDate() - remindBefore);
    notifyDate.setHours(hour, minute, 0, 0);
    if (notifyDate > now) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Document Expiry: ${nextDoc.title}`,
          body: `Your document \"${nextDoc.title}\" is expiring soon!`,
          sound: true,
        },
        trigger: { type: 'date', date: notifyDate }, // Use correct trigger format
      });
    }
  }

  // Call this whenever notification time or remindBefore changes
  React.useEffect(() => {
    if (notificationEnabled) {
      scheduleNextNotification(tempNotificationTime.getHours(), tempNotificationTime.getMinutes());
    } else {
      Notifications.cancelAllScheduledNotificationsAsync();
    }
  }, [notificationEnabled, tempNotificationTime, remindBefore, documents]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeBg }} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={safeBg} barStyle={statusBarStyle} translucent={false} hidden={false} />
      {showSplash && (
        <View style={{
          ...StyleSheet.absoluteFillObject,
          zIndex: 9999,
          backgroundColor: theme.background,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <SplashScreenComponent forceShow onClose={() => setShowSplash(false)} />
        </View>
      )}
      <Animated.View style={[
        styles.header,
        { backgroundColor: theme.background },
        { transform: [{ scale: headerScale }] },
      ]}> 
        <Text style={[styles.headerTitle, { color: theme.accent }]}>
          Settings
        </Text>
      </Animated.View>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: safeBg }}
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
              value={notificationEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#e2e8f0', true: '#6366f1' }}
              thumbColor="#fff"
              ios_backgroundColor="#e2e8f0"
            />
          </SettingsItem>
          <SettingsItem 
            icon="clock" 
            label="Notification Time" 
            value={tempNotificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            onPress={notificationEnabled ? () => setShowTimePicker(true) : undefined}
          >
            <TouchableOpacity
              onPress={notificationEnabled ? () => setShowTimePicker(true) : undefined}
              activeOpacity={notificationEnabled ? 0.7 : 1}
              style={{ flexDirection: 'row', alignItems: 'center', opacity: notificationEnabled ? 1 : 0.4 }}
              disabled={!notificationEnabled}
            >
              <Feather name="clock" size={18} color={notificationEnabled ? '#6366f1' : '#bfc6e6'} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 16, color: notificationEnabled ? (colorScheme === 'dark' ? '#8aadf4' : '#6366f1') : '#bfc6e6', fontWeight: '500' }}>
                {tempNotificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>
          </SettingsItem>
          <SettingsItem
            icon="calendar"
            label="Remind Me Before"
            value={REMIND_OPTIONS.find(opt => opt.value === tempRemindBefore)?.label}
            onPress={notificationEnabled ? () => setShowRemindConfirm(true) : undefined}
            isLast={true}
          >
            {/* Lower opacity if notifications are off */}
            <View style={!notificationEnabled ? { opacity: 0.4 } : null} pointerEvents={notificationEnabled ? 'auto' : 'none'} />
          </SettingsItem>
        </View>
        {showTimePicker && (
          <View style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 16, backgroundColor: colorScheme === 'dark' ? '#232946' : '#fff', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colorScheme === 'dark' ? '#8aadf4' : '#334155', marginBottom: 12 }}>Set Notification Time</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
              <TouchableOpacity
                onPress={() => {
                  let hour = tempNotificationTime.getHours() - 1;
                  if (hour < 0) hour = 23;
                  setTempNotificationTime(new Date(0, 0, 0, hour, tempNotificationTime.getMinutes()));
                }}
                style={{ padding: 8 }}
              >
                <Text style={{ fontSize: 28, color: colorScheme === 'dark' ? '#8aadf4' : '#6366f1', fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 32, fontWeight: '700', width: 50, textAlign: 'center', color: colorScheme === 'dark' ? '#fff' : '#232946' }}>{tempNotificationTime.getHours().toString().padStart(2, '0')}</Text>
              <Text style={{ fontSize: 32, fontWeight: '700', color: colorScheme === 'dark' ? '#fff' : '#232946' }}>:</Text>
              <TouchableOpacity
                onPress={() => {
                  let minute = tempNotificationTime.getMinutes() - 1;
                  if (minute < 0) minute = 59;
                  setTempNotificationTime(new Date(0, 0, 0, tempNotificationTime.getHours(), minute));
                }}
                style={{ padding: 8 }}
              >
                <Text style={{ fontSize: 28, color: colorScheme === 'dark' ? '#8aadf4' : '#6366f1', fontWeight: 'bold' }}>-</Text>
              </TouchableOpacity>
              <Text style={{ fontSize: 32, fontWeight: '700', width: 50, textAlign: 'center', color: colorScheme === 'dark' ? '#fff' : '#232946' }}>{tempNotificationTime.getMinutes().toString().padStart(2, '0')}</Text>
              <TouchableOpacity
                onPress={() => {
                  let minute = tempNotificationTime.getMinutes() + 1;
                  if (minute > 59) minute = 0;
                  setTempNotificationTime(new Date(0, 0, 0, tempNotificationTime.getHours(), minute));
                }}
                style={{ padding: 8 }}
              >
                <Text style={{ fontSize: 28, color: colorScheme === 'dark' ? '#8aadf4' : '#6366f1', fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  let hour = tempNotificationTime.getHours() + 1;
                  if (hour > 23) hour = 0;
                  setTempNotificationTime(new Date(0, 0, 0, hour, tempNotificationTime.getMinutes()));
                }}
                style={{ padding: 8 }}
              >
                <Text style={{ fontSize: 28, color: colorScheme === 'dark' ? '#8aadf4' : '#6366f1', fontWeight: 'bold' }}>+</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <TouchableOpacity
                onPress={() => setShowTimePicker(false)}
                style={{ paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#e2e8f0', marginRight: 10 }}
              >
                <Text style={{ color: '#334155', fontWeight: '600', fontSize: 16 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowTimePicker(false);
                  setNotificationTime({ hour: tempNotificationTime.getHours(), minute: tempNotificationTime.getMinutes() });
                }}
                style={{ paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#6366f1' }}
              >
                <Text style={{ color: '#fff', fontWeight: '600', fontSize: 16 }}>Set</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        <Text style={[styles.sectionTitle, colorScheme === 'dark' && { color: '#8aadf4' }]}>About</Text>
        <View style={[styles.settingCard, colorScheme === 'dark' && { backgroundColor: '#232946', shadowColor: '#000' }]}> 
          <SettingsItem 
            icon="info" 
            label="Version" 
            value={appVersion}
            onPress={handleVersionPress}
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
          <SettingsItem 
            icon="download" 
            label="Export Data (CSV)" 
            onPress={handleExportCSV}
          />
        </View>
        <View style={styles.footer}>
          <Text style={[styles.footerText, colorScheme === 'dark' && { color: '#8aadf4' }]}>Made with <Feather name="heart" size={14} color="#f43f5e" /> by Abhishek</Text>
          <Text style={[styles.footerText, colorScheme === 'dark' && { color: '#8aadf4' }]}>© {new Date().getFullYear()} Abhishek Nepal</Text>
        </View>
      </ScrollView>
      <RemindMeBeforeSelector
        value={tempRemindBefore}
        onChange={setTempRemindBefore}
        options={REMIND_OPTIONS}
        onConfirm={() => {
          setRemindBefore(tempRemindBefore);
          setShowRemindConfirm(false);
        }}
        onCancel={() => setShowRemindConfirm(false)}
        visible={showRemindConfirm}
        colorScheme={colorScheme}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
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
  remindModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  remindModal: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10,
    alignItems: 'stretch',
  },
  remindModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 18,
    textAlign: 'center',
  },
  remindModalOption: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#f1f5f9',
  },
  remindModalOptionSelected: {
    backgroundColor: '#6366f1',
  },
  remindModalOptionText: {
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
    textAlign: 'center',
  },
  remindModalOptionTextSelected: {
    color: '#fff',
  },
  remindModalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  remindModalButton: {
    flex: 1,
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
    paddingVertical: 10,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  remindModalButtonText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 16,
  },
  remindModalButtonConfirm: {
    backgroundColor: '#6366f1',
  },
  remindModalButtonConfirmText: {
    color: '#fff',
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(180, 180, 180, 0.25)',
    borderRadius: 10,
    zIndex: 10,
  },
});