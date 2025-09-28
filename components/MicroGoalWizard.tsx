import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronRight, ChevronLeft, Target, Zap, Clock, Star } from 'lucide-react-native';
import { MicroGoal, MicroHabit } from '@/types/microHabits';

interface MicroGoalWizardProps {
  onComplete: (goal: MicroGoal, habits: MicroHabit[]) => void;
  onCancel: () => void;
}

interface WizardData {
  title: string;
  category: string;
  targetOutcome: string;
  timeline: number;
  currentSituation: string;
  energyLevel: string;
  preferences: string[];
}

const GOAL_TEMPLATES = {
  'weight_loss': {
    title: 'Lose Weight & Feel Amazing',
    habits: [
      { title: 'Drink one sip of water', energy: 'none', time: 5 },
      { title: 'Stand up for 10 seconds', energy: 'none', time: 10 },
      { title: 'Take one deep breath', energy: 'none', time: 15 },
      { title: 'Look at a healthy food', energy: 'minimal', time: 5 },
      { title: 'Put on workout clothes', energy: 'minimal', time: 30 },
      { title: 'Walk to the kitchen', energy: 'minimal', time: 20 },
      { title: 'Open a fitness app', energy: 'minimal', time: 10 },
      { title: 'Do 1 jumping jack', energy: 'low', time: 5 },
      { title: 'Eat one bite of vegetables', energy: 'low', time: 30 },
      { title: 'Walk for 1 minute', energy: 'low', time: 60 },
    ]
  },
  'learn_skill': {
    title: 'Master a New Skill',
    habits: [
      { title: 'Open learning app', energy: 'none', time: 5 },
      { title: 'Read one sentence', energy: 'none', time: 10 },
      { title: 'Watch 30 seconds of tutorial', energy: 'minimal', time: 30 },
      { title: 'Take one note', energy: 'minimal', time: 20 },
      { title: 'Practice for 1 minute', energy: 'low', time: 60 },
    ]
  },
  'productivity': {
    title: 'Become Super Productive',
    habits: [
      { title: 'Open task list', energy: 'none', time: 5 },
      { title: 'Write one word', energy: 'none', time: 10 },
      { title: 'Clear one item from desk', energy: 'minimal', time: 30 },
      { title: 'Set 5-minute timer', energy: 'minimal', time: 10 },
      { title: 'Complete one tiny task', energy: 'low', time: 300 },
    ]
  }
};

export function MicroGoalWizard({ onComplete, onCancel }: MicroGoalWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    title: '',
    category: '',
    targetOutcome: '',
    timeline: 30,
    currentSituation: '',
    energyLevel: 'low',
    preferences: [],
  });

  const totalSteps = 4;

  const generateMicroHabits = (template: any): MicroHabit[] => {
    return template.habits.map((habit: any, index: number) => ({
      id: `micro_${Date.now()}_${index}`,
      micro_goal_id: `goal_${Date.now()}`,
      user_id: 'current_user',
      title: habit.title,
      description: `A tiny step towards ${data.targetOutcome}`,
      difficulty_level: habit.energy === 'none' ? 1 : habit.energy === 'minimal' ? 2 : 3,
      energy_requirement: habit.energy,
      estimated_time: habit.time,
      xp_reward: habit.energy === 'none' ? 5 : habit.energy === 'minimal' ? 10 : 15,
      order_index: index,
      unlocked: index < 3, // First 3 unlocked
      completed: false,
      completion_method: 'tap',
      fun_variants: [
        {
          id: `variant_${index}_1`,
          name: 'Quick Tap',
          description: 'Just tap to complete',
          method: 'gamified',
          novelty_score: 1,
          engagement_boost: 1.1,
          unlocked: true,
        },
        {
          id: `variant_${index}_2`,
          name: 'Victory Swipe',
          description: 'Swipe right for victory!',
          method: 'gamified',
          novelty_score: 2,
          engagement_boost: 1.2,
          unlocked: false,
        }
      ],
      created_at: new Date().toISOString(),
    }));
  };

  const handleComplete = () => {
    const template = GOAL_TEMPLATES[data.category as keyof typeof GOAL_TEMPLATES];
    
    const goal: MicroGoal = {
      id: `goal_${Date.now()}`,
      user_id: 'current_user',
      title: data.title || template.title,
      description: `Break down your goal into tiny, achievable steps`,
      category: data.category as any,
      target_outcome: data.targetOutcome,
      estimated_timeline: data.timeline,
      total_micro_habits: template.habits.length,
      completed_micro_habits: 0,
      created_at: new Date().toISOString(),
      active: true,
    };

    const habits = generateMicroHabits(template);
    onComplete(goal, habits);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your big goal? 🎯</Text>
            <Text style={styles.stepSubtitle}>
              We'll break it down into 100+ tiny, fun steps!
            </Text>
            <View style={styles.optionsContainer}>
              {Object.entries(GOAL_TEMPLATES).map(([key, template]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    data.category === key && styles.selectedOption,
                  ]}
                  onPress={() => setData(prev => ({ ...prev, category: key }))}
                >
                  <Text style={[
                    styles.optionText,
                    data.category === key && styles.selectedOptionText,
                  ]}>
                    {template.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your specific outcome? ✨</Text>
            <Text style={styles.stepSubtitle}>
              Be specific! "Lose 10 pounds" or "Learn Spanish basics"
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Lose 15 pounds and feel confident"
              placeholderTextColor="#718096"
              value={data.targetOutcome}
              onChangeText={text => setData(prev => ({ ...prev, targetOutcome: text }))}
              multiline
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's your energy like? ⚡</Text>
            <Text style={styles.stepSubtitle}>
              We'll create habits that match your energy levels
            </Text>
            <View style={styles.energyOptions}>
              {[
                { key: 'depleted', label: 'Often Depleted', desc: 'Need super tiny steps', color: '#e53e3e' },
                { key: 'low', label: 'Usually Low', desc: 'Small, gentle habits', color: '#ed8936' },
                { key: 'medium', label: 'Sometimes Good', desc: 'Mix of easy and medium', color: '#48bb78' },
                { key: 'high', label: 'Often Energetic', desc: 'Can handle bigger steps', color: '#38a169' },
              ].map(option => (
                <TouchableOpacity
                  key={option.key}
                  style={[
                    styles.energyOption,
                    data.energyLevel === option.key && styles.selectedEnergyOption,
                    { borderColor: option.color }
                  ]}
                  onPress={() => setData(prev => ({ ...prev, energyLevel: option.key }))}
                >
                  <Text style={[
                    styles.energyLabel,
                    data.energyLevel === option.key && { color: option.color }
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={styles.energyDesc}>{option.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Ready to start! 🚀</Text>
            <Text style={styles.stepSubtitle}>
              We've created {GOAL_TEMPLATES[data.category as keyof typeof GOAL_TEMPLATES]?.habits.length || 10} micro-habits for you
            </Text>
            <View style={styles.previewContainer}>
              <View style={styles.previewHeader}>
                <Target size={20} color="#48bb78" />
                <Text style={styles.previewTitle}>Your Micro-Habits Preview</Text>
              </View>
              {GOAL_TEMPLATES[data.category as keyof typeof GOAL_TEMPLATES]?.habits.slice(0, 5).map((habit, index) => (
                <View key={index} style={styles.previewHabit}>
                  <View style={styles.previewNumber}>
                    <Text style={styles.previewNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.previewHabitText}>{habit.title}</Text>
                  <View style={styles.previewReward}>
                    <Star size={12} color="#ed8936" />
                    <Text style={styles.previewRewardText}>+{habit.energy === 'none' ? 5 : 10} XP</Text>
                  </View>
                </View>
              ))}
              <Text style={styles.previewMore}>...and many more!</Text>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.progress}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill,
              { width: `${(step / totalSteps) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>Step {step} of {totalSteps}</Text>
      </View>

      {renderStep()}

      <View style={styles.navigationContainer}>
        {step > 1 && (
          <TouchableOpacity style={styles.backButton} onPress={() => setStep(step - 1)}>
            <ChevronLeft size={20} color="#a0aec0" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.nextButton, { marginLeft: step === 1 ? 0 : 12 }]}
          onPress={step === totalSteps ? handleComplete : () => setStep(step + 1)}
        >
          <Text style={styles.nextButtonText}>
            {step === totalSteps ? 'Create My Journey' : 'Continue'}
          </Text>
          <ChevronRight size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  progress: {
    padding: 20,
    paddingBottom: 10,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#4a5568',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 2,
  },
  progressText: {
    color: '#a0aec0',
    fontSize: 14,
    textAlign: 'center',
  },
  stepContainer: {
    padding: 20,
    paddingTop: 40,
    minHeight: 400,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#48bb78',
    backgroundColor: '#48bb7820',
  },
  optionText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#48bb78',
  },
  textInput: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  energyOptions: {
    gap: 12,
  },
  energyOption: {
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEnergyOption: {
    backgroundColor: '#4a556820',
  },
  energyLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  energyDesc: {
    color: '#a0aec0',
    fontSize: 14,
  },
  previewContainer: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  previewTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewHabit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  previewNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#48bb78',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewNumberText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  previewHabitText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  previewReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewRewardText: {
    color: '#ed8936',
    fontSize: 12,
    fontWeight: '600',
  },
  previewMore: {
    color: '#a0aec0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  backButtonText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48bb78',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});