import React, { useState, useRef } from 'react';
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  Animated, 
  Easing, 
  StyleSheet,
  Text
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useThemeMode } from '../contexts/ThemeContext';

/**
 * @typedef {Object} SearchBarProps
 * @property {string} value
 * @property {(text: string) => void} onChangeText
 * @property {(text: string) => void=} onSearch
 */

/**
 * @param {SearchBarProps} props
 */
const SearchBar = ({ 
  value, 
  onChangeText, 
  onSearch 
}) => {
  const { colorScheme } = useThemeMode();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);
  
  // Animation values
  const scaleValue = useRef(new Animated.Value(1)).current;
  const borderColorValue = useRef(new Animated.Value(0)).current;
  const buttonWidthValue = useRef(new Animated.Value(82)).current;

  // Colors
  const accentColor = colorScheme === 'dark' ? '#8aadf4' : '#6366f1';
  const bgColor = colorScheme === 'dark' ? 'rgba(30, 32, 48, 0.8)' : 'rgba(255, 255, 255, 0.9)';
  const placeholderColor = colorScheme === 'dark' ? 'rgba(200, 210, 235, 0.6)' : 'rgba(100, 110, 140, 0.6)';
  const borderColor = colorScheme === 'dark' ? 'rgba(138, 173, 244, 0.15)' : 'rgba(99, 102, 241, 0.1)';

  const animateFocus = (focused) => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: focused ? 1.008 : 1,
        useNativeDriver: true,
        speed: 18,
      }),
      Animated.timing(borderColorValue, {
        toValue: focused ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: false
      }),
      Animated.spring(buttonWidthValue, {
        toValue: focused ? 88 : 82,
        useNativeDriver: false,
        speed: 16,
      })
    ]).start();
  };

  const handleFocus = () => {
    setIsFocused(true);
    animateFocus(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    animateFocus(false);
  };

  const handleSearch = () => {
    inputRef.current?.blur();
    onSearch?.(value);
    Animated.sequence([
      Animated.spring(scaleValue, {
        toValue: 0.992,
        useNativeDriver: true,
        speed: 24,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 7,
        tension: 100,
      })
    ]).start();
  };

  const clearSearch = () => {
    onChangeText('');
    Animated.spring(scaleValue, {
      toValue: 1.012,
      useNativeDriver: true,
      speed: 18,
    }).start(() => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    });
  };

  const borderColorInterpolation = borderColorValue.interpolate({
    inputRange: [0, 1],
    outputRange: [borderColor, accentColor]
  });

  return (
    <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
      <BlurView 
        intensity={32} 
        tint={colorScheme} 
        style={styles.blurContainer}
      >
        <Animated.View style={[
          styles.searchContainer,
          {
            backgroundColor: bgColor,
            borderColor: borderColorInterpolation,
          }
        ]}>
          <Feather
            name="search"
            size={18}
            color={isFocused ? accentColor : placeholderColor}
            style={styles.searchIcon}
          />

          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              { color: colorScheme === 'dark' ? '#f8fafc' : '#1e293b' }
            ]}
            placeholder="Search documents..."
            placeholderTextColor={placeholderColor}
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            clearButtonMode="never"
            selectionColor={accentColor}
          />

          {value ? (
            <TouchableOpacity
              onPress={clearSearch}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather
                name="x"
                size={18}
                color={isFocused ? accentColor : placeholderColor}
              />
            </TouchableOpacity>
          ) : null}
        </Animated.View>

        <Animated.View style={[styles.buttonContainer, { width: buttonWidthValue }]}>
          <TouchableOpacity
            onPress={handleSearch}
            style={[
              styles.searchButton,
              {
                backgroundColor: accentColor,
                shadowColor: accentColor,
              }
            ]}
            activeOpacity={0.82}
          >
            {isFocused ? (
              <Text style={styles.buttonText}>Search</Text>
            ) : (
              <Feather
                name="search"
                size={18}
                color="#fff"
              />
            )}
          </TouchableOpacity>
        </Animated.View>
      </BlurView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  blurContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1.5,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderRightWidth: 0,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
    paddingVertical: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 6,
  },
  buttonContainer: {
    height: 48,
  },
  searchButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.15,
  },
});

export default SearchBar;