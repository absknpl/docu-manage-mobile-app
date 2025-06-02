# Arkive: Your Ultimate Document Management App

**Developed by [Abhishek Nepal](https://www.abisek.dev)**

---

## Overview

**Arkive** is a next-generation, cross-platform document management app designed to help you organize, track, and never miss a deadline for your most important files. Built with React Native, Arkive delivers a seamless, beautiful, and highly functional experience on both iOS and Android devices.

---

## Features

- **Modern, Professional UI**: Clean, intuitive, and visually appealing interface with support for light, dark, and pop color themes.
- **Timeline View**: Visualize all your documents with expiration dates in a chronological, card-based timeline. Instantly see what’s due today, this week, this month, or this year.
- **Powerful Search & Filtering**: Instantly search documents by title or filter by category for rapid access.
- **Category Management**: Organize your documents with custom categories and beautiful tag icons.
- **Smart Notifications**: Set custom notification times and “remind me before” intervals. Never miss an expiration again.
- **Document Upload & Editing**: Add, edit, and manage documents with ease. Upload files, set expiration dates, and assign categories.
- **Share Anywhere**: Share your documents with a tap using the native share sheet on iOS and Android.
- **Settings & Personalization**: Fine-tune notification preferences, theme, and more from a polished settings screen.
- **Accessibility & Responsiveness**: Designed to look and work great on every device size.

---

## Screenshots

> _Add screenshots here to showcase Timeline, Document List, Upload Modal, and Settings._

---

## Getting Started

### Prerequisites

- Node.js (>= 16.x)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)

### Installation

```bash
git clone https://github.com/yourusername/arkive.git
cd arkive
npm install # or yarn install
```

### Running the App

```bash
npm start # or yarn start
```

Scan the QR code with your Expo Go app or run on an emulator/simulator.

---

## Project Structure

- `App.js` – App entry point and context providers
- `components/` – Reusable UI components (TimelineItem, DocumentCard, FloatingActionButton, etc.)
- `contexts/` – React Contexts for Documents, Theme, and Notification Settings
- `navigation/` – Navigation setup (Tab and Stack navigators)
- `screens/` – Main app screens (Documents, Timeline, Settings, Notifications)
- `assets/` – App icons and images

---

## Key Technical Highlights

- **React Native + Expo**: Fast, cross-platform development with native performance.
- **Context API**: Global state management for documents, notifications, and theming.
- **Custom Notification Logic**: All notification scheduling is context-aware and updates instantly with user preferences.
- **Animated UI**: Smooth transitions, animated FAB, and timeline cards for a delightful user experience.
- **Error Handling & Edge Cases**: Robust handling of navigation, modals, and list virtualization.

---

## Problems Faced & Solutions

- **Navigation & Modal Issues**: Early navigation errors were resolved by making the tab navigator the root and using reliable navigation patterns for modals.
- **Notification Scheduling**: Ensured that notification logic is always in sync with user settings, rescheduling as needed.
- **VirtualizedList Warnings**: Fixed by replacing nested ScrollViews with FlatLists for filter pills and lists.
- **UI Consistency**: Refined card, pill, and modal designs for a cohesive, professional look across all screens.
- **Cross-Platform Share**: Integrated native share functionality for both iOS and Android.

---

## Future Plans

- **Cloud Sync & Backup**: Integrate with cloud storage providers for backup and multi-device sync.
- **Document Scanning**: Add built-in document scanning and OCR.
- **Advanced Search**: Full-text search and smart suggestions.
- **Collaboration**: Share folders and documents with other users.
- **Biometric Security**: Add FaceID/TouchID/biometric lock for sensitive documents.
- **Widget & Quick Actions**: Home screen widgets and quick add actions.

---

## About the Developer

**Abhishek Nepal** is a passionate software engineer and product designer, specializing in mobile and web app development. With a keen eye for detail and a relentless drive for user-centric design, Abhishek delivers products that are not only functional but delightful to use.

- 🌐 [www.abisek.dev](https://www.abisek.dev)
- 💼 [LinkedIn](https://www.linkedin.com/in/abhisheknepaldev)
- 🐦 [Twitter/X](https://twitter.com/abhisheknepal)

> _"Arkive is more than just an app—it's your digital memory, your personal assistant, and your peace of mind. Experience the future of document management, today."_

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT
