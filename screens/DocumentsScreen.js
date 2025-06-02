import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  StyleSheet, 
  Animated, 
  TouchableOpacity, 
  Text,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import DocumentList from '../components/DocumentList';
import SearchBar from '../components/SearchBar';
import UploadModal from '../components/UploadModal';
import CategoryFilter from '../components/CategoryFilter';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function DocumentsScreen() {
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editDocument, setEditDocument] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { addNewDocument, documents, updateDocument } = useDocuments();
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  // Animation for floating action button
  const fabScale = useRef(new Animated.Value(1)).current;
  const fabRotation = useRef(new Animated.Value(0)).current;

  // Get unique categories from user's documents
  const categories = Array.from(
    new Set(documents.map(doc => doc.category).filter(Boolean))
  );

  useEffect(() => {
    if (route.params?.showUploadModal) {
      handleOpenUploadModal();
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

  const handleOpenUploadModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowUploadModal(true);
    
    // Animate FAB
    Animated.parallel([
      Animated.spring(fabScale, {
        toValue: 0.9,
        useNativeDriver: true,
      }),
      Animated.spring(fabRotation, {
        toValue: 1,
        useNativeDriver: true,
      })
    ]).start();
  };

  const handleCloseUploadModal = () => {
    Haptics.selectionAsync();
    setShowUploadModal(false);
    setEditDocument(null);
    
    // Reset FAB animation
    Animated.parallel([
      Animated.spring(fabScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.spring(fabRotation, {
        toValue: 0,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Filtered search query for DocumentList
  const effectiveSearch = selectedCategory ? selectedCategory : searchQuery;

  // Handle add or edit document
  const handleSubmit = async (doc, isEdit) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (isEdit) {
      await updateDocument(doc);
    } else {
      await addNewDocument(doc);
    }
  };

  const rotateInterpolate = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  // Header for FlatList
  const renderListHeader = () => (
    <>
    </>
  );

  return (
    <SafeAreaView style={[
      styles.container,
      isPop
        ? { backgroundColor: theme.faded }
        : colorScheme === 'dark' && { backgroundColor: '#0f172a' }
    ]}>
      {/* Main Header */}
      <View style={[
        styles.mainHeader,
        isPop 
          ? { backgroundColor: theme.primary }
          : colorScheme === 'dark' && { backgroundColor: '#1e293b' }
      ]}>
        <Text style={[
          styles.mainHeaderTitle,
          isPop 
            ? { color: theme.textOnPrimary }
            : colorScheme === 'dark' && { color: '#f8fafc' }
        ]}>
          Documents
        </Text>
        <Text style={[
          styles.mainHeaderSubtitle,
          isPop 
            ? { color: theme.textOnPrimary, opacity: 0.9 }
            : colorScheme === 'dark' && { color: '#94a3b8' }
        ]}>
          {documents.length} items
        </Text>
      </View>

      {/* Search Bar on top of Documents */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12, backgroundColor: 'transparent' }}>
        <SearchBar 
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => Haptics.selectionAsync()}
        />
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={cat => {
            Haptics.selectionAsync();
            setSelectedCategory(cat);
            if (!cat) setSearchQuery('');
          }}
        />
      </View>

      {/* Scrolling Header (appears on scroll) */}
      <Animated.View style={[
        styles.scrollHeader,
        isPop 
          ? { backgroundColor: theme.primary }
          : colorScheme === 'dark' && { backgroundColor: '#1e293b' },
        { opacity: headerOpacity }
      ]}>
        <Text style={[
          styles.scrollHeaderTitle,
          isPop 
            ? { color: theme.textOnPrimary }
            : colorScheme === 'dark' && { color: '#f8fafc' }
        ]}>
          Documents
        </Text>
      </Animated.View>

      {/* Use DocumentList's FlatList as the main scrollable area */}
      <DocumentList 
        searchQuery={selectedCategory ? selectedCategory : searchQuery} 
        categoryFilter={selectedCategory}
        onEditDocument={doc => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setEditDocument(doc);
          handleOpenUploadModal();
        }}
        ListHeaderComponent={null}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      />

      <UploadModal 
        visible={showUploadModal} 
        onClose={handleCloseUploadModal}
        onSubmit={handleSubmit}
        editDocument={editDocument}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mainHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 24,
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  mainHeaderTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    marginBottom: 4,
  },
  mainHeaderSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  scrollHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 24,
    backgroundColor: '#f8fafc',
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  scrollHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  scrollContainer: {
    paddingBottom: 100,
    paddingHorizontal: 16,
  },
});