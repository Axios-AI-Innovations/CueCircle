# Firebase Setup Guide for CueCircle

## 🚀 Quick Start (5 minutes)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Name it "CueCircle" (or whatever you prefer)
4. Enable Google Analytics (optional, but recommended)
5. Choose your region (closest to your users)

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" provider
3. (Optional) Enable Google, Apple, or other providers

### 3. Create Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (we'll add security rules later)
3. Select your region (same as project)

### 4. Get Configuration
1. Go to Project Settings → General → Your apps
2. Click "Add app" → Web app
3. Name it "CueCircle Web"
4. Copy the config object

### 5. Add Environment Variables
Create a `.env` file in your project root:

```bash
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 6. Install Dependencies
```bash
npm install firebase
```

## 📊 Database Schema

### Collections Structure:
```
/users/{userId}
  - id: string
  - email: string
  - name: string
  - pod_id?: string
  - preferences: object
  - created_at: timestamp

/habits/{habitId}
  - id: string
  - user_id: string
  - title: string
  - identity_goal: string
  - cue_type: 'time' | 'habit_stack'
  - cue_details: object
  - starter_version: string
  - backup_version: string
  - category: string
  - is_doctor_assigned: boolean
  - active: boolean
  - created_at: timestamp

/habit_logs/{logId}
  - id: string
  - habit_id: string
  - user_id: string
  - completed: boolean
  - version: 'starter' | 'backup' | 'full'
  - notes?: string
  - logged_at: timestamp
  - synced: boolean

/pods/{podId}
  - id: string
  - name: string
  - members: string[]
  - created_at: timestamp

/xp_systems/{userId}
  - user_id: string
  - total_xp: number
  - level: number
  - xp_to_next_level: number
  - streak_multiplier: number
  - achievements: array
  - created_at: timestamp
```

## 🔒 Security Rules (Add Later)

```javascript
// Firestore Security Rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Habits are private to the user
    match /habits/{habitId} {
      allow read, write: if request.auth != null && 
        resource.data.user_id == request.auth.uid;
    }
    
    // Habit logs are private to the user
    match /habit_logs/{logId} {
      allow read, write: if request.auth != null && 
        resource.data.user_id == request.auth.uid;
    }
    
    // Pods can be read by members
    match /pods/{podId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.members;
    }
  }
}
```

## 💰 Cost Breakdown

### Free Tier (Perfect for MVP):
- **Storage**: 1GB (≈ 50,000 habit logs)
- **Bandwidth**: 10GB/month (≈ 100,000 reads)
- **Reads**: 20,000/day (≈ 600,000/month)
- **Writes**: 20,000/day (≈ 600,000/month)

### Estimated Monthly Usage (100 active users):
- **Storage**: ~100MB (well under 1GB limit)
- **Reads**: ~50,000 (well under 600,000 limit)
- **Writes**: ~10,000 (well under 600,000 limit)

**Total Cost: $0/month** 🎉

### When You Need to Upgrade:
- **Blaze Plan**: Pay-as-you-go
- **Cost**: ~$0.18 per 100,000 reads
- **Example**: 1M reads/month = ~$1.80

## 🚀 Next Steps

1. **Test the setup**: Run `npm run dev` and check console for errors
2. **Create test user**: Try the authentication flow
3. **Add security rules**: Once you're ready for production
4. **Monitor usage**: Check Firebase Console for usage stats

## 🔧 Development Tips

### Local Emulators (Optional but Recommended):
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize emulators
firebase init emulators

# Start emulators
firebase emulators:start
```

### Testing Offline Support:
1. Disconnect internet
2. Create habits/logs
3. Reconnect internet
4. Check if data syncs automatically

## 🆘 Troubleshooting

### Common Issues:
1. **"Firebase not initialized"**: Check your environment variables
2. **"Permission denied"**: Add security rules or use test mode
3. **"Network error"**: Check your internet connection
4. **"Invalid API key"**: Verify your Firebase config

### Getting Help:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Community](https://firebase.community/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/firebase)
