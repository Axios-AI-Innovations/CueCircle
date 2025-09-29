import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { HabitCard } from '@/components/HabitCard';
import { Plus, Target, TrendingUp, Star, Shield, Zap } from 'lucide-react-native';
import { useDispatch } from 'react-redux';
import { toggleCrisisMode, toggleHyperfocusMode } from '@/store/slices/userSlice';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { habits, logs } = useSelector((state: RootState) => state.habits);
  const { currentUser, adhdProfile, crisisMode, hyperfocusMode } = useSelector((state: RootState) => state.user);
  const { xpSystem } = useSelector((state: RootState) => state.xp);

  // Get today's logs
  const todayLogs = logs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.logged_at).toDateString() === today;
  });

  // Calculate today's progress
  const todayHabits = habits.filter(habit => habit.active);
  const completedToday = todayLogs.filter(log => log.completed).length;
  const completionRate = todayHabits.length > 0 ? (completedToday / todayHabits.length) * 100 : 0;

  // Get current streak (simplified)
  const currentStreak = 7; // This would be calculated from logs

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
          {xpSystem && (
            <View style={styles.xpDisplay}>
              <Text style={styles.xpLabel}>Level {xpSystem.level}</Text>
              <View style={styles.xpBar}>
                <View 
                  style={[
                    styles.xpBarFill,
                    { width: `${(xpSystem.total_xp % (xpSystem.level * 100)) / (xpSystem.level * 100) * 100}%` }
                  ]}
                />
              </View>
            </View>
          )}
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
              <Plus size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          
          {todayHabits.length === 0 ? (
            <View style={styles.emptyState}>
              <Target size={48} color="#48bb78" />
              <Text style={styles.emptyTitle}>Ready to build habits? 🌱</Text>
              <Text style={styles.emptyText}>
                Start with one small habit and build momentum from there.
              </Text>
            </View>
          ) : (
            <View style={styles.habitsList}>
              {todayHabits.slice(0, 5).map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  todayLog={todayLogs.find(log => log.habit_id === habit.id)}
                  onComplete={() => {}} // This would be connected to the completion handler
                />
              ))}
              {todayHabits.length > 5 && (
                <TouchableOpacity style={styles.viewAllButton}>
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
            <TouchableOpacity style={styles.actionButton}>
              <Star size={24} color="#ed8936" />
              <Text style={styles.actionButtonText}>Log Energy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <TrendingUp size={24} color="#805ad5" />
              <Text style={styles.actionButtonText}>View Progress</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ADHD Mode Toggles */}
        <View style={styles.modeSection}>
          <Text style={styles.sectionTitle}>ADHD Modes</Text>
          <View style={styles.modeButtons}>
            <TouchableOpacity 
              style={[styles.modeButton, crisisMode && styles.activeModeButton]}
              onPress={() => dispatch(toggleCrisisMode())}
            >
              <Shield size={20} color={crisisMode ? "#ffffff" : "#e53e3e"} />
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
              <Zap size={20} color={hyperfocusMode ? "#ffffff" : "#ed8936"} />
              <Text style={[styles.modeButtonText, hyperfocusMode && styles.activeModeButtonText]}>
                Hyperfocus Mode
              </Text>
              <Text style={styles.modeDescription}>
                Optimized for high-energy sessions
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ADHD Profile Status */}
        {adhdProfile && (
          <View style={styles.adhdStatus}>
            <Text style={styles.adhdStatusTitle}>Your ADHD Profile</Text>
            <Text style={styles.adhdStatusText}>
              Optimized for your unique patterns and preferences.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
  },
  progressCard: {
    backgroundColor: '#2d3748',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  progressTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#48bb78',
  },
  statLabel: {
    fontSize: 12,
    color: '#a0aec0',
    marginTop: 4,
  },
  progressBarContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
  habitsSection: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  addButton: {
    backgroundColor: '#48bb78',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
  },
  habitsList: {
    gap: 12,
    paddingHorizontal: 20,
  },
  viewAllButton: {
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  viewAllText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '500',
  },
  quickActions: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2d3748',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  adhdStatus: {
    backgroundColor: '#805ad520',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#805ad540',
  },
  adhdStatusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#805ad5',
    marginBottom: 4,
  },
  adhdStatusText: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
  xpDisplay: {
    alignItems: 'flex-end',
    gap: 4,
  },
  xpLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#48bb78',
  },
  xpBar: {
    width: 80,
    height: 4,
    backgroundColor: '#4a5568',
    borderRadius: 2,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 2,
  },
  modeSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  modeButtons: {
    gap: 12,
    marginTop: 16,
  },
  modeButton: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeModeButton: {
    backgroundColor: '#48bb7820',
    borderColor: '#48bb78',
  },
  modeButtonText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '600',
  },
  activeModeButtonText: {
    color: '#48bb78',
  },
  modeDescription: {
    color: '#718096',
    fontSize: 12,
    textAlign: 'center',
  },
});