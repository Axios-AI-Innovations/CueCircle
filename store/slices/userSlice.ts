import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, ADHDProfile } from '@/types/advanced';
import { userService } from '@/utils/firebase';

interface UserState {
  currentUser: User | null;
  adhdProfile: ADHDProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  crisisMode: boolean;
  hyperfocusMode: boolean;
}

const initialState: UserState = {
  currentUser: null,
  adhdProfile: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  crisisMode: false,
  hyperfocusMode: false,
};

export const fetchUserProfile = createAsyncThunk(
  'user/fetchProfile',
  async (userId: string) => {
    const userData = await userService.getUser(userId);
    return userData;
  }
);

export const updateADHDProfile = createAsyncThunk(
  'user/updateADHDProfile',
  async (profile: Partial<ADHDProfile>) => {
    // This would update the ADHD profile in Firebase
    // For now, just return the profile
    return profile;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
    },
    setADHDProfile: (state, action: PayloadAction<ADHDProfile>) => {
      state.adhdProfile = action.payload;
    },
    toggleCrisisMode: (state) => {
      state.crisisMode = !state.crisisMode;
    },
    toggleHyperfocusMode: (state) => {
      state.hyperfocusMode = !state.hyperfocusMode;
    },
    logout: (state) => {
      state.currentUser = null;
      state.adhdProfile = null;
      state.isAuthenticated = false;
      state.crisisMode = false;
      state.hyperfocusMode = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload.user;
        state.adhdProfile = action.payload.adhdProfile;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });
  },
});

export const { 
  setUser, 
  setADHDProfile, 
  toggleCrisisMode, 
  toggleHyperfocusMode, 
  logout, 
  clearError 
} = userSlice.actions;

export default userSlice.reducer;