import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from '@reduxjs/toolkit';

import userReducer from './slices/userSlice';
import habitsReducer from './slices/habitsSlice';
import analyticsReducer from './slices/analyticsSlice';
import xpReducer from './slices/xpSlice';
import podReducer from './slices/podSlice';
import insightsReducer from './slices/insightsSlice';

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user', 'habits', 'xp', 'pod'], // Only persist essential data
};

const rootReducer = combineReducers({
  user: userReducer,
  habits: habitsReducer,
  analytics: analyticsReducer,
  xp: xpReducer,
  pod: podReducer,
  insights: insightsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;