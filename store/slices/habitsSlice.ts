import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdvancedHabit, HabitLog, CompletionInsight } from '@/types/advanced';
import { habitsService, habitLogsService } from '@/utils/firebase';
import { awardXP } from './xpSlice';

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
  async (userId: string, { getState }) => {
    const state = getState() as any;
    const { syncQueue } = state.habits;
    
    // Sync queued logs to Firebase
    const promises = syncQueue.map(log => habitLogsService.logHabit(log));
    await Promise.all(promises);
    
    return { synced: syncQueue.length };
  }
);

export const loadHabits = createAsyncThunk(
  'habits/loadHabits',
  async (userId: string) => {
    const habits = await habitsService.getHabits(userId);
    return habits;
  }
);

export const createHabit = createAsyncThunk(
  'habits/createHabit',
  async (habit: Omit<AdvancedHabit, 'id' | 'created_at'>) => {
    const habitId = await habitsService.createHabit(habit);
    return { ...habit, id: habitId, created_at: new Date().toISOString() };
  }
);

export const completeHabitWithXP = createAsyncThunk(
  'habits/completeHabitWithXP',
  async (payload: {
    habitId: string;
    insight: CompletionInsight;
  }, { dispatch, getState }) => {
    const { habitId, insight } = payload;
    
    // First complete the habit
    dispatch(completeHabit({ habitId, insight }));
    
    // Then award XP
    const state = getState() as any;
    const habit = state.habits.habits.find((h: any) => h.id === habitId);
    
    if (habit) {
      const baseXP = habit.xp_value || 10;
      const difficulty = habit.difficulty_level || 1;
      const energyMatch = insight.energy_level >= 4;
      const timingBonus = new Date().getHours() >= 6 && new Date().getHours() <= 10;
      
      // Calculate streak multiplier
      const recentLogs = state.habits.logs
        .filter((log: any) => log.habit_id === habitId)
        .slice(-30);
      const streakCount = recentLogs.filter((log: any) => log.completed).length;
      const streakMultiplier = Math.min(1 + (streakCount * 0.1), 3);
      
      dispatch(awardXP({
        baseXP,
        source: `habit_${habitId}`,
        difficulty,
        energyMatch,
        timingBonus,
        streakMultiplier,
      }));
    }
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
        
        // Award XP for habit completion
        const baseXP = habit.xp_value || 10;
        const difficultyMultiplier = habit.difficulty_level || 1;
        const energyMatch = insight.energy_level >= 4; // High energy completion
        const timingBonus = new Date().getHours() >= 6 && new Date().getHours() <= 10; // Morning completion
        
        // Calculate streak multiplier (simplified)
        const streakCount = recentLogs.filter(log => log.completed).length;
        const streakMultiplier = Math.min(1 + (streakCount * 0.1), 3); // Max 3x multiplier
        
        // XP will be awarded via the XP slice when this action is dispatched
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
      .addCase(loadHabits.fulfilled, (state, action) => {
        state.habits = action.payload;
      })
      .addCase(createHabit.fulfilled, (state, action) => {
        state.habits.unshift(action.payload);
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

// Async thunks are already exported above

export default habitsSlice.reducer;