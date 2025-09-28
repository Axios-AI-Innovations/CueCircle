import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { logHabitCompletion } from '@/store/slices/habitsSlice';
import { awardXP } from '@/store/slices/xpSlice';
import { HabitCard } from '@/components/HabitCard';
import { ConstellationView } from '@/components/ConstellationView';
import { XPDisplay } from '@/components/advanced/XPDisplay';
import { AIInsightsPanel } from '@/components/advanced/AIInsightsPanel';
import { AdvancedHabit, HabitLog, CompletionInsight } from '@/types/advanced';
import { OfflineManager } from '@/utils/offline';
import { format } from 'date-fns';

export default function HomeScreen() {
  const dispatch = useDispatch();
  const { habits, logs } = useSelector((state: RootState) => state.habits);
  const { currentUser, crisisMode, hyperfocusMode } = useSelector((state: RootState) => state.user);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadInitialData();
    OfflineManager.cleanOldLogs();
  }, []);

  const loadInitialData = async () => {
    // In a real app, this would dispatch actions to load data
    console.log('Loading initial data...');
  };

  const handleHabitComplete = async (
    habitId: string, 
    version: 'starter' | 'backup' | 'full',
    energyLevel: number = 3,
    mood: number = 3
  ) => {
    const now = new Date();
    const today = format(now, 'yyyy-MM-dd');
    
    // Check if already logged today
    const existingLog = logs.find(log => 
      log.habit_id === habitId && 
      format(new Date(log.logged_at), 'yyyy-MM-dd') === today
    );

    if (existingLog) return;

    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const insight: CompletionInsight = {
      date: now.toISOString(),
      completion_method: 'tap',
      energy_level: energyLevel,
      mood_rating: mood,
      context_tags: [],
      time_to_complete: 0,
      difficulty_perceived: habit.difficulty_level,
    };

    // Log the completion
    dispatch(logHabitCompletion({
      habitId,
      completed: true,
      version,
      insight,
    }));

    // Award XP
    const baseXP = habit.xp_value || 10;
    const energyMatch = energyLevel >= habit.energy_requirement;
    const currentHour = now.getHours();
    const optimalTiming = habit.optimal_timing.some(window => {
      const startHour = parseInt(window.start.split(':')[0]);
      const endHour = parseInt(window.end.split(':')[0]);
      return currentHour >= startHour && currentHour <= endHour;
    });

    dispatch(awardXP({
      baseXP,
      source: `habit_${habitId}`,
      difficulty: habit.difficulty_level,
      energyMatch,
      timingBonus: optimalTiming,
      streakMultiplier: 1, // Would calculate based on streak
    }));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    loadInitialData().then(() => setRefreshing(false));
  }, []);

  const todayLogs = logs.filter(log => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return format(new Date(log.logged_at), 'yyyy-MM-dd') === today;
  });

  const completedToday = todayLogs.filter(log => log.completed).length;

  if (crisisMode) {
    return (
      <SafeAreaView style={[styles.container, styles.crisisMode]}>
        <View style={styles.crisisHeader}>
          <Text style={styles.crisisTitle}>Crisis Mode 🛡️</Text>
          <Text style={styles.crisisSubtitle}>Just the essentials. You've got this.</Text>
        </View>
        <ScrollView>
          {habits.filter(h => h.medical_priority).slice(0, 2).map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              todayLog={todayLogs.find(log => log.habit_id === habit.id)}
              onComplete={handleHabitComplete}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning! ✨</Text>
          <Text style={styles.subtitle}>
            {completedToday} of {habits.length} habits completed today
          </Text>
        </View>

        <XPDisplay />
        <AIInsightsPanel />
        <ConstellationView logs={logs} days={7} />

        <View style={styles.habitsSection}>
          <Text style={styles.sectionTitle}>Today's Habits</Text>
          {habits.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              todayLog={todayLogs.find(log => log.habit_id === habit.id)}
              onComplete={handleHabitComplete}
            />
          ))}
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
  crisisMode: {
    backgroundColor: '#2d1b69',
  },
  crisisHeader: {
    padding: 20,
    alignItems: 'center',
  },
  crisisTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  crisisSubtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
  },
  header: {
    padding: 20,
    paddingTop: 10,
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
    fontWeight: '500',
  },
  habitsSection: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
});