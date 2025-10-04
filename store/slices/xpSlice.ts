import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { XPSystem, Achievement, BonusPool } from '@/types/advanced';

interface XPState {
  xpSystem: XPSystem | null;
  recentXPGains: Array<{
    amount: number;
    source: string;
    timestamp: string;
    multiplier?: number;
  }>;
  levelUpAnimation: boolean;
  achievementUnlocked: Achievement | null;
}

const initialState: XPState = {
  xpSystem: null,
  recentXPGains: [],
  levelUpAnimation: false,
  achievementUnlocked: null,
};

const calculateLevel = (totalXP: number): number => {
  // Exponential leveling: Level = floor(sqrt(totalXP / 100))
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

const calculateXPToNextLevel = (currentLevel: number): number => {
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  return nextLevelXP - currentLevelXP;
};

const xpSlice = createSlice({
  name: 'xp',
  initialState,
  reducers: {
    initializeXPSystem: (state, action: PayloadAction<{ userId: string }>) => {
      // Only initialize if not already initialized or if user_id is different
      if (!state.xpSystem || state.xpSystem.user_id !== action.payload.userId) {
        state.xpSystem = {
          user_id: action.payload.userId,
          total_xp: 0,
          level: 1,
          xp_to_next_level: 100,
          streak_multiplier: 1,
          bonus_pools: [],
          achievements: [],
        };
      }
    },
    awardXP: (state, action: PayloadAction<{
      baseXP: number;
      source: string;
      difficulty?: number;
      energyMatch?: boolean;
      timingBonus?: boolean;
      streakMultiplier?: number;
    }>) => {
      if (!state.xpSystem) return;
      
      const { baseXP, source, difficulty = 1, energyMatch = false, timingBonus = false, streakMultiplier = 1 } = action.payload;
      
      let totalXP = baseXP;
      let multiplier = 1;
      
      // Apply difficulty multiplier
      multiplier *= (1 + (difficulty - 1) * 0.2);
      
      // Apply energy match bonus
      if (energyMatch) multiplier *= 1.3;
      
      // Apply timing bonus
      if (timingBonus) multiplier *= 1.2;
      
      // Apply streak multiplier
      multiplier *= streakMultiplier;
      
      totalXP = Math.floor(baseXP * multiplier);
      
      
      const previousLevel = state.xpSystem.level;
      state.xpSystem.total_xp += totalXP;
      state.xpSystem.level = calculateLevel(state.xpSystem.total_xp);
      state.xpSystem.xp_to_next_level = calculateXPToNextLevel(state.xpSystem.level);
      
      
      // Check for level up
      if (state.xpSystem.level > previousLevel) {
        state.levelUpAnimation = true;
      }
      
      // Record XP gain
      state.recentXPGains.unshift({
        amount: totalXP,
        source,
        timestamp: new Date().toISOString(),
        multiplier: multiplier > 1 ? multiplier : undefined,
      });
      
      // Keep only last 10 XP gains
      state.recentXPGains = state.recentXPGains.slice(0, 10);
    },
    addBonusPool: (state, action: PayloadAction<BonusPool>) => {
      if (!state.xpSystem) return;
      
      const existingPool = state.xpSystem.bonus_pools.find(pool => pool.type === action.payload.type);
      if (existingPool) {
        existingPool.accumulated_xp += action.payload.accumulated_xp;
        existingPool.multiplier = Math.max(existingPool.multiplier, action.payload.multiplier);
      } else {
        state.xpSystem.bonus_pools.push(action.payload);
      }
    },
    claimBonusPool: (state, action: PayloadAction<{ type: BonusPool['type'] }>) => {
      if (!state.xpSystem) return;
      
      const poolIndex = state.xpSystem.bonus_pools.findIndex(pool => pool.type === action.payload.type);
      if (poolIndex !== -1) {
        const pool = state.xpSystem.bonus_pools[poolIndex];
        const bonusXP = Math.floor(pool.accumulated_xp * pool.multiplier);
        
        state.xpSystem.total_xp += bonusXP;
        state.xpSystem.level = calculateLevel(state.xpSystem.total_xp);
        state.xpSystem.xp_to_next_level = calculateXPToNextLevel(state.xpSystem.level);
        
        state.recentXPGains.unshift({
          amount: bonusXP,
          source: `${pool.type}_bonus`,
          timestamp: new Date().toISOString(),
          multiplier: pool.multiplier,
        });
        
        state.xpSystem.bonus_pools.splice(poolIndex, 1);
      }
    },
    unlockAchievement: (state, action: PayloadAction<Achievement>) => {
      if (!state.xpSystem) return;
      
      const achievement = action.payload;
      state.xpSystem.achievements.push(achievement);
      state.achievementUnlocked = achievement;
      
      // Award achievement XP
      state.xpSystem.total_xp += achievement.xp_reward;
      state.xpSystem.level = calculateLevel(state.xpSystem.total_xp);
      state.xpSystem.xp_to_next_level = calculateXPToNextLevel(state.xpSystem.level);
      
      state.recentXPGains.unshift({
        amount: achievement.xp_reward,
        source: `achievement_${achievement.id}`,
        timestamp: new Date().toISOString(),
      });
    },
    updateStreakMultiplier: (state, action: PayloadAction<number>) => {
      if (!state.xpSystem) return;
      state.xpSystem.streak_multiplier = action.payload;
    },
    clearLevelUpAnimation: (state) => {
      state.levelUpAnimation = false;
    },
    clearAchievementNotification: (state) => {
      state.achievementUnlocked = null;
    },
    resetXPSystem: (state, action: PayloadAction<{ userId: string }>) => {
      state.xpSystem = {
        user_id: action.payload.userId,
        total_xp: 0,
        level: 1,
        xp_to_next_level: 100,
        streak_multiplier: 1,
        bonus_pools: [],
        achievements: [],
      };
      state.recentXPGains = [];
      state.levelUpAnimation = false;
      state.achievementUnlocked = null;
    },
  },
});

export const {
  initializeXPSystem,
  awardXP,
  addBonusPool,
  claimBonusPool,
  unlockAchievement,
  updateStreakMultiplier,
  clearLevelUpAnimation,
  clearAchievementNotification,
  resetXPSystem,
} = xpSlice.actions;

export default xpSlice.reducer;