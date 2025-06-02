import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeMode } from '../contexts/ThemeContext';

// Using regular function syntax instead of arrow function
export default function SearchBar({ value, onChangeText, onSearch }) {
  const [isFocused, setIsFocused] = useState(false);
  const { colorScheme } = useThemeMode();

  const handleSearch = () => {
    onSearch && onSearch(value);
  };

  const clearSearch = () => {
    onChangeText && onChangeText('');
    onSearch && onSearch('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.glassContainer}>
        <BlurView intensity={40} tint={colorScheme === 'dark' ? 'dark' : 'light'} style={styles.blurView}>
          <View style={[
            styles.inputContainer,
            isFocused && styles.inputContainerFocused,
            colorScheme === 'dark' && { backgroundColor: 'rgba(24,25,38,0.28)', borderColor: 'rgba(99,102,241,0.18)' }
          ]}>
            <Feather 
              name="search" 
              size={20} 
              color={isFocused ? '#6366f1' : (colorScheme === 'dark' ? '#bfc6e6' : '#64748b')} 
              style={styles.icon}
            />
            <TextInput
              style={[styles.input, colorScheme === 'dark' && { color: '#fff' }]}
              placeholder="Search documents..."
              placeholderTextColor={colorScheme === 'dark' ? '#bfc6e6' : '#64748b'}
              value={value}
              onChangeText={onChangeText}
              onSubmitEditing={handleSearch}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="search"
              clearButtonMode="never"
            />
            {value ? (
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearSearch}
              >
                <Feather name="x" size={20} color={colorScheme === 'dark' ? '#bfc6e6' : '#64748b'} />
              </TouchableOpacity>
            ) : null}
          </View>
        </BlurView>
        <TouchableOpacity 
          style={[
            styles.searchButton,
            isFocused && styles.searchButtonFocused,
            colorScheme === 'dark' && { backgroundColor: '#6366f1' }
          ]}
          onPress={handleSearch}
          activeOpacity={0.85}
        >
          <Text style={[styles.searchButtonText, colorScheme === 'dark' && { color: '#fff' }]}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  glassContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    overflow: 'visible',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 18,
    elevation: 10,
    backgroundColor: 'transparent',
  },
  blurView: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1.5,
    borderColor: 'rgba(99,102,241,0.10)',
    transitionProperty: 'border-color',
    transitionDuration: '150ms',
  },
  inputContainerFocused: {
    borderColor: '#6366f1',
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  icon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  input: {
    flex: 1,
    padding: 15,
    paddingLeft: 45,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
    shadowColor: 'rgba(99,102,241,0.08)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 2,
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  searchButton: {
    paddingHorizontal: 22,
    height: 52,
    marginLeft: -8,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
    transform: [{ scale: 1 }],
    transitionProperty: 'background-color',
    transitionDuration: '150ms',
  },
  searchButtonFocused: {
    backgroundColor: '#4f46e5',
    transform: [{ scale: 1.06 }],
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});