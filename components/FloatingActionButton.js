import React from 'react';
import { 
  View, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  Animated 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const FloatingActionButton = () => {
  const navigation = useNavigation();
  const scaleAnim = new Animated.Value(1);
  const translateAnim = new Animated.Value(0);

  const handlePress = () => {
    // Pulse animation
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 80,
        useNativeDriver: true
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true
      })
    ]).start();

    navigation.navigate('Documents', { 
      showUploadModal: true,
      merge: true 
    });
  };

  return (
    <Animated.View style={[
      styles.fab,
      {
        transform: [
          { scale: scaleAnim },
          { translateY: translateAnim }
        ]
      }
    ]}>
      <TouchableOpacity 
        onPress={handlePress}
        activeOpacity={0.85}
      >
        <View style={styles.fabInner}>
          <Feather 
            name="plus" 
            size={24} 
            color="white" 
            style={styles.fabIcon}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 24,
    bottom: Platform.select({
      ios: 140, // Move FAB higher on iOS
      android: 120 // Move FAB higher on Android
    }),
    zIndex: 100,
  },
  fabInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  fabIcon: {
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
});

export default FloatingActionButton;