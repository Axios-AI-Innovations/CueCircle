import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AdvancedPod, EngagementMetric, SharedGoal, BodyDoublingSession, EncouragementExchange, MutualInsight } from '@/types/advanced';

interface PodState {
  currentPod: AdvancedPod | null;
  inviteCode: string | null;
  partnerActivity: EngagementMetric[];
  sharedGoals: SharedGoal[];
  bodyDoublingSessions: BodyDoublingSession[];
  encouragements: EncouragementExchange[];
  mutualInsights: MutualInsight[];
  loading: boolean;
  error: string | null;
}

const initialState: PodState = {
  currentPod: null,
  inviteCode: null,
  partnerActivity: [],
  sharedGoals: [],
  bodyDoublingSessions: [],
  encouragements: [],
  mutualInsights: [],
  loading: false,
  error: null,
};

export const createPod = createAsyncThunk(
  'pod/create',
  async (userId: string) => {
    const response = await fetch('/api/pods/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    return response.json();
  }
);

export const joinPod = createAsyncThunk(
  'pod/join',
  async (data: { userId: string; inviteCode: string }) => {
    const response = await fetch('/api/pods/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const sendEncouragement = createAsyncThunk(
  'pod/sendEncouragement',
  async (data: { fromUser: string; toUser: string; type: string; message: string }) => {
    const response = await fetch('/api/pods/encourage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const requestBodyDoubling = createAsyncThunk(
  'pod/requestBodyDoubling',
  async (data: { requestedBy: string; duration: number; focusArea: string }) => {
    const response = await fetch('/api/pods/body-doubling', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

const podSlice = createSlice({
  name: 'pod',
  initialState,
  reducers: {
    setPod: (state, action: PayloadAction<AdvancedPod>) => {
      state.currentPod = action.payload;
    },
    setInviteCode: (state, action: PayloadAction<string>) => {
      state.inviteCode = action.payload;
    },
    addEngagementMetric: (state, action: PayloadAction<EngagementMetric>) => {
      state.partnerActivity.unshift(action.payload);
      // Keep only last 30 days
      state.partnerActivity = state.partnerActivity.slice(0, 30);
    },
    createSharedGoal: (state, action: PayloadAction<SharedGoal>) => {
      state.sharedGoals.push(action.payload);
    },
    updateSharedGoalProgress: (state, action: PayloadAction<{
      goalId: string;
      userId: string;
      progress: number;
    }>) => {
      const goal = state.sharedGoals.find(g => g.id === action.payload.goalId);
      if (goal) {
        if (action.payload.userId === goal.id) { // Simplified user matching
          goal.progress_user_1 = action.payload.progress;
        } else {
          goal.progress_user_2 = action.payload.progress;
        }
      }
    },
    addBodyDoublingSession: (state, action: PayloadAction<BodyDoublingSession>) => {
      state.bodyDoublingSessions.unshift(action.payload);
      // Keep only last 20 sessions
      state.bodyDoublingSessions = state.bodyDoublingSessions.slice(0, 20);
    },
    completeBodyDoublingSession: (state, action: PayloadAction<{
      sessionId: string;
      effectivenessRating: number;
    }>) => {
      const session = state.bodyDoublingSessions.find(s => s.id === action.payload.sessionId);
      if (session) {
        session.completed = true;
        session.effectiveness_rating = action.payload.effectivenessRating;
      }
    },
    addEncouragement: (state, action: PayloadAction<EncouragementExchange>) => {
      state.encouragements.unshift(action.payload);
      // Keep only last 50 encouragements
      state.encouragements = state.encouragements.slice(0, 50);
    },
    addMutualInsight: (state, action: PayloadAction<MutualInsight>) => {
      state.mutualInsights.unshift(action.payload);
      // Keep only last 10 insights
      state.mutualInsights = state.mutualInsights.slice(0, 10);
    },
    updateAccountabilityScore: (state, action: PayloadAction<number>) => {
      if (state.currentPod) {
        state.currentPod.accountability_score = action.payload;
      }
    },
    leavePod: (state) => {
      state.currentPod = null;
      state.inviteCode = null;
      state.partnerActivity = [];
      state.sharedGoals = [];
      state.bodyDoublingSessions = [];
      state.encouragements = [];
      state.mutualInsights = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPod.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPod.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPod = action.payload.pod;
        state.inviteCode = action.payload.inviteCode;
      })
      .addCase(createPod.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create pod';
      })
      .addCase(joinPod.fulfilled, (state, action) => {
        state.currentPod = action.payload.pod;
        state.inviteCode = null;
      })
      .addCase(sendEncouragement.fulfilled, (state, action) => {
        state.encouragements.unshift(action.payload);
      })
      .addCase(requestBodyDoubling.fulfilled, (state, action) => {
        state.bodyDoublingSessions.unshift(action.payload);
      });
  },
});

export const {
  setPod,
  setInviteCode,
  addEngagementMetric,
  createSharedGoal,
  updateSharedGoalProgress,
  addBodyDoublingSession,
  completeBodyDoublingSession,
  addEncouragement,
  addMutualInsight,
  updateAccountabilityScore,
  leavePod,
} = podSlice.actions;

export default podSlice.reducer;