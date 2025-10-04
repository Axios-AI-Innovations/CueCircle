import { Achievement } from '@/types/advanced';

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'id' | 'unlocked_at' | 'progress'>[] = [
  // Consistency Achievements
  {
    title: 'First Steps',
    description: 'Complete your first habit',
    rarity: 'common',
    xp_reward: 50,
    category: 'consistency',
    max_progress: 1,
  },
  {
    title: 'Streak Master',
    description: 'Maintain a 7-day streak',
    rarity: 'rare',
    xp_reward: 200,
    category: 'consistency',
    max_progress: 7,
  },
  {
    title: 'Month Warrior',
    description: 'Maintain a 30-day streak',
    rarity: 'epic',
    xp_reward: 500,
    category: 'consistency',
    max_progress: 30,
  },
  {
    title: 'Habit Legend',
    description: 'Maintain a 100-day streak',
    rarity: 'legendary',
    xp_reward: 1000,
    category: 'consistency',
    max_progress: 100,
  },

  // Growth Achievements
  {
    title: 'Habit Builder',
    description: 'Create 5 different habits',
    rarity: 'common',
    xp_reward: 100,
    category: 'growth',
    max_progress: 5,
  },
  {
    title: 'Habit Architect',
    description: 'Create 20 different habits',
    rarity: 'rare',
    xp_reward: 300,
    category: 'growth',
    max_progress: 20,
  },
  {
    title: 'Level Up',
    description: 'Reach level 5',
    rarity: 'rare',
    xp_reward: 250,
    category: 'growth',
    max_progress: 5,
  },
  {
    title: 'XP Master',
    description: 'Reach level 10',
    rarity: 'epic',
    xp_reward: 500,
    category: 'growth',
    max_progress: 10,
  },

  // Support Achievements
  {
    title: 'Team Player',
    description: 'Join your first pod',
    rarity: 'common',
    xp_reward: 75,
    category: 'support',
    max_progress: 1,
  },
  {
    title: 'Encourager',
    description: 'Send 10 cheers to your pod partner',
    rarity: 'rare',
    xp_reward: 200,
    category: 'support',
    max_progress: 10,
  },
  {
    title: 'Body Double Pro',
    description: 'Complete 10 body doubling sessions',
    rarity: 'epic',
    xp_reward: 400,
    category: 'support',
    max_progress: 10,
  },
  {
    title: 'Pod Champion',
    description: 'Help your pod partner reach their goals',
    rarity: 'legendary',
    xp_reward: 750,
    category: 'support',
    max_progress: 1,
  },

  // Resilience Achievements
  {
    title: 'Comeback Kid',
    description: 'Return after missing a day',
    rarity: 'common',
    xp_reward: 100,
    category: 'resilience',
    max_progress: 1,
  },
  {
    title: 'Bounce Back',
    description: 'Return after missing 3 days',
    rarity: 'rare',
    xp_reward: 200,
    category: 'resilience',
    max_progress: 1,
  },
  {
    title: 'Unstoppable',
    description: 'Complete habits during a difficult week',
    rarity: 'epic',
    xp_reward: 300,
    category: 'resilience',
    max_progress: 1,
  },
  {
    title: 'Phoenix Rising',
    description: 'Return after a 30-day break',
    rarity: 'legendary',
    xp_reward: 500,
    category: 'resilience',
    max_progress: 1,
  },

  // Discovery Achievements
  {
    title: 'Explorer',
    description: 'Try 3 different habit categories',
    rarity: 'common',
    xp_reward: 75,
    category: 'discovery',
    max_progress: 3,
  },
  {
    title: 'Early Bird',
    description: 'Complete a habit before 8 AM',
    rarity: 'rare',
    xp_reward: 150,
    category: 'discovery',
    max_progress: 1,
  },
  {
    title: 'Night Owl',
    description: 'Complete a habit after 10 PM',
    rarity: 'rare',
    xp_reward: 150,
    category: 'discovery',
    max_progress: 1,
  },
  {
    title: 'Energy Master',
    description: 'Complete habits during your optimal energy times',
    rarity: 'epic',
    xp_reward: 300,
    category: 'discovery',
    max_progress: 10,
  },
  {
    title: 'Adaptive Genius',
    description: 'Use backup versions of habits 5 times',
    rarity: 'epic',
    xp_reward: 250,
    category: 'discovery',
    max_progress: 5,
  },
  {
    title: 'Habit Scientist',
    description: 'Discover your most effective habit patterns',
    rarity: 'legendary',
    xp_reward: 600,
    category: 'discovery',
    max_progress: 1,
  },
];

export const checkAchievements = (
  currentAchievements: Achievement[],
  userStats: {
    totalHabitsCompleted: number;
    currentStreak: number;
    maxStreak: number;
    habitsCreated: number;
    level: number;
    cheersSent: number;
    bodyDoublingSessions: number;
    daysSinceLastActivity: number;
    categoriesTried: string[];
    earlyMorningCompletions: number;
    lateNightCompletions: number;
    energyMatchedCompletions: number;
    backupVersionsUsed: number;
  }
): Achievement[] => {
  const newAchievements: Achievement[] = [];
  const unlockedIds = currentAchievements.map(a => a.id);

  ACHIEVEMENT_DEFINITIONS.forEach(definition => {
    if (unlockedIds.includes(definition.title.toLowerCase().replace(/\s+/g, '_'))) {
      return; // Already unlocked
    }

    let progress = 0;
    let shouldUnlock = false;

    switch (definition.title) {
      case 'First Steps':
        progress = Math.min(userStats.totalHabitsCompleted, 1);
        shouldUnlock = userStats.totalHabitsCompleted >= 1;
        break;
      
      case 'Streak Master':
        progress = Math.min(userStats.currentStreak, 7);
        shouldUnlock = userStats.currentStreak >= 7;
        break;
      
      case 'Month Warrior':
        progress = Math.min(userStats.currentStreak, 30);
        shouldUnlock = userStats.currentStreak >= 30;
        break;
      
      case 'Habit Legend':
        progress = Math.min(userStats.maxStreak, 100);
        shouldUnlock = userStats.maxStreak >= 100;
        break;
      
      case 'Habit Builder':
        progress = Math.min(userStats.habitsCreated, 5);
        shouldUnlock = userStats.habitsCreated >= 5;
        break;
      
      case 'Habit Architect':
        progress = Math.min(userStats.habitsCreated, 20);
        shouldUnlock = userStats.habitsCreated >= 20;
        break;
      
      case 'Level Up':
        progress = Math.min(userStats.level, 5);
        shouldUnlock = userStats.level >= 5;
        break;
      
      case 'XP Master':
        progress = Math.min(userStats.level, 10);
        shouldUnlock = userStats.level >= 10;
        break;
      
      case 'Team Player':
        // This would need to be tracked separately
        progress = 0;
        shouldUnlock = false;
        break;
      
      case 'Encourager':
        progress = Math.min(userStats.cheersSent, 10);
        shouldUnlock = userStats.cheersSent >= 10;
        break;
      
      case 'Body Double Pro':
        progress = Math.min(userStats.bodyDoublingSessions, 10);
        shouldUnlock = userStats.bodyDoublingSessions >= 10;
        break;
      
      case 'Comeback Kid':
        progress = userStats.daysSinceLastActivity > 1 ? 1 : 0;
        shouldUnlock = userStats.daysSinceLastActivity > 1;
        break;
      
      case 'Bounce Back':
        progress = userStats.daysSinceLastActivity > 3 ? 1 : 0;
        shouldUnlock = userStats.daysSinceLastActivity > 3;
        break;
      
      case 'Explorer':
        progress = Math.min(userStats.categoriesTried.length, 3);
        shouldUnlock = userStats.categoriesTried.length >= 3;
        break;
      
      case 'Early Bird':
        progress = Math.min(userStats.earlyMorningCompletions, 1);
        shouldUnlock = userStats.earlyMorningCompletions >= 1;
        break;
      
      case 'Night Owl':
        progress = Math.min(userStats.lateNightCompletions, 1);
        shouldUnlock = userStats.lateNightCompletions >= 1;
        break;
      
      case 'Energy Master':
        progress = Math.min(userStats.energyMatchedCompletions, 10);
        shouldUnlock = userStats.energyMatchedCompletions >= 10;
        break;
      
      case 'Adaptive Genius':
        progress = Math.min(userStats.backupVersionsUsed, 5);
        shouldUnlock = userStats.backupVersionsUsed >= 5;
        break;
    }

    if (shouldUnlock) {
      const achievement: Achievement = {
        id: definition.title.toLowerCase().replace(/\s+/g, '_'),
        ...definition,
        progress,
        unlocked_at: new Date().toISOString(),
      };
      newAchievements.push(achievement);
    }
  });

  return newAchievements;
};

export const getAchievementProgress = (achievement: Achievement, userStats: any): number => {
  // This would calculate current progress for achievements that aren't yet unlocked
  // Implementation depends on the specific achievement
  return 0;
};

export default {
  ACHIEVEMENT_DEFINITIONS,
  checkAchievements,
  getAchievementProgress,
};
