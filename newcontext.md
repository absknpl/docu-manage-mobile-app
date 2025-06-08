# Arkive Project Context

## Overview

Arkive is a cross-platform document management app built with **React Native** (using Expo), designed for both mobile (iOS/Android) and web. It features document upload, viewing, categorization, notifications, and a visually polished, responsive UI. The project is structured for easy App Store/Play Store submission and web deployment.

---

## Tech Stack

- **React Native** (Expo managed workflow)
- **React Navigation** (Stack and Bottom Tab navigators)
- **Expo Modules**: expo-notifications, expo-document-picker, expo-image-picker, expo-splash-screen, expo-linear-gradient, etc.
- **@react-native-community/datetimepicker** for date selection
- **react-native-pdf** for PDF viewing (native module)
- **@expo/vector-icons** for icons (Feather, Ionicons, MaterialCommunityIcons)
- **Context API** for state management (documents, theme, notifications)
- **Custom CSS/StyleSheet** for responsive, modern UI
- **Web assets**: HTML, images, icons, Open Graph/Twitter meta tags for social previews

---

## Project Structure

```
/assets/                # App icons, splash, images, and iOS AppIcon set
/components/            # Reusable UI components (FAB, DocumentCard, UploadModal, etc.)
/contexts/              # React Contexts for app-wide state (documents, theme, notifications)
/navigation/            # Navigation setup (AppNavigator, BottomTabNavigator)
/screens/               # Main app screens (Documents, Timeline, Notifications, Settings)
App.js                  # App entry point, context providers, splash logic
index.js                # Entry for Expo
app.json, eas.json      # Expo and EAS config
package.json            # Dependencies and scripts
arkive.html, ...        # Web landing pages with meta tags, download links, etc.
README.md               # Project documentation
```

---

## Key Files and Their Roles

### App Entry & Providers

- **App.js**
  - Sets up the root of the app.
  - Wraps everything in `ThemeProvider`, `NotificationSettingsProvider`, and `DocumentsProvider`.
  - Handles splash screen logic and notification permissions.
  - Loads `AppNavigator` inside a `NavigationContainer`.

### Navigation

- **/navigation/AppNavigator.js**

  - Stack navigator for the app.
  - Main stack screen: `"MainTabs"` (loads `BottomTabNavigator`).
  - Renders the global `FloatingActionButton`.

- **/navigation/BottomTabNavigator.js**
  - Bottom tab navigator with four tabs:
    - `"Documents"` → `DocumentsScreen`
    - `"Timeline"` → `TimelineScreen`
    - `"Notifications"` → `NotificationsScreen`
    - `"Settings"` → `SettingsScreen`
  - Custom tab bar styling and animated icons.

### Screens

- **/screens/DocumentsScreen.js**

  - Main document list, search, category filter, and upload modal.
  - Handles `showUploadModal` param to open `UploadModal`.
  - Uses `DocumentList`, `CategoryFilter`, and `UploadModal`.

- **/screens/TimelineScreen.js**

  - Visual timeline of documents, sorted by expiration.

- **/screens/NotificationsScreen.js**

  - Notification feed, mock data, and notification settings.

- **/screens/SettingsScreen.js**
  - User preferences: theme, notification time, export, about, etc.

### Components

- **/components/FloatingActionButton.js**

  - FAB that triggers navigation to `"MainTabs"` > `"Documents"` with `showUploadModal: true`.

- **/components/UploadModal.js**

  - Modal for uploading or editing documents.
  - Handles file picking (PDF/image), title, expiration date, and category.
  - Animated, responsive, and uses context for document actions.

- **/components/DocumentCard.js**

  - Card UI for each document, with actions (view, edit, delete).

- **/components/DocumentViewer.js**

  - PDF/image viewer for documents.

- **/components/DocumentList.js**

  - FlatList of documents, supports search and category filtering.

- **/components/TagIcons.js**

  - Icon mapping for document categories.

- **/components/SplashScreen.js**

  - Custom splash screen with branding and auto-navigation to `"MainTabs"`.

- **/components/SearchBar.js**, **/components/TimelineItem.js**, **/components/TimelineView.js**
  - Additional UI elements for search and timeline.

### Contexts

- **/contexts/DocumentsContext.js**

  - Manages document state, add/edit/delete logic.

- **/contexts/ThemeContext.js**

  - Manages theme (light/dark/pop), provides theme values.

- **/contexts/NotificationSettingsContext.js**
  - Manages notification settings and scheduling.

---

## Navigation Flow

- **SplashScreen** (auto-navigates to `"MainTabs"`)
- **MainTabs** (Stack screen in AppNavigator)
  - **BottomTabNavigator** (Tabs: Documents, Timeline, Notifications, Settings)
    - **DocumentsScreen** (shows UploadModal if `showUploadModal` param is set)
    - **TimelineScreen**
    - **NotificationsScreen**
    - **SettingsScreen**
- **FloatingActionButton** is rendered globally and always navigates to `"MainTabs"` > `"Documents"` with the correct param.

---

## Web & Assets

- **arkive.html, arkive-press.html, etc.**
  - Landing pages for web, with download links, Open Graph/Twitter meta tags, and responsive design.
- **/assets/**
  - All icons, splash images, and iOS/Android app icons.

---

## Key Implementation Details

- **Document Upload:**

  - Uses Expo DocumentPicker and ImagePicker for file selection.
  - UploadModal is triggered via navigation param (`showUploadModal`).
  - Documents are managed in context and persisted as needed.

- **Navigation:**

  - Uses unique screen names at every level to avoid nested name warnings.
  - FAB uses nested navigation pattern to always open the upload modal, regardless of current tab.

- **Notifications:**

  - Uses Expo Notifications for scheduling and handling reminders.

- **Theming:**

  - ThemeContext provides light, dark, and "pop" (custom) themes.
  - All components use theme values for colors and styles.

- **Responsiveness:**

  - All screens and components use responsive padding, font sizes, and layouts for mobile and web.

- **Branding:**
  - Custom splash screen, icons, and meta tags for App Store/Play Store/web.

---

## File Naming Conventions

- **Screens:** `/screens/[ScreenName]Screen.js`
- **Components:** `/components/[ComponentName].js`
- **Contexts:** `/contexts/[ContextName]Context.js`
- **Navigation:** `/navigation/[NavigatorName].js`
- **Assets:** `/assets/` (images, icons, splash, etc.)

---

## How Everything Works

- The app starts at `App.js`, which sets up providers and navigation.
- The splash screen is shown, then the user is taken to the main tab navigator.
- The FAB is always visible and can trigger the upload modal from anywhere.
- All document, theme, and notification state is managed via React Context.
- Navigation is robust, with unique names and correct param passing for modals and actions.
- The web version is visually consistent with the mobile app, with proper meta tags and download links.

---
