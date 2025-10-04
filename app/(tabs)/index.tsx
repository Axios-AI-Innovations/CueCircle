import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { HabitCard } from '@/components/HabitCard';
import XPDisplay from '@/components/XPDisplay';
import { Plus, Target, TrendingUp, Star, Shield, Zap, Trophy } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { toggleCrisisMode, toggleHyperfocusMode } from '@/store/slices/userSlice';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/utils/themeStyles';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { habits, logs } = useSelector((state: RootState) => state.habits);
  const { currentUser, personalProfile, crisisMode, hyperfocusMode } = useSelector((state: RootState) => state.user);
  const { xpSystem } = useSelector((state: RootState) => state.xp);
  const { currentTheme } = useTheme();
  
  const styles = useMemo(() => createThemedStyles(currentTheme), [currentTheme]);

  // Get today's logs
  const todayLogs = logs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.logged_at).toDateString() === today;
  });

  // Calculate today's progress
  const todayHabits = habits.filter(habit => (habit as any).active);
  const completedToday = todayLogs.filter(log => log.completed).length;
  const completionRate = todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0;

  // Calculate actual streak from logs
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    // Sort logs by date (most recent first)
    const sortedLogs = [...logs].sort((a, b) => 
      new Date(b.logged_at).getTime() - new Date(a.logged_at).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const log of sortedLogs) {
      const logDate = new Date(log.logged_at);
      logDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === streak) {
        if (log.completed) {
          streak++;
          currentDate.setDate(currentDate.getDate() - 1);
        } else {
          break;
        }
      } else if (daysDiff > streak) {
        break;
      }
    }
    
    return streak;
  };
  
  const currentStreak = calculateStreak();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              {new Date().getHours() < 12 ? 'Good morning' : 
               new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'}, 
              {currentUser?.name || 'there'}!
            </Text>
            <Text style={styles.subtitle}>How are you feeling today?</Text>
          </View>
          <XPDisplay showDetails={false} onPress={() => {
            console.log('XP Display clicked!');
            router.push('/xp-dashboard');
          }} />
        </View>

        {/* Progress Overview */}
        <View style={styles.progressCard}>
          <Text style={styles.progressTitle}>Today's Progress</Text>
          <View style={styles.progressStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{completedToday}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{todayHabits.length - completedToday}</Text>
              <Text style={styles.statLabel}>Remaining</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{Math.round(completionRate)}%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{currentStreak}</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${completionRate}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {completionRate === 100 ? "🎉 All done today!" : 
               completionRate > 50 ? "Great progress!" : 
               completionRate > 0 ? "Every step counts!" : 
               "Ready to start?"}
            </Text>
          </View>
        </View>

        {/* Today's Habits */}
        <View style={styles.habitsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Habits</Text>
            <TouchableOpacity style={styles.addButton}>
              <Plus size={20} color={styles.buttonText.color} />
            </TouchableOpacity>
          </View>
          
          {todayHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Target size={48} color={styles.emptyTitle.color} />
              <Text style={styles.emptyTitle}>Ready to build habits? 🌱</Text>
              <Text style={styles.emptyText}>
                Start with one small habit and build momentum from there.
              </Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {todayHabits.slice(0, 5).map(habit => (
                <HabitCard
                  key={(habit as any).id}
                  habit={habit}
                  todayLog={todayLogs.find(log => log.habit_id === (habit as any).id)}
                  onComplete={(habitId) => {
                    // Navigate to habits tab to complete the habit
                    router.push('/habits');
                  }}
                />
              ))}
              {todayHabits.length > 5 && (
                <TouchableOpacity 
                  style={styles.viewAllButton}
                  onPress={() => router.push('/habits')}
                >
                  <Text style={styles.viewAllText}>
                    View all {todayHabits.length} habits
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/progress')}
            >
              <Star size={24} color={styles.statNumber.color} />
              <Text style={styles.actionButtonText}>Log Energy</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/progress')}
            >
              <TrendingUp size={24} color={styles.statNumber.color} />
              <Text style={styles.actionButtonText}>View Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Adaptive Mode Toggles */}
        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>Adaptive Modes</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity 
              style={[styles.modeButton, crisisMode && styles.activeModeButton]}
              onPress={() => dispatch(toggleCrisisMode())}
            >
              <Shield size={20} color={crisisMode ? styles.buttonText.color : styles.errorText.color} />
              <Text style={[styles.modeButtonText, crisisMode && styles.activeModeButtonText]}>
                Crisis Mode
              </Text>
              <Text style={styles.modeDescription}>
                Simplified interface for overwhelming days
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modeButton, hyperfocusMode && styles.activeModeButton]}
              onPress={() => dispatch(toggleHyperfocusMode())}
            >
              <Zap size={20} color={hyperfocusMode ? styles.buttonText.color : styles.warningText.color} />
              <Text style={[styles.modeButtonText, hyperfocusMode && styles.activeModeButtonText]}>
                Hyperfocus Mode
              </Text>
              <Text style={styles.modeDescription}>
                Optimized for high-energy sessions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Profile Status */}
        {personalProfile && (
          <View style={styles.adhdStatus}>
            <Text style={styles.adhdStatusTitle}>Your Personal Profile</Text>
            <Text style={styles.adhdStatusText}>
              Optimized for your unique patterns and preferences.
            </Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}
