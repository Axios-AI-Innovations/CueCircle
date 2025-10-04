import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Brain, Clock, Zap, Heart, Shield, Edit, Settings, ArrowLeft } from 'lucide-react-native';
import { RootState } from '@/store';
import { PersonalProfile } from '@/types/advanced';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/utils/themeStyles';

export default function ProfileSettingsScreen() {
  const dispatch = useDispatch();
  const { personalProfile } = useSelector((state: RootState) => state.user);
  const { currentTheme } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  
  const styles = useMemo(() => createThemedStyles(currentTheme), [currentTheme]);

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
      case 'executive_function': return <Brain size={20} color={styles.successText.color} />;
      case 'time_blindness': return <Clock size={20} color={styles.accentText.color} />;
      case 'emotional_regulation': return <Heart size={20} color={styles.errorText.color} />;
      case 'working_memory': return <Zap size={20} color={styles.warningText.color} />;
      case 'attention_regulation': return <Shield size={20} color={styles.successText.color} />;
      default: return <Brain size={20} color={styles.successText.color} />;
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
            <ArrowLeft size={24} color={styles.title.color} />
          </TouchableOpacity>
          <Text style={styles.title}>Personal Profile</Text>
          <View style={styles.headerSpacer} />
        </View>
        
        <View style={styles.emptyState}>
          <Brain size={64} color={styles.emptyTitle.color} />
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
          <ArrowLeft size={24} color={styles.title.color} />
        </TouchableOpacity>
        <Text style={styles.title}>Personal Profile</Text>
        <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
          <Edit size={20} color={styles.successText.color} />
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
