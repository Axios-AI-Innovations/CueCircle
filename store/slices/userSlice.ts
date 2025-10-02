import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { User, PersonalProfile } from '@/types/advanced';
import { userService } from '@/utils/firebase';

interface UserState {
  currentUser: User | null;
  personalProfile: PersonalProfile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  crisisMode: boolean;
  hyperfocusMode: boolean;
}

const initialState: UserState = {
  currentUser: null,
  personalProfile: null,
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

export const updatePersonalProfile = createAsyncThunk(
  'user/updatePersonalProfile',
  async (profile: Partial<PersonalProfile>) => {
    // This would update the personal profile in Firebase
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
    setPersonalProfile: (state, action: PayloadAction<PersonalProfile>) => {
      state.personalProfile = action.payload;
    },
    toggleCrisisMode: (state) => {
      state.crisisMode = !state.crisisMode;
    },
    toggleHyperfocusMode: (state) => {
      state.hyperfocusMode = !state.hyperfocusMode;
    },
    logout: (state) => {
      state.currentUser = null;
      state.personalProfile = null;
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
        state.personalProfile = action.payload.personalProfile;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch profile';
      });
  },
});

export const { 
  setUser, 
  setPersonalProfile, 
  toggleCrisisMode, 
  toggleHyperfocusMode, 
  logout, 
  clearError 
} = userSlice.actions;

export default userSlice.reducer;