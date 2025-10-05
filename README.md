# 🌾 AgriHub Davao

**AgriHub Davao** is a comprehensive mobile marketplace platform designed to connect farmers, suppliers, store owners, and consumers in the Davao agricultural ecosystem. Built with React Native and Expo, the app facilitates direct trade, reduces intermediaries, and promotes fair pricing in the agricultural supply chain.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Key Features by User Role](#key-features-by-user-role)
- [App Navigation](#app-navigation)
- [API & Data Management](#api--data-management)
- [Development](#development)

---

## 🎯 Overview

AgriHub Davao is a multi-role agricultural marketplace platform that enables:

- **Farmers/Suppliers** to sell their produce directly to buyers
- **Store Owners** to find reliable suppliers and purchase in bulk
- **Consumers** to discover fresh local products and connect with sellers
- **All users** to communicate, rate, and build trusted networks

The platform features real-time messaging, product showcases, rating systems, profile management, and role-specific dashboards.

---

## ✨ Features

### Core Features
- 🔐 **Authentication System** - Secure login and registration with role-based access
- 👥 **Multi-Role Support** - Consumer, Farmer/Supplier, and Store Owner roles
- 💬 **Real-Time Messaging** - Direct chat between users with message history
- ⭐ **Rating System** - Rate farmers, suppliers, and store owners
- 📝 **Post Management** - Create, view, and interact with posts (Selling/Buying)
- 🛒 **Product Showcase** - Display and browse products with images and pricing
- 👫 **Friends Network** - Send/accept friend requests and manage connections
- 🔔 **Notifications** - Stay updated with activity (Coming Soon)
- 📍 **Location Sharing** - Share farm/store locations (Coming Soon)
- 📷 **Image Support** - Upload and share product/post images

### User Experience
- 🎨 **Modern UI/UX** - Clean, intuitive design with role-specific color schemes
- 📱 **Responsive Design** - Optimized for various screen sizes
- 🔄 **Real-Time Updates** - Live data synchronization
- 💭 **Comments & Interactions** - Engage with posts through comments and reactions
- 🔍 **Search Functionality** - Find users, products, and posts easily

---

## 👤 User Roles

### 1. **Consumer** (Orange Theme - `#FF9800`)
- Browse products from farmers and store owners
- View "Selling" posts from store owners
- Rate and review store owners
- Send buying requests
- Build connections with suppliers

### 2. **Farmer/Supplier** (Green Theme - `#4CAF50`)
- Post products for sale
- Manage product showcase
- View "Buying" posts from store owners
- Rate and review store owners
- Direct communication with buyers

### 3. **Store Owner** (Green Theme - `#4CAF50`)
- Post buying requests
- Find reliable farmers and suppliers
- Manage product inventory
- Rate and review farmers/suppliers
- Build supplier network

---

## 🛠 Tech Stack

### Frontend
- **React Native** (0.81.4) - Mobile app framework
- **Expo** (~54.0.12) - Development platform
- **Expo Router** (~6.0.10) - File-based routing
- **TypeScript** (~5.9.2) - Type safety

### Navigation
- **React Navigation** (^7.1.8) - Navigation library
- **Bottom Tabs** (^7.4.0) - Tab navigation
- **Expo Router** - File-based routing system

### State & Storage
- **AsyncStorage** (2.2.0) - Local data persistence
- **React Hooks** - State management

### UI/UX
- **React Native Gesture Handler** (~2.28.0) - Touch interactions
- **React Native Reanimated** (~4.1.1) - Smooth animations
- **Expo Image Picker** (~17.0.8) - Image selection
- **Expo Haptics** (~15.0.7) - Haptic feedback

### Development Tools
- **ESLint** (^9.25.0) - Code linting
- **TypeScript** - Type checking

---

## 📁 Project Structure

```
AgriHubDavao/
├── app/                          # Expo Router pages
│   ├── (tabs)/                   # Tab navigation screens
│   │   ├── index.tsx
│   │   ├── explore.tsx
│   ├── consumer-home.tsx
│   ├── farmer-home.tsx
│   ├── store-owner-home.tsx
│   ├── login.tsx
│   ├── register.tsx
│   ├── messages.tsx
│   ├── friends.tsx
│   ├── chat.tsx
│   └── *-profile*.tsx           # Profile screens
│
├── features/
│   ├── Users/
│   │   ├── Consumer/
│   │   │   ├── Consumer_HomeScreen.tsx
│   │   │   ├── Consumer_Profile.tsx
│   │   │   └── Consumer_ProfileView.tsx
│   │   ├── Farmer&Supplier/
│   │   │   ├── FS_HomeScreen.tsx
│   │   │   ├── FS_Profile.tsx
│   │   │   └── FS_ProfileView.tsx
│   │   └── StoreOwner/
│   │       ├── StoreO_HomeScreen.tsx
│   │       ├── StoreO_Profile.tsx
│   │       └── StoreO_ProfileView.tsx
│   │
│   ├── Database/
│   │   └── UserData.tsx          # User data management
│   │
│   ├── Login&Registration/
│   │   ├── Login_Screen.tsx
│   │   ├── Registration_Screen.tsx
│   │   └── UserConsent&TermsOfAgreement.tsx
│   │
│   ├── Navigation/
│   │   ├── HomeScreen.tsx
│   │   ├── MessagesScreen.tsx
│   │   ├── FriendsScreen.tsx
│   │   └── NotificationsScreen.tsx
│   │
│   ├── Chat/
│   │   └── ChatScreen.tsx
│   │
│   └── Settings/
│       ├── Consumer_ProfileSettings.tsx
│       ├── FS_ProfileSettings.tsx
│       └── StoreO_ProfileSettings.tsx
│
├── components/
│   ├── navigation-components/
│   │   ├── Consumer_Footer.tsx
│   │   ├── FS_Footer.tsx
│   │   └── StoreO_Footer.tsx
│   └── ui/                       # Reusable UI components
│
├── assets/
│   └── images/                   # App images and icons
│
└── constants/
    └── theme.ts                  # App theme configuration
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- Android Studio (for Android) or Xcode (for iOS)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd AgriHubDavao
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Expo CLI globally** (if not already installed)
   ```bash
   npm install -g expo-cli
   ```

---

## 📱 Running the App

### Development Mode

```bash
npx expo start
```

This will start the Expo development server. You can then:

- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan QR code with Expo Go app on physical device

### Platform-Specific Commands

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 🔑 Key Features by User Role

### Consumer Features
- ✅ Browse store owner posts (Selling only)
- ✅ View store owner profiles with ratings
- ✅ Comment on posts with image support
- ✅ Rate store owners (1-5 stars)
- ✅ Direct messaging with sellers
- ✅ Friend network management
- ✅ Profile settings & management
- ✅ Product showcase viewing

### Farmer/Supplier Features
- ✅ Create "Selling" posts with images
- ✅ View store owner "Buying" requests
- ✅ Product showcase management
- ✅ Rate and review store owners
- ✅ Direct communication with buyers
- ✅ Profile customization with farm location
- ✅ Post management (create, edit, delete)
- ✅ Comment and interact with posts

### Store Owner Features
- ✅ Create "Buying" requests
- ✅ View farmer/supplier "Selling" posts
- ✅ Rate farmers and suppliers
- ✅ Product inventory management
- ✅ Direct messaging with suppliers
- ✅ Store profile with location
- ✅ Supplier network building
- ✅ Post interactions and comments

---

## 🧭 App Navigation

### Route Structure
```
/login                          # Login screen
/register                       # Registration screen
/consumer-home                  # Consumer dashboard
/farmer-home                    # Farmer/Supplier dashboard
/store-owner-home              # Store Owner dashboard
/messages                       # Messages list
/chat                          # Chat conversation
/friends                       # Friends management
/c-profile                     # Consumer profile
/fs-profile                    # Farmer/Supplier profile
/storeo-profile               # Store Owner profile
/consumer-profile-view        # View store owner profile (Consumer)
/fs-profile-view             # View farmer profile (Store Owner)
/storeo-profile-view         # View store owner profile (Farmer)
/consumer-profile-settings   # Consumer settings
/fs-profile-settings        # Farmer/Supplier settings
/storeo-profile-settings    # Store Owner settings
```

### Footer Navigation
Each user role has custom footer navigation:
- 🏠 **Home** - Dashboard
- 💬 **Messages** - Chat inbox
- 🔔 **Notifications** - Activity alerts (Coming Soon)
- 👥 **Friends** - Network management
- 👤 **Profile** - User profile

---

## 💾 API & Data Management

### User Data Structure
```typescript
interface UserData {
  id?: number;
  email: string;
  password: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  userName: string;
  phoneNumber: string;
  role: string; // 'Consumer' | 'Farmer/Supplier' | 'Store Owner'
  farmLocation?: string;
  storeName?: string;
  storeLocation?: string;
  documents?: {
    psaBiodata?: string;
    validId?: string;
    businessPermit?: string;
  };
}
```

### Data Storage
- **AsyncStorage** - Local data persistence
- User session management
- Post and product data
- Message history
- Friend connections

### Key Functions
- `saveUser()` - Register new user
- `getCurrentUser()` - Get logged-in user
- `findUserByEmail()` - Authentication
- `updateCurrentUser()` - Update profile
- `clearCurrentUser()` - Logout

---

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Lint code
npm run lint

# Reset project
npm run reset-project
```

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Component-based architecture**
- **Hooks for state management**
- **Expo Router for navigation**

### Design Patterns
- **Role-based UI** - Different interfaces per user role
- **Component reusability** - Shared components across roles
- **Modal system** - Comments, ratings, and forms
- **Navigation adapters** - Consistent routing across screens

---

## 🎨 Theme & Styling

### Color Schemes
- **Consumer**: Orange (`#FF9800`)
- **Farmer/Supplier**: Green (`#4CAF50`)
- **Store Owner**: Green (`#4CAF50`)
- **Accents**: Blue (`#2196F3`), Red (`#f44336`)

### UI Components
- Custom headers with role-specific colors
- Bottom tab navigation
- Modal overlays for actions
- Card-based layouts
- Star rating system
- Image galleries

---

## 📝 Core Functionality

### Post System
- **Create Post** - Title, content, images, status (Selling/Buying)
- **View Posts** - Filter by user role and post type
- **Interact** - Like, comment, share location
- **Comments Modal** - Modern sliding modal with reply support

### Rating System
- **5-Star Rating** - Interactive star selection
- **Rate Users** - Rate farmers, suppliers, and store owners
- **View Ratings** - Display average rating and review count
- **Rating Modal** - Clean UI for submitting ratings

### Messaging
- **Direct Chat** - One-on-one conversations
- **Message List** - View all conversations
- **Real-time Updates** - Live message synchronization
- **Image Sharing** - Send images in chat

### Profile Management
- **View Profile** - Display user information, posts, and products
- **Edit Profile** - Update personal information
- **Settings** - Manage account preferences
- **Profile View** - View other users' profiles with rating

---

## 🔒 Authentication Flow

1. **Login Screen** - Email and password authentication
2. **Registration** - Multi-step registration with role selection
3. **User Consent** - Terms of agreement acceptance
4. **Role-Based Redirect** - Redirect to appropriate dashboard
5. **Session Management** - Persistent login with AsyncStorage

---

## 🚧 Upcoming Features

- 🔔 **Push Notifications** - Real-time alerts
- 📍 **Advanced Location Services** - Map integration
- 💳 **Payment Integration** - In-app transactions
- 📊 **Analytics Dashboard** - Insights and reports
- 🌐 **Multi-language Support** - Localization
- 🔍 **Advanced Search** - Filters and sorting
- 📱 **Web Version** - Progressive web app

---

## 📄 License

This project is private and proprietary.

---

## 👥 Contributing

This is a private project. For collaboration inquiries, please contact the project owner.

---

## 📞 Support

For issues, questions, or feedback, please contact the development team.

---

**Built with ❤️ for the Davao Agricultural Community**
