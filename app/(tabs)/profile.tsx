import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { User, Settings, Moon, Palette, Vibrate, LogOut } from 'lucide-react-native';
import { RootState } from '@/store';
import { logout } from '@/store/slices/userSlice';
import { authService } from '@/utils/firebase';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [preferences, setPreferences] = useState({
    theme: 'dark',
    font: 'default',
    hapticsEnabled: true,
    notifications: true,
  });

  const updatePreference = (key: string, value: any) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
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
          <Settings size={24} color="#a0aec0" />
        </View>

        <View style={styles.userSection}>
          <View style={styles.avatar}>
            <User size={32} color="#ffffff" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
            <Text style={styles.userEmail}>{currentUser?.email || 'user@cuecircle.com'}</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Active Habits</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>85%</Text>
            <Text style={styles.statLabel}>Consistency</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>ADHD-Friendly Settings</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.settingIcon}>
                <Palette size={20} color="#805ad5" />
              </View>
              <View>
                <Text style={styles.settingLabel}>High Contrast Mode</Text>
                <Text style={styles.settingDescription}>Enhanced visibility</Text>
              </View>
            </View>
            <Switch
              value={preferences.theme === 'high-contrast'}
              onValueChange={value => 
                updatePreference('theme', value ? 'high-contrast' : 'dark')
              }
              trackColor={{ false: '#4a5568', true: '#48bb78' }}
              thumbColor="#ffffff"
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
                <Vibrate size={20} color="#ed8936" />
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
          <LogOut size={20} color="#e53e3e" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            CueCircle helps you build habits that stick, designed specifically for ADHD minds.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 0,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#48bb78',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#a0aec0',
  },
  statsGrid: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statItem: {
    flex: 1,
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#48bb78',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#a0aec0',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a5568',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  fontIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: '#805ad5',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#a0aec0',
  },
  actionItem: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#a0aec0',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 32,
    gap: 8,
  },
  signOutText: {
    color: '#e53e3e',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    paddingBottom: 100,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
  },
  versionText: {
    fontSize: 12,
    color: '#718096',
  },
});