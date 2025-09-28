import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle,
  withSequence,
  runOnJS
} from 'react-native-reanimated';
import { RootState } from '@/store';
import { clearLevelUpAnimation } from '@/store/slices/xpSlice';
import { Star, Zap, Trophy } from 'lucide-react-native';

export function XPDisplay() {
  const dispatch = useDispatch();
  const { xpSystem, levelUpAnimation, recentXPGains } = useSelector((state: RootState) => state.xp);
  
  const levelScale = useSharedValue(1);
  const xpBarWidth = useSharedValue(0);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (xpSystem) {
      const currentLevelXP = Math.pow(xpSystem.level - 1, 2) * 100;
      const nextLevelXP = Math.pow(xpSystem.level, 2) * 100;
      const progressXP = xpSystem.total_xp - currentLevelXP;
      const totalNeededXP = nextLevelXP - currentLevelXP;
      
      xpBarWidth.value = withSpring((progressXP / totalNeededXP) * 100);
    }
  }, [xpSystem?.total_xp]);

  useEffect(() => {
    if (levelUpAnimation) {
      levelScale.value = withSequence(
        withSpring(1.3, { damping: 10 }),
        withSpring(1, { damping: 15 })
      );
      glowOpacity.value = withSequence(
        withSpring(1),
        withSpring(0, {}, () => {
          runOnJS(dispatch)(clearLevelUpAnimation());
        })
      );
    }
  }, [levelUpAnimation]);

  const levelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: levelScale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const xpBarAnimatedStyle = useAnimatedStyle(() => ({
    width: `${xpBarWidth.value}%`,
  }));

  if (!xpSystem) return null;

  const currentLevelXP = Math.pow(xpSystem.level - 1, 2) * 100;
  const nextLevelXP = Math.pow(xpSystem.level, 2) * 100;
  const progressXP = xpSystem.total_xp - currentLevelXP;
  const totalNeededXP = nextLevelXP - currentLevelXP;

  return (
    <View style={styles.container}>
      <View style={styles.levelContainer}>
        <Animated.View style={[styles.levelBadge, levelAnimatedStyle]}>
          <Animated.View style={[styles.levelGlow, glowAnimatedStyle]} />
          <Star size={16} color="#ffffff" />
          <Text style={styles.levelText}>{xpSystem.level}</Text>
        </Animated.View>
        
        <View style={styles.xpInfo}>
          <Text style={styles.xpText}>
            {progressXP.toLocaleString()} / {totalNeededXP.toLocaleString()} XP
          </Text>
          <View style={styles.xpBar}>
            <Animated.View style={[styles.xpBarFill, xpBarAnimatedStyle]} />
          </View>
        </View>
      </View>

      {xpSystem.bonus_pools.length > 0 && (
        <View style={styles.bonusPoolsContainer}>
          {xpSystem.bonus_pools.map((pool, index) => (
            <View key={pool.type} style={styles.bonusPool}>
              <Zap size={12} color="#ed8936" />
              <Text style={styles.bonusPoolText}>
                {pool.accumulated_xp} {pool.type}
              </Text>
              <Text style={styles.bonusMultiplier}>×{pool.multiplier}</Text>
            </View>
          ))}
        </View>
      )}

      {recentXPGains.length > 0 && (
        <View style={styles.recentGains}>
          {recentXPGains.slice(0, 3).map((gain, index) => (
            <View key={index} style={styles.xpGain}>
              <Text style={styles.xpGainAmount}>+{gain.amount}</Text>
              {gain.multiplier && (
                <Text style={styles.xpGainMultiplier}>×{gain.multiplier.toFixed(1)}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    margin: 20,
    marginBottom: 0,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48bb78',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 16,
    gap: 4,
  },
  levelGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: '#48bb78',
    borderRadius: 24,
    opacity: 0,
  },
  levelText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  xpInfo: {
    flex: 1,
  },
  xpText: {
    color: '#a0aec0',
    fontSize: 12,
    marginBottom: 4,
  },
  xpBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 4,
  },
  bonusPoolsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  bonusPool: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ed893620',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  bonusPoolText: {
    color: '#ed8936',
    fontSize: 10,
    fontWeight: '500',
  },
  bonusMultiplier: {
    color: '#ed8936',
    fontSize: 10,
    fontWeight: '700',
  },
  recentGains: {
    flexDirection: 'row',
    gap: 8,
  },
  xpGain: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48bb7820',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    gap: 2,
  },
  xpGainAmount: {
    color: '#48bb78',
    fontSize: 10,
    fontWeight: '600',
  },
  xpGainMultiplier: {
    color: '#48bb78',
    fontSize: 8,
    fontWeight: '500',
  },
});