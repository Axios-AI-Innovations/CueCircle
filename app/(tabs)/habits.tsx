import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Heart } from 'lucide-react-native';
import { HabitWizard } from '@/components/HabitWizard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { HabitCard } from '@/components/HabitCard';
import { EnhancedRewardSystem } from '@/components/EnhancedRewardSystem';
import { MicroReward } from '@/types/microHabits';
import { logHabitCompletion } from '@/store/slices/habitsSlice';
import { awardXP, initializeXPSystem } from '@/store/slices/xpSlice';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/utils/themeStyles';

export default function HabitsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const [showWizard, setShowWizard] = useState(false);
  const [currentReward, setCurrentReward] = useState<MicroReward | null>(null);
  const { habits, logs } = useSelector((state: RootState) => state.habits);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { xpSystem } = useSelector((state: RootState) => state.xp);
  const { currentTheme } = useTheme();
  
  const styles = useMemo(() => createThemedStyles(currentTheme), [currentTheme]);
  
  const todayLogs = logs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.logged_at).toDateString() === today;
  });

  const handleHabitCompletion = (habitId: string, version: 'starter' | 'backup' | 'full') => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;

    const insight = {
      date: new Date().toISOString(),
      completion_method: 'tap' as const,
      energy_level: Math.floor(Math.random() * 5) + 1, // Mock energy level
      mood_rating: Math.floor(Math.random() * 5) + 1, // Mock mood rating
      context_tags: ['mobile', 'quick_completion'],
      time_to_complete: Math.floor(Math.random() * 60) + 10, // Mock completion time
      difficulty_perceived: Math.floor(Math.random() * 5) + 1, // Mock difficulty
    };

    dispatch(logHabitCompletion({
      habitId,
      completed: true,
      version,
      insight,
    }));

    // Initialize XP system if not already done
    if (!xpSystem && currentUser) {
      dispatch(initializeXPSystem({ userId: currentUser.id }));
    }

    // Award XP based on version and habit difficulty
    const baseXP = version === 'full' ? habit.xp_value : 
                   version === 'starter' ? Math.floor(habit.xp_value * 0.8) : 
                   Math.floor(habit.xp_value * 0.6);

    dispatch(awardXP({
      baseXP,
      source: `habit_${habitId}`,
      difficulty: habit.difficulty_level,
      energyMatch: Math.random() > 0.5, // Mock energy match
      timingBonus: Math.random() > 0.7, // Mock timing bonus
      streakMultiplier: xpSystem?.streak_multiplier || 1,
    }));

    // Trigger a reward
    const reward: MicroReward = {
      id: `reward_${Date.now()}`,
      type: 'xp',
      value: baseXP,
      title: 'Habit Completed! 🎉',
      description: `You completed the ${version} version!`,
      rarity: 'common',
      visual_effect: 'sparkle',
    };

    setCurrentReward(reward);
  };
  return (
    <>
      <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Your Habits</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowWizard(true)}
          >
            <Plus size={20} color={styles.addButtonText.color} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={48} color={styles.emptyTitle.color} />
              <Text style={styles.emptyTitle}>Start small, build steady 🌱</Text>
              <Text style={styles.emptyText}>
                Create habits that work with your brain, not against it. Every small step counts.
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setShowWizard(true)}
              >
                <Plus size={20} color={styles.startButtonText.color} />
                <Text style={styles.startButtonText}>Create Your First Habit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.habitsContainer}>
              {habits.map(habit => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  todayLog={todayLogs.find(log => log.habit_id === habit.id)}
                  onComplete={handleHabitCompletion}
                />
              ))}
            </View>
          )}
        </View>

      </ScrollView>
      </SafeAreaView>

      {showWizard && (
        <Modal
          visible={showWizard}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowWizard(false)}
              >
                <Text style={{ color: '#ffffff', fontSize: 16 }}>Done</Text>
              </TouchableOpacity>
            </View>
            <HabitWizard onComplete={() => setShowWizard(false)} />
          </View>
        </Modal>
      )}

      {/* Enhanced Reward System */}
      {currentReward && (
        <EnhancedRewardSystem
          reward={currentReward}
          onComplete={() => setCurrentReward(null)}
        />
      )}
    </>
  );
}