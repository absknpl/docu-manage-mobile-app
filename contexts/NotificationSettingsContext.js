import React, { createContext, useContext, useState } from 'react';

const NotificationSettingsContext = createContext();

export function NotificationSettingsProvider({ children }) {
  // Default: 23:35, 1 day before
  const [notificationTime, setNotificationTime] = useState({ hour: 23, minute: 35 });
  const [remindBefore, setRemindBefore] = useState(1); // days before expiry

  return (
    <NotificationSettingsContext.Provider value={{ notificationTime, setNotificationTime, remindBefore, setRemindBefore }}>
      {children}
    </NotificationSettingsContext.Provider>
  );
}

export const useNotificationSettings = () => useContext(NotificationSettingsContext);
