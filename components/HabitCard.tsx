import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AdvancedHabit, HabitLog } from '@/types/advanced';
import { Check, Clock, Zap, Shield, Heart } from 'lucide-react-native';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface HabitCardProps {
  habit: AdvancedHabit;
  todayLog?: HabitLog;
  onComplete: (habitId: string, version: 'starter' | 'backup' | 'full') => void;
}

export function HabitCard({ habit, todayLog, onComplete }: HabitCardProps) {
  const scale = useSharedValue(1);
  const isCompleted = todayLog?.completed || false;

  const handlePress = (version: 'starter' | 'backup' | 'full' = 'starter') => {
    scale.value = withSpring(0.95, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onComplete(habit.id, version);
  };

  const showVersionOptions = () => {
    const options = ['Full Version', 'Starter Version'];
    if (habit.backup_version) {
      options.push('Backup Version (Low Energy)');
    }
    options.push('Cancel');

    Alert.alert(
      'How are you feeling today?',
      'Choose the version that matches your energy level',
      [
        { text: 'Full Version', onPress: () => handlePress('full') },
        { text: 'Starter Version', onPress: () => handlePress('starter') },
        ...(habit.backup_version ? [{ 
          text: 'Backup (Low Energy)', 
          onPress: () => handlePress('backup'),
          style: 'default'
        }] : []),
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.card, animatedStyle]}>
      <View style={styles.header}>
        <View style={styles.identityContainer}>
          <Text style={styles.identityText}>{habit.identity_goal}</Text>
          <Text style={styles.habitTitle}>{habit.title}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkButton, isCompleted && styles.completedButton]}
          onPress={showVersionOptions}
          disabled={isCompleted}
        >
          {isCompleted ? (
            <Check size={24} color="#ffffff" />
          ) : (
            <View style={styles.checkInner} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.details}>
        <View style={styles.cueContainer}>
          {habit.cue_type === 'time' ? (
            <Clock size={16} color="#805ad5" />
          ) : (
            <Zap size={16} color="#805ad5" />
          )}
          <Text style={styles.cueText}>
            {habit.cue_type === 'time' 
              ? `${habit.cue_details.time_window?.start} - ${habit.cue_details.time_window?.end}`
              : `After: ${habit.cue_details.stack_habit}`
            }
          </Text>
        </View>
        
        <View style={styles.versions}>
          <Text style={styles.starterText}>✨ {habit.starter_version}</Text>
          {habit.backup_version && (
            <Text style={styles.backupText}>🔄 Backup: {habit.backup_version}</Text>
          )}
          <Text style={styles.encouragementText}>
            Every step counts - you're building something amazing 💚
          </Text>
        </View>
      </View>
      
      {habit.is_doctor_assigned && (
        <View style={styles.doctorBadge}>
          <Heart size={12} color="#ffffff" />
          <Text style={styles.doctorText}>Doctor Assigned</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 8,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  identityContainer: {
    flex: 1,
    marginRight: 12,
  },
  identityText: {
    color: '#ed8936',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  habitTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  checkButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4a5568',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#718096',
  },
  completedButton: {
    backgroundColor: '#48bb78',
    borderColor: '#38a169',
  },
  checkInner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#a0aec0',
  },
  details: {
    marginBottom: 12,
  },
  cueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cueText: {
    color: '#a0aec0',
    fontSize: 14,
    marginLeft: 8,
  },
  versions: {
    gap: 4,
  },
  starterText: {
    color: '#48bb78',
    fontSize: 14,
    fontWeight: '500',
  },
  backupText: {
    color: '#ed8936',
    fontSize: 12,
    fontStyle: 'italic',
  },
  habitMeta: {
    marginTop: 4,
  },
  metaText: {
    color: '#718096',
    fontSize: 10,
    fontWeight: '500',
  },
  doctorBadge: {
    backgroundColor: '#805ad5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  doctorText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});