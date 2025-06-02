import React, { createContext, useState, useContext } from 'react';
import * as Notifications from 'expo-notifications';

const DocumentsContext = createContext();

// Notification time (24h format)
const NOTIFICATION_HOUR = 23;
const NOTIFICATION_MINUTE = 35;

export function DocumentsProvider({ children }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);

  // Helper to schedule notifications
  const scheduleDocumentNotifications = async (doc) => {
    // Cancel previous notifications for this doc (by id tag)
    await Notifications.cancelScheduledNotificationAsync(doc.id + '-expire');
    await Notifications.cancelScheduledNotificationAsync(doc.id + '-week');

    const expirationDate = new Date(doc.expirationDate);
    const now = new Date();
    // Only schedule if in the future
    if (expirationDate > now) {
      // If the document expires within the next 7 days, notify at 9am on the expiration day
      const msInDay = 24 * 60 * 60 * 1000;
      const daysUntilExpire = Math.floor((expirationDate - now) / msInDay);
      if (daysUntilExpire < 7) {
        const expireTrigger = new Date(expirationDate);
        expireTrigger.setHours(NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0, 0);
        await Notifications.scheduleNotificationAsync({
          identifier: doc.id + '-expire',
          content: {
            title: 'Document Expired',
            body: `The document "${doc.title}" expires today.`,
            sound: true,
          },
          trigger: expireTrigger,
        });
      } else {
        // Notify a week before
        const weekBefore = new Date(expirationDate);
        weekBefore.setDate(weekBefore.getDate() - 7);
        weekBefore.setHours(NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0, 0);
        if (weekBefore > now) {
          await Notifications.scheduleNotificationAsync({
            identifier: doc.id + '-week',
            content: {
              title: 'Document Expiry Reminder',
              body: `The document "${doc.title}" will expire in 1 week.`,
              sound: true,
            },
            trigger: weekBefore,
          });
        }
        // Also notify on the day of expiration
        const expireTrigger = new Date(expirationDate);
        expireTrigger.setHours(NOTIFICATION_HOUR, NOTIFICATION_MINUTE, 0, 0);
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