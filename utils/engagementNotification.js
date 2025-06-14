// utils/engagementNotification.js
// Handles weekly engagement notification scheduling for Arkive
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY_LAST_MESSAGE = 'arkive:lastEngagementMessage';
const STORAGE_KEY_LAST_ID = 'arkive:lastEngagementNotifId';

const ENGAGEMENT_MESSAGES = [
  "New to Arkive? Tap to add your first document and never miss an expiry date again.",
  "Documents expire quietly - let Arkive speak up for you. Add your passports/IDs to get started.",
  "Pro tip: Add all your insurance policies in one go. We’ll track each expiry date separately.",
  "Your Arkive timeline is empty. Add documents to see when things expire at a glance.",
  "Weekend task: Spend 5 minutes adding your important docs. Future-you will thank present-you.",
  "Travel soon? Add your passport to Arkive so we can remind you about renewals.",
  "Professionals save 2 hours/month by tracking licenses with Arkive. Add yours today.",
  "Did you know? Arkive can remind you about warranty expirations for appliances and gadgets.",
  "Your future self deserves less stress. Add documents now to avoid last-minute renewals.",
  "Organized people use Arkive to track: Passports | Licenses | Contracts | Certificates",
  "Quick win: Snap a photo of your driver’s license. We’ll extract the expiry date for you.",
  "Arkive works best when full. Add 5 documents today to unlock its full potential.",
  "Health docs matter too! Add vaccination records or insurance cards to your timeline.",
  "Tap to categorize your documents - makes finding them later much easier.",
  "Set custom reminder times in Settings to get alerts when you need them most.",
  "Your documents tell a story. Keep them organized with Arkive’s timeline view.",
  "First time here? Try our quick-start guide to adding documents efficiently.",
  "Busy week? Schedule 10 minutes this weekend to organize your important papers.",
  "Documents are piling up elsewhere? Let Arkive be your single source of truth."
];

// Helper to get all scheduled engagement notifications
async function getScheduledEngagementNotifications() {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.filter(n => n.content?.data?.engagement);
}

function getRandomMessage(lastMessage) {
  let pool = ENGAGEMENT_MESSAGES.filter(msg => msg !== lastMessage);
  if (pool.length === 0) pool = ENGAGEMENT_MESSAGES;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

function getRandomMessageNoRepeat(lastMessage, excludeMessages = []) {
  let pool = ENGAGEMENT_MESSAGES.filter(
    msg => msg !== lastMessage && !excludeMessages.includes(msg)
  );
  if (pool.length === 0) pool = ENGAGEMENT_MESSAGES.filter(msg => !excludeMessages.includes(msg));
  if (pool.length === 0) pool = ENGAGEMENT_MESSAGES;
  const idx = Math.floor(Math.random() * pool.length);
  return pool[idx];
}

export async function scheduleWeeklyEngagementNotification() {
  try {
    // Get all scheduled engagement notifications
    const scheduled = await getScheduledEngagementNotifications();
    // Sort by trigger date ascending
    const now = new Date();
    let futureNotifs = scheduled
      .map(n => {
        let date = n.trigger?.value ? new Date(n.trigger.value) : null;
        return date && date > now ? { id: n.identifier, date, message: n.content?.body } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.date - b.date);
    // Only keep up to 10 future notifications
    if (futureNotifs.length > 10) {
      // Cancel extras
      for (let i = 10; i < futureNotifs.length; ++i) {
        await Notifications.cancelScheduledNotificationAsync(futureNotifs[i].id);
      }
      futureNotifs = futureNotifs.slice(0, 10);
    }
    // Top up to 10
    let lastDate = futureNotifs.length > 0 ? new Date(futureNotifs[futureNotifs.length - 1].date) : new Date();
    let lastMessage = futureNotifs.length > 0 ? futureNotifs[futureNotifs.length - 1].message : await AsyncStorage.getItem(STORAGE_KEY_LAST_MESSAGE);
    let excludeMessages = [];
    if (futureNotifs.length > 0) {
      // Prevent immediate repeat
      excludeMessages.push(lastMessage);
    }
    for (let i = futureNotifs.length; i < 10; ++i) {
      // Schedule next notification 7 days after lastDate
      let nextDate = new Date(lastDate.getTime() + 7 * 24 * 60 * 60 * 1000);
      const message = getRandomMessageNoRepeat(lastMessage, excludeMessages);
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Stay organized with Arkive',
          body: message,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { engagement: true },
        },
        trigger: { date: nextDate },
      });
      // Save last message for next iteration
      lastDate = nextDate;
      lastMessage = message;
      excludeMessages = [lastMessage];
      await AsyncStorage.setItem(STORAGE_KEY_LAST_MESSAGE, message);
    }
  } catch (e) {
    // Fail silently
    console.warn('Failed to schedule engagement notifications', e);
  }
}

export async function clearWeeklyEngagementNotification() {
  try {
    const lastId = await AsyncStorage.getItem(STORAGE_KEY_LAST_ID);
    if (lastId) {
      await Notifications.cancelScheduledNotificationAsync(lastId);
      await AsyncStorage.removeItem(STORAGE_KEY_LAST_ID);
    }
  } catch (e) {
    // Fail silently
  }
}
