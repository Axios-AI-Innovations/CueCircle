export interface User {
  id: string;
  email: string;
  name: string;
  pod_id?: string;
  created_at: string;
  email_verified?: boolean;
  preferences: {
    theme: 'light' | 'dark';
    font: 'default' | 'dyslexia-friendly';
    haptics_enabled: boolean;
  };
}

export interface Pod {
  id: string;
  name: string;
  members: string[];
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  identity_goal: string;
  cue_type: 'time' | 'habit_stack';
  cue_details: {
    time_window?: { start: string; end: string };
    stack_habit?: string;
  };
  starter_version: string;
  backup_version: string;
  category: string;
  is_doctor_assigned: boolean;
  created_at: string;
  active: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  user_id: string;
  completed: boolean;
  version: 'starter' | 'backup' | 'full';
  notes?: string;
  logged_at: string;
  synced: boolean;
}

export interface NudgeType {
  type: 'cheer' | 'join_me';
  from_user: string;
  to_user: string;
  habit_id?: string;
  message?: string;
  created_at: string;
}