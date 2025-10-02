import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Trophy, Star, Zap, Heart, Shield, Target } from 'lucide-react-native';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { xpService, AchievementDefinition } from '@/utils/xpService';

export default function AchievementsScreen() {
  const { xpSystem } = useSelector((state: RootState) => state.xp);
  const [achievements, setAchievements] = useState<AchievementDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAchievements, setUserAchievements] = useState<string[]>([]);

  useEffect(() => {
    loadAchievements();
  }, []);

  const loadAchievements = async () => {
    try {
      const availableAchievements = await xpService.getAvailableAchievements();
      setAchievements(availableAchievements);
      
      if (xpSystem?.user_id) {
        const userAchievementsData = await xpService.getUserAchievements(xpSystem.user_id);
        const unlockedIds = userAchievementsData.map(ua => ua.achievement_id);
        setUserAchievements(unlockedIds);
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return '#48bb78';
      case 'rare': return '#805ad5';
      case 'epic': return '#ed8936';
      case 'legendary': return '#f6ad55';
      default: return '#a0aec0';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Star size={16} color="#48bb78" />;
      case 'rare': return <Trophy size={16} color="#805ad5" />;
      case 'epic': return <Zap size={16} color="#ed8936" />;
      case 'legendary': return <Target size={16} color="#f6ad55" />;
      default: return <Star size={16} color="#a0aec0" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'consistency': return <Zap size={20} color="#48bb78" />;
      case 'growth': return <Star size={20} color="#805ad5" />;
      case 'support': return <Heart size={20} color="#e53e3e" />;
      case 'resilience': return <Shield size={20} color="#38a169" />;
      case 'discovery': return <Target size={20} color="#f6ad55" />;
      default: return <Star size={20} color="#a0aec0" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'consistency': return 'Consistency';
      case 'growth': return 'Growth';
      case 'support': return 'Support';
      case 'resilience': return 'Resilience';
      case 'discovery': return 'Discovery';
      default: return 'Other';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Achievements</Text>
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48bb78" />
          <Text style={styles.loadingText}>Loading achievements...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const unlockedCount = userAchievements.length;
  const totalCount = achievements.length;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Achievements</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress Summary */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Trophy size={24} color="#f6ad55" />
            <Text style={styles.progressTitle}>Achievement Progress</Text>
          </View>
          <Text style={styles.progressText}>
            {unlockedCount} of {totalCount} achievements unlocked
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill,
                { width: `${(unlockedCount / totalCount) * 100}%` }
              ]}
            />
          </View>
        </View>

        {/* Achievements List */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>All Achievements</Text>
          
          {achievements.map((achievement) => {
            const isUnlocked = userAchievements.includes(achievement.id);
            const rarityColor = getRarityColor(achievement.rarity);
            
            return (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  isUnlocked && styles.unlockedAchievement,
                  { borderColor: isUnlocked ? rarityColor : '#4a5568' }
                ]}
              >
                <View style={styles.achievementHeader}>
                  <View style={styles.achievementIcon}>
                    <Text style={styles.achievementEmoji}>{achievement.icon}</Text>
                  </View>
                  
                  <View style={styles.achievementInfo}>
                    <View style={styles.achievementTitleRow}>
                      <Text style={[
                        styles.achievementTitle,
                        !isUnlocked && styles.lockedText
                      ]}>
                        {achievement.title}
                      </Text>
                      <View style={styles.rarityBadge}>
                        {getRarityIcon(achievement.rarity)}
                        <Text style={[styles.rarityText, { color: rarityColor }]}>
                          {achievement.rarity.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={[
                      styles.achievementDescription,
                      !isUnlocked && styles.lockedText
                    ]}>
                      {achievement.description}
                    </Text>
                    
                    <View style={styles.achievementMeta}>
                      <View style={styles.categoryBadge}>
                        {getCategoryIcon(achievement.category)}
                        <Text style={styles.categoryText}>
                          {getCategoryName(achievement.category)}
                        </Text>
                      </View>
                      
                      <View style={styles.xpBadge}>
                        <Text style={styles.xpText}>+{achievement.xp_reward} XP</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.achievementStatus}>
                    {isUnlocked ? (
                      <View style={[styles.statusIcon, { backgroundColor: rarityColor }]}>
                        <Trophy size={16} color="#ffffff" />
                      </View>
                    ) : (
                      <View style={styles.lockedIcon}>
                        <Text style={styles.lockedText}>🔒</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
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
  headerSpacer: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  scrollContent: {
    padding: 20,
  },
  progressCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  progressText: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f6ad55',
    borderRadius: 4,
  },
  achievementsSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  achievementCard: {
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#4a5568',
  },
  unlockedAchievement: {
    backgroundColor: '#2d374820',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4a5568',
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementEmoji: {
    fontSize: 24,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  lockedText: {
    color: '#718096',
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5568',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  rarityText: {
    fontSize: 10,
    fontWeight: '600',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#a0aec0',
    lineHeight: 20,
    marginBottom: 12,
  },
  achievementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5568',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    color: '#a0aec0',
    fontWeight: '500',
  },
  xpBadge: {
    backgroundColor: '#f6ad5520',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  xpText: {
    fontSize: 12,
    color: '#f6ad55',
    fontWeight: '600',
  },
  achievementStatus: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4a5568',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
