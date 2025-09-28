import AsyncStorage from '@react-native-async-storage/async-storage';
import { HabitLog, Habit } from '@/types';

const OFFLINE_LOGS_KEY = 'offline_habit_logs';
const HABITS_CACHE_KEY = 'habits_cache';
const MAX_OFFLINE_DAYS = 7;

export class OfflineManager {
  static async saveLogOffline(log: Omit<HabitLog, 'id' | 'synced'>): Promise<void> {
    try {
      const existingLogs = await this.getOfflineLogs();
      const newLog: HabitLog = {
        ...log,
        id: `offline_${Date.now()}_${Math.random()}`,
        synced: false,
      };
      
      const updatedLogs = [...existingLogs, newLog];
      await AsyncStorage.setItem(OFFLINE_LOGS_KEY, JSON.stringify(updatedLogs));
    } catch (error) {
      console.error('Failed to save log offline:', error);
    }
  }

  static async getOfflineLogs(): Promise<HabitLog[]> {
    try {
      const logsJson = await AsyncStorage.getItem(OFFLINE_LOGS_KEY);
      return logsJson ? JSON.parse(logsJson) : [];
    } catch (error) {
      console.error('Failed to get offline logs:', error);
      return [];
    }
  }

  static async syncOfflineLogs(): Promise<void> {
    // This would sync with Supabase when online
    console.log('Syncing offline logs...');
  }

  static async cacheHabits(habits: Habit[]): Promise<void> {
    try {
      await AsyncStorage.setItem(HABITS_CACHE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Failed to cache habits:', error);
    }
  }

  static async getCachedHabits(): Promise<Habit[]> {
    try {
      const habitsJson = await AsyncStorage.getItem(HABITS_CACHE_KEY);
      return habitsJson ? JSON.parse(habitsJson) : [];
    } catch (error) {
      console.error('Failed to get cached habits:', error);
      return [];
    }
  }

  static async cleanOldLogs(): Promise<void> {
    try {
      const logs = await this.getOfflineLogs();
      const maxAge = Date.now() - (MAX_OFFLINE_DAYS * 24 * 60 * 60 * 1000);
      const filteredLogs = logs.filter(log => 
        new Date(log.logged_at).getTime() > maxAge
      );
      await AsyncStorage.setItem(OFFLINE_LOGS_KEY, JSON.stringify(filteredLogs));
    } catch (error) {
      console.error('Failed to clean old logs:', error);
    }
  }
}