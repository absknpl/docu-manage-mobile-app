import React, { useState } from 'react';
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
  Alert
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { TAG_ICONS, TAGS } from './TagIcons';
import { useThemeMode } from '../contexts/ThemeContext';

export default function UploadModal({ visible, onClose, onSubmit }) {
  const { colorScheme } = useThemeMode();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [tempDate, setTempDate] = useState(new Date());
  const [category, setCategory] = useState(TAGS[0]); // Default to first category
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
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
        id: Date.now().toString(),
        title: title.trim(),
        file,
        expirationDate: date.toISOString(),
        category: category || TAGS[0],
        createdAt: new Date().toISOString(),
        size: file.size,
        type: file.mimeType || 'application/octet-stream'
      };
      
      await onSubmit(newDoc);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setTitle('');
    setDate(new Date());
    setCategory(TAGS[0]);
  };

  const handleDatePress = () => {
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
    }
    // For iOS, it's always visible so no need to toggle
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
    setShowDatePicker(false);
  };

  const handleModalClose = () => {
    resetForm();
    onClose();
  };

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
          
          <View style={styles.modalContainer}>
            <View style={styles.header}>
              <Text style={styles.title}>Upload Document</Text>
              <TouchableOpacity onPress={handleModalClose}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              contentContainerStyle={styles.content}
              keyboardShouldPersistTaps="handled"
            >
              {/* File Upload Section */}
              <TouchableOpacity 
                style={styles.uploadArea}
                onPress={pickDocument}
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
                  style={styles.dateInput}
                  onPress={handleDatePress}
                  activeOpacity={0.7}
                >
                  <Text style={styles.dateText}>
                    {date.toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </Text>
                  <Feather name="calendar" size={18} color="#6366f1" />
                </TouchableOpacity>
                {showDatePicker && (
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
                <TouchableOpacity 
                  style={[
                    styles.submitBtn,
                    (!file || !title.trim()) && styles.disabledBtn
                  ]}
                  onPress={handleSubmit}
                  disabled={!file || !title.trim() || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.submitBtnText}>Upload</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
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
    backgroundColor: '#6366f1',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
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
    paddingHorizontal: 4,
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
  submitBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#6366f1',
    flex: 1,
    marginLeft: 12,
    alignItems: 'center',
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