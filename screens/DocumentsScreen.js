import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import DocumentList from '../components/DocumentList';
import SearchBar from '../components/SearchBar';
import UploadModal from '../components/UploadModal';
import CategoryFilter from '../components/CategoryFilter';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function DocumentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { addNewDocument, documents } = useDocuments();
  const { colorScheme } = useThemeMode();

  // Get unique categories from user's documents
  const categories = Array.from(
    new Set(documents.map(doc => doc.category).filter(Boolean))
  );

  useEffect(() => {
    if (route.params?.showUploadModal) {
      setShowUploadModal(true);
      // Clear the param safely
      navigation.dispatch({
        ...navigation.getState(),
        routes: navigation.getState().routes.map(r => ({
          ...r,
          params: undefined
        }))
      });
    }
  }, [route.params]);

  // Filtered search query for DocumentList
  const effectiveSearch = selectedCategory ? selectedCategory : searchQuery;

  return (
    <View style={[styles.container, colorScheme === 'dark' && { backgroundColor: '#181926' }]}> 
      <SearchBar 
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={cat => {
          setSelectedCategory(cat);
          if (!cat) setSearchQuery('');
        }}
      />
      <DocumentList 
        searchQuery={selectedCategory ? selectedCategory : searchQuery} 
        categoryFilter={selectedCategory}
      />
      <UploadModal 
        visible={showUploadModal} 
        onClose={() => setShowUploadModal(false)}
        onSubmit={addNewDocument}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc', // Match app background
    marginTop: 0, // Explicitly remove top margin
  },
});