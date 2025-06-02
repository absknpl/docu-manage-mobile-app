import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TimelineItem from './TimelineItem';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function TimelineView() {
  const { documents } = useDocuments();
  const { colorScheme } = useThemeMode();
  const isDarkMode = colorScheme === 'dark';
  
  const upcomingDocuments = documents
    .filter(doc => doc.expirationDate)
    .sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

  // Colors for both modes
  const colors = {
    background: isDarkMode ? '#181926' : '#f8fafc',
    cardBackground: isDarkMode ? '#24273a' : '#ffffff',
    primaryText: isDarkMode ? '#e0def4' : '#1e293b',
    secondaryText: isDarkMode ? '#908caa' : '#64748b',
    accent: isDarkMode ? '#8aadf4' : '#3b82f6',
    icon: isDarkMode ? '#8aadf4' : '#3b82f6',
    emptyIcon: isDarkMode ? '#6e6a86' : '#94a3b8',
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.cardBackground }]}>
          <Feather name="calendar" size={24} color={colors.icon} />
        </View>
        <View>
          <Text style={[styles.title, { color: colors.primaryText }]}>Document Timeline</Text>
          <Text style={[styles.subtitle, { color: colors.secondaryText }]}>
            Upcoming deadlines and expiration dates
          </Text>
        </View>
      </View>
      
      {upcomingDocuments.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.emptyIconContainer, { backgroundColor: colors.cardBackground }]}>
            <Feather name="file" size={48} color={colors.emptyIcon} />
          </View>
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No upcoming deadlines
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.secondaryText }]}>
            Documents with expiration dates will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={upcomingDocuments}
          renderItem={({ item, index }) => (
            <TimelineItem 
              document={item} 
              isLast={index === upcomingDocuments.length - 1}
              colors={colors}
            />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.timelineContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  paddingTop: 16,
  paddingBottom: 0,
  gap: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    marginTop: 2,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 240,
  },
  timelineContainer: {
    gap: 16,
    paddingBottom: 24,
  },
});