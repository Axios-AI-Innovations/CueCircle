import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdvancedHabit, HabitLog, CompletionInsight } from '@/types/advanced';

interface HabitsState {
  habits: AdvancedHabit[];
  logs: HabitLog[];
  loading: boolean;
  error: string | null;
  syncQueue: HabitLog[];
  lastSync: string | null;
}

const initialState: HabitsState = {
  habits: [],
  logs: [],
  loading: false,
  error: null,
  syncQueue: [],
  lastSync: null,
};

export const syncHabits = createAsyncThunk(
  'habits/sync',
  async (_, { getState }) => {
    const state = getState() as any;
    const { syncQueue } = state.habits;
    
    // Sync queued logs to server
    const response = await fetch('/api/habits/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ logs: syncQueue }),
    });
    
    return response.json();
  }
);

export const analyzeHabitPatterns = createAsyncThunk(
  'habits/analyzePatterns',
  async (habitId: string) => {
    const response = await fetch(`/api/habits/${habitId}/analyze`);
    return response.json();
  }
);

const habitsSlice = createSlice({
  name: 'habits',
  initialState,
  reducers: {
    addHabit: (state, action: PayloadAction<AdvancedHabit>) => {
      state.habits.push(action.payload);
    },
    updateHabit: (state, action: PayloadAction<Partial<AdvancedHabit> & { id: string }>) => {
      const index = state.habits.findIndex(h => h.id === action.payload.id);
      if (index !== -1) {
        state.habits[index] = { ...state.habits[index], ...action.payload };
      }
    },
    logHabitCompletion: (state, action: PayloadAction<{
      habitId: string;
      completed: boolean;
      version: 'starter' | 'backup' | 'full';
      insight: CompletionInsight;
    }>) => {
      const { habitId, completed, version, insight } = action.payload;
      
      const newLog: HabitLog = {
        id: `offline_${Date.now()}_${Math.random()}`,
        habit_id: habitId,
        user_id: 'current_user', // Would be from auth state
        completed,
        version,
        notes: insight.context_tags.join(', '),
        logged_at: new Date().toISOString(),
        synced: false,
      };
      
      state.logs.push(newLog);
      state.syncQueue.push(newLog);
      
      // Update habit insights
      const habit = state.habits.find(h => h.id === habitId);
      if (habit) {
        habit.completion_insights.push(insight);
        
        // Recalculate success rate
        const recentLogs = state.logs
          .filter(log => log.habit_id === habitId)
          .slice(-30); // Last 30 completions
        
        habit.success_rate = recentLogs.filter(log => log.completed).length / recentLogs.length;
      }
    },
    updateHabitDifficulty: (state, action: PayloadAction<{
      habitId: string;
      difficulty: number;
      reason: string;
    }>) => {
      const habit = state.habits.find(h => h.id === action.payload.habitId);
      if (habit) {
        habit.difficulty_level = action.payload.difficulty as 1 | 2 | 3 | 4 | 5;
        habit.xp_value = habit.difficulty_level * 10; // Base XP calculation
      }
    },
    linkHabits: (state, action: PayloadAction<{
      primaryHabitId: string;
      linkedHabitId: string;
    }>) => {
      const habit = state.habits.find(h => h.id === action.payload.primaryHabitId);
      if (habit && !habit.linked_habits.includes(action.payload.linkedHabitId)) {
        habit.linked_habits.push(action.payload.linkedHabitId);
      }
    },
    clearSyncQueue: (state) => {
      state.syncQueue = [];
      state.lastSync = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(syncHabits.fulfilled, (state, action) => {
        state.syncQueue = [];
        state.lastSync = new Date().toISOString();
        // Update synced status for logs
        state.logs.forEach(log => {
          if (!log.synced) {
            log.synced = true;
          }
        });
      })
      .addCase(analyzeHabitPatterns.fulfilled, (state, action) => {
        const { habitId, patterns, recommendations } = action.payload;
        const habit = state.habits.find(h => h.id === habitId);
        if (habit) {
          habit.behavioral_triggers = patterns;
          // Update optimal timing based on analysis
          habit.optimal_timing = recommendations.optimalTiming || [];
        }
      });
  },
});

export const {
  addHabit,
  updateHabit,
  logHabitCompletion,
  updateHabitDifficulty,
  linkHabits,
  clearSyncQueue,
} = habitsSlice.actions;

export default habitsSlice.reducer;