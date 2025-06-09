import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import DocumentCard from './DocumentCard';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function DocumentList({ searchQuery, categoryFilter, onEditDocument }) {
  const { documents, loading } = useDocuments();
  const { colorScheme } = useThemeMode();
  const isDarkMode = colorScheme === 'dark';

  // Theme-aware colors
  const colors = {
    cardBackground: isDarkMode ? '#24273a' : '#ffffff',
    primaryText: isDarkMode ? '#e0def4' : '#1e293b',
    secondaryText: isDarkMode ? '#908caa' : '#64748b',
    accent: isDarkMode ? '#8aadf4' : '#3b82f6',
    border: isDarkMode ? 'rgba(99,102,241,0.18)' : 'rgba(255,255,255,0.3)',
    icon: isDarkMode ? '#8aadf4' : '#3b82f6',
    emptyText: isDarkMode ? '#908caa' : '#64748b',
  };

  const filteredDocuments = documents.filter(doc => {
    // If categoryFilter is set, only show docs in that category
    if (categoryFilter) {
      return doc.category === categoryFilter;
    }
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(query) ||
      (doc.category && doc.category.toLowerCase().includes(query))
    );
  });

  // Helper: check if document title matches search query exactly (case-insensitive, trimmed)
  const isTitleMatch = (doc) => {
    if (!searchQuery) return false;
    return doc.title.trim().toLowerCase() === searchQuery.trim().toLowerCase();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.secondaryText }]}>Loading your documents...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: isDarkMode ? '#181926' : 'transparent' }}>
      <FlatList
        data={filteredDocuments}
        renderItem={({ item }) => (
          <DocumentCard 
            document={item} 
            colors={colors} 
            onEdit={onEditDocument}
            isHighlighted={isTitleMatch(item)}
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.emptyText }]}>
              {searchQuery ? 'No documents match your search' : 'No documents yet. Add your first document!'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 20,
    color: '#64748b',
  },
  listContainer: {
    paddingTop: 20,
    gap: 20,
    paddingBottom: 200, // Added extra bottom padding for better spacing
  },
  emptyState: {
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#64748b',
    fontSize: 16,
    textAlign: 'center',
  },
});