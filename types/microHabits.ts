export interface MicroGoal {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: 'health' | 'fitness' | 'learning' | 'productivity' | 'relationships' | 'creativity';
  target_outcome: string;
  estimated_timeline: number; // days
  total_micro_habits: number;
  completed_micro_habits: number;
  created_at: string;
  active: boolean;
}

export interface MicroHabit {
  id: string;
  micro_goal_id: string;
  user_id: string;
  title: string;
  description: string;
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  energy_requirement: 'none' | 'minimal' | 'low' | 'medium' | 'high';
  estimated_time: number; // seconds
  xp_reward: number;
  order_index: number;
  unlocked: boolean;
  completed: boolean;
  completion_method: 'tap' | 'swipe' | 'voice' | 'photo' | 'timer' | 'game';
  fun_variants: FunVariant[];
  created_at: string;
}

export interface FunVariant {
  id: string;
  name: string;
  description: string;
  method: 'gamified' | 'social' | 'creative' | 'competitive' | 'mindful';
  novelty_score: number;
  engagement_boost: number;
  unlocked: boolean;
}

export interface MicroReward {
  id: string;
  type: 'xp' | 'badge' | 'unlock' | 'celebration' | 'streak_bonus' | 'surprise';
  value: number;
  title: string;
  description: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  visual_effect: 'sparkle' | 'confetti' | 'glow' | 'bounce' | 'rainbow' | 'fireworks';
  sound_effect?: string;
  unlocks_content?: string[];
}

export interface NoveltySystem {
  user_id: string;
  current_theme: string;
  available_themes: Theme[];
  completion_methods: CompletionMethod[];
  last_novelty_refresh: string;
  novelty_preferences: NoveltyPreference[];
}

export interface Theme {
  id: string;
  name: string;
  description: string;
  color_scheme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
  };
  visual_style: 'minimal' | 'playful' | 'nature' | 'space' | 'retro' | 'neon';
  unlocked: boolean;
  unlock_condition: string;
}

export interface CompletionMethod {
  id: string;
  name: string;
  description: string;
  interaction_type: 'tap' | 'swipe' | 'shake' | 'voice' | 'draw' | 'breathe';
  fun_factor: number;
  accessibility_friendly: boolean;
  energy_required: 'none' | 'minimal' | 'low';
}

export interface NoveltyPreference {
  category: 'visual' | 'audio' | 'interaction' | 'reward' | 'challenge';
  preference_score: number;
  last_used: string;
}

export interface EnergyAdaptiveHabit {
  id: string;
  base_habit_id: string;
  energy_level: 'depleted' | 'low' | 'medium' | 'high' | 'hyperfocus';
  adapted_action: string;
  estimated_time: number;
  success_rate: number;
  user_rating: number;
}

export interface GamificationElement {
  id: string;
  type: 'mini_game' | 'challenge' | 'quest' | 'puzzle' | 'story';
  name: string;
  description: string;
  associated_habits: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  estimated_duration: number;
  xp_multiplier: number;
  fun_rating: number;
  unlocked: boolean;
}

export interface ProgressCelebration {
  id: string;
  trigger_type: 'completion' | 'streak' | 'milestone' | 'level_up' | 'goal_progress';
  trigger_value: number;
  celebration_type: 'animation' | 'sound' | 'haptic' | 'visual' | 'unlock';
  intensity: 'subtle' | 'moderate' | 'exciting' | 'epic';
  personalized: boolean;
  adhd_optimized: boolean;
}