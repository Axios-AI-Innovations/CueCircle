import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './supabase';
import { XPSystem, Achievement, BonusPool } from '@/types/advanced';

export interface XPGain {
  id: string;
  user_id: string;
  amount: number;
  source: string;
  multiplier?: number;
  created_at: string;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  category: 'consistency' | 'growth' | 'support' | 'resilience' | 'discovery';
  requirements: {
    type: 'streak' | 'total_completions' | 'consecutive_days' | 'energy_match' | 'pod_support';
    value: number;
    timeframe?: string;
  }[];
  icon: string;
  color: string;
}

export const xpService = {
  // Initialize XP system for a new user
  async initializeXPSystem(userId: string): Promise<XPSystem> {
    const xpSystem: XPSystem = {
      user_id: userId,
      total_xp: 0,
      level: 1,
      xp_to_next_level: 100,
      streak_multiplier: 1,
      bonus_pools: [],
      achievements: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const xpRef = doc(db, 'xp_systems', userId);
    await setDoc(xpRef, {
      ...xpSystem,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });

    return xpSystem;
  },

  // Get user's XP system
  async getXPSystem(userId: string): Promise<XPSystem | null> {
    const xpRef = doc(db, 'xp_systems', userId);
    const xpSnap = await getDoc(xpRef);
    
    if (xpSnap.exists()) {
      return { id: xpSnap.id, ...xpSnap.data() } as XPSystem;
    }
    return null;
  },

  // Update XP system
  async updateXPSystem(userId: string, xpSystem: Partial<XPSystem>): Promise<void> {
    const xpRef = doc(db, 'xp_systems', userId);
    await updateDoc(xpRef, {
      ...xpSystem,
      updated_at: serverTimestamp(),
    });
  },

  // Award XP to user
  async awardXP(userId: string, xpGain: Omit<XPGain, 'id' | 'user_id' | 'created_at'>): Promise<void> {
    // Add XP gain record
    const gainsRef = collection(db, 'xp_gains');
    await addDoc(gainsRef, {
      ...xpGain,
      user_id: userId,
      created_at: serverTimestamp(),
    });

    // Update XP system
    const xpSystem = await this.getXPSystem(userId);
    if (xpSystem) {
      const newTotalXP = xpSystem.total_xp + xpGain.amount;
      const newLevel = this.calculateLevel(newTotalXP);
      
      await this.updateXPSystem(userId, {
        total_xp: newTotalXP,
        level: newLevel,
        xp_to_next_level: this.calculateXPToNextLevel(newLevel),
        updated_at: new Date().toISOString(),
      });
    }
  },

  // Get recent XP gains
  async getRecentXPGains(userId: string, limitCount: number = 10): Promise<XPGain[]> {
    const gainsRef = collection(db, 'xp_gains');
    const q = query(
      gainsRef,
      where('user_id', '==', userId),
      orderBy('created_at', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const gains: XPGain[] = [];
    querySnapshot.forEach((doc) => {
      gains.push({ id: doc.id, ...doc.data() } as XPGain);
    });

    return gains;
  },

  // Unlock achievement
  async unlockAchievement(userId: string, achievement: Achievement): Promise<void> {
    // Add achievement to user's achievements
    const achievementsRef = collection(db, 'user_achievements');
    await addDoc(achievementsRef, {
      user_id: userId,
      achievement_id: achievement.id,
      unlocked_at: serverTimestamp(),
    });

    // Update XP system with achievement
    const xpSystem = await this.getXPSystem(userId);
    if (xpSystem) {
      const newAchievements = [...xpSystem.achievements, achievement];
      const newTotalXP = xpSystem.total_xp + achievement.xp_reward;
      const newLevel = this.calculateLevel(newTotalXP);

      await this.updateXPSystem(userId, {
        achievements: newAchievements,
        total_xp: newTotalXP,
        level: newLevel,
        xp_to_next_level: this.calculateXPToNextLevel(newLevel),
        updated_at: new Date().toISOString(),
      });
    }
  },

  // Check and unlock achievements based on user progress
  async checkAchievements(userId: string, progressData: {
    streak?: number;
    totalCompletions?: number;
    consecutiveDays?: number;
    energyMatches?: number;
    podSupport?: number;
  }): Promise<Achievement[]> {
    const achievements = await this.getAvailableAchievements();
    const userAchievements = await this.getUserAchievements(userId);
    const unlockedAchievements: Achievement[] = [];

    for (const achievementDef of achievements) {
      // Skip if already unlocked
      if (userAchievements.some(ua => ua.achievement_id === achievementDef.id)) {
        continue;
      }

      let shouldUnlock = true;
      for (const requirement of achievementDef.requirements) {
        let currentValue = 0;
        
        switch (requirement.type) {
          case 'streak':
            currentValue = progressData.streak || 0;
            break;
          case 'total_completions':
            currentValue = progressData.totalCompletions || 0;
            break;
          case 'consecutive_days':
            currentValue = progressData.consecutiveDays || 0;
            break;
          case 'energy_match':
            currentValue = progressData.energyMatches || 0;
            break;
          case 'pod_support':
            currentValue = progressData.podSupport || 0;
            break;
        }

        if (currentValue < requirement.value) {
          shouldUnlock = false;
          break;
        }
      }

      if (shouldUnlock) {
        const achievement: Achievement = {
          id: achievementDef.id,
          title: achievementDef.title,
          description: achievementDef.description,
          rarity: achievementDef.rarity,
          xp_reward: achievementDef.xp_reward,
          unlocked_at: new Date().toISOString(),
          category: achievementDef.category,
          progress: 100,
          max_progress: 100,
        };

        await this.unlockAchievement(userId, achievement);
        unlockedAchievements.push(achievement);
      }
    }

    return unlockedAchievements;
  },

  // Get available achievements
  async getAvailableAchievements(): Promise<AchievementDefinition[]> {
    // In a real app, this would fetch from Firestore
    // For now, return predefined achievements
    return [
      {
        id: 'first_habit',
        title: 'Getting Started',
        description: 'Complete your first habit',
        rarity: 'common',
        xp_reward: 50,
        category: 'growth',
        requirements: [{ type: 'total_completions', value: 1 }],
        icon: '🎯',
        color: '#48bb78',
      },
      {
        id: 'streak_7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        rarity: 'rare',
        xp_reward: 200,
        category: 'consistency',
        requirements: [{ type: 'streak', value: 7 }],
        icon: '🔥',
        color: '#ed8936',
      },
      {
        id: 'streak_30',
        title: 'Monthly Master',
        description: 'Maintain a 30-day streak',
        rarity: 'epic',
        xp_reward: 1000,
        category: 'consistency',
        requirements: [{ type: 'streak', value: 30 }],
        icon: '👑',
        color: '#805ad5',
      },
      {
        id: 'pod_supporter',
        title: 'Team Player',
        description: 'Send 10 encouragements to your pod',
        rarity: 'rare',
        xp_reward: 300,
        category: 'support',
        requirements: [{ type: 'pod_support', value: 10 }],
        icon: '🤝',
        color: '#38a169',
      },
      {
        id: 'energy_master',
        title: 'Energy Optimizer',
        description: 'Complete 20 habits during your peak energy times',
        rarity: 'epic',
        xp_reward: 500,
        category: 'resilience',
        requirements: [{ type: 'energy_match', value: 20 }],
        icon: '⚡',
        color: '#f6ad55',
      },
    ];
  },

  // Get user's achievements
  async getUserAchievements(userId: string): Promise<Array<{ achievement_id: string; unlocked_at: string }>> {
    const achievementsRef = collection(db, 'user_achievements');
    const q = query(
      achievementsRef,
      where('user_id', '==', userId)
    );

    const querySnapshot = await getDocs(q);
    const achievements: Array<{ achievement_id: string; unlocked_at: string }> = [];
    querySnapshot.forEach((doc) => {
      achievements.push(doc.data() as { achievement_id: string; unlocked_at: string });
    });

    return achievements;
  },

  // Helper functions
  calculateLevel(totalXP: number): number {
    return Math.floor(Math.sqrt(totalXP / 100)) + 1;
  },

  calculateXPToNextLevel(currentLevel: number): number {
    const nextLevelXP = Math.pow(currentLevel, 2) * 100;
    const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
    return nextLevelXP - currentLevelXP;
  },

  // Get leaderboard data
  async getLeaderboard(limitCount: number = 10): Promise<Array<{
    user_id: string;
    total_xp: number;
    level: number;
    rank: number;
  }>> {
    const xpRef = collection(db, 'xp_systems');
    const q = query(
      xpRef,
      orderBy('total_xp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    const leaderboard: Array<{
      user_id: string;
      total_xp: number;
      level: number;
      rank: number;
    }> = [];

    let rank = 1;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        user_id: doc.id,
        total_xp: data.total_xp,
        level: data.level,
        rank: rank++,
      });
    });

    return leaderboard;
  },
};

export default xpService;
