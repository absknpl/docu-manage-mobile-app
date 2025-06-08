import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Platform,
  Share,
  Image,
  Dimensions,
  Animated,
  Easing
} from 'react-native';
import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import Pdf from 'react-native-pdf';
import { format } from 'date-fns';
import { useThemeMode } from '../contexts/ThemeContext';
import { TAG_ICONS } from './TagIcons';
import { BlurView } from 'expo-blur';

const DocumentViewer = ({ document, onClose, onEdit, onDelete }) => {
  const { colorScheme, theme } = useThemeMode();
  const [fileType, setFileType] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Determine file type and prepare URI
    const determineFileType = async () => {
      try {
        let uri = document.file.uri;
        
        // For iOS, we might need to copy the file to a readable location
        if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
          const newPath = `${FileSystem.cacheDirectory}${document.file.name}`;
          await FileSystem.copyAsync({ from: uri, to: newPath });
          uri = newPath;
        }
        
        setFileUri(uri);
        
        if (document.file.type.includes('pdf')) {
          setFileType('pdf');
        } else if (document.file.type.includes('image')) {
          setFileType('image');
        } else {
          setFileType('unknown');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error preparing file:', err);
        setError('Failed to load document');
        setLoading(false);
      }
    };

    determineFileType();

    // Animation on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(0.8)),
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        url: fileUri,
        title: document.title,
        message: `Check out this document: ${document.title}`,
      });
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorContainer}>
          <MaterialIcons name="error-outline" size={48} color={theme.error} />
          <Text style={[styles.errorText, { color: theme.text }]}>{error}</Text>
        </View>
      );
    }

    if (fileType === 'pdf') {
      return (
        <Pdf
          source={{ uri: fileUri, cache: true }}
          style={styles.pdf}
          enablePaging={true}
          enableRTL={false}
          fitPolicy={0}
          minScale={1.0}
          maxScale={3.0}
          spacing={0}
          onLoadComplete={(numberOfPages) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onError={(err) => {
            console.error('PDF error:', err);
            setError('Failed to load PDF');
          }}
        />
      );
    }

    if (fileType === 'image') {
      return (
        <ScrollView 
          maximumZoomScale={3}
          minimumZoomScale={1}
          contentContainerStyle={styles.imageContainer}
        >
          <Image
            source={{ uri: fileUri }}
            style={styles.image}
            resizeMode="contain"
            onError={() => setError('Failed to load image')}
          />
        </ScrollView>
      );
    }

    return (
      <View style={styles.unsupportedContainer}>
        <MaterialIcons name="insert-drive-file" size={48} color={theme.icon} />
        <Text style={[styles.unsupportedText, { color: theme.text }]}>
          File type not supported for preview
        </Text>
      </View>
    );
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        { 
          backgroundColor: theme.background,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header with document info and actions */}
        <BlurView intensity={30} tint={colorScheme} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Feather name="chevron-down" size={24} color={theme.text} />
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text 
                style={[styles.title, { color: theme.text }]} 
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {document.title}
              </Text>
              {document.category && (
                <View style={styles.categoryBadge}>
                  {TAG_ICONS[document.category]}
                  <Text style={[styles.categoryText, { color: theme.accent }]}>
                    {document.category}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
                <Feather name="share-2" size={20} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onEdit(document)} style={styles.actionButton}>
                <Feather name="edit-2" size={20} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onDelete(document.id)} style={styles.actionButton}>
                <Feather name="trash-2" size={20} color={theme.error} />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        {/* Document content area */}
        <View style={styles.content}>
          {renderContent()}
        </View>

        {/* Footer with metadata */}
        <BlurView intensity={30} tint={colorScheme} style={styles.footer}>
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Feather name="calendar" size={16} color={theme.icon} />
              <Text style={[styles.metaText, { color: theme.text }]}>
                {format(new Date(document.createdAt), 'MMM d, yyyy')}
              </Text>
            </View>
            
            {document.expirationDate && (
              <View style={styles.metaItem}>
                <Feather name="clock" size={16} color={theme.icon} />
                <Text style={[styles.metaText, { color: theme.text }]}>
                  Expires: {format(new Date(document.expirationDate), 'MMM d, yyyy')}
                </Text>
              </View>
            )}
            
            <View style={styles.metaItem}>
              <Feather name="file" size={16} color={theme.icon} />
              <Text style={[styles.metaText, { color: theme.text }]}>
                {(document.file.size / (1024 * 1024)).toFixed(2)} MB
              </Text>
            </View>
          </View>
        </BlurView>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 100,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'center',
  },
  categoryText: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  content: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  unsupportedText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  metadata: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    marginLeft: 6,
    fontSize: 14,
    opacity: 0.8,
  },
});

export default DocumentViewer;