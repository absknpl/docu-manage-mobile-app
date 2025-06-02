import React, { useRef, useState } from 'react';
import { View, StyleSheet, Animated, ScrollView, Text, TouchableOpacity, Platform, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import TimelineView from '../components/TimelineView';
import { useThemeMode } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimelineScreen() {
  const { colorScheme, theme } = useThemeMode();
  const isPop = colorScheme === 'pop';
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeFilter, setActiveFilter] = useState('all');
  const fabScale = useRef(new Animated.Value(1)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const handleFilterPress = (filter) => {
    Haptics.selectionAsync();
    setActiveFilter(filter);
  };

  const filterOptions = ['all', 'today', 'week', 'month', 'year'];

  return (
    <SafeAreaView style={[styles.container, isPop ? { backgroundColor: theme.faded } : colorScheme === 'dark' && { backgroundColor: '#0f172a' }]}>
      <View style={[
        styles.mainHeader,
        isPop ? { backgroundColor: theme.primary } : colorScheme === 'dark' && { backgroundColor: '#1e293b' }
      ]}>
        <Text style={[
          styles.mainHeaderTitle,
          isPop ? { color: theme.textOnPrimary } : colorScheme === 'dark' && { color: '#f8fafc' }
        ]}>
          Timeline
        </Text>
        <Text style={[
          styles.mainHeaderSubtitle,
          isPop ? { color: theme.textOnPrimary, opacity: 0.9 } : colorScheme === 'dark' && { color: '#94a3b8' }
        ]}>
          Expiration Projection dates and reminders
        </Text>
      </View>

      <Animated.View style={[
        styles.scrollHeader,
        isPop ? { backgroundColor: theme.primary } : colorScheme === 'dark' && { backgroundColor: '#1e293b' },
        { opacity: headerOpacity }
      ]}>
        <Text style={[
          styles.scrollHeaderTitle,
          isPop ? { color: theme.textOnPrimary } : colorScheme === 'dark' && { color: '#f8fafc' }
        ]}>
          Timeline
        </Text>
      </Animated.View>

      <View style={styles.filterWrapper}>
        <FlatList
          data={filterOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContainer}
          keyExtractor={(item) => item}
          renderItem={({ item: filter }) => (
            <TouchableOpacity key={filter} onPress={() => handleFilterPress(filter)} activeOpacity={0.7}>
              <View style={[
                styles.filterPill,
                activeFilter === filter && styles.filterPillActive,
                isPop && activeFilter === filter && { backgroundColor: theme.accent },
                colorScheme === 'dark' && { borderColor: '#334155' }
              ]}>
                <Text style={[
                  styles.filterText,
                  activeFilter === filter && styles.filterTextActive,
                  isPop && activeFilter === filter && { color: theme.textOnAccent },
                  colorScheme === 'dark' && { color: '#e2e8f0' }
                ]}>
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>

      <Animated.ScrollView
        contentContainerStyle={styles.contentContainer}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        showsVerticalScrollIndicator={false}
      >
        <TimelineView filter={activeFilter} />
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainHeader: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16, // Reduced from 24
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  mainHeaderTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1e293b',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    marginBottom: 2, // Reduced from 4
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
    paddingBottom: 12, // Reduced from 16
    paddingHorizontal: 24,
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
  filterWrapper: {
    height: 44, // Fixed height for the filter container
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8, // Reduced from 12
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    height: 44, // Match wrapper height
  },
  filterPill: {
    paddingHorizontal: 14, // Slightly reduced from 16
    paddingVertical: 6, // Reduced from 8
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginRight: 8,
    height: 28, // Fixed height for consistent touch area
    justifyContent: 'center',
  },
  filterPillActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterText: {
    fontSize: 13, // Slightly reduced from 14
    fontWeight: '500',
    color: '#64748b',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});