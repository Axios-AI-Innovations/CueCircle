import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { ChevronRight, ChevronLeft, Clock, Zap } from 'lucide-react-native';

interface HabitWizardProps {
  onComplete: () => void;
}

interface WizardData {
  identityGoal: string;
  habitTitle: string;
  cueType: 'time' | 'habit_stack';
  timeWindow?: { start: string; end: string };
  stackHabit?: string;
  starterVersion: string;
  backupVersion: string;
  category: string;
  isDoctorAssigned: boolean;
}

export function HabitWizard({ onComplete }: HabitWizardProps) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>({
    identityGoal: '',
    habitTitle: '',
    cueType: 'time',
    starterVersion: '',
    backupVersion: '',
    category: 'health',
    isDoctorAssigned: false,
  });

  const totalSteps = 6;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    // Here you would save the habit
    console.log('Creating habit:', data);
    onComplete();
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What do you want to feel more of?</Text>
            <Text style={styles.stepSubtitle}>
              Think about the identity you're building, not just the action.
            </Text>
            <View style={styles.optionsContainer}>
              {[
                'I want to feel more energized',
                'I want to feel more calm',
                'I want to feel more confident',
                'I want to feel more creative',
                'I want to feel more connected',
                'I want to feel more organized',
              ].map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    data.identityGoal === option && styles.selectedOption,
                  ]}
                  onPress={() => setData(prev => ({ ...prev, identityGoal: option }))}
                >
                  <Text style={[
                    styles.optionText,
                    data.identityGoal === option && styles.selectedOptionText,
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>What's the habit?</Text>
            <Text style={styles.stepSubtitle}>
              Describe the action that will help you feel {data.identityGoal.toLowerCase()}.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Drink a glass of water"
              placeholderTextColor="#718096"
              value={data.habitTitle}
              onChangeText={text => setData(prev => ({ ...prev, habitTitle: text }))}
              multiline
            />
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>When will you do this?</Text>
            <Text style={styles.stepSubtitle}>
              Pick your cue - what will remind you to do this habit?
            </Text>
            <View style={styles.cueOptions}>
              <TouchableOpacity
                style={[
                  styles.cueOption,
                  data.cueType === 'time' && styles.selectedCue,
                ]}
                onPress={() => setData(prev => ({ ...prev, cueType: 'time' }))}
              >
                <Clock size={24} color={data.cueType === 'time' ? '#ffffff' : '#a0aec0'} />
                <Text style={[
                  styles.cueOptionText,
                  data.cueType === 'time' && styles.selectedCueText,
                ]}>
                  Time-based
                </Text>
                <Text style={styles.cueDescription}>
                  Set a flexible time window
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.cueOption,
                  data.cueType === 'habit_stack' && styles.selectedCue,
                ]}
                onPress={() => setData(prev => ({ ...prev, cueType: 'habit_stack' }))}
              >
                <Zap size={24} color={data.cueType === 'habit_stack' ? '#ffffff' : '#a0aec0'} />
                <Text style={[
                  styles.cueOptionText,
                  data.cueType === 'habit_stack' && styles.selectedCueText,
                ]}>
                  Habit Stack
                </Text>
                <Text style={styles.cueDescription}>
                  After an existing habit
                </Text>
              </TouchableOpacity>
            </View>

            {data.cueType === 'time' && (
              <View style={styles.timeInputs}>
                <TextInput
                  style={styles.timeInput}
                  placeholder="Start time"
                  placeholderTextColor="#718096"
                  value={data.timeWindow?.start || ''}
                  onChangeText={text => setData(prev => ({
                    ...prev,
                    timeWindow: { ...prev.timeWindow, start: text, end: prev.timeWindow?.end || '' }
                  }))}
                />
                <Text style={styles.timeSeparator}>to</Text>
                <TextInput
                  style={styles.timeInput}
                  placeholder="End time"
                  placeholderTextColor="#718096"
                  value={data.timeWindow?.end || ''}
                  onChangeText={text => setData(prev => ({
                    ...prev,
                    timeWindow: { ...prev.timeWindow, end: text, start: prev.timeWindow?.start || '' }
                  }))}
                />
              </View>
            )}

            {data.cueType === 'habit_stack' && (
              <TextInput
                style={styles.textInput}
                placeholder="After I..."
                placeholderTextColor="#718096"
                value={data.stackHabit || ''}
                onChangeText={text => setData(prev => ({ ...prev, stackHabit: text }))}
              />
            )}
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Start incredibly small ✨</Text>
            <Text style={styles.stepSubtitle}>
              What's the tiniest version? So small it feels almost silly NOT to do it.
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Drink one sip of water"
              placeholderTextColor="#718096"
              value={data.starterVersion}
              onChangeText={text => setData(prev => ({ ...prev, starterVersion: text }))}
              multiline
            />
            <Text style={styles.helpText}>
              💡 This is your "no excuses" version - perfect for low-energy days
            </Text>
          </View>
        );

      case 5:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Your backup plan 🛡️</Text>
            <Text style={styles.stepSubtitle}>
              For days when you're running on empty - what's the absolute minimum?
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Just hold the water glass"
              placeholderTextColor="#718096"
              value={data.backupVersion}
              onChangeText={text => setData(prev => ({ ...prev, backupVersion: text }))}
              multiline
            />
            <Text style={styles.helpText}>
              🤗 This protects your progress on tough days - you're still showing up!
            </Text>
          </View>
        );

      case 6:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Almost done! 🎉</Text>
            <Text style={styles.stepSubtitle}>
              Let's review your new habit:
            </Text>
            <View style={styles.reviewContainer}>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Identity Goal:</Text>
                <Text style={styles.reviewValue}>{data.identityGoal}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Habit:</Text>
                <Text style={styles.reviewValue}>{data.habitTitle}</Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>When:</Text>
                <Text style={styles.reviewValue}>
                  {data.cueType === 'time' 
                    ? `${data.timeWindow?.start} - ${data.timeWindow?.end}`
                    : `After: ${data.stackHabit}`
                  }
                </Text>
              </View>
              <View style={styles.reviewItem}>
                <Text style={styles.reviewLabel}>Starter Version:</Text>
                <Text style={styles.reviewValue}>{data.starterVersion}</Text>
              </View>
              {data.backupVersion && (
                <View style={styles.reviewItem}>
                  <Text style={styles.reviewLabel}>Backup Version:</Text>
                  <Text style={styles.reviewValue}>{data.backupVersion}</Text>
                </View>
              )}
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
          <TouchableOpacity style={styles.backButton} onPress={prevStep}>
            <ChevronLeft size={20} color="#a0aec0" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={[styles.nextButton, { marginLeft: step === 1 ? 0 : 12 }]}
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {step === totalSteps ? 'Create Habit' : 'Continue'}
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
    minHeight: 56,
    textAlignVertical: 'top',
  },
  cueOptions: {
    gap: 16,
    marginBottom: 24,
  },
  cueOption: {
    backgroundColor: '#2d3748',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  selectedCue: {
    borderColor: '#48bb78',
    backgroundColor: '#48bb7820',
  },
  cueOptionText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  selectedCueText: {
    color: '#48bb78',
  },
  cueDescription: {
    color: '#a0aec0',
    fontSize: 14,
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
  },
  timeSeparator: {
    color: '#a0aec0',
    fontSize: 16,
  },
  reviewContainer: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 20,
    gap: 16,
  },
  reviewItem: {
    gap: 4,
  },
  reviewLabel: {
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '500',
  },
  reviewValue: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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