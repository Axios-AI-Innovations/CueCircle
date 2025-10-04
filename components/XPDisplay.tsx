import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Star, Trophy, Zap, Target, Users } from 'lucide-react-native';
import { RootState } from '@/store';
import { clearLevelUpAnimation, clearAchievementNotification, initializeXPSystem } from '@/store/slices/xpSlice';

interface XPDisplayProps {
  showDetails?: boolean;
  onPress?: () => void;
}

export default function XPDisplay({ showDetails = false, onPress }: XPDisplayProps) {
  const dispatch = useDispatch();
  const { xpSystem, levelUpAnimation, achievementUnlocked } = useSelector((state: RootState) => state.xp || {});
  const { currentUser } = useSelector((state: RootState) => state.user || {});
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    console.log('XPDisplay: currentUser:', currentUser);
    console.log('XPDisplay: xpSystem:', xpSystem);
    if (currentUser && !xpSystem) {
      console.log('XPDisplay: Initializing XP system for user:', currentUser.id);
      dispatch(initializeXPSystem({ userId: currentUser.id }));
    }
  }, [currentUser, xpSystem, dispatch]);

  useEffect(() => {
    if (levelUpAnimation) {
      // Trigger level up animation
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();

      // Clear animation after delay
      setTimeout(() => {
        dispatch(clearLevelUpAnimation());
      }, 2000);
    }
  }, [levelUpAnimation]);

  if (!xpSystem) {
    return (
      <View style={styles.container}>
        <Text style={styles.noXPText}>XP System Loading...</Text>
      </View>
    );
  }

  // Additional safety check for corrupted XP system - but don't block rendering
  if (xpSystem.total_xp === null || xpSystem.level === null || xpSystem.xp_to_next_level === null) {
    console.log('XPDisplay: XP system has null values, reinitializing...');
    if (currentUser) {
      dispatch(initializeXPSystem({ userId: currentUser.id }));
    }
    // Don't return early - let the component render with fallback values
  }

  
  // Safety check for NaN and null values
  const safeTotalXP = (xpSystem.total_xp === null || xpSystem.total_xp === undefined || isNaN(xpSystem.total_xp)) ? 0 : Number(xpSystem.total_xp);
  const safeLevel = (xpSystem.level === null || xpSystem.level === undefined || isNaN(xpSystem.level)) ? 1 : Number(xpSystem.level);
  const safeXPToNext = (xpSystem.xp_to_next_level === null || xpSystem.xp_to_next_level === undefined || isNaN(xpSystem.xp_to_next_level)) ? 100 : Number(xpSystem.xp_to_next_level);
  
  const progressPercentage = Math.max(0, Math.min(100, ((safeTotalXP - Math.pow(safeLevel - 1, 2) * 100) / safeXPToNext) * 100));


  return (
    <TouchableOpacity 
      style={[styles.container, levelUpAnimation && styles.levelUpContainer]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Animated.View style={[styles.xpCard, { transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.xpHeader}>
          <View style={styles.levelInfo}>
            <Text style={styles.levelText}>Level {safeLevel}</Text>
            <Text style={styles.xpText}>{typeof safeTotalXP === 'number' ? safeTotalXP.toLocaleString() : '0'} XP</Text>
          </View>
          <View style={styles.levelIcon}>
            <Star size={24} color="#f6ad55" />
          </View>
        </View>
        
        {onPress && (
          <View style={styles.tapIndicator}>
            <Text style={styles.tapText}>Tap to view details</Text>
          </View>
        )}

        {showDetails && (
          <>
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(progressPercentage, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {Math.floor(Math.max(0, Math.min(100, progressPercentage)))}% to Level {safeLevel + 1}
              </Text>
            </View>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Trophy size={16} color="#ed8936" />
                <Text style={styles.statText}>{xpSystem.achievements.length} Achievements</Text>
              </View>
              <View style={styles.statItem}>
                <Zap size={16} color="#f6ad55" />
                <Text style={styles.statText}>{xpSystem.streak_multiplier}x Streak</Text>
              </View>
              {xpSystem.bonus_pools.length > 0 && (
                <View style={styles.statItem}>
                  <Target size={16} color="#48bb78" />
                  <Text style={styles.statText}>{xpSystem.bonus_pools.length} Bonus Pools</Text>
                </View>
              )}
            </View>
          </>
        )}
      </Animated.View>

      {/* Achievement Notification */}
      {achievementUnlocked && (
        <View style={styles.achievementNotification}>
          <View style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>🏆</Text>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Achievement Unlocked!</Text>
              <Text style={styles.achievementName}>{achievementUnlocked.title}</Text>
              <Text style={styles.achievementDescription}>{achievementUnlocked.description}</Text>
              <Text style={styles.achievementXP}>+{achievementUnlocked.xp_reward} XP</Text>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  noXPText: {
    color: '#a0aec0',
    fontSize: 14,
    textAlign: 'center',
    padding: 16,
  },
  xpCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4a5568',
  },
  levelUpContainer: {
    borderColor: '#f6ad55',
    backgroundColor: '#f6ad5520',
  },
  xpHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelInfo: {
    flex: 1,
  },
  levelText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  xpText: {
    fontSize: 14,
    color: '#a0aec0',
  },
  levelIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f6ad5520',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#f6ad55',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5568',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  achievementNotification: {
    position: 'absolute',
    top: -10,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  achievementCard: {
    backgroundColor: '#f6ad55',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    elevation: 8,
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 4,
  },
  achievementXP: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  dismissButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  tapIndicator: {
    marginTop: 8,
    alignItems: 'center',
  },
  tapText: {
    fontSize: 12,
    color: '#a0aec0',
    fontStyle: 'italic',
  },
});
