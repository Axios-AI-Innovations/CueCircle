import { XPSystem, BonusPool } from '@/types/advanced';

export interface XPCalculation {
  baseXP: number;
  difficultyMultiplier: number;
  energyMatchBonus: boolean;
  timingBonus: boolean;
  streakMultiplier: number;
  podSupportBonus: boolean;
  totalXP: number;
  bonusPools: BonusPool[];
}

export const calculateXP = (
  baseXP: number,
  options: {
    difficulty?: number;
    energyMatch?: boolean;
    timingBonus?: boolean;
    streakMultiplier?: number;
    podSupport?: boolean;
    personalProfile?: any;
  } = {}
): XPCalculation => {
  const {
    difficulty = 1,
    energyMatch = false,
    timingBonus = false,
    streakMultiplier = 1,
    podSupport = false,
    personalProfile
  } = options;

  let totalXP = baseXP;
  let difficultyMultiplier = 1;
  const bonusPools: BonusPool[] = [];

  // Difficulty multiplier (1.0x to 2.0x)
  difficultyMultiplier = 1 + (difficulty - 1) * 0.2;
  totalXP *= difficultyMultiplier;

  // Energy match bonus (30% bonus)
  if (energyMatch) {
    totalXP *= 1.3;
  }

  // Timing bonus (20% bonus)
  if (timingBonus) {
    totalXP *= 1.2;
  }

  // Streak multiplier
  totalXP *= streakMultiplier;

  // Pod support bonus (15% bonus)
  if (podSupport) {
    totalXP *= 1.15;
  }

  // Create bonus pools based on conditions
  if (energyMatch && personalProfile) {
    bonusPools.push({
      type: 'energy_match',
      accumulated_xp: Math.floor(baseXP * 0.3),
      multiplier: 1.5,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
    });
  }

  if (timingBonus) {
    bonusPools.push({
      type: 'timing',
      accumulated_xp: Math.floor(baseXP * 0.2),
      multiplier: 1.3,
      expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(), // 12 hours
    });
  }

  if (podSupport) {
    bonusPools.push({
      type: 'pod_support',
      accumulated_xp: Math.floor(baseXP * 0.15),
      multiplier: 1.2,
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours
    });
  }

  // Consistency bonus pool (accumulates over time)
  if (streakMultiplier > 1) {
    bonusPools.push({
      type: 'consistency',
      accumulated_xp: Math.floor(baseXP * (streakMultiplier - 1)),
      multiplier: streakMultiplier,
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // 48 hours
    });
  }

  return {
    baseXP,
    difficultyMultiplier,
    energyMatch,
    timingBonus,
    streakMultiplier,
    podSupportBonus: podSupport,
    totalXP: Math.floor(totalXP),
    bonusPools,
  };
};

export const calculateStreakMultiplier = (streak: number): number => {
  if (streak < 3) return 1;
  if (streak < 7) return 1.2;
  if (streak < 14) return 1.5;
  if (streak < 30) return 2.0;
  if (streak < 60) return 2.5;
  return 3.0; // Max 3x multiplier
};

export const calculateLevel = (totalXP: number): number => {
  // Exponential leveling: Level = floor(sqrt(totalXP / 100)) + 1
  return Math.floor(Math.sqrt(totalXP / 100)) + 1;
};

export const calculateXPToNextLevel = (currentLevel: number): number => {
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  return nextLevelXP - currentLevelXP;
};

export const getLevelProgress = (totalXP: number, currentLevel: number): number => {
  const currentLevelXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  const progressXP = totalXP - currentLevelXP;
  const levelXP = nextLevelXP - currentLevelXP;
  return Math.min(progressXP / levelXP, 1);
};

export const getLevelTitle = (level: number): string => {
  if (level < 5) return 'Beginner';
  if (level < 10) return 'Explorer';
  if (level < 20) return 'Builder';
  if (level < 30) return 'Master';
  if (level < 50) return 'Legend';
  return 'Mythic';
};

export const getLevelColor = (level: number): string => {
  if (level < 5) return '#48bb78'; // Green
  if (level < 10) return '#805ad5'; // Purple
  if (level < 20) return '#ed8936'; // Orange
  if (level < 30) return '#e53e3e'; // Red
  if (level < 50) return '#38a169'; // Teal
  return '#f6ad55'; // Gold
};

export const shouldAwardBonusPool = (
  xpSystem: XPSystem,
  conditions: {
    energyMatch?: boolean;
    timingBonus?: boolean;
    podSupport?: boolean;
    streakLength?: number;
  }
): BonusPool[] => {
  const bonusPools: BonusPool[] = [];

  // Check if user already has these bonus pools
  const existingTypes = xpSystem.bonus_pools.map(pool => pool.type);

  if (conditions.energyMatch && !existingTypes.includes('energy_match')) {
    bonusPools.push({
      type: 'energy_match',
      accumulated_xp: 50,
      multiplier: 1.5,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  if (conditions.timingBonus && !existingTypes.includes('timing')) {
    bonusPools.push({
      type: 'timing',
      accumulated_xp: 30,
      multiplier: 1.3,
      expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
    });
  }

  if (conditions.podSupport && !existingTypes.includes('pod_support')) {
    bonusPools.push({
      type: 'pod_support',
      accumulated_xp: 25,
      multiplier: 1.2,
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(),
    });
  }

  if (conditions.streakLength && conditions.streakLength >= 7 && !existingTypes.includes('consistency')) {
    bonusPools.push({
      type: 'consistency',
      accumulated_xp: 100,
      multiplier: 1.5,
      expires_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
    });
  }

  return bonusPools;
};

export const getXPBreakdown = (calculation: XPCalculation): string[] => {
  const breakdown: string[] = [];
  
  breakdown.push(`Base XP: ${calculation.baseXP}`);
  
  if (calculation.difficultyMultiplier > 1) {
    breakdown.push(`Difficulty Bonus: +${Math.round((calculation.difficultyMultiplier - 1) * 100)}%`);
  }
  
  if (calculation.energyMatch) {
    breakdown.push('Energy Match: +30%');
  }
  
  if (calculation.timingBonus) {
    breakdown.push('Timing Bonus: +20%');
  }
  
  if (calculation.streakMultiplier > 1) {
    breakdown.push(`Streak Multiplier: ${calculation.streakMultiplier.toFixed(1)}x`);
  }
  
  if (calculation.podSupportBonus) {
    breakdown.push('Pod Support: +15%');
  }
  
  breakdown.push(`Total: ${calculation.totalXP} XP`);
  
  return breakdown;
};

export default {
  calculateXP,
  calculateStreakMultiplier,
  calculateLevel,
  calculateXPToNextLevel,
  getLevelProgress,
  getLevelTitle,
  getLevelColor,
  shouldAwardBonusPool,
  getXPBreakdown,
};