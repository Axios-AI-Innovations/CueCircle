// Firebase service layer for CueCircle
// Provides database operations with offline support

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth } from './supabase'; // Updated import
import { User as CueCircleUser, Habit, HabitLog, Pod } from '@/types';

// Auth service
export const authService = {
  async signUp(email: string, password: string, userData: Partial<CueCircleUser>) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user document
    await setDoc(doc(db, 'users', user.uid), {
      ...userData,
      id: user.uid,
      email: user.email,
      created_at: serverTimestamp(),
      preferences: {
        theme: 'light',
        font: 'default',
        haptics_enabled: true,
        ...userData.preferences
      }
    });
    
    return user;
  },

  async signIn(email: string, password: string) {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  async signOut() {
    return await signOut(auth);
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }
};

// User service
export const userService = {
  async getUser(userId: string): Promise<CueCircleUser | null> {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as CueCircleUser;
    }
    return null;
  },

  async updateUser(userId: string, updates: Partial<CueCircleUser>) {
    const docRef = doc(db, 'users', userId);
    return await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
  }
};

// Habits service
export const habitsService = {
  async getHabits(userId: string): Promise<Habit[]> {
    const q = query(
      collection(db, 'habits'),
      where('user_id', '==', userId),
      where('active', '==', true),
      orderBy('created_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Habit[];
  },

  async createHabit(habit: Omit<Habit, 'id' | 'created_at'>): Promise<string> {
    const docRef = doc(collection(db, 'habits'));
    await setDoc(docRef, {
      ...habit,
      id: docRef.id,
      created_at: serverTimestamp()
    });
    return docRef.id;
  },

  async updateHabit(habitId: string, updates: Partial<Habit>) {
    const docRef = doc(db, 'habits', habitId);
    return await updateDoc(docRef, {
      ...updates,
      updated_at: serverTimestamp()
    });
  },

  async deleteHabit(habitId: string) {
    const docRef = doc(db, 'habits', habitId);
    return await updateDoc(docRef, { active: false });
  },

  // Real-time habit updates for accountability pods
  subscribeToHabits(userId: string, callback: (habits: Habit[]) => void) {
    const q = query(
      collection(db, 'habits'),
      where('user_id', '==', userId),
      where('active', '==', true)
    );
    
    return onSnapshot(q, (querySnapshot) => {
      const habits = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Habit[];
      callback(habits);
    });
  }
};

// Habit logs service
export const habitLogsService = {
  async logHabit(habitLog: Omit<HabitLog, 'id' | 'logged_at'>): Promise<string> {
    const docRef = doc(collection(db, 'habit_logs'));
    await setDoc(docRef, {
      ...habitLog,
      id: docRef.id,
      logged_at: serverTimestamp()
    });
    return docRef.id;
  },

  async getHabitLogs(userId: string, limitCount: number = 50): Promise<HabitLog[]> {
    const q = query(
      collection(db, 'habit_logs'),
      where('user_id', '==', userId),
      orderBy('logged_at', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HabitLog[];
  },

  async getTodayLogs(userId: string): Promise<HabitLog[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const q = query(
      collection(db, 'habit_logs'),
      where('user_id', '==', userId),
      where('logged_at', '>=', today),
      orderBy('logged_at', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as HabitLog[];
  }
};

// Pods service
export const podsService = {
  async createPod(pod: Omit<Pod, 'id' | 'created_at'>): Promise<string> {
    const docRef = doc(collection(db, 'pods'));
    await setDoc(docRef, {
      ...pod,
      id: docRef.id,
      created_at: serverTimestamp()
    });
    return docRef.id;
  },

  async getPod(podId: string): Promise<Pod | null> {
    const docRef = doc(db, 'pods', podId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Pod;
    }
    return null;
  },

  async joinPod(podId: string, userId: string) {
    const podRef = doc(db, 'pods', podId);
    const pod = await getDoc(podRef);
    
    if (pod.exists()) {
      const podData = pod.data();
      const updatedMembers = [...podData.members, userId];
      
      await updateDoc(podRef, { members: updatedMembers });
      
      // Update user's pod_id
      await userService.updateUser(userId, { pod_id: podId });
    }
  }
};

// Offline support service
export const offlineService = {
  async syncPendingLogs(userId: string) {
    // This would sync any offline logs when connection is restored
    // Implementation depends on your offline strategy
    console.log('Syncing pending logs for user:', userId);
  }
};

// Batch operations for better performance
export const batchService = {
  async batchUpdateHabits(updates: Array<{ id: string; data: Partial<Habit> }>) {
    const batch = writeBatch(db);
    
    updates.forEach(({ id, data }) => {
      const docRef = doc(db, 'habits', id);
      batch.update(docRef, data);
    });
    
    return await batch.commit();
  }
};
