# CueCircle 🌟

**A mobile-first habit formation app designed for people who struggle with accountability and follow-through.**

## About CueCircle

CueCircle is more than just another habit tracker. It's a supportive environment that adapts to you instead of expecting perfection. Built around behavioral science principles like BJ Fogg's Behavior Model and Atomic Habits, CueCircle makes habit-building simpler by reducing friction and focusing on self-compassion.

### Core Philosophy

Unlike general habit apps that assume steady motivation and rigid schedules, CueCircle acknowledges the realities of building habits:
- **Variable energy levels** throughout the day
- **Time-blindness** and executive function challenges  
- **Sensitivity to failure** and need for gentle encouragement
- **Need for flexibility** and backup plans

## Key Features

### 🎯 **Adaptive Habit Creation**
- **Identity-based goals**: Focus on who you want to become, not just what you want to do
- **Tiny starter steps**: So small they feel almost silly NOT to do
- **Backup versions**: For low-energy days when you're running on empty
- **Flexible cues**: Time-based or habit-stacking triggers
- **Doctor-assigned goals**: Support for medication, diet, and treatment plans

### 🌟 **Visual Progress Tracking**
- **Constellation view**: Your habits form a growing constellation of stars
- **Consistency percentages**: Forgiving progress tracking that celebrates effort
- **Freeze tokens**: Protect your streaks during difficult periods
- **Crisis mode**: Simplified interface for overwhelming days
- **Hyperfocus mode**: Optimized for high-energy, focused sessions

### 🤝 **Accountability Pods**
- **Small, intimate groups**: Just you and one accountability partner
- **Body doubling sessions**: Work alongside each other virtually
- **Encouragement system**: Send cheers and support
- **Shared goals**: Collaborative progress tracking
- **Low-pressure environment**: No judgment, just support

### 🎮 **Engaging Reward System**
- **XP and leveling**: Gamified progression that feels meaningful
- **Micro-rewards**: Immediate feedback for small wins
- **Novelty system**: Keeps things fresh and interesting
- **Fun variants**: Different ways to complete the same habit
- **Celebration animations**: Joyful feedback for achievements

### 🧠 **Advanced Analytics & Insights**
- **AI-powered insights**: Pattern recognition and personalized recommendations
- **Energy correlation tracking**: When you perform best
- **Behavioral trigger analysis**: What helps you succeed
- **Medical report data**: Share progress with healthcare providers
- **Personalized insights**: Tailored to your unique patterns and challenges

### ♿ **Accessibility & Inclusivity**
- **Dyslexia-friendly fonts**: Easy-to-read typography
- **High-contrast modes**: Visual accessibility options
- **Haptic feedback**: Tactile confirmation of actions
- **Voice logging**: Alternative input methods
- **Calming UI design**: Reduces sensory overwhelm

## Technical Architecture

### **Frontend**
- **React Native** with Expo for cross-platform mobile development
- **TypeScript** for type safety and better developer experience
- **Redux Toolkit** for state management
- **React Native Reanimated** for smooth animations
- **Expo Router** for navigation

### **State Management**
- **Habits Slice**: Core habit tracking and completion logging
- **Pod Slice**: Accountability partner management
- **XP Slice**: Gamification and reward system
- **User Slice**: User preferences and personal profile
- **Analytics Slice**: Advanced insights and pattern recognition

### **Key Components**
- **HabitWizard**: Guided habit creation process
- **ConstellationView**: Visual progress representation
- **EnhancedRewardSystem**: Celebration animations
- **AIInsightsPanel**: Personalized recommendations
- **MicroHabitCard**: Tiny habit tracking

### **Data Models**
- **Advanced Habit**: Comprehensive habit tracking with insights
- **Personal Profile**: Personalized accommodations and patterns
- **Micro Habits**: Tiny, achievable steps
- **Pod System**: Accountability and support features
- **XP System**: Gamification and progression

## Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/cuecircle.git
cd cuecircle

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Development Scripts

```bash
# Start development server
npm run dev

# Build for web
npm run build:web

# Run linting
npm run lint

# Type checking
npm run typecheck
```

## Project Structure

```
CueCircle/
├── app/                    # Expo Router app structure
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Home dashboard
│   │   ├── habits.tsx     # Habit management
│   │   ├── pod.tsx        # Accountability pods
│   │   ├── progress.tsx   # Analytics & insights
│   │   └── profile.tsx   # User settings
├── components/            # Reusable UI components
│   ├── advanced/         # Advanced features
│   ├── HabitWizard.tsx   # Habit creation flow
│   ├── ConstellationView.tsx
│   └── EnhancedRewardSystem.tsx
├── store/                # Redux state management
│   ├── slices/          # Feature-specific state
│   └── index.ts        # Store configuration
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
└── hooks/              # Custom React hooks
```

## Future Development Tasks

### Phase 2 - Advanced Features
- **Offline-First Architecture**: Implement sync queue and conflict resolution for seamless offline experience
- **Push Notifications**: Add reminder system for habit cues and accountability
- **Accessibility Features**: Implement dyslexia-friendly fonts, high contrast modes, and voice logging
- **Medical Integration**: Build healthcare provider sharing and medical report generation
- **Testing & Polish**: Add comprehensive testing, error handling, and performance optimization

### Immediate Fixes Needed
- **Home Quick Actions**: Fix "Log Energy" and "View Progress" buttons that don't work
- **Streak Calculation**: Fix streak showing default 7 days instead of actual streak
- **Authentication Flow**: Implement proper login screen for non-authenticated users
- **Profile Goals**: Develop profile creation with goals and pre-suggested habits
- **Generic Profile**: Improve non-user profile with proper Days Active, Active Habits, and Consistency
- **UI Polish**: Visual improvements and better user experience

### Current Functionality Enhancements
- **XP System Polish**: Fix linting errors and complete Firebase integration
- **Analytics Dashboard**: Build AI-powered insights with pattern recognition
- **Real-time Sync**: Enhance pod updates and body doubling sessions
- **Profile Management**: Improve personal profile editing and settings
- **Habit Templates**: Add pre-built habit templates for common goals
- **Social Features**: Expand pod functionality with group challenges
- **Data Export**: Add user data export and backup features

## Contributing

CueCircle is built with inclusivity in mind. We welcome contributions that:
- Improve accessibility and inclusivity
- Enhance adaptive features
- Add new behavioral science insights
- Strengthen the accountability system


## Support

For questions, feedback, or support, please reach out through our community channels or open an issue on GitHub.

---

**Remember**: CueCircle is designed to be your supportive companion in building better habits. It's okay to have off days, and the app is here to help you get back on track with compassion and understanding. 🌟
