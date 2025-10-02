export interface PersonalProfile {
  id: string;
  user_id: string;
  challenges: PersonalChallenge[];
  energy_patterns: EnergyPattern[];
  motivation_styles: MotivationStyle[];
  optimal_times: TimeWindow[];
  crisis_mode_enabled: boolean;
  hyperfocus_mode_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalChallenge {
  type: 'executive_function' | 'time_blindness' | 'emotional_regulation' | 'working_memory' | 'attention_regulation';
  severity: 1 | 2 | 3 | 4 | 5;
  accommodations: string[];
}

export interface EnergyPattern {
  time_of_day: string;
  energy_level: 1 | 2 | 3 | 4 | 5;
  consistency_score: number;
  sample_size: number;
}

export interface MotivationStyle {
  type: 'novelty' | 'urgency' | 'interest' | 'challenge' | 'social';
  effectiveness: number;
  context_dependent: boolean;
}

export interface TimeWindow {
  start: string;
  end: string;
  success_rate: number;
  energy_correlation: number;
}

export interface AdvancedHabit extends Habit {
  success_rate: number;
  completion_insights: CompletionInsight[];
  linked_habits: string[];
  difficulty_level: 1 | 2 | 3 | 4 | 5;
  xp_value: number;
  energy_requirement: 1 | 2 | 3 | 4 | 5;
  optimal_timing: TimeWindow[];
  behavioral_triggers: BehavioralTrigger[];
  resilience_score: number;
  medical_priority: boolean;
}

export interface CompletionInsight {
  date: string;
  completion_method: 'tap' | 'swipe' | 'voice' | 'photo';
  energy_level: number;
  mood_rating: number;
  context_tags: string[];
  time_to_complete: number;
  difficulty_perceived: number;
}

export interface BehavioralTrigger {
  type: 'location' | 'emotion' | 'time' | 'habit_stack' | 'energy_level';
  value: string;
  success_correlation: number;
  confidence_score: number;
}

export interface XPSystem {
  user_id: string;
  total_xp: number;
  level: number;
  xp_to_next_level: number;
  streak_multiplier: number;
  bonus_pools: BonusPool[];
  achievements: Achievement[];
}

export interface BonusPool {
  type: 'consistency' | 'difficulty' | 'timing' | 'energy_match' | 'pod_support';
  accumulated_xp: number;
  multiplier: number;
  expires_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  xp_reward: number;
  unlocked_at: string;
  category: 'consistency' | 'growth' | 'support' | 'resilience' | 'discovery';
  progress: number;
  max_progress: number;
}

export interface AIInsight {
  id: string;
  user_id: string;
  type: 'pattern_recognition' | 'recommendation' | 'prediction' | 'optimization';
  title: string;
  description: string;
  confidence_score: number;
  actionable_steps: string[];
  data_points: any[];
  created_at: string;
  dismissed: boolean;
  implemented: boolean;
}

export interface BehavioralPattern {
  pattern_type: 'timing' | 'energy' | 'context' | 'sequence' | 'environmental';
  description: string;
  strength: number;
  sample_size: number;
  statistical_significance: number;
  recommendations: string[];
}

export interface AdvancedPod extends Pod {
  accountability_score: number;
  engagement_metrics: EngagementMetric[];
  shared_goals: SharedGoal[];
  body_doubling_sessions: BodyDoublingSession[];
  encouragement_exchange: EncouragementExchange[];
  mutual_insights: MutualInsight[];
}

export interface EngagementMetric {
  date: string;
  interactions: number;
  support_given: number;
  support_received: number;
  session_time: number;
  quality_score: number;
}

export interface SharedGoal {
  id: string;
  title: string;
  description: string;
  target_date: string;
  progress_user_1: number;
  progress_user_2: number;
  collaborative_bonus: number;
  created_at: string;
}

export interface BodyDoublingSession {
  id: string;
  requested_by: string;
  accepted_by: string;
  duration: number;
  focus_area: string;
  completed: boolean;
  effectiveness_rating: number;
  created_at: string;
}

export interface EncouragementExchange {
  id: string;
  from_user: string;
  to_user: string;
  type: 'cheer' | 'milestone' | 'resilience' | 'breakthrough';
  message: string;
  impact_score: number;
  created_at: string;
}

export interface MutualInsight {
  id: string;
  insight_type: 'complementary_patterns' | 'shared_challenges' | 'mutual_strengths';
  description: string;
  actionable_suggestions: string[];
  confidence_score: number;
  created_at: string;
}

export interface AnalyticsDashboard {
  user_id: string;
  time_period: 'week' | 'month' | 'quarter' | 'year';
  success_patterns: SuccessPattern[];
  energy_correlations: EnergyCorrelation[];
  optimal_timing_analysis: OptimalTimingAnalysis;
  habit_performance_comparison: HabitPerformanceComparison[];
  personalized_insights: PersonalizedInsight[];
  medical_report_data: MedicalReportData;
}

export interface SuccessPattern {
  pattern_name: string;
  success_rate: number;
  trend_direction: 'improving' | 'stable' | 'declining';
  contributing_factors: string[];
  recommendations: string[];
}

export interface EnergyCorrelation {
  energy_level: number;
  completion_rate: number;
  optimal_habits: string[];
  time_windows: TimeWindow[];
}

export interface OptimalTimingAnalysis {
  best_performance_windows: TimeWindow[];
  worst_performance_windows: TimeWindow[];
  consistency_by_hour: { hour: number; success_rate: number }[];
  day_of_week_patterns: { day: string; success_rate: number }[];
}

export interface HabitPerformanceComparison {
  habit_id: string;
  habit_title: string;
  success_rate: number;
  consistency_score: number;
  difficulty_rating: number;
  xp_earned: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface PersonalizedInsight {
  insight_type: 'executive_function' | 'attention_regulation' | 'emotional_regulation' | 'working_memory';
  description: string;
  impact_on_habits: string[];
  coping_strategies: string[];
  success_correlation: number;
}

export interface MedicalReportData {
  report_period: string;
  overall_consistency: number;
  habit_categories: { category: string; success_rate: number }[];
  energy_patterns: EnergyPattern[];
  medication_correlations: MedicationCorrelation[];
  crisis_episodes: CrisisEpisode[];
  hyperfocus_sessions: HyperfocusSession[];
  recommendations_for_provider: string[];
}

export interface MedicationCorrelation {
  medication_name: string;
  dosage_time: string;
  habit_performance_impact: number;
  energy_level_correlation: number;
  side_effect_notes: string[];
}

export interface CrisisEpisode {
  date: string;
  duration: number;
  triggers: string[];
  coping_strategies_used: string[];
  habit_impact: string[];
  recovery_time: number;
}

export interface HyperfocusSession {
  date: string;
  duration: number;
  focus_area: string;
  productivity_rating: number;
  habits_completed: string[];
  energy_after: number;
}