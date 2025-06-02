import React from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Linking } from 'react-native';
import { Feather } from '@expo/vector-icons';
import FloatingActionButton from '../components/FloatingActionButton';
import { useThemeMode } from '../contexts/ThemeContext';

const themeOptions = [
  { label: 'System', value: 'system' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [appVersion] = React.useState('1.0.0');
  const { themeMode, setThemeMode, colorScheme } = useThemeMode();

  const handleSupport = () => {
    Linking.openURL('mailto:support@example.com?subject=Support%20Request');
  };

  const handlePrivacy = () => {
    Linking.openURL('https://yourapp.com/privacy');
  };

  const handleRate = () => {
    Linking.openURL('https://yourapp.com/rate');
  };

  return (
    <View style={[styles.container, colorScheme === 'dark' && { backgroundColor: '#181926' }]}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.settingItemColumn}>
        <View style={styles.settingLabelRow}>
          <Feather name="moon" size={18} color="#6366f1" style={styles.settingIcon} />
          <Text style={styles.settingText}>Theme</Text>
        </View>
        <View style={styles.themeOptionsRow}>
          {themeOptions.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.themeOption, themeMode === opt.value && styles.themeOptionSelected]}
              onPress={() => setThemeMode(opt.value)}
            >
              <Text style={[styles.themeOptionText, themeMode === opt.value && styles.themeOptionTextSelected]}>{opt.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.settingItem}>
        <View style={styles.settingLabelRow}>
          <Feather name="bell" size={18} color="#6366f1" style={styles.settingIcon} />
          <Text style={styles.settingText}>Enable Notifications</Text>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>
      <Text style={styles.sectionTitle}>App</Text>
      <View style={styles.settingItem}>
        <View style={styles.settingLabelRow}>
          <Feather name="info" size={18} color="#6366f1" style={styles.settingIcon} />
          <Text style={styles.settingText}>Version</Text>
        </View>
        <Text style={styles.settingValue}>{appVersion}</Text>
      </View>
      <TouchableOpacity style={styles.settingItem} onPress={handleSupport}>
        <View style={styles.settingLabelRow}>
          <Feather name="mail" size={18} color="#6366f1" style={styles.settingIcon} />
          <Text style={styles.settingText}>Contact Support</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#bfc6e6" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={handlePrivacy}>
        <View style={styles.settingLabelRow}>
          <Feather name="shield" size={18} color="#6366f1" style={styles.settingIcon} />
          <Text style={styles.settingText}>Privacy Policy</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#bfc6e6" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.settingItem} onPress={handleRate}>
        <View style={styles.settingLabelRow}>
          <Feather name="star" size={18} color="#6366f1" style={styles.settingIcon} />
          <Text style={styles.settingText}>Rate This App</Text>
        </View>
        <Feather name="chevron-right" size={18} color="#bfc6e6" />
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Made with <Feather name="heart" size={14} color="#f43f5e" /> by abisek </Text>
        <Text style={styles.footerText}>© Copyright Abhishek Nepal • 2025 </Text>
  
      </View>
      <FloatingActionButton onPress={() => console.log('Settings FAB pressed')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6fb',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#6366f1',
    marginTop: 18,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99,102,241,0.08)',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 6,
    paddingHorizontal: 10,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  settingItemColumn: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 15,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  settingLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingText: {
    fontSize: 16,
    color: '#3730a3',
    fontWeight: '600',
  },
  settingValue: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
  themeOptionsRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 10,
  },
  themeOption: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: 'rgba(99,102,241,0.10)',
    borderWidth: 1.5,
    borderColor: 'rgba(99,102,241,0.10)',
  },
  themeOptionSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  themeOptionText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  themeOptionTextSelected: {
    color: '#fff',
  },
  footer: {
    marginTop: 30,
    alignItems: 'center',
  },
  footerText: {
    color: '#bfc6e6',
    fontSize: 13,
    fontWeight: '500',
  },
});