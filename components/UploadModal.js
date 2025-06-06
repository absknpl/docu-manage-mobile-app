import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  Pressable, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
  Easing
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { TAG_ICONS, TAGS } from './TagIcons';
import { useThemeMode } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

// Create an animated version of LinearGradient
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

// Animated gradient header component
const AnimatedGradientHeader = ({ title, onClose, editDocument }) => {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(progress, {
        toValue: 1,
        duration: 10000, // Slower animation
        easing: Easing.linear,
        useNativeDriver: false, // <-- Fix: always use false for JS-driven style props
      })
    ).start();
  }, []);

  // Animate the gradient's position by shifting the gradient horizontally
  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 60] // px shift for subtle movement
  });

  return (
    <View style={styles.header}>
      <AnimatedLinearGradient
        colors={['#6366f1', '#8b5cf6', '#6366f1']}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        locations={[0, 0.5, 1]}
        style={[
          StyleSheet.absoluteFill,
          // Remove transform so only the gradient animates, not the content
        ]}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', position: 'relative', zIndex: 1 }}>
        <Text style={styles.title}>{editDocument ? 'Edit Document' : 'Upload Document'}</Text>
        <TouchableOpacity onPress={onClose}>
          <Feather name="x" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function UploadModal({ visible, onClose, onSubmit, editDocument }) {
  const { colorScheme } = useThemeMode();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false); // Always start hidden
  const [tempDate, setTempDate] = useState(new Date());
  const [category, setCategory] = useState(TAGS[0]); // Default to first category
  const [isLoading, setIsLoading] = useState(false);
  const [dateWarning, setDateWarning] = useState(false);
  const [noExpiration, setNoExpiration] = useState(false);

  // Animation values
  const buttonShine = useRef(new Animated.Value(-100)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const formTranslateY = useRef(new Animated.Value(20)).current;

  // Glow animation for submit button
  const buttonGlow = useRef(new Animated.Value(0)).current;

  // Gradient animation for header
  const gradientAnim = useRef(new Animated.Value(0)).current;

  // If editDocument is provided, prefill the form
  useEffect(() => {
    if (visible && editDocument) {
      setFile(editDocument.file || null);
      setTitle(editDocument.title || '');
      setDate(editDocument.expirationDate ? new Date(editDocument.expirationDate) : new Date());
      setCategory(editDocument.category || TAGS[0]);
      setNoExpiration(false);
    } else if (visible && !editDocument) {
      resetForm();
    }
  }, [visible, editDocument]);

  // Check if form is valid
  const isFormValid = file && title.trim();

  // Shine animation for submit button
  const startShineAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(buttonShine, {
          toValue: 200,
          duration: 1500,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(buttonShine, {
          toValue: -100,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();
  };

  // Stop shine animation
  const stopShineAnimation = () => {
    buttonShine.setValue(-100);
    buttonShine.stopAnimation();
  };

  // Handle shine animation based on form validity
  useEffect(() => {
    if (isFormValid) {
      startShineAnimation();
    } else {
      stopShineAnimation();
    }
  }, [isFormValid]);

  // Form enter animation
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(formTranslateY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.back(0.8)),
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset animations when modal closes
      formOpacity.setValue(0);
      formTranslateY.setValue(20);
    }
  }, [visible]);

  // Glow animation for submit button
  useEffect(() => {
    let glowAnim;
    if (isFormValid) {
      glowAnim = Animated.loop(
        Animated.sequence([
          Animated.timing(buttonGlow, {
            toValue: 1,
            duration: 900,
            useNativeDriver: false,
          }),
          Animated.timing(buttonGlow, {
            toValue: 0,
            duration: 900,
            useNativeDriver: false,
          })
        ])
      );
      glowAnim.start();
    } else {
      buttonGlow.setValue(0);
    }
    return () => {
      if (glowAnim) glowAnim.stop();
    };
  }, [isFormValid]);

  // Gradient animation effect
  useEffect(() => {
    if (visible) {
      Animated.loop(
        Animated.timing(gradientAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.linear,
          useNativeDriver: false, // Can't animate start/end with native driver
        })
      ).start();
    } else {
      gradientAnim.setValue(0);
    }
  }, [visible]);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled) {
        setFile(result.assets[0]);
        // Set default title if empty
        if (!title) {
          const fileName = result.assets[0].name;
          setTitle(fileName.substring(0, fileName.lastIndexOf('.')) || fileName);
        }
      }
    } catch (err) {
      console.error('Document picker error:', err);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  // Helper to pick from gallery
  const pickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
          mimeType: asset.type ? `image/${asset.type}` : 'image/jpeg',
        });
        if (!title) {
          setTitle(asset.fileName ? asset.fileName.replace(/\.[^/.]+$/, '') : 'Photo');
        }
      }
    } catch (err) {
      console.error('Gallery picker error:', err);
      Alert.alert('Error', 'Failed to select photo. Please try again.');
    }
  };

  // Helper to pick from camera
  const pickFromCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is required to take a photo.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        setFile({
          uri: asset.uri,
          name: asset.fileName || `camera_${Date.now()}.jpg`,
          size: asset.fileSize || 0,
          mimeType: asset.type ? `image/${asset.type}` : 'image/jpeg',
        });
        if (!title) {
          setTitle(asset.fileName ? asset.fileName.replace(/\.[^/.]+$/, '') : 'Camera Photo');
        }
      }
    } catch (err) {
      console.error('Camera picker error:', err);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  // Show source selection
  const handlePickSource = () => {
    Alert.alert(
      'Select File Source',
      'Choose where to upload from:',
      [
        { text: 'Files', onPress: pickDocument },
        { text: 'Photo Gallery', onPress: pickFromGallery },
        { text: 'Camera', onPress: pickFromCamera },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleSubmit = async () => {
    // Add button press animation
    await Animated.sequence([
      Animated.spring(buttonScale, {
        toValue: 0.95,
        useNativeDriver: true,
      }),
      Animated.spring(buttonScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();

    const today = new Date();
    today.setHours(0,0,0,0);
    const selected = new Date(date);
    selected.setHours(0,0,0,0);
    if (selected.getTime() === today.getTime() && !dateWarning) {
      setDateWarning(true);
      return;
    }
    if (!file) {
      Alert.alert('Required', 'Please select a file first');
      return;
    }
    if (!title.trim()) {
      Alert.alert('Required', 'Please enter a document title');
      return;
    }
    setIsLoading(true);
    try {
      const newDoc = {
        id: editDocument ? editDocument.id : Date.now().toString(),
        title: title.trim(),
        file,
        expirationDate: noExpiration ? null : date.toISOString(),
        category: category || TAGS[0],
        createdAt: editDocument ? editDocument.createdAt : new Date().toISOString(),
        size: file.size,
        type: file.mimeType || 'application/octet-stream',
      };
      await onSubmit(newDoc, !!editDocument);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
      setDateWarning(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDate(new Date());
    setCategory(TAGS[0]);
    setNoExpiration(false);
  };

  const handleNoExpirationToggle = () => {
    if (!noExpiration) {
      // Set date 5 years from now
      const d = new Date();
      d.setFullYear(d.getFullYear() + 5);
      setDate(d);
    }
    setNoExpiration(!noExpiration);
  };

  const handleDatePress = () => {
    setTempDate(date); // Always start with the current date
    setShowDatePicker(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set') {
        setDate(currentDate);
      }
    } else {
      setTempDate(currentDate);
    }
  };

  const confirmDateIOS = () => {
    setDate(tempDate);
    setShowDatePicker(false); // Hide after confirm
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

  // Reset warning if user changes date
  useEffect(() => {
    setDateWarning(false);
  }, [date]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={[styles.overlay, colorScheme === 'dark' && { backgroundColor: 'rgba(24,25,38,0.92)' }]}> 
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.container}
        >
          <Pressable 
            style={styles.background} 
            onPress={handleModalClose} 
          />
          <Animated.View 
            style={[
              styles.modalContainer,
              {
                opacity: formOpacity,
                transform: [{ translateY: formTranslateY }]
              }
            ]}
          >
            <AnimatedGradientHeader 
              title={editDocument ? 'Edit Document' : 'Upload Document'}
              onClose={handleModalClose}
              editDocument={editDocument}
            />
            <ScrollView 
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              {/* File Upload Section */}
              <TouchableOpacity 
                style={styles.uploadArea}
                onPress={handlePickSource}
                activeOpacity={0.7}
              >
                {file ? (
                  <View style={styles.filePreview}>
                    <Feather 
                      name={file.mimeType?.includes('image') ? 'image' : 'file'} 
                      size={24} 
                      color="#6366f1" 
                    />
                    <View style={styles.fileInfo}>
                      <Text 
                        style={styles.fileName}
                        numberOfLines={1}
                      >
                        {file.name}
                      </Text>
                      <Text style={styles.fileSize}>
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </Text>
                    </View>
                  </View>
                ) : (
                  <>
                    <Feather name="upload" size={24} color="#6366f1" />
                    <Text style={styles.uploadText}>Select File (PDF or Image)</Text>
                  </>
                )}
              </TouchableOpacity>
              
              {/* Title Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Document Title*</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter document title"
                  value={title}
                  onChangeText={setTitle}
                  maxLength={100}
                />
              </View>
              
              {/* Expiration Date */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Expiration Date</Text>
                <TouchableOpacity 
                  style={[styles.dateInput, dateWarning && { borderColor: '#ef4444', backgroundColor: '#fee2e2' }, noExpiration && { opacity: 0.5 }]}
                  onPress={noExpiration ? undefined : handleDatePress}
                  activeOpacity={noExpiration ? 1 : 0.7}
                  disabled={noExpiration}
                >
                  <Text style={[styles.dateText, dateWarning && { color: '#ef4444' }] }>
                    {noExpiration ? 'No Expiration (5 years from now)' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </Text>
                  <Feather name="calendar" size={18} color={dateWarning ? '#ef4444' : '#6366f1'} />
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <TouchableOpacity
                    onPress={handleNoExpirationToggle}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Feather name={noExpiration ? 'check-square' : 'square'} size={20} color={noExpiration ? '#6366f1' : '#64748b'} />
                    <Text style={{ marginLeft: 8, color: '#64748b', fontSize: 15 }}>No Expiration date</Text>
                  </TouchableOpacity>
                </View>
                {showDatePicker && !noExpiration && (
                  <View style={styles.datePickerContainer}>
                    {Platform.OS === 'ios' && (
                      <View style={styles.iosDatePickerHeader}>
                        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                          <Text style={styles.datePickerButton}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={confirmDateIOS}>
                          <Text style={[styles.datePickerButton, styles.confirmButton]}>Confirm</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    <DateTimePicker
                      value={Platform.OS === 'ios' ? tempDate : date}
                      mode="date"
                      display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                      onChange={onChangeDate}
                      minimumDate={new Date()}
                      themeVariant="light"
                    />
                  </View>
                )}
              </View>
              
              {/* Category Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Category</Text>
                <ScrollView 
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.tagContainer}
                >
                  {TAGS.map(tag => (
                    <TouchableOpacity
                      key={tag}
                      style={[
                        styles.tag,
                        category === tag && styles.selectedTag
                      ]}
                      onPress={() => setCategory(tag)}
                      activeOpacity={0.7}
                    >
                      {TAG_ICONS[tag]}
                      <Text style={[
                        styles.tagText,
                        category === tag && styles.selectedTagText
                      ]}>
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Action Buttons (moved here for better UX) */}
              <View style={styles.actionsBelowCategory}>
                <TouchableOpacity 
                  style={styles.cancelBtn}
                  onPress={handleModalClose}
                  disabled={isLoading}
                >
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <Animated.View
                  style={[
                    styles.glowWrapper,
                    isFormValid && !isLoading ? {
                      borderColor: buttonGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['#6366f1', '#a5b4fc']
                      }),
                      shadowColor: '#6366f1',
                      shadowOpacity: buttonGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.3, 0.7]
                      }),
                      shadowRadius: buttonGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [8, 16]
                      }),
                      elevation: buttonGlow.interpolate({
                        inputRange: [0, 1],
                        outputRange: [4, 12]
                      })
                    } : { borderColor: '#e2e8f0', shadowOpacity: 0, shadowRadius: 0, elevation: 0 }
                  ]}
                >
                <TouchableOpacity 
                  style={[
                    styles.submitBtn,
                    (!file || !title.trim()) && styles.disabledBtn
                  ]}
                  onPress={handleSubmit}
                  disabled={!file || !title.trim() || isLoading}
                  activeOpacity={0.7}
                >
                  {/* Shine effect overlay */}
                  {isFormValid && !isLoading && (
                    <Animated.View 
  style={[
    StyleSheet.absoluteFill,
    {
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      width: 30,
      left: undefined,
      right: undefined,
      top: -10,
      bottom: -10,
      transform: [
        { 
          translateX: buttonShine.interpolate({
            inputRange: [-100, 200],
            outputRange: [-100, 200]
          }) 
        },
        { rotate: '20deg' }
      ],
      shadowColor: '#fff',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
      borderRadius: 2,
    }
  ]}
/>
                  )}
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Animated.Text style={[
                      styles.submitBtnText,
                      { transform: [{ scale: buttonScale }] }
                    ]}>
                      {editDocument ? 'Save Changes' : 'Upload'}
                    </Animated.Text>
                  )}
                </TouchableOpacity>
                </Animated.View>
              </View>
            </ScrollView>
          </Animated.View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '90%',
  },
header: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 16,
  borderTopLeftRadius: 16,
  borderTopRightRadius: 16,
  overflow: 'hidden',
  position: 'relative', // Add this
  height: 60, // Set a fixed height
},
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  content: {
    padding: 16,
    paddingBottom: 8,
  },
  uploadArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#f8fafc',
  },
  filePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  fileName: {
    fontSize: 14,
    color: '#334155',
  },
  fileSize: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  uploadText: {
    marginLeft: 8,
    color: '#6366f1',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  input: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    fontSize: 15,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  dateText: {
    fontSize: 15,
    color: '#334155',
  },
  tagContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    backgroundColor: '#f8fafc',
  },
  selectedTag: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  tagText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#334155',
  },
  selectedTagText: {
    color: 'white',
  },
  actionsBelowCategory: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
    paddingHorizontal: 0, // Changed from 4 to 0
    gap: 10,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelBtnText: {
    color: '#64748b',
    fontWeight: '500',
  },
  glowWrapper: {
    borderWidth: 2,
    borderRadius: 8, // Match button
    flex: 1,
    alignItems: 'stretch', // Changed from 'center' to 'stretch'
    justifyContent: 'center',
    shadowColor: '#FFDA32',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
    minHeight: 48, // Ensure minimum height matches button
  },
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6, // Slightly smaller than wrapper to account for border
    backgroundColor: '#6366f1',
    width: '100%', // Fill wrapper
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
    opacity: 0.92,
    minHeight: 44, // Ensure minimum height
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitBtnText: {
    color: 'white',
    fontWeight: '600',
  },
  datePickerContainer: {
    marginTop: 10,
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  datePickerButton: {
    fontSize: 16,
    padding: 8,
    color: '#64748b',
  },
  confirmButton: {
    color: '#6366f1',
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});