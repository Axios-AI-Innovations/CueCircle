import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, Moon, Palette, Vibrate, LogOut, Sun, Eye } from 'lucide-react-native';
import { RootState } from '@/store';
import { logout, updateUserPreferences } from '@/store/slices/userSlice';
import { authService } from '@/utils/firebase';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/utils/themeStyles';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { currentUser, personalProfile } = useSelector((state: RootState) => state.user);
  const { habits, logs } = useSelector((state: RootState) => state.habits);
  const { xpSystem } = useSelector((state: RootState) => state.xp);
  const { currentTheme, themeName, setTheme } = useTheme();
  
  const [preferences, setPreferences] = useState({
    theme: currentUser?.preferences?.theme || 'light',
    font: currentUser?.preferences?.font || 'default',
    hapticsEnabled: currentUser?.preferences?.haptics_enabled || true,
    notifications: true,
  });

  const styles = useMemo(() => createThemedStyles(currentTheme), [currentTheme]);

  // Calculate real statistics
  const activeHabits = habits.filter(habit => !habit.completed).length;
  const totalLogs = logs.length;
  const completedToday = logs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.completed_at).toDateString() === today;
  }).length;
  
  // Calculate consistency (percentage of days with at least one habit completed)
  const uniqueDays = new Set(logs.map(log => new Date(log.completed_at).toDateString())).size;
  const daysSinceStart = currentUser?.created_at ? 
    Math.ceil((Date.now() - new Date(currentUser.created_at).getTime()) / (1000 * 60 * 60 * 24)) : 1;
  
  // Handle new members and edge cases
  let consistency;
  if (logs.length === 0) {
    consistency = "0%";
  } else if (daysSinceStart < 2) {
    consistency = "0%";
  } else {
    const percentage = Math.round((uniqueDays / Math.max(daysSinceStart, 1)) * 100);
    consistency = `${percentage}%`;
  }

  const updatePreference = async (key: string, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    // Update theme if it's the theme preference
    if (key === 'theme') {
      setTheme(value);
    }
    
    // Update Redux store and Firebase
    if (currentUser) {
      dispatch(updateUserPreferences({
        userId: currentUser.id,
        preferences: {
          theme: newPreferences.theme,
          font: newPreferences.font,
          haptics_enabled: newPreferences.hapticsEnabled
        }
      }));
    }
  };

  const handleThemeChange = (newTheme: string) => {
    updatePreference('theme', newTheme);
  };

  const handleSignOut = () => {
    console.log('Sign out button clicked!');
    
    // For web, use confirm instead of Alert.alert
    const confirmed = window.confirm('Are you sure you want to sign out?');
    if (confirmed) {
      console.log('User confirmed sign out');
      performSignOut();
    } else {
      console.log('User cancelled sign out');
    }
  };

  const performSignOut = async () => {
    try {
      console.log('Starting sign out process...');
      await authService.signOut();
      console.log('Firebase sign out completed');
      dispatch(logout());
      console.log('Redux logout dispatched');
      // Force navigation to auth screen
      setTimeout(() => {
        router.replace('/auth/signin');
        console.log('Navigation to signin triggered');
      }, 100);
    } catch (error) {
      console.error('Sign out error:', error);
      window.alert('Failed to sign out. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/profile-settings')}
          >
            <Settings size={24} color={styles.iconColor.color} />
          </TouchableOpacity>
        </View>

        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <User size={32} color={styles.avatarText.color} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{currentUser?.email || 'user@cuecircle.com'}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{uniqueDays}</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activeHabits}</Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{consistency}</Text>
            <Text style={styles.statLabel}>Consistency</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance & Accessibility</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                <Sun size={20} color={styles.warningText.color} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Light Theme</Text>
                <Text style={styles.settingDescription}>Softer colors, easier on the eyes</Text>
              </View>
            </View>
            <Switch
              value={themeName === 'light'}
              onValueChange={value => 
                handleThemeChange(value ? 'light' : 'dark')
              }
              trackColor={styles.switchTrack}
              thumbColor={styles.switchThumb}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                <Moon size={20} color={styles.accentText.color} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Dark Theme</Text>
                <Text style={styles.settingDescription}>Dark mode for low-light environments</Text>
              </View>
            </View>
            <Switch
              value={themeName === 'dark'}
              onValueChange={value => 
                handleThemeChange(value ? 'dark' : 'light')
              }
              trackColor={styles.switchTrack}
              thumbColor={styles.switchThumb}
            />
          </View>


          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                <Text style={styles.fontIcon}>Aa</Text>
              </View>
              <View>
                <Text style={styles.settingLabel}>Dyslexia-Friendly Font</Text>
                <Text style={styles.settingDescription}>Easier reading experience</Text>
              </View>
            </View>
            <Switch
              value={preferences.font === 'dyslexia-friendly'}
              onValueChange={value => 
                updatePreference('font', value ? 'dyslexia-friendly' : 'default')
              }
              trackColor={{ false: '#4a5568', true: '#48bb78' }}
              thumbColor="#ffffff"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                <Vibrate size={20} color={styles.warningText.color} />
              </View>
              <View>
                <Text style={styles.settingLabel}>Haptic Feedback</Text>
                <Text style={styles.settingDescription}>Feel your progress</Text>
              </View>
            </View>
            <Switch
              value={preferences.hapticsEnabled}
              onValueChange={value => updatePreference('hapticsEnabled', value)}
              trackColor={{ false: '#4a5568', true: '#48bb78' }}
              thumbColor="#ffffff"
            />
          </View>
        </View>


        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionLabel}>Export My Data</Text>
            <Text style={styles.actionDescription}>Download your habit history</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionLabel}>Privacy Settings</Text>
            <Text style={styles.actionDescription}>Manage what you share</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem}>
            <Text style={styles.actionLabel}>Help & Support</Text>
            <Text style={styles.actionDescription}>Get help or report issues</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <LogOut size={20} color={styles.errorText.color} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            CueCircle helps you build habits that stick, designed for your unique needs.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles are now handled by the theme system