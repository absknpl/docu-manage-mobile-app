import React from 'react';
import { View, FlatList, ActivityIndicator, Text, StyleSheet } from 'react-native';
import DocumentCard from './DocumentCard';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function DocumentList({ searchQuery, categoryFilter }) {
  const { documents, loading } = useDocuments();
  const { colorScheme } = useThemeMode();

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading your documents...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colorScheme === 'dark' ? '#181926' : 'transparent' }}>
      <FlatList
        data={filteredDocuments}
        renderItem={({ item }) => <DocumentCard document={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
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