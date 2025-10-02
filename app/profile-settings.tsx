import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Brain, Clock, Zap, Heart, Shield, Edit, Settings, ArrowLeft } from 'lucide-react-native';
import { RootState } from '@/store';
import { PersonalProfile } from '@/types/advanced';

export default function ProfileSettingsScreen() {
  const dispatch = useDispatch();
  const { personalProfile } = useSelector((state: RootState) => state.user);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditProfile = () => {
    router.push('/auth/adhd-profile');
  };

  const handleResetProfile = () => {
    Alert.alert(
      'Reset Profile',
      'Are you sure you want to reset your personal profile? This will remove all your personalized settings.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            // Reset profile logic would go here
            Alert.alert('Profile Reset', 'Your profile has been reset.');
          }
        }
      ]
    );
  };

  const getChallengeIcon = (type: string) => {
    switch (type) {
      case 'executive_function': return <Brain size={20} color="#48bb78" />;
      case 'time_blindness': return <Clock size={20} color="#805ad5" />;
      case 'emotional_regulation': return <Heart size={20} color="#e53e3e" />;
      case 'working_memory': return <Zap size={20} color="#ed8936" />;
      case 'attention_regulation': return <Shield size={20} color="#38a169" />;
      default: return <Brain size={20} color="#48bb78" />;
    }
  };

  const getChallengeTitle = (type: string) => {
    switch (type) {
      case 'executive_function': return 'Executive Function';
      case 'time_blindness': return 'Time Blindness';
      case 'emotional_regulation': return 'Emotional Regulation';
      case 'working_memory': return 'Working Memory';
      case 'attention_regulation': return 'Attention Regulation';
      default: return 'Unknown';
    }
  };

  const getSeverityText = (severity: number) => {
    switch (severity) {
      case 1: return 'Very Mild';
      case 2: return 'Mild';
      case 3: return 'Moderate';
      case 4: return 'Significant';
      case 5: return 'Severe';
      default: return 'Unknown';
    }
  };

  const getEnergyLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Very Low';
      case 2: return 'Low';
      case 3: return 'Moderate';
      case 4: return 'High';
      case 5: return 'Very High';
      default: return 'Unknown';
    }
  };

  const getMotivationTitle = (type: string) => {
    switch (type) {
      case 'novelty': return 'Novelty';
      case 'urgency': return 'Urgency';
      case 'interest': return 'Interest';
      case 'challenge': return 'Challenge';
      case 'social': return 'Social';
      default: return 'Unknown';
    }
  };

  if (!personalProfile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Personal Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.emptyState}>
          <Brain size={64} color="#48bb78" />
          <Text style={styles.emptyTitle}>No Profile Set Up</Text>
          <Text style={styles.emptySubtitle}>
            Create your personal profile to get personalized recommendations and accommodations.
          </Text>
          <TouchableOpacity style={styles.createButton} onPress={handleEditProfile}>
            <Text style={styles.createButtonText}>Create Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Profile</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Edit size={20} color="#48bb78" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Challenges Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Challenges</Text>
          <View style={styles.challengesList}>
            {personalProfile.challenges.map((challenge, index) => (
              <View key={index} style={styles.challengeItem}>
                <View style={styles.challengeHeader}>
                  <View style={styles.challengeIcon}>
                    {getChallengeIcon(challenge.type)}
                  </View>
                  <View style={styles.challengeInfo}>
                    <Text style={styles.challengeTitle}>
                      {getChallengeTitle(challenge.type)}
                    </Text>
                    <Text style={styles.challengeSeverity}>
                      Severity: {getSeverityText(challenge.severity)}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Energy Patterns Section */}
        {personalProfile.energy_patterns.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Energy Patterns</Text>
            <View style={styles.energyList}>
              {personalProfile.energy_patterns.map((pattern, index) => (
                <View key={index} style={styles.energyItem}>
                  <Text style={styles.energyTime}>{pattern.time_of_day}</Text>
                  <Text style={styles.energyLevel}>
                    {getEnergyLevelText(pattern.energy_level)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Motivation Styles Section */}
        {personalProfile.motivation_styles.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Motivation Styles</Text>
            <View style={styles.motivationList}>
              {personalProfile.motivation_styles.map((motivation, index) => (
                <View key={index} style={styles.motivationItem}>
                  <Text style={styles.motivationTitle}>
                    {getMotivationTitle(motivation.type)}
                  </Text>
                  <Text style={styles.motivationEffectiveness}>
                    Effectiveness: {motivation.effectiveness}/5
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Special Modes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Special Modes</Text>
          <View style={styles.modesList}>
            <View style={styles.modeItem}>
              <Text style={styles.modeTitle}>Crisis Mode</Text>
              <Text style={styles.modeStatus}>
                {personalProfile.crisis_mode_enabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
            <View style={styles.modeItem}>
              <Text style={styles.modeTitle}>Hyperfocus Mode</Text>
              <Text style={styles.modeStatus}>
                {personalProfile.hyperfocus_mode_enabled ? 'Enabled' : 'Disabled'}
              </Text>
            </View>
          </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  headerSpacer: {
    width: 40, // Same width as back button to center title
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  challengesList: {
    gap: 12,
  },
  challengeItem: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
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
  challengeSeverity: {
    fontSize: 14,
    color: '#a0aec0',
  },
  energyList: {
    gap: 8,
  },
  energyItem: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  energyTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  energyLevel: {
    fontSize: 14,
    color: '#a0aec0',
  },
  motivationList: {
    gap: 8,
  },
  motivationItem: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 12,
  },
  motivationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  motivationEffectiveness: {
    fontSize: 12,
    color: '#a0aec0',
  },
  modesList: {
    gap: 8,
  },
  modeItem: {
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  modeStatus: {
    fontSize: 14,
    color: '#a0aec0',
  },
});
