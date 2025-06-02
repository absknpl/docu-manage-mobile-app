import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import FloatingActionButton from '../components/FloatingActionButton';
import { useThemeMode } from '../contexts/ThemeContext';

const notifications = [
  { id: '1', title: 'Document Expiring', message: 'Your passport expires in 30 days' },
  { id: '2', title: 'New Feature', message: 'Check out the new timeline view' },
];

export default function NotificationsScreen() {
  const { colorScheme } = useThemeMode();

  return (
    <View style={[styles.container, colorScheme === 'dark' && { backgroundColor: '#181926' }]}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationItem}>
            <View style={{ flex: 1 }}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage} numberOfLines={2} ellipsizeMode="tail">
                {item.message.length > 0
                  ? item.message.slice(0, Math.floor(item.message.length * 0.8)) + (item.message.length > Math.floor(item.message.length * 0.8) ? '...' : '')
                  : ''}
              </Text>
            </View>
          </View>
        )}
      />
      <FloatingActionButton onPress={() => console.log('Notifications FAB pressed')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f6fb',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 18,
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 6,
    borderLeftWidth: 4,
    borderLeftColor: '#6366f1',
  },
  notificationTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
    color: '#3730a3',
    letterSpacing: 0.2,
  },
  notificationMessage: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
  },
});