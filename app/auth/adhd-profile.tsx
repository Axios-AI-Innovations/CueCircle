import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { setPersonalProfile } from '@/store/slices/userSlice';
import { router } from 'expo-router';
import { Brain, Clock, Zap, Heart, Shield, Check, Sun, Moon, Star, Target } from 'lucide-react-native';
import { RootState } from '@/store';
import { PersonalProfile, EnergyPattern, MotivationStyle } from '@/types/advanced';

interface PersonalChallenge {
  type: 'executive_function' | 'time_blindness' | 'emotional_regulation' | 'working_memory' | 'attention_regulation';
  severity: 1 | 2 | 3 | 4 | 5;
}

export default function PersonalProfileScreen() {
  const dispatch = useDispatch();
  const [selectedChallenges, setSelectedChallenges] = useState<PersonalChallenge[]>([]);
  const [energyPatterns, setEnergyPatterns] = useState<EnergyPattern[]>([]);
  const [motivationStyles, setMotivationStyles] = useState<MotivationStyle[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

  const { currentUser } = useSelector((state: RootState) => state.user);

  const challenges = [
    {
      type: 'executive_function' as const,
      title: 'Executive Function',
      description: 'Planning, organizing, and starting tasks',
      icon: <Brain size={24} color="#48bb78" />,
    },
    {
      type: 'time_blindness' as const,
      title: 'Time Blindness',
      description: 'Difficulty tracking time and meeting deadlines',
      icon: <Clock size={24} color="#805ad5" />,
    },
    {
      type: 'emotional_regulation' as const,
      title: 'Emotional Regulation',
      description: 'Managing emotions and stress responses',
      icon: <Heart size={24} color="#e53e3e" />,
    },
    {
      type: 'working_memory' as const,
      title: 'Working Memory',
      description: 'Holding information in mind while completing tasks',
      icon: <Zap size={24} color="#ed8936" />,
    },
    {
      type: 'attention_regulation' as const,
      title: 'Attention Regulation',
      description: 'Focusing and shifting attention when needed',
      icon: <Shield size={24} color="#38a169" />,
    },
  ];

  const energyTimes = [
    { time: '6:00 AM', label: 'Early Morning', icon: <Sun size={20} color="#f6ad55" /> },
    { time: '9:00 AM', label: 'Morning', icon: <Sun size={20} color="#f6ad55" /> },
    { time: '12:00 PM', label: 'Midday', icon: <Sun size={20} color="#f6ad55" /> },
    { time: '3:00 PM', label: 'Afternoon', icon: <Sun size={20} color="#f6ad55" /> },
    { time: '6:00 PM', label: 'Evening', icon: <Moon size={20} color="#805ad5" /> },
    { time: '9:00 PM', label: 'Night', icon: <Moon size={20} color="#805ad5" /> },
  ];

  const motivationTypes = [
    {
      type: 'novelty' as const,
      title: 'Novelty',
      description: 'New experiences and variety',
      icon: <Star size={20} color="#48bb78" />,
    },
    {
      type: 'urgency' as const,
      title: 'Urgency',
      description: 'Deadlines and time pressure',
      icon: <Clock size={20} color="#e53e3e" />,
    },
    {
      type: 'interest' as const,
      title: 'Interest',
      description: 'Personal passion and curiosity',
      icon: <Heart size={20} color="#ed8936" />,
    },
    {
      type: 'challenge' as const,
      title: 'Challenge',
      description: 'Difficulty and growth',
      icon: <Target size={20} color="#805ad5" />,
    },
    {
      type: 'social' as const,
      title: 'Social',
      description: 'Community and connection',
      icon: <Zap size={20} color="#38a169" />,
    },
  ];

  const handleChallengeSelect = (challenge: typeof challenges[0]) => {
    const existingIndex = selectedChallenges.findIndex(c => c.type === challenge.type);
    
    if (existingIndex >= 0) {
      // Remove if already selected
      setSelectedChallenges(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      // Add with default severity
      setSelectedChallenges(prev => [...prev, { type: challenge.type, severity: 3 }]);
    }
  };

  const updateSeverity = (challengeType: string, severity: 1 | 2 | 3 | 4 | 5) => {
    setSelectedChallenges(prev => 
      prev.map(c => c.type === challengeType ? { ...c, severity } : c)
    );
  };

  const handleEnergyLevelSelect = (timeOfDay: string, energyLevel: 1 | 2 | 3 | 4 | 5) => {
    setEnergyPatterns(prev => {
      const existing = prev.find(p => p.time_of_day === timeOfDay);
      if (existing) {
        return prev.map(p => p.time_of_day === timeOfDay ? { ...p, energy_level: energyLevel } : p);
      } else {
        return [...prev, {
          time_of_day: timeOfDay,
          energy_level: energyLevel,
          consistency_score: 0,
          sample_size: 0,
        }];
      }
    });
  };

  const handleMotivationSelect = (motivationType: typeof motivationTypes[0]) => {
    const existingIndex = motivationStyles.findIndex(m => m.type === motivationType.type);
    
    if (existingIndex >= 0) {
      setMotivationStyles(prev => prev.filter((_, index) => index !== existingIndex));
    } else {
      setMotivationStyles(prev => [...prev, {
        type: motivationType.type,
        effectiveness: 3,
        context_dependent: false,
      }]);
    }
  };

  const handleComplete = () => {
    if (selectedChallenges.length === 0) {
      Alert.alert('No Challenges Selected', 'Please select at least one challenge to continue');
      return;
    }

    // Create personal profile
    const personalProfile: PersonalProfile = {
      id: `profile_${Date.now()}`,
      user_id: currentUser?.id || 'current_user',
      challenges: selectedChallenges,
      energy_patterns: energyPatterns,
      motivation_styles: motivationStyles,
      optimal_times: [],
      crisis_mode_enabled: false,
      hyperfocus_mode_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dispatch(setPersonalProfile(personalProfile));

    Alert.alert(
      'Profile Complete! 🎉',
      'Your personal profile has been set up. CueCircle will now personalize your experience.',
      [
        {
          text: 'Get Started',
          onPress: () => router.replace('/(tabs)')
        }
      ]
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What challenges do you face?</Text>
      <Text style={styles.stepSubtitle}>
        Select the areas where you'd like support. This helps CueCircle personalize your experience.
      </Text>
      
      <View style={styles.challengesList}>
        {challenges.map((challenge) => {
          const isSelected = selectedChallenges.some(c => c.type === challenge.type);
          return (
            <TouchableOpacity
              key={challenge.type}
              style={[styles.challengeCard, isSelected && styles.selectedChallenge]}
              onPress={() => handleChallengeSelect(challenge)}
            >
              <View style={styles.challengeHeader}>
                <View style={styles.challengeIcon}>
                  {challenge.icon}
                </View>
                <View style={styles.challengeInfo}>
                  <Text style={styles.challengeTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeDescription}>{challenge.description}</Text>
                </View>
                {isSelected && (
                  <Check size={20} color="#48bb78" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>How severe are these challenges?</Text>
      <Text style={styles.stepSubtitle}>
        Rate the severity of each selected challenge (1 = mild, 5 = severe)
      </Text>
      
      <View style={styles.severityList}>
        {selectedChallenges.map((challenge) => {
          const challengeInfo = challenges.find(c => c.type === challenge.type);
          return (
            <View key={challenge.type} style={styles.severityCard}>
              <View style={styles.severityHeader}>
                <View style={styles.severityIcon}>
                  {challengeInfo?.icon}
                </View>
                <Text style={styles.severityTitle}>{challengeInfo?.title}</Text>
              </View>
              
              <View style={styles.severityButtons}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.severityButton,
                      challenge.severity === level && styles.selectedSeverity
                    ]}
                    onPress={() => updateSeverity(challenge.type, level as 1 | 2 | 3 | 4 | 5)}
                  >
                    <Text style={[
                      styles.severityButtonText,
                      challenge.severity === level && styles.selectedSeverityText
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>When do you feel most energetic?</Text>
      <Text style={styles.stepSubtitle}>
        Rate your energy level at different times of day (1 = very low, 5 = very high)
      </Text>
      
      <View style={styles.energyList}>
        {energyTimes.map((timeSlot) => {
          const currentPattern = energyPatterns.find(p => p.time_of_day === timeSlot.time);
          return (
            <View key={timeSlot.time} style={styles.energyCard}>
              <View style={styles.energyHeader}>
                <View style={styles.energyIcon}>
                  {timeSlot.icon}
                </View>
                <View style={styles.energyInfo}>
                  <Text style={styles.energyTime}>{timeSlot.time}</Text>
                  <Text style={styles.energyLabel}>{timeSlot.label}</Text>
                </View>
              </View>
              
              <View style={styles.energyButtons}>
                {[1, 2, 3, 4, 5].map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.energyButton,
                      currentPattern?.energy_level === level && styles.selectedEnergy
                    ]}
                    onPress={() => handleEnergyLevelSelect(timeSlot.time, level as 1 | 2 | 3 | 4 | 5)}
                  >
                    <Text style={[
                      styles.energyButtonText,
                      currentPattern?.energy_level === level && styles.selectedEnergyText
                    ]}>
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>What motivates you most?</Text>
      <Text style={styles.stepSubtitle}>
        Select the motivation styles that work best for you
      </Text>
      
      <View style={styles.motivationList}>
        {motivationTypes.map((motivation) => {
          const isSelected = motivationStyles.some(m => m.type === motivation.type);
          return (
            <TouchableOpacity
              key={motivation.type}
              style={[styles.motivationCard, isSelected && styles.selectedMotivation]}
              onPress={() => handleMotivationSelect(motivation)}
            >
              <View style={styles.motivationHeader}>
                <View style={styles.motivationIcon}>
                  {motivation.icon}
                </View>
                <View style={styles.motivationInfo}>
                  <Text style={styles.motivationTitle}>{motivation.title}</Text>
                  <Text style={styles.motivationDescription}>{motivation.description}</Text>
                </View>
                {isSelected && (
                  <Check size={20} color="#48bb78" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Brain size={32} color="#48bb78" />
            <Text style={styles.logoText}>CueCircle</Text>
          </View>
          <Text style={styles.title}>Personal Profile Setup</Text>
          <Text style={styles.subtitle}>
            Help us understand your unique needs
          </Text>
        </View>

        <View style={styles.progress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(currentStep / 4) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Step {currentStep} of 4</Text>
        </View>

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <View style={styles.navigation}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.nextButton, { marginLeft: currentStep === 1 ? 0 : 12 }]}
            onPress={() => {
              if (currentStep === 1) {
                if (selectedChallenges.length === 0) {
                  Alert.alert('No Challenges Selected', 'Please select at least one challenge to continue');
                  return;
                }
                setCurrentStep(2);
              } else if (currentStep === 2) {
                setCurrentStep(3);
              } else if (currentStep === 3) {
                setCurrentStep(4);
              } else {
                handleComplete();
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 4 ? 'Complete Setup' : 'Continue'}
            </Text>
          </TouchableOpacity>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginLeft: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
  },
  progress: {
    marginBottom: 30,
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
    flex: 1,
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 20,
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
    marginBottom: 24,
  },
  challengesList: {
    gap: 12,
  },
  challengeCard: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedChallenge: {
    borderColor: '#48bb78',
    backgroundColor: '#48bb7820',
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  challengeIcon: {
    marginRight: 12,
  },
  challengeInfo: {
    flex: 1,
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  challengeDescription: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
  severityList: {
    gap: 16,
  },
  severityCard: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
  },
  severityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  severityIcon: {
    marginRight: 12,
  },
  severityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  severityButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  severityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a5568',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedSeverity: {
    backgroundColor: '#48bb78',
    borderColor: '#38a169',
  },
  severityButtonText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedSeverityText: {
    color: '#ffffff',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  backButton: {
    backgroundColor: '#2d3748',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Energy patterns styles
  energyList: {
    gap: 12,
  },
  energyCard: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
  },
  energyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  energyIcon: {
    marginRight: 12,
  },
  energyInfo: {
    flex: 1,
  },
  energyTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  energyLabel: {
    fontSize: 14,
    color: '#a0aec0',
  },
  energyButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  energyButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4a5568',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedEnergy: {
    backgroundColor: '#f6ad55',
    borderColor: '#ed8936',
  },
  energyButtonText: {
    color: '#a0aec0',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedEnergyText: {
    color: '#ffffff',
  },
  // Motivation styles
  motivationList: {
    gap: 12,
  },
  motivationCard: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMotivation: {
    borderColor: '#48bb78',
    backgroundColor: '#48bb7820',
  },
  motivationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  motivationIcon: {
    marginRight: 12,
  },
  motivationInfo: {
    flex: 1,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  motivationDescription: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
  },
});
