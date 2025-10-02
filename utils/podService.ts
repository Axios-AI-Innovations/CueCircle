import { 
  collection, 
  doc, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './supabase';
import { Pod, NudgeType } from '@/types';

export interface PodActivity {
  id: string;
  pod_id: string;
  user_id: string;
  type: 'cheer' | 'body_double_start' | 'body_double_end' | 'habit_completed' | 'message';
  message?: string;
  habit_id?: string;
  created_at: string;
  user_name: string;
}

export interface BodyDoublingSession {
  id: string;
  pod_id: string;
  user_id: string;
  started_at: string;
  ended_at?: string;
  duration?: number;
  status: 'active' | 'completed';
}

export const realtimePodService = {
  // Listen to pod activities in real-time
  subscribeToPodActivities(podId: string, callback: (activities: PodActivity[]) => void) {
    const activitiesRef = collection(db, 'pod_activities');
    const q = query(
      activitiesRef,
      where('pod_id', '==', podId),
      orderBy('created_at', 'desc'),
      limit(20)
    );

    return onSnapshot(q, (snapshot) => {
      const activities: PodActivity[] = [];
      snapshot.forEach((doc) => {
        activities.push({ id: doc.id, ...doc.data() } as PodActivity);
      });
      callback(activities);
    });
  },

  // Send a cheer to pod members
  async sendCheer(podId: string, fromUserId: string, toUserId: string, message?: string) {
    const activitiesRef = collection(db, 'pod_activities');
    await addDoc(activitiesRef, {
      pod_id: podId,
      user_id: fromUserId,
      type: 'cheer',
      message: message || 'You got this! 💪',
      created_at: serverTimestamp(),
    });

    // Also create a nudge
    const nudgesRef = collection(db, 'nudges');
    await addDoc(nudgesRef, {
      type: 'cheer',
      from_user: fromUserId,
      to_user: toUserId,
      message: message || 'You got this! 💪',
      created_at: serverTimestamp(),
    });
  },

  // Start a body doubling session
  async startBodyDoublingSession(podId: string, userId: string) {
    const sessionsRef = collection(db, 'body_doubling_sessions');
    const docRef = await addDoc(sessionsRef, {
      pod_id: podId,
      user_id: userId,
      started_at: serverTimestamp(),
      status: 'active',
    });

    // Notify pod members
    const activitiesRef = collection(db, 'pod_activities');
    await addDoc(activitiesRef, {
      pod_id: podId,
      user_id: userId,
      type: 'body_double_start',
      message: 'Started a body doubling session',
      created_at: serverTimestamp(),
    });

    return docRef.id;
  },

  // End a body doubling session
  async endBodyDoublingSession(sessionId: string, podId: string, userId: string) {
    const sessionRef = doc(db, 'body_doubling_sessions', sessionId);
    const endTime = new Date();
    
    await updateDoc(sessionRef, {
      ended_at: serverTimestamp(),
      status: 'completed',
    });

    // Notify pod members
    const activitiesRef = collection(db, 'pod_activities');
    await addDoc(activitiesRef, {
      pod_id: podId,
      user_id: userId,
      type: 'body_double_end',
      message: 'Completed body doubling session',
      created_at: serverTimestamp(),
    });
  },

  // Get active body doubling sessions for a pod
  async getActiveBodyDoublingSessions(podId: string): Promise<BodyDoublingSession[]> {
    const sessionsRef = collection(db, 'body_doubling_sessions');
    const q = query(
      sessionsRef,
      where('pod_id', '==', podId),
      where('status', '==', 'active')
    );

    // This would need to be implemented with getDocs in a real scenario
    // For now, return empty array
    return [];
  },

  // Send a message to pod members
  async sendPodMessage(podId: string, userId: string, message: string) {
    const activitiesRef = collection(db, 'pod_activities');
    await addDoc(activitiesRef, {
      pod_id: podId,
      user_id: userId,
      type: 'message',
      message,
      created_at: serverTimestamp(),
    });
  },

  // Notify when a habit is completed
  async notifyHabitCompleted(podId: string, userId: string, habitId: string, habitTitle: string) {
    const activitiesRef = collection(db, 'pod_activities');
    await addDoc(activitiesRef, {
      pod_id: podId,
      user_id: userId,
      type: 'habit_completed',
      habit_id: habitId,
      message: `Completed: ${habitTitle}`,
      created_at: serverTimestamp(),
    });
  },

  // Get pod member info
  async getPodMembers(podId: string) {
    // This would fetch user details for pod members
    // For now, return mock data
    return [
      { id: 'user1', name: 'Alex', email: 'alex@example.com' },
      { id: 'user2', name: 'Sam', email: 'sam@example.com' }
    ];
  }
};

export default realtimePodService;

