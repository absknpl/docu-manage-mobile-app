import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import DocumentViewer from './DocumentViewer';
import { TAG_ICONS } from './TagIcons';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function DocumentCard({ document, onPress, onDelete, colors }) {
  const [showViewer, setShowViewer] = useState(false);
  const { deleteDocument } = useDocuments();
  const { colorScheme } = useThemeMode();
  const isDarkMode = colorScheme === 'dark';

  const getFileIcon = () => {
    if (document.file?.type?.includes('pdf')) return '📄';
    if (document.file?.type?.includes('image')) return '🖼️';
    return '📁';
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.border,
            shadowColor: isDarkMode ? '#000' : '#64748b',
          },
        ]}
        onPress={onPress}
        activeOpacity={0.92}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.documentIcon}>{getFileIcon()}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              onPress={() => setShowViewer(true)}
              style={styles.actionButton}
            >
              <Feather name="eye" size={18} color={colors.secondaryText} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                deleteDocument(document.id);
              }}
              style={styles.actionButton}
            >
              <Feather name="trash-2" size={18} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.documentInfo}>
          <Text style={[styles.title, { color: colors.primaryText }]}>{document.title}</Text>
          
          {document.category && (
            <View style={[styles.category, { backgroundColor: isDarkMode ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.1)' }] }>
              {/* Pass accent color to TagIcons if needed */}
              {TAG_ICONS[document.category] || TAG_ICONS['Other']}
              <Text style={[styles.categoryText, { color: colors.accent }]}>{document.category}</Text>
            </View>
          )}
          
          {document.expirationDate && (
            <View style={styles.expiry}>
              <Feather name="calendar" size={14} color={colors.secondaryText} />
              <Text style={[styles.expiryText, { color: colors.secondaryText }] }>
                Expires: {format(new Date(document.expirationDate), 'MMM d, yyyy')}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
      
      <DocumentViewer 
        document={document}
        visible={showViewer}
        onClose={() => setShowViewer(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  documentIcon: {
    fontSize: 32,
  },
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  documentInfo: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
  },
  category: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  categoryText: {
    color: '#6366f1',
    fontSize: 14,
    fontWeight: '500',
  },
  expiry: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  expiryText: {
    color: '#64748b',
    fontSize: 14,
  },
});