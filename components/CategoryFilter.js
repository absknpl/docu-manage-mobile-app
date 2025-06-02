import React from 'react';
import { View, ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useThemeMode } from '../contexts/ThemeContext';

export default function CategoryFilter({ categories, selectedCategory, onSelectCategory }) {
  const { colorScheme } = useThemeMode();
  if (!categories.length) return null;
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <TouchableOpacity
        style={[
          styles.chip,
          !selectedCategory && styles.chipSelected,
          colorScheme === 'dark' && { backgroundColor: 'rgba(99,102,241,0.18)', borderColor: 'rgba(99,102,241,0.18)' }
        ]}
        onPress={() => onSelectCategory(null)}
      >
        <Text style={[
          styles.chipText,
          !selectedCategory && styles.chipTextSelected,
          colorScheme === 'dark' && { color: '#fff' }
        ]}>All</Text>
      </TouchableOpacity>
      {categories.map(cat => (
        <TouchableOpacity
          key={cat}
          style={[
            styles.chip,
            selectedCategory === cat && styles.chipSelected,
            colorScheme === 'dark' && { backgroundColor: 'rgba(99,102,241,0.18)', borderColor: 'rgba(99,102,241,0.18)' }
          ]}
          onPress={() => onSelectCategory(cat)}
        >
          <Text style={[
            styles.chipText,
            selectedCategory === cat && styles.chipTextSelected,
            colorScheme === 'dark' && { color: '#fff' }
          ]}>{cat}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
    marginBottom: 12,
    marginTop: 2,
  },
  chip: {
    backgroundColor: 'rgba(99,102,241,0.10)',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1.5,
    borderColor: 'rgba(99,102,241,0.10)',
  },
  chipSelected: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  chipText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 15,
    letterSpacing: 0.1,
  },
  chipTextSelected: {
    color: '#fff',
  },
});
