import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AnalyticsDashboard, SuccessPattern, EnergyCorrelation, OptimalTimingAnalysis, HabitPerformanceComparison, ADHDSpecificInsight, MedicalReportData } from '@/types/advanced';

interface AnalyticsState {
  dashboard: AnalyticsDashboard | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: AnalyticsState = {
  dashboard: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

export const generateAnalytics = createAsyncThunk(
  'analytics/generate',
  async (data: { userId: string; timePeriod: 'week' | 'month' | 'quarter' | 'year' }) => {
    const response = await fetch('/api/analytics/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
);

export const exportMedicalReport = createAsyncThunk(
  'analytics/exportMedicalReport',
  async (userId: string) => {
    const response = await fetch(`/api/analytics/medical-report/${userId}`, {
      method: 'GET',
    });
    return response.json();
  }
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    updateSuccessPatterns: (state, action: PayloadAction<SuccessPattern[]>) => {
      if (state.dashboard) {
        state.dashboard.success_patterns = action.payload;
      }
    },
    updateEnergyCorrelations: (state, action: PayloadAction<EnergyCorrelation[]>) => {
      if (state.dashboard) {
        state.dashboard.energy_correlations = action.payload;
      }
    },
    updateOptimalTiming: (state, action: PayloadAction<OptimalTimingAnalysis>) => {
      if (state.dashboard) {
        state.dashboard.optimal_timing_analysis = action.payload;
      }
    },
    updateHabitComparisons: (state, action: PayloadAction<HabitPerformanceComparison[]>) => {
      if (state.dashboard) {
        state.dashboard.habit_performance_comparison = action.payload;
      }
    },
    addADHDInsight: (state, action: PayloadAction<ADHDSpecificInsight>) => {
      if (state.dashboard) {
        state.dashboard.adhd_specific_insights.push(action.payload);
      }
    },
    clearAnalytics: (state) => {
      state.dashboard = null;
      state.lastUpdated = null;
    },
    setTimePeriod: (state, action: PayloadAction<'week' | 'month' | 'quarter' | 'year'>) => {
      if (state.dashboard) {
        state.dashboard.time_period = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(generateAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to generate analytics';
      })
      .addCase(exportMedicalReport.fulfilled, (state, action) => {
        if (state.dashboard) {
          state.dashboard.medical_report_data = action.payload;
        }
      });
  },
});

export const {
  updateSuccessPatterns,
  updateEnergyCorrelations,
  updateOptimalTiming,
  updateHabitComparisons,
  addADHDInsight,
  clearAnalytics,
  setTimePeriod,
} = analyticsSlice.actions;

export default analyticsSlice.reducer;