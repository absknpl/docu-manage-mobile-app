import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import TimelineItem from './TimelineItem';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function TimelineView({ filter }) {
  const { documents } = useDocuments();
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';
  const isDarkMode = colorScheme === 'dark';

  const now = new Date();
  let filteredDocuments = documents.filter(doc => doc.expirationDate);
  if (filter && filter !== 'all') {
    filteredDocuments = filteredDocuments.filter(doc => {
      const exp = new Date(doc.expirationDate);
      if (filter === 'today') return exp.toDateString() === now.toDateString();
      else if (filter === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return exp >= startOfWeek && exp <= endOfWeek;
      } else if (filter === 'month') return exp.getMonth() === now.getMonth() && exp.getFullYear() === now.getFullYear();
      else if (filter === 'year') return exp.getFullYear() === now.getFullYear();
      return true;
    });
  }
  const upcomingDocuments = filteredDocuments.sort((a, b) => new Date(a.expirationDate) - new Date(b.expirationDate));

  const colors = {
    background: theme.faded || (isDarkMode ? '#181926' : '#f8fafc'),
    cardBackground: theme.card,
    primaryText: theme.text,
    secondaryText: isPop ? theme.accent : (isDarkMode ? '#908caa' : '#64748b'),
    accent: theme.accent,
    icon: theme.icon,
    emptyIcon: isPop ? theme.accent : (isDarkMode ? '#6e6a86' : '#94a3b8'),
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      {upcomingDocuments.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[
            styles.emptyIconContainer, 
            isPop ? { 
              backgroundColor: theme.faded, 
              borderColor: theme.accent, 
              borderWidth: 2, 
              shadowColor: theme.popShadow, 
              elevation: 8 
            } : { 
              backgroundColor: colors.cardBackground 
            }
          ]}>
            <Feather name="file" size={48} color={colors.emptyIcon} />
          </View>
          <Text style={[styles.emptyText, { color: colors.secondaryText }, isPop && { fontFamily: theme.popFont }]}>
            No upcoming deadlines
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.secondaryText }, isPop && { fontFamily: theme.popFont }]}>
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
              isPop={isPop}
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
    padding: 0,
    gap: 0,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    gap: 8,
    marginTop: 0,
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
    marginTop: 20,
  },
});