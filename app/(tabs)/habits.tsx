import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Heart } from 'lucide-react-native';
import { HabitWizard } from '@/components/HabitWizard';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { HabitCard } from '@/components/HabitCard';
import { EnhancedRewardSystem } from '@/components/EnhancedRewardSystem';
import { MicroReward } from '@/types/microHabits';

export default function HabitsScreen() {
  const dispatch = useDispatch();
  const [showWizard, setShowWizard] = useState(false);
  const [currentReward, setCurrentReward] = useState<MicroReward | null>(null);
  const { habits, logs } = useSelector((state: RootState) => state.habits);
  
  const todayLogs = logs.filter(log => {
    const today = new Date().toDateString();
    return new Date(log.logged_at).toDateString() === today;
  });
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
            <Plus size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Heart size={48} color="#48bb78" />
              <Text style={styles.emptyTitle}>Start small, build steady 🌱</Text>
              <Text style={styles.emptyText}>
                Create habits that work with your brain, not against it. Every small step counts.
              </Text>
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => setShowWizard(true)}
              >
                <Plus size={20} color="#ffffff" />
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
                  onComplete={() => {}}
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
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    backgroundColor: '#48bb78',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  microGoalButton: {
    backgroundColor: '#805ad5',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 320,
  },
  startButton: {
    backgroundColor: '#805ad5',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
    marginBottom: 16,
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  simpleButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  simpleButtonText: {
    color: '#a0aec0',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  goalSection: {
    marginBottom: 32,
  },
  goalHeader: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  goalInfo: {
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  goalProgress: {
    fontSize: 14,
    color: '#a0aec0',
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    overflow: 'hidden',
  },
  goalProgressFill: {
    height: '100%',
    backgroundColor: '#805ad5',
    borderRadius: 4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    padding: 8,
  },
  habitsContainer: {
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingTop: 60,
  },
  closeButton: {
    padding: 8,
  },
});