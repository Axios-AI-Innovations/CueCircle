# CueCircle Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Firebase Setup
1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create a Firestore database
4. Get your config from Project Settings → General → Your apps

### 3. Environment Variables
Create a `.env` file in the project root:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the App
```bash
npm run dev
```

## 🔧 Development

### Testing Authentication
1. Start the app
2. Try creating an account
3. Test sign in/out
4. Test password reset

### Database Structure
The app uses these Firestore collections:
- `users` - User profiles and preferences
- `habits` - User habits and configurations
- `habit_logs` - Daily habit completions
- `pods` - Accountability groups
- `xp_systems` - Gamification data

## 🚨 Troubleshooting

### Common Issues:
1. **"Firebase not initialized"** - Check your environment variables
2. **"Permission denied"** - Enable Authentication in Firebase Console
3. **"Network error"** - Check your internet connection
4. **"Invalid API key"** - Verify your Firebase config

### Getting Help:
- Check the console for error messages
- Verify Firebase project settings
- Ensure all environment variables are set
