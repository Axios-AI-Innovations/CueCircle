import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AIInsight, BehavioralPattern } from '@/types/advanced';

interface InsightsState {
  insights: AIInsight[];
  patterns: BehavioralPattern[];
  loading: boolean;
  error: string | null;
  lastAnalysis: string | null;
}

const initialState: InsightsState = {
  insights: [],
  patterns: [],
  loading: false,
  error: null,
  lastAnalysis: null,
};

export const generateInsights = createAsyncThunk(
  'insights/generate',
  async (userId: string) => {
    const response = await fetch(`/api/ai/insights/${userId}`, {
      method: 'POST',
    });
    return response.json();
  }
);

export const analyzePatterns = createAsyncThunk(
  'insights/analyzePatterns',
  async (data: { userId: string; timeframe: string }) => {
    const response = await fetch('/api/ai/patterns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    addInsight: (state, action: PayloadAction<AIInsight>) => {
      state.insights.unshift(action.payload);
      // Keep only the most recent 50 insights
      state.insights = state.insights.slice(0, 50);
    },
    dismissInsight: (state, action: PayloadAction<string>) => {
      const insight = state.insights.find(i => i.id === action.payload);
      if (insight) {
        insight.dismissed = true;
      }
    },
    implementInsight: (state, action: PayloadAction<string>) => {
      const insight = state.insights.find(i => i.id === action.payload);
      if (insight) {
        insight.implemented = true;
      }
    },
    updatePattern: (state, action: PayloadAction<BehavioralPattern>) => {
      const existingIndex = state.patterns.findIndex(
        p => p.pattern_type === action.payload.pattern_type && 
            p.description === action.payload.description
      );
      
      if (existingIndex !== -1) {
        state.patterns[existingIndex] = action.payload;
      } else {
        state.patterns.push(action.payload);
      }
    },
    clearOldInsights: (state) => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      state.insights = state.insights.filter(
        insight => new Date(insight.created_at) > oneWeekAgo || !insight.dismissed
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateInsights.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateInsights.fulfilled, (state, action) => {
        state.loading = false;
        state.insights = [...action.payload.insights, ...state.insights];
        state.lastAnalysis = new Date().toISOString();
      })
      .addCase(generateInsights.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate insights';
      })
      .addCase(analyzePatterns.fulfilled, (state, action) => {
        state.patterns = action.payload.patterns;
      });
  },
});

export const {
  addInsight,
  dismissInsight,
  implementInsight,
  updatePattern,
  clearOldInsights,
} = insightsSlice.actions;

export default insightsSlice.reducer;