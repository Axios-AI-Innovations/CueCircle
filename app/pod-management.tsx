import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, Users, Settings, MessageCircle, Timer, Heart, Share, Copy } from 'lucide-react-native';
import { RootState } from '@/store';
import { podsService } from '@/utils/firebase';
import { realtimePodService, PodActivity } from '@/utils/podService';
import { router } from 'expo-router';
import { Pod } from '@/types';

export default function PodManagementScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [pod, setPod] = useState<Pod | null>(null);
  const [activities, setActivities] = useState<PodActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSessions, setActiveSessions] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser?.pod_id) {
      loadPodData();
    }
  }, [currentUser?.pod_id]);

  const loadPodData = async () => {
    if (!currentUser?.pod_id) return;
    
    setLoading(true);
    try {
      const podData = await podsService.getPod(currentUser.pod_id);
      setPod(podData);
      
      // Subscribe to real-time activities
      const unsubscribe = realtimePodService.subscribeToPodActivities(
        currentUser.pod_id,
        (newActivities) => {
          setActivities(newActivities);
        }
      );

      // Load active body doubling sessions
      const sessions = await realtimePodService.getActiveBodyDoublingSessions(currentUser.pod_id);
      setActiveSessions(sessions);

      return () => unsubscribe();
    } catch (error) {
      console.error('Error loading pod data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLeavePod = () => {
    Alert.alert(
      'Leave Pod',
      'Are you sure you want to leave this pod? You will lose access to all shared activities.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            // Implement leave pod logic
            Alert.alert('Left Pod', 'You have left the pod.');
          }
        }
      ]
    );
  };

  const handleInviteMembers = () => {
    if (pod) {
      Alert.alert('Invite Code', `Share this code: ${pod.id}`);
    }
  };

  const handleSendCheer = () => {
    if (!currentUser?.pod_id) return;
    
    realtimePodService.sendCheer(
      currentUser.pod_id,
      currentUser.id,
      'partner_id', // This would be the partner's ID
      'You\'re doing amazing! Keep it up! 🌟'
    );
    
    Alert.alert('Cheer Sent! 🎉', 'Your encouragement has been sent to your pod partner.');
  };

  const handleStartBodyDoubling = async () => {
    if (!currentUser?.pod_id) return;
    
    try {
      const sessionId = await realtimePodService.startBodyDoublingSession(
        currentUser.pod_id,
        currentUser.id
      );
      
      Alert.alert(
        'Body Doubling Started! 🎯',
        'Your session has started. Your pod partner will be notified.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error starting body doubling:', error);
      Alert.alert('Error', 'Failed to start body doubling session.');
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'cheer': return <Heart size={16} color="#48bb78" />;
      case 'body_double_start': return <Timer size={16} color="#805ad5" />;
      case 'body_double_end': return <Timer size={16} color="#38a169" />;
      case 'habit_completed': return <MessageCircle size={16} color="#ed8936" />;
      case 'message': return <MessageCircle size={16} color="#48bb78" />;
      default: return <MessageCircle size={16} color="#a0aec0" />;
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#48bb78" />
          <Text style={styles.loadingText}>Loading pod...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!pod) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.title}>Pod Management</Text>
        </View>
        
        <View style={styles.emptyState}>
          <Users size={64} color="#48bb78" />
          <Text style={styles.emptyTitle}>No Pod Found</Text>
          <Text style={styles.emptySubtitle}>
            You need to join or create a pod first.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.title}>Pod Management</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Settings size={20} color="#a0aec0" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Pod Info */}
        <View style={styles.podInfo}>
          <Text style={styles.podName}>{pod.name}</Text>
          <View style={styles.podStats}>
            <View style={styles.statItem}>
              <Users size={16} color="#48bb78" />
              <Text style={styles.statText}>{pod.members.length} members</Text>
            </View>
            <View style={styles.statItem}>
              <Timer size={16} color="#805ad5" />
              <Text style={styles.statText}>{activeSessions.length} active sessions</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSendCheer}>
              <Heart size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Send Cheer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleStartBodyDoubling}>
              <Timer size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Start Body Doubling</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Invite Code */}
        <View style={styles.inviteSection}>
          <Text style={styles.sectionTitle}>Invite Code</Text>
          <View style={styles.inviteCodeContainer}>
            <Text style={styles.inviteCode}>{pod.id}</Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleInviteMembers}>
              <Copy size={16} color="#48bb78" />
            </TouchableOpacity>
          </View>
          <Text style={styles.inviteDescription}>
            Share this code with friends to invite them to your pod
          </Text>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {activities.length === 0 ? (
            <View style={styles.emptyActivity}>
              <MessageCircle size={32} color="#a0aec0" />
              <Text style={styles.emptyActivityText}>No recent activity</Text>
            </View>
          ) : (
            <View style={styles.activityList}>
              {activities.slice(0, 10).map((activity) => (
                <View key={activity.id} style={styles.activityItem}>
                  <View style={styles.activityIcon}>
                    {getActivityIcon(activity.type)}
                  </View>
                  <View style={styles.activityContent}>
                    <Text style={styles.activityText}>{activity.message}</Text>
                    <Text style={styles.activityTime}>
                      {formatTimeAgo(activity.created_at)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Pod Settings */}
        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Pod Settings</Text>
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Notifications</Text>
            <Text style={styles.settingValue}>Enabled</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingItem}>
            <Text style={styles.settingLabel}>Privacy</Text>
            <Text style={styles.settingValue}>Private</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, styles.dangerItem]} onPress={handleLeavePod}>
            <Text style={[styles.settingLabel, styles.dangerText]}>Leave Pod</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a365d',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2d3748',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 16,
  },
  scrollContent: {
    padding: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
  },
  podInfo: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  podName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },
  podStats: {
    flexDirection: 'row',
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: '#a0aec0',
  },
  actionsSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#48bb78',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  inviteSection: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  inviteCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a5568',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  inviteCode: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    fontFamily: 'monospace',
  },
  copyButton: {
    padding: 8,
  },
  inviteDescription: {
    fontSize: 14,
    color: '#a0aec0',
  },
  activitySection: {
    marginBottom: 24,
  },
  emptyActivity: {
    alignItems: 'center',
    padding: 40,
  },
  emptyActivityText: {
    color: '#a0aec0',
    fontSize: 16,
    marginTop: 12,
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  activityIcon: {
    marginTop: 2,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  activityTime: {
    color: '#a0aec0',
    fontSize: 12,
  },
  settingsSection: {
    marginBottom: 40,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  settingValue: {
    fontSize: 14,
    color: '#a0aec0',
  },
  dangerItem: {
    backgroundColor: '#2d1b1b',
  },
  dangerText: {
    color: '#e53e3e',
  },
});
