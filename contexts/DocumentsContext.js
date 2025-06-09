import React, { createContext, useState, useContext } from 'react';
import * as Notifications from 'expo-notifications';
import { useNotificationSettings } from './NotificationSettingsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DocumentsContext = createContext();

export function DocumentsProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { notificationTime, remindBefore } = useNotificationSettings();

  // Load documents from AsyncStorage on mount
  React.useEffect(() => {
    (async () => {
      try {
        const storedDocs = await AsyncStorage.getItem('arkive_documents');
        if (storedDocs) {
          setDocuments(JSON.parse(storedDocs));
        }
      } catch (e) {
        console.error('Failed to load documents from storage:', e);
      }
    })();
  }, []);

  // Persist documents to AsyncStorage whenever they change
  React.useEffect(() => {
    AsyncStorage.setItem('arkive_documents', JSON.stringify(documents)).catch(e => {
      console.error('Failed to save documents:', e);
    });
  }, [documents]);

  // Helper to schedule notifications
  const scheduleDocumentNotifications = async (doc) => {
    // Cancel previous notifications for this doc (by id tag)
    await Notifications.cancelScheduledNotificationAsync(doc.id + '-expire');
    await Notifications.cancelScheduledNotificationAsync(doc.id + '-remind');

    const expirationDate = new Date(doc.expirationDate);
    const now = new Date();
    // Only schedule if in the future
    if (expirationDate > now) {
      // Remind before (custom)
      if (remindBefore > 0) {
        const remindDate = new Date(expirationDate);
        // If remindBefore is 30, this will be exactly 30 days before expiration
        remindDate.setDate(remindDate.getDate() - remindBefore); // Handles 1, 3, 7, 30 (1 month before)
        remindDate.setHours(notificationTime.hour, notificationTime.minute, 0, 0);
        if (remindDate > now) {
          await Notifications.scheduleNotificationAsync({
            identifier: doc.id + '-remind',
            content: {
              title: 'Document Expiry Reminder',
              body: `The document "${doc.title}" will expire in ${remindBefore === 1 ? '1 day' : remindBefore + ' days'}.`,
              sound: true,
            },
            trigger: remindDate,
          });
        }
      }
      // Also notify on the day of expiration
      const expireTrigger = new Date(expirationDate);
      expireTrigger.setHours(notificationTime.hour, notificationTime.minute, 0, 0);
      if (expireTrigger > now) {
        await Notifications.scheduleNotificationAsync({
          identifier: doc.id + '-expire',
          content: {
            title: 'Document Expired',
            body: `The document "${doc.title}" expires today.`,
            sound: true,
          },
          trigger: expireTrigger,
        });
      }
    }
  };

  const addNewDocument = async (newDoc) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setDocuments(prev => [...prev, newDoc]);
      await scheduleDocumentNotifications(newDoc);
    } catch (error) {
      console.error('Error adding document:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateDocument = async (updatedDoc) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setDocuments(prev => prev.map(doc => doc.id === updatedDoc.id ? { ...doc, ...updatedDoc } : doc));
      await scheduleDocumentNotifications(updatedDoc);
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    Notifications.cancelScheduledNotificationAsync(id + '-expire');
    Notifications.cancelScheduledNotificationAsync(id + '-week');
  };

  return (
    <DocumentsContext.Provider value={{ documents, loading, addNewDocument, deleteDocument, updateDocument }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export const useDocuments = () => useContext(DocumentsContext);