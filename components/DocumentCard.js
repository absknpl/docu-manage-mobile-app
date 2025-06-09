import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share, Platform, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { format } from 'date-fns';
import { TAG_ICONS } from './TagIcons';
import { useDocuments } from '../contexts/DocumentsContext';
import { useThemeMode } from '../contexts/ThemeContext';

export default function DocumentCard({ document, onPress, onDelete, onEdit, isHighlighted }) {
  const { deleteDocument } = useDocuments();
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';
  const isDarkMode = colorScheme === 'dark';

  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isHighlighted) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 900,
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 900,
            useNativeDriver: false,
          }),
        ])
      ).start();
    } else {
      glowAnim.stopAnimation();
      glowAnim.setValue(0);
    }
  }, [isHighlighted]);

  const getFileIcon = () => {
    if (document.file?.type?.includes('pdf')) return '📄';
    if (document.file?.type?.includes('image')) return '🖼️';
    return '📁';
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(document.id);
    } else {
      deleteDocument(document.id);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      let url = document.file?.uri || document.file?.url;
      let message = `Check out this document: ${document.title}`;
      if (url) message += `\n${url}`;
      await Share.share(
        Platform.select({
          ios: { url, message },
          android: { message },
          default: { message },
        })
      );
    } catch (error) {
      // Optionally handle error
    }
  };

  // Interpolate border and shadow color for golden glow
  const animatedBorderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffd700', '#fff7b2'] // gold to light gold
  });
  const animatedShadowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ffd700', '#fff7b2']
  });
  const animatedShadowRadius = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [12, 24]
  });

  return (
    <Animated.View
      style={[
        isHighlighted && {
          borderColor: animatedBorderColor,
          borderWidth: 3,
          shadowColor: animatedShadowColor,
          shadowRadius: animatedShadowRadius,
          shadowOpacity: 0.85,
          shadowOffset: { width: 0, height: 0 },
          elevation: 16,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.card,
          isPop && {
            backgroundColor: theme.card,
            borderColor: theme.accent,
            shadowColor: theme.popShadow,
            borderWidth: 2.5,
            elevation: 12,
            transform: [{ rotate: '-1.5deg' }],
            shadowOpacity: 0.25,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
          },
          !isPop && {
            backgroundColor: theme.card,
            borderColor: theme.border,
            shadowColor: isDarkMode ? '#000' : '#64748b',
          },
        ]}
        onPress={onPress}
        activeOpacity={0.92}
      >
        <View style={styles.cardHeader}>
          <Text style={[
            styles.documentIcon,
            isPop && {
              textShadowColor: theme.accent,
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 6,
              color: theme.accent,
            },
          ]}>{getFileIcon()}</Text>
          <View style={styles.cardActions}>
            <TouchableOpacity 
              onPress={handleEdit}
              style={styles.actionButton}
            >
              <Feather name="edit-2" size={20} color={isPop ? theme.accent : theme.icon} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDelete}
              style={styles.actionButton}
            >
              <Feather name="trash-2" size={20} color={isPop ? theme.error : theme.icon} />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleShare}
              style={styles.actionButton}
            >
              <Feather name="share-2" size={20} color={isPop ? theme.accent : theme.icon} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.documentInfo}>
          <Text style={[
            styles.title,
            { color: theme.text },
            isPop && {
              fontFamily: theme.popFont,
              fontWeight: 'bold',
              fontSize: 22,
              color: theme.accent,
              letterSpacing: 0.5,
            },
          ]}>{document.title}</Text>
          {document.category && (
            <View style={[
              styles.category,
              isPop
                ? {
                    backgroundColor: theme.faded,
                    borderColor: theme.accent,
                    borderWidth: 2,
                    shadowColor: theme.accent,
                    shadowOpacity: 0.12,
                    shadowRadius: 8,
                    marginTop: 2,
                  }
                : { backgroundColor: isDarkMode ? 'rgba(99,102,241,0.18)' : 'rgba(99,102,241,0.1)' },
            ]}>
              {TAG_ICONS[document.category] || TAG_ICONS['Other']}
              <Text style={[
                styles.categoryText,
                { color: theme.accent },
                isPop && {
                  fontFamily: theme.popFont,
                  fontWeight: 'bold',
                  fontSize: 15,
                  letterSpacing: 0.2,
                },
              ]}>{document.category}</Text>
            </View>
          )}
          {document.expirationDate && (
            <View style={styles.expiry}>
              <Feather name="calendar" size={16} color={isPop ? theme.accent : theme.icon} />
              <Text style={[
                styles.expiryText,
                { color: isPop ? theme.accent : theme.icon },
                isPop && {
                  fontFamily: theme.popFont,
                  fontWeight: 'bold',
                  fontSize: 15,
                },
              ]}>
                Expires: {format(new Date(document.expirationDate), 'MMM d, yyyy')}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
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
    marginHorizontal: 12, // Add horizontal margin for better fit on all screens
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