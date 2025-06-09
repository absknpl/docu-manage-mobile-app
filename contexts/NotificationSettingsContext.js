import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationSettingsContext = createContext();

export function NotificationSettingsProvider({ children }) {
  // Default: 23:35, 1 day before
  const [notificationTime, setNotificationTimeState] = useState({ hour: 23, minute: 35 });
  const [remindBefore, setRemindBeforeState] = useState(1); // days before expiry
  const [notificationEnabled, setNotificationEnabledState] = useState(true); // Notification enabled/disabled state

  // Load settings from AsyncStorage on mount
  React.useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('arkive_notification_settings');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.notificationTime) setNotificationTimeState(parsed.notificationTime);
          if (typeof parsed.remindBefore === 'number') setRemindBeforeState(parsed.remindBefore);
          if (typeof parsed.notificationEnabled === 'boolean') setNotificationEnabledState(parsed.notificationEnabled);
        }
      } catch (e) {
        console.error('Failed to load notification settings:', e);
      }
    })();
  }, []);

  // Save settings to AsyncStorage whenever they change
  React.useEffect(() => {
    AsyncStorage.setItem('arkive_notification_settings', JSON.stringify({ notificationTime, remindBefore, notificationEnabled })).catch(e => {
      console.error('Failed to save notification settings:', e);
    });
  }, [notificationTime, remindBefore, notificationEnabled]);

  const setNotificationTime = (time) => setNotificationTimeState(time);
  const setRemindBefore = (val) => setRemindBeforeState(val);
  const setNotificationEnabled = (val) => setNotificationEnabledState(val);

  return (
    <NotificationSettingsContext.Provider value={{ notificationEnabled, setNotificationEnabled, notificationTime, setNotificationTime, remindBefore, setRemindBefore }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export const useNotificationSettings = () => useContext(NotificationSettingsContext);
