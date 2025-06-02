import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { useThemeMode } from '../contexts/ThemeContext';

export default function TimelineItem({ document, isLast, colors, isPop }) {
  const { colorScheme, theme } = useThemeMode();
  const isDarkMode = colorScheme === 'dark';
  
  const date = new Date(document.expirationDate);
  const today = new Date();
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

  let popStatusColors = ['#ff5e62', '#f9d423', '#fc6076', '#22c55e'];
  if (isPop) {
    if (status === 'today') color = popStatusColors[0];
    else if (status === 'tomorrow') color = popStatusColors[1];
    else if (status === 'this-week') color = popStatusColors[2];
    else color = popStatusColors[3];
  }
  const statusBgColor = isPop ? `${color}22` : (isDarkMode ? `${color}20` : `${color}10`);
  const categoryBgColor = isPop ? theme.faded : (isDarkMode ? 'rgba(99, 102, 241, 0.2)' : 'rgba(99, 102, 241, 0.1)');

  return (
    <View style={[
      styles.item,
      isPop ? {
        borderLeftColor: color,
        backgroundColor: theme.card,
        shadowColor: theme.popShadow,
        borderWidth: 2,
        elevation: 8,
        transform: [{ rotate: '-1deg' }],
      } : {
        borderLeftColor: color,
        backgroundColor: colors.cardBackground,
        shadowColor: isDarkMode ? '#000' : '#64748b',
      }
    ]}>
      <View style={styles.marker}>
        <View style={[styles.dot, isPop ? { backgroundColor: color, borderWidth: 2, borderColor: theme.accent } : { backgroundColor: color }]} />
        {(status === 'today' || status === 'tomorrow') && (
          <Feather name="alert-triangle" size={16} color={color} style={styles.warningIcon} />
        )}
        {!isLast && <View style={[styles.line, isPop ? { backgroundColor: theme.accent } : { backgroundColor: isDarkMode ? '#363a4f' : '#e2e8f0' }]} />}
      </View>
      <View style={styles.content}>
        <View style={styles.dateRow}>
          <Text style={[styles.dateText, { color: colors.secondaryText }, isPop && { fontFamily: theme.popFont }]}>
            {format(date, 'EEE, MMM d')}
          </Text>
          <View style={[styles.status, { backgroundColor: statusBgColor }]}>
            <Text style={[styles.statusText, { color }, isPop && { fontFamily: theme.popFont }]}>{label}</Text>
          </View>
        </View>
        <Text style={[styles.docTitle, { color: colors.primaryText }, isPop && { fontFamily: theme.popFont, fontWeight: 'bold', fontSize: 18 }]}>
          {document.title}
        </Text>
        <View style={styles.meta}>
          {document.category && (
            <View style={[styles.category, isPop ? { backgroundColor: theme.faded, borderColor: theme.accent, borderWidth: 1.5 } : { backgroundColor: categoryBgColor }]}>
              <Text style={[styles.categoryText, { color: isPop ? theme.accent : '#6366f1' }, isPop && { fontFamily: theme.popFont }]}>
                {document.category}
              </Text>
            </View>
          )}
          <Text style={[styles.year, { color: colors.secondaryText }, isPop && { fontFamily: theme.popFont }]}>
            {format(date, 'yyyy')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    gap: 12,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 2,
  },
  marker: {
    width: 24,
    alignItems: 'center',
    position: 'relative',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 2,
  },
  line: {
    position: 'absolute',
    width: 2,
    top: 20,
    bottom: -20,
    left: 5,
    zIndex: 1,
  },
  warningIcon: {
    position: 'absolute',
    top: -4,
    left: 4,
    zIndex: 3,
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
    fontSize: 14,
    fontWeight: '500',
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  docTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  meta: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  category: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  year: {
    fontSize: 14,
    fontWeight: '500',
  },
});