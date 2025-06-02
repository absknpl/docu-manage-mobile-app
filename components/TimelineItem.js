import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useThemeMode } from '../contexts/ThemeContext';

export default function TimelineItem({ document, isLast }) {
  const { colorScheme } = useThemeMode();
  const date = new Date(document.expirationDate);
  const today = new Date();

  // Zero out time for both dates to compare only the date part
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const daysDiff = Math.floor((dateOnly - todayOnly) / (1000 * 60 * 60 * 24));
  
  let status, label, color;
  
  if (daysDiff === 0) {
    status = 'today';
    label = 'Expires today';
    color = '#ef4444';
  } else if (daysDiff === 1) {
    status = 'tomorrow';
    label = 'Expires tomorrow';
    color = '#f59e0b';
  } else if (daysDiff <= 7) {
    status = 'this-week';
    label = `Expires in ${daysDiff} days`;
    color = '#3b82f6';
  } else {
    status = 'future';
    label = `Expires in ${daysDiff} days`;
    color = '#10b981';
  }

  return (
    <View style={[
      styles.item,
      { borderLeftColor: color },
      colorScheme === 'dark' && { backgroundColor: 'rgba(24,25,38,0.92)' }
    ]}>
      <View style={styles.marker}>
        <View style={[styles.dot, { backgroundColor: color }]} />
        {(status === 'today' || status === 'tomorrow') && (
          <Feather 
            name="alert-triangle" 
            size={16} 
            color="#ef4444" 
            style={styles.warningIcon}
          />
        )}
      </View>
      <View style={styles.content}>
        <View style={styles.dateRow}>
          <Text style={styles.dateText}>{format(date, 'EEE, MMM d')}</Text>
          <View style={[styles.status, { backgroundColor: `${color}20` }]}>
            <Text style={[styles.statusText, { color }]}>{label}</Text>
          </View>
        </View>
        <Text style={styles.docTitle}>{document.title}</Text>
        <View style={styles.meta}>
          {document.category && (
            <View style={styles.category}>
              <Text style={styles.categoryText}>{document.category}</Text>
            </View>
          )}
          <Text style={styles.year}>{format(date, 'yyyy')}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    gap: 12,
  },
  marker: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  warningIcon: {
    position: 'absolute',
    top: -4,
  },
  content: {
    flex: 1,
    gap: 8,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    color: '#64748b',
    fontSize: 14,
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  category: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  categoryText: {
    color: '#6366f1',
    fontSize: 12,
    fontWeight: '500',
  },
  year: {
    color: '#64748b',
    fontSize: 14,
  },
});