import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { setADHDProfile } from '@/store/slices/userSlice';
import { router } from 'expo-router';
import { Brain, Clock, Zap, Heart, Shield, Check } from 'lucide-react-native';

interface ADHDChallenge {
  type: 'executive_function' | 'time_blindness' | 'emotional_regulation' | 'working_memory' | 'attention_regulation';
  severity: 1 | 2 | 3 | 4 | 5;
}

export default function ADHDProfileScreen() {
  const dispatch = useDispatch();
  const [selectedChallenges, setSelectedChallenges] = useState<ADHDChallenge[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

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

  const handleComplete = () => {
    if (selectedChallenges.length === 0) {
      Alert.alert('No Challenges Selected', 'Please select at least one challenge to continue');
      return;
    }

    // Create ADHD profile
    const adhdProfile = {
      id: `adhd_${Date.now()}`,
      user_id: 'current_user', // This would come from auth state
      challenges: selectedChallenges,
      energy_patterns: [],
      motivation_styles: [],
      optimal_times: [],
      crisis_mode_enabled: false,
      hyperfocus_mode_enabled: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    dispatch(setADHDProfile(adhdProfile));

    Alert.alert(
      'Profile Complete! 🎉',
      'Your ADHD profile has been set up. CueCircle will now personalize your experience.',
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Brain size={32} color="#48bb78" />
            <Text style={styles.logoText}>CueCircle</Text>
          </View>
          <Text style={styles.title}>ADHD Profile Setup</Text>
          <Text style={styles.subtitle}>
            Help us understand your unique needs
          </Text>
        </View>

        <View style={styles.progress}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(currentStep / 2) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>Step {currentStep} of 2</Text>
        </View>

        {currentStep === 1 ? renderStep1() : renderStep2()}

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
              } else {
                handleComplete();
              }
            }}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 2 ? 'Complete Setup' : 'Continue'}
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
});
