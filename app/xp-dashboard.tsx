import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Animated, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Trophy, Zap, Target, Award, TrendingUp, Clock, Users } from 'lucide-react-native';
import { RootState } from '@/store';
import { 
  initializeXPSystem, 
  awardXP, 
  claimBonusPool, 
  unlockAchievement,
  updateStreakMultiplier,
  clearAchievementNotification
} from '@/store/slices/xpSlice';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/utils/themeStyles';

export default function XPDashboard() {
  const dispatch = useDispatch();
  const { xpSystem, recentXPGains, levelUpAnimation, achievementUnlocked } = useSelector((state: RootState) => state.xp);
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { currentTheme } = useTheme();
  
  const styles = useMemo(() => createThemedStyles(currentTheme), [currentTheme]);
  const [showBonusPools, setShowBonusPools] = useState(false);

  // Initialize XP system if needed
  useEffect(() => {
    if (currentUser && !xpSystem) {
      dispatch(initializeXPSystem({ userId: currentUser.id }));
    }
  }, [currentUser, xpSystem, dispatch]);


  if (!xpSystem) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>XP Dashboard</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading XP System...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Safety check for XP system values
  const safeTotalXP = (xpSystem.total_xp === null || xpSystem.total_xp === undefined || isNaN(xpSystem.total_xp)) ? 0 : Number(xpSystem.total_xp);
  const safeLevel = (xpSystem.level === null || xpSystem.level === undefined || isNaN(xpSystem.level)) ? 1 : Number(xpSystem.level);
  const safeXPToNext = (xpSystem.xp_to_next_level === null || xpSystem.xp_to_next_level === undefined || isNaN(xpSystem.xp_to_next_level)) ? 100 : Number(xpSystem.xp_to_next_level);
  
  const progressPercentage = Math.max(0, Math.min(100, ((safeTotalXP - Math.pow(safeLevel - 1, 2) * 100) / safeXPToNext) * 100));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>XP Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Level Overview */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View style={styles.levelInfo}>
              <Text style={styles.levelText}>Level {safeLevel}</Text>
              <Text style={styles.xpText}>{safeTotalXP.toLocaleString()} XP</Text>
            </View>
            <View style={styles.levelIcon}>
              <Star size={32} color="#f6ad55" />
            </View>
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${progressPercentage}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {safeXPToNext - (safeTotalXP - Math.pow(safeLevel - 1, 2) * 100)} XP to next level
            </Text>
          </View>
        </View>

        {/* Recent XP Gains */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent XP Gains</Text>
          {recentXPGains.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No recent XP gains</Text>
            </View>
          ) : (
            <View style={styles.xpGainsList}>
              {recentXPGains.slice(0, 5).map((gain, index) => (
                <View key={index} style={styles.xpGainItem}>
                  <View style={styles.xpGainInfo}>
                    <Text style={styles.xpGainSource}>{gain.source}</Text>
                    <Text style={styles.xpGainTime}>
                      {new Date(gain.timestamp).toLocaleTimeString()}
                    </Text>
                  </View>
                  <View style={styles.xpGainAmount}>
                    <Text style={styles.xpGainNumber}>+{gain.amount}</Text>
                    {gain.multiplier && gain.multiplier > 1 && (
                      <Text style={styles.multiplierText}>×{gain.multiplier}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bonus Pools */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.sectionHeader}
            onPress={() => setShowBonusPools(!showBonusPools)}
          >
            <Text style={styles.sectionTitle}>Bonus Pools</Text>
            <Text style={styles.toggleText}>
              {showBonusPools ? 'Hide' : 'Show'} ({xpSystem.bonus_pools.length})
            </Text>
          </TouchableOpacity>
          
          {showBonusPools && (
            <View style={styles.bonusPoolsList}>
              {xpSystem.bonus_pools.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>No active bonus pools</Text>
                </View>
              ) : (
                xpSystem.bonus_pools.map((pool, index) => (
                  <View key={index} style={styles.bonusPoolItem}>
                    <View style={styles.bonusPoolInfo}>
                      <Text style={styles.bonusPoolName}>{pool.name}</Text>
                      <Text style={styles.bonusPoolDescription}>{pool.description}</Text>
                      <Text style={styles.bonusPoolExpiry}>
                        Expires: {new Date(pool.expires_at).toLocaleDateString()}
                      </Text>
                    </View>
                    <TouchableOpacity 
                      style={styles.claimButton}
                      onPress={() => dispatch(claimBonusPool({ poolId: pool.id }))}
                    >
                      <Text style={styles.claimButtonText}>Claim</Text>
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

      </ScrollView>

      {/* Achievement Notification */}
      {achievementUnlocked && (
        <View style={styles.achievementNotification}>
          <View style={styles.achievementContent}>
            <Trophy size={32} color="#f6ad55" />
            <View style={styles.achievementText}>
              <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
              <Text style={styles.achievementName}>{achievementUnlocked.name}</Text>
            </View>
            <TouchableOpacity 
              style={styles.dismissButton}
              onPress={() => dispatch(clearAchievementNotification())}
            >
              <Text style={styles.dismissText}>×</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  placeholder: {
    width: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#a0aec0',
  },
  scrollView: {
    flex: 1,
  },
  levelCard: {
    backgroundColor: '#2d3748',
    margin: 20,
    borderRadius: 16,
    padding: 20,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  levelInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  xpText: {
    fontSize: 16,
    color: '#a0aec0',
  },
  levelIcon: {
    backgroundColor: '#f6ad5520',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  toggleText: {
    fontSize: 14,
    color: '#48bb78',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0aec0',
  },
  xpGainsList: {
    paddingHorizontal: 20,
  },
  xpGainItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  xpGainInfo: {
    flex: 1,
  },
  xpGainSource: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  xpGainTime: {
    fontSize: 12,
    color: '#a0aec0',
  },
  xpGainAmount: {
    alignItems: 'flex-end',
  },
  xpGainNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#48bb78',
  },
  multiplierText: {
    fontSize: 12,
    color: '#f6ad55',
    fontWeight: '600',
  },
  bonusPoolsList: {
    paddingHorizontal: 20,
  },
  bonusPoolItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  bonusPoolInfo: {
    flex: 1,
  },
  bonusPoolName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  bonusPoolDescription: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 4,
  },
  bonusPoolExpiry: {
    fontSize: 12,
    color: '#f6ad55',
  },
  claimButton: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  claimButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  achievementNotification: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    backgroundColor: '#f6ad55',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  achievementText: {
    marginLeft: 12,
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
  },
  dismissButton: {
    backgroundColor: '#ffffff20',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  dismissText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
