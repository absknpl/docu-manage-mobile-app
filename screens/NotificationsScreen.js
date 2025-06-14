import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  PanResponder,
  Platform,
  RefreshControl,
  StatusBar,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Notifications from "expo-notifications";
import { useThemeMode } from "../contexts/ThemeContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDocuments } from "../contexts/DocumentsContext";
import { useNavigation } from '@react-navigation/native';

const NotificationItem = ({ item, index, onAction, onTimeChange, isPop }) => {
  const { colorScheme, theme } = useThemeMode();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const navigation = useNavigation();

  // PanResponder for smooth, controlled swipe
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (_, gestureState) => {
        // Only set pan responder if horizontal movement is more than vertical
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 8
        );
      },
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only set pan responder if horizontal movement is more than vertical
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 8
        );
      },
      onPanResponderGrant: () => {
        setIsSwiping(true);
      },
      onPanResponderMove: (_, gestureState) => {
        // Limit swipe to -120 (left) and 120 (right) for stability
        if (gestureState.dx < -120) {
          translateX.setValue(-120);
        } else if (gestureState.dx > 120) {
          translateX.setValue(120);
        } else {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsSwiping(false);
        if (gestureState.dx > 80) {
          // Swiped right - toggle read/unread
          Animated.timing(translateX, {
            toValue: 500,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onAction(item.id, "read");
            translateX.setValue(0);
          });
        } else if (gestureState.dx < -80) {
          // Swiped left - delete
          Animated.timing(translateX, {
            toValue: -500,
            duration: 220,
            useNativeDriver: true,
          }).start(() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            onAction(item.id, "delete");
          });
        } else {
          // Snap back to original position
          Animated.spring(translateX, {
            toValue: 0,
            friction: 7,
            tension: 60,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminationRequest: () => false, // Don't allow parent to take over
      onPanResponderTerminate: () => {
        setIsSwiping(false);
        Animated.spring(translateX, {
          toValue: 0,
          friction: 7,
          tension: 60,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const toggleExpand = () => {
    if (!isSwiping) {
      Haptics.selectionAsync();
      setIsExpanded(!isExpanded);
    }
  };

  const getNotificationIcon = () => {
    if (item.title.includes("Reminder")) return "bell";
    if (item.title.includes("Alert")) return "alert-circle";
    return "info";
  };

  const notificationItemStyles = [
    styles.notificationItem,
    colorScheme === "dark" && styles.notificationItemDark,
    isPop && {
      backgroundColor: theme.card,
      borderColor: theme.accent,
      shadowColor: theme.popShadow,
    },
    item.read && styles.notificationRead,
    colorScheme === "dark" && item.read && styles.notificationReadDark,
  ];

  return (
    <View style={{ position: "relative", minHeight: 0 }}>
      {/* Swipe indicators (under main card) */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.swipeBackground,
          styles.swipeRightBackground,
          {
            opacity: translateX.interpolate({
              inputRange: [0, 40],
              outputRange: [0, 0.25],
              extrapolate: "clamp",
            }),
            zIndex: 0,
            height: undefined,
            minHeight: undefined,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        ]}
      >
        <Feather
          name="check"
          size={20}
          color="#ffffff"
          style={{ opacity: 0.7 }}
        />
        <Text style={[styles.swipeText, { opacity: 0.7 }]}>
          {item.read ? "Mark Unread" : "Mark Read"}
        </Text>
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.swipeBackground,
          styles.swipeLeftBackground,
          {
            opacity: translateX.interpolate({
              inputRange: [-40, 0],
              outputRange: [0.25, 0],
              extrapolate: "clamp",
            }),
            zIndex: 0,
            height: undefined,
            minHeight: undefined,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
        ]}
      >
        <Feather
          name="trash-2"
          size={20}
          color="#ffffff"
          style={{ opacity: 0.7 }}
        />
        <Text style={[styles.swipeText, { opacity: 0.7 }]}>Delete</Text>
      </Animated.View>
      {/* Main content */}
      <Animated.View
        style={notificationItemStyles.concat({
          transform: [{ scale: scaleAnim }, { translateX: translateX }],
          opacity: fadeAnim,
          marginTop: index === 0 ? 16 : 8,
          zIndex: 1,
        })}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => {
            toggleExpand();
            navigation.navigate('Notifications');
          }}
          activeOpacity={0.8}
        >
          <View style={styles.notificationHeader}>
            <View
              style={[
                styles.notificationIconContainer,
                colorScheme === "dark" && styles.notificationIconContainerDark,
                item.read && { backgroundColor: "rgba(99, 102, 241, 0.05)" },
              ]}
            >
              <Feather
                name={getNotificationIcon()}
                size={18}
                color={item.read ? "#94a3b8" : "#6366f1"}
              />
            </View>
            <View style={styles.notificationTextContainer}>
              <Text
                style={[
                  styles.notificationTitle,
                  colorScheme === "dark" && styles.notificationTitleDark,
                  item.read && styles.notificationReadText,
                  isPop && { color: theme.accent, fontFamily: theme.popFont },
                ]}
              >
                {item.title}
              </Text>
              <Text
                style={[
                  styles.notificationTime,
                  colorScheme === "dark" && styles.notificationTimeDark,
                  item.read && styles.notificationReadText,
                ]}
              >
                {item.trigger?.value
                  ? new Date(item.trigger.value).toLocaleString()
                  : "Now"}
              </Text>
            </View>
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={colorScheme === "dark" ? "#94a3b8" : "#64748b"}
            />
          </View>
          <Text
            style={[
              styles.notificationMessage,
              colorScheme === "dark" && styles.notificationMessageDark,
              item.read && styles.notificationReadText,
              { display: isExpanded ? "flex" : "none" },
            ]}
            numberOfLines={isExpanded ? undefined : 2}
          >
            {item.message}
          </Text>
          {isExpanded && (
            <>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.markReadButton,
                    colorScheme === "dark" && styles.actionButtonDark,
                  ]}
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Success
                    );
                    onAction(item.id, "read");
                  }}
                >
                  <Feather name="check" size={16} color="#6366f1" />
                  <Text style={styles.actionButtonText}>
                    {item.read ? "Mark Unread" : "Mark Read"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    styles.deleteButton,
                    colorScheme === "dark" && styles.actionButtonDark,
                  ]}
                  onPress={() => {
                    Haptics.notificationAsync(
                      Haptics.NotificationFeedbackType.Error
                    );
                    onAction(item.id, "delete");
                  }}
                >
                  <Feather name="trash-2" size={16} color="#ef4444" />
                  <Text style={[styles.actionButtonText, { color: "#ef4444" }]}>Delete</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.reminderContainer}>
                <TouchableOpacity
                  style={styles.reminderButton}
                  onPress={() => {
                    Haptics.selectionAsync();
                    // Schedule reminder for next day at 9 AM
                    const tomorrowAt9AM = new Date();
                    tomorrowAt9AM.setDate(tomorrowAt9AM.getDate() + 1);
                    tomorrowAt9AM.setHours(9, 0, 0, 0);
                    onTimeChange(item.id, tomorrowAt9AM);
                  }}
                >
                  <Feather
                    name="clock"
                    size={16}
                    color={colorScheme === "dark" ? "#94a3b8" : "#64748b"}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={styles.reminderText}>
                    Remind me tomorrow at 9:00 AM
                  </Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default function NotificationsScreen({ navigation }) {
  const { colorScheme, theme, getStatusBarStyle } = useThemeMode();
  const isPop = colorScheme === "pop";
  const { documents } = useDocuments();
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const fetchNotifications = async () => {
    try {
      // Get all scheduled notifications
      const scheduled = await Notifications.getAllScheduledNotificationsAsync();
      // Get delivered notifications (currently showing)
      let delivered = [];
      try {
        delivered = await Notifications.getPresentedNotificationsAsync();
      } catch (e) {
        console.log("Error getting delivered notifications:", e);
        delivered = [];
      }
      // Get past notification history (requires permissions)
      let history = [];
      // Expo Notifications API does not have getDeliveredNotificationsAsync on all platforms/versions
      // so we skip this if not available
      if (typeof Notifications.getDeliveredNotificationsAsync === 'function') {
        try {
          const { status } = await Notifications.getPermissionsAsync();
          if (status === 'granted') {
            history = await Notifications.getDeliveredNotificationsAsync();
          }
        } catch (e) {
          console.log("Error getting notification history:", e);
          history = [];
        }
      }
      // Combine all notifications
      const allNotifs = [...scheduled, ...delivered, ...history];
      // Deduplicate by identifier and filter scheduled notifications by trigger time
      const seenIds = new Set();
      const now = new Date();
      const mapped = allNotifs
        .filter((n) => {
          if (seenIds.has(n.identifier)) return false;
          seenIds.add(n.identifier);
          // Only show scheduled notifications if their trigger time is in the past
          if (n.trigger?.value) {
            return new Date(n.trigger.value) <= now;
          }
          return true; // delivered/history notifications
        })
        .map((n, idx) => ({
          id: n.identifier || idx.toString(),
          title: n.content?.title || "Notification",
          message: n.content?.body || "",
          trigger: n.trigger,
          date: n.date || (n.trigger?.value ? new Date(n.trigger.value) : new Date()),
          read: false,
        }))
        .sort((a, b) => b.date - a.date);
      setNotifications(mapped);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleNotificationAction = async (id, action) => {
    if (action === "read") {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else if (action === "delete") {
      // Cancel the scheduled notification so it does not show up again
      await Notifications.cancelScheduledNotificationAsync(id);
      // Also remove delivered notification if present
      try {
        await Notifications.dismissNotificationAsync(id);
      } catch (e) {}
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else if (action === "remind") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      // Find the notification
      const notif = notifications.find((n) => n.id === id);
      if (notif) {
        // Schedule a new notification for the next day at the same time
        const now = new Date();
        let nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);
        nextDay.setHours(now.getHours(), now.getMinutes(), 0, 0);
        Notifications.scheduleNotificationAsync({
          content: {
            title: notif.title + " (Reminded)",
            body: notif.message,
            sound: true,
          },
          trigger: { type: 'date', date: nextDay }, // Use correct trigger format
        });
      }
    }
  };

  // Add handler to reschedule notification
  const handleTimeChange = async (id, newTime) => {
    const notif = notifications.find((n) => n.id === id);
    if (notif) {
      // Cancel old notification
      await Notifications.cancelScheduledNotificationAsync(id);
      // Schedule new notification at 9 AM
      const newId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notif.title,
          body: notif.message,
          sound: true,
        },
        trigger: { type: 'date', date: newTime },
      });
      // Update state to reflect new notification
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { 
                ...n, 
                id: newId, 
                trigger: { value: newTime },
                read: false // Mark as unread when reminded
              }
            : n
        )
      );
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Listen for notification responses
  React.useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      navigation.navigate('Notifications');
    });
    return () => subscription.remove();
  }, [navigation]);

  const safeBg = isPop ? theme.faded : theme.background;
  const statusBarStyle = getStatusBarStyle(safeBg);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: safeBg }} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor={safeBg} barStyle={statusBarStyle} translucent={false} hidden={false} />
      {/* Main Header */}
      <View style={[
        styles.mainHeader,
        { backgroundColor: theme.background },
      ]}>
        <Text style={[
          styles.mainHeaderTitle,
          { color: theme.text },
        ]}>
          Your Notifications
        </Text>
        <Text style={[
          styles.mainHeaderSubtitle,
          { color: '#64748b' },
        ]}>
          {notifications.filter((n) => !n.read).length} unread
        </Text>
      </View>

      {/* Scrolling Header (appears on scroll) */}
      <Animated.View
        style={[
          styles.scrollHeader,
          { backgroundColor: theme.background },
          { opacity: headerOpacity },
        ]}
      >
        <Text style={[
          styles.scrollHeaderTitle,
          { color: theme.text },
        ]}>
          Notifications
        </Text>
      </Animated.View>

      <Animated.FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <NotificationItem
            item={item}
            index={index}
            onAction={handleNotificationAction}
            onTimeChange={handleTimeChange}
            isPop={isPop}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colorScheme === "dark" ? "#94a3b8" : "#64748b"}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather
              name="bell-off"
              size={48}
              color={colorScheme === "dark" ? "#94a3b8" : "#64748b"}
              style={styles.emptyIcon}
            />
            <Text
              style={[
                styles.emptyTitle,
                colorScheme === "dark" && styles.emptyTitleDark,
              ]}
            >
              No notifications
            </Text>
            <Text
              style={[
                styles.emptyText,
                colorScheme === "dark" && styles.emptyTextDark,
              ]}
            >
              You're all caught up!
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={[
          styles.refreshButton,
          colorScheme === "dark" && styles.refreshButtonDark,
        ]}
        onPress={onRefresh}
        activeOpacity={0.7}
      >
        <Feather name="refresh-cw" size={20} color="#6366f1" />
      </TouchableOpacity>
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
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
    marginBottom: 4,
  },
  mainHeaderSubtitle: {
    fontSize: 16,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  scrollHeader: {
    position: "absolute",
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
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  containerDark: {
    backgroundColor: "#0f172a",
  },
  listContent: {
    paddingBottom: 100,
  },
  notificationItem: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  notificationItemDark: {
    backgroundColor: "#1e293b",
    shadowColor: "#6366f1",
    shadowOpacity: 0.1,
  },
  notificationRead: {
    opacity: 0.8,
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  notificationReadDark: {
    backgroundColor: "rgba(30, 41, 59, 0.7)",
  },
  notificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  notificationIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notificationIconContainerDark: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    marginBottom: 2,
  },
  notificationTitleDark: {
    color: "#f8fafc",
  },
  notificationTime: {
    fontSize: 13,
    color: "#64748b",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  notificationTimeDark: {
    color: "#94a3b8",
  },
  notificationMessage: {
    fontSize: 15,
    color: "#475569",
    lineHeight: 22,
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
    paddingTop: 8,
  },
  notificationMessageDark: {
    color: "#cbd5e1",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "rgba(99, 102, 241, 0.1)",
  },
  actionButtonDark: {
    backgroundColor: "rgba(99, 102, 241, 0.2)",
  },
  actionButtonText: {
    marginLeft: 6,
    color: "#6366f1",
    fontWeight: "500",
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    opacity: 0.5,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 8,
    fontFamily: Platform.OS === "ios" ? "SF Pro Display" : "Roboto",
  },
  emptyTitleDark: {
    color: "#f8fafc",
  },
  emptyText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "SF Pro Text" : "Roboto",
  },
  emptyTextDark: {
    color: "#94a3b8",
  },
  refreshButton: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  refreshButtonDark: {
    backgroundColor: "#1e293b",
  },
  swipeBackground: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 20,
    borderRadius: 14,
  },
  swipeRightBackground: {
    backgroundColor: "#10b981",
    left: 0,
  },
  swipeLeftBackground: {
    backgroundColor: "#ef4444",
    right: 0,
  },
  swipeText: {
    color: "#ffffff",
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
  },
  reminderContainer: {
    marginTop: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0,0,0,0.1)',
    paddingTop: 12,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  reminderText: {
    // Use a function to access colorScheme from props or context
    color: '#64748b', // fallback default
    fontWeight: "500",
    fontSize: 14,
  },
});
