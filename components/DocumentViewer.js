import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  Image, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity 
} from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function DocumentViewer({ document, visible, onClose }) {
  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = () => {
    // In React Native, you would use something like expo-file-system for downloads
    alert('Download functionality would be implemented here');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title} numberOfLines={1}>
              {document?.title}
            </Text>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.downloadBtn}
                onPress={handleDownload}
              >
                <Feather name="download" size={18} color="#fff" />
                <Text style={styles.downloadBtnText}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.closeBtn}
                onPress={onClose}
              >
                <Feather name="x" size={20} color="#1e293b" />
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.content}>
            {isLoading && (
              <View style={styles.loading}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading document...</Text>
              </View>
            )}
            
            {document?.file?.type?.includes('image') ? (
              <Image
                source={{ uri: document.file.uri }}
                style={styles.image}
                onLoad={() => setIsLoading(false)}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.fallback}>
                <Feather name="file" size={48} color="#64748b" />
                <Text style={styles.fallbackText}>
                  Preview not available for this file type
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              <Text style={styles.metaLabel}>Type:</Text> {document?.file?.type || 'Unknown'}
            </Text>
            {document?.category && (
              <Text style={styles.metaText}>
                <Text style={styles.metaLabel}>Category:</Text> {document.category}
              </Text>
            )}
            {document?.expirationDate && (
              <Text style={styles.metaText}>
                <Text style={styles.metaLabel}>Expires:</Text> 
                {new Date(document.expirationDate).toLocaleDateString()}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    width: '100%',
    maxWidth: 800,
    maxHeight: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: '#6366f1',
  },
  downloadBtnText: {
    color: '#fff',
    fontWeight: '500',
  },
  closeBtn: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 300,
  },
  loading: {
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#64748b',
  },
  image: {
    width: '100%',
    height: 400,
  },
  fallback: {
    alignItems: 'center',
    gap: 16,
    padding: 20,
  },
  fallbackText: {
    color: '#64748b',
    textAlign: 'center',
  },
  meta: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#64748b',
  },
  metaLabel: {
    fontWeight: '600',
    color: '#1e293b',
  },
});