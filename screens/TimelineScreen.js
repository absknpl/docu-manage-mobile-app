import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, FlatList, TouchableOpacity, StatusBar, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import TimelineView from '../components/TimelineView';
import { useThemeMode } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimelineScreen() {
  const { colorScheme, theme, getStatusBarStyle } = useThemeMode();
  const isPop = colorScheme === 'pop';
  const scrollY = useRef(new Animated.Value(0)).current;
  const [activeFilter, setActiveFilter] = useState('all');
  const fabScale = useRef(new Animated.Value(1)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const filterOptions = ['all', 'today', 'week', 'month', 'year'];
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );
  const handleFilterPress = (filter) => {
    Haptics.selectionAsync();
    setActiveFilter(filter);
  };

  const safeBg = colorScheme === 'dark' ? (theme.background || '#0f172a') : (isPop ? theme.faded : theme.background);
  const statusBarStyle = getStatusBarStyle(safeBg);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeBg }} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={safeBg} barStyle={statusBarStyle} translucent={false} hidden={false} />
      <View style={[
        styles.mainHeader,
        { backgroundColor: isPop ? theme.primary : theme.background },
      ]}>
        <Text style={[
          styles.mainHeaderTitle,
          { color: isPop ? theme.textOnPrimary : theme.text },
        ]}>
          Timeline
        </Text>
        <Text style={[
          styles.mainHeaderSubtitle,
          { color: isPop ? theme.textOnPrimary : '#64748b' },
        ]}>
          Upcoming Expiration dates.
        </Text>
      </View>
      <Animated.View style={[
        styles.scrollHeader,
        { backgroundColor: isPop ? theme.primary : theme.background },
        { opacity: headerOpacity },
      ]}>
        <Text style={[
          styles.scrollHeaderTitle,
          { color: isPop ? theme.textOnPrimary : theme.text },
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
        contentContainerStyle={[styles.contentContainer, { backgroundColor: safeBg }]}
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
  mainHeader: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  mainHeaderTitle: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    marginBottom: 2,
  },
  mainHeaderSubtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : 'Roboto',
  },
  scrollHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 12,
    paddingHorizontal: 24,
    zIndex: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  scrollHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
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