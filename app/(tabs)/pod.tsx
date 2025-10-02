import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Heart, MessageCircle, Timer, UserPlus, Copy, Share, Clock, CheckCircle, Settings } from 'lucide-react-native';
import { RootState } from '@/store';
import { podsService, userService } from '@/utils/firebase';
import { setUser } from '@/store/slices/userSlice';
import { Pod } from '@/types';
import { router } from 'expo-router';

export default function PodScreen() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const [hasPod, setHasPod] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [pod, setPod] = useState<Pod | null>(null);
  const [podInviteCode, setPodInviteCode] = useState('');
  const [bodyDoublingActive, setBodyDoublingActive] = useState(false);
  const [bodyDoublingTime, setBodyDoublingTime] = useState(0);

  const partnerProgress = {
    name: 'Alex',
    completedToday: 2,
    totalHabits: 3,
    streak: 5,
  };

  useEffect(() => {
    if (currentUser?.pod_id) {
      loadPod();
    }
  }, [currentUser?.pod_id]);

  const loadPod = async () => {
    if (!currentUser?.pod_id) return;
    
    try {
      const podData = await podsService.getPod(currentUser.pod_id);
      if (podData) {
        setPod(podData);
        setHasPod(true);
      }
    } catch (error) {
      console.error('Error loading pod:', error);
    }
  };

  const handleCreatePod = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const podId = await podsService.createPod({
        name: `${currentUser.name}'s Pod`,
        members: [currentUser.id],
      });
      
      // Update user with pod_id
      await userService.updateUser(currentUser.id, { pod_id: podId });
      dispatch(setUser({ ...currentUser, pod_id: podId }));
      
      setPodInviteCode(podId);
      setHasPod(true);
      
      Alert.alert(
        'Pod Created! 🎉',
        'Your pod has been created. Share the invite code with your accountability partner.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error creating pod:', error);
      Alert.alert('Error', 'Failed to create pod. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinPod = async () => {
    if (!inviteCode.trim()) {
      Alert.alert('Invalid Code', 'Please enter a valid invite code.');
      return;
    }
    
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await podsService.joinPod(inviteCode.trim(), currentUser.id);
      await loadPod();
      
      Alert.alert(
        'Joined Pod! 🎉',
        'You have successfully joined the pod.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error joining pod:', error);
      Alert.alert('Error', 'Failed to join pod. Please check the invite code.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyInviteCode = () => {
    if (podInviteCode) {
      // In a real app, you'd use Clipboard API
      Alert.alert('Invite Code', `Share this code: ${podInviteCode}`);
    }
  };

  const handleSendCheer = () => {
    Alert.alert('Cheer Sent! 🎉', 'Your support message has been sent to your pod partner.');
  };

  const handleStartBodyDoubling = () => {
    setBodyDoublingActive(true);
    setBodyDoublingTime(0);
    
    // Start timer
    const interval = setInterval(() => {
      setBodyDoublingTime(prev => prev + 1);
    }, 1000);
    
    // Stop after 10 minutes (600 seconds) for demo
    setTimeout(() => {
      clearInterval(interval);
      setBodyDoublingActive(false);
      Alert.alert('Session Complete! 🎉', 'Great job on your body doubling session!');
    }, 600000); // 10 minutes
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!hasPod) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <View style={styles.header}>
            <Text style={styles.title}>Your Accountability Pod</Text>
          </View>

          <View style={styles.emptyPodContainer}>
            <Users size={64} color="#48bb78" />
            <Text style={styles.emptyTitle}>Ready to find your accountability partner?</Text>
            <Text style={styles.emptyText}>
              Pods work best with just two people - someone who can cheer you on and join you for support.
            </Text>

            <View style={styles.joinOptions}>
              <View style={styles.optionCard}>
                <Text style={styles.optionTitle}>Join a Pod</Text>
                <Text style={styles.optionDescription}>
                  Have an invite code from a friend?
                </Text>
                <TextInput
                  style={styles.codeInput}
                  placeholder="Enter invite code"
                  placeholderTextColor="#718096"
                  value={inviteCode}
                  onChangeText={setInviteCode}
                />
                <TouchableOpacity
                  style={[styles.joinButton, loading && styles.disabledButton]}
                  onPress={handleJoinPod}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Text style={styles.joinButtonText}>Join Pod</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.optionCard}>
                <Text style={styles.optionTitle}>Create a Pod</Text>
                <Text style={styles.optionDescription}>
                  Start your own and invite someone special.
                </Text>
                <TouchableOpacity
                  style={[styles.createButton, loading && styles.disabledButton]}
                  onPress={handleCreatePod}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <>
                      <UserPlus size={20} color="#ffffff" />
                      <Text style={styles.createButtonText}>Create Pod</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Your Pod</Text>
          <View style={styles.podIndicator}>
            <Users size={16} color="#48bb78" />
            <Text style={styles.podCount}>{pod?.members.length || 1}</Text>
          </View>
        </View>

        {podInviteCode && (
          <View style={styles.inviteSection}>
            <Text style={styles.inviteTitle}>Invite Code</Text>
            <View style={styles.inviteCodeContainer}>
              <Text style={styles.inviteCode}>{podInviteCode}</Text>
              <TouchableOpacity style={styles.copyButton} onPress={handleCopyInviteCode}>
                <Copy size={16} color="#48bb78" />
              </TouchableOpacity>
            </View>
            <Text style={styles.inviteDescription}>
              Share this code with your accountability partner
            </Text>
          </View>
        )}

        <View style={styles.partnerCard}>
          <View style={styles.partnerHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>A</Text>
            </View>
            <View style={styles.partnerInfo}>
              <Text style={styles.partnerName}>{partnerProgress.name}</Text>
              <Text style={styles.partnerStatus}>
                {partnerProgress.completedToday}/{partnerProgress.totalHabits} habits today
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakText}>{partnerProgress.streak}🔥</Text>
            </View>
          </View>

          <View style={styles.partnerProgress}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${(partnerProgress.completedToday / partnerProgress.totalHabits) * 100}%` 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              Great progress today! 🌟
            </Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <Text style={styles.actionsTitle}>Show Support</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleSendCheer}>
              <Heart size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>Send a Cheer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, bodyDoublingActive && styles.activeBodyDouble]} 
              onPress={handleStartBodyDoubling}
              disabled={bodyDoublingActive}
            >
              <Timer size={20} color="#ffffff" />
              <Text style={styles.actionButtonText}>
                {bodyDoublingActive ? 'Body Doubling...' : 'Body Double'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.bodyDoubleExplainer}>
            Body doubling: Work alongside each other virtually for accountability and focus
          </Text>
          
          {bodyDoublingActive && (
            <View style={styles.bodyDoubleTimer}>
              <Clock size={20} color="#48bb78" />
              <Text style={styles.timerText}>{formatTime(bodyDoublingTime)}</Text>
              <Text style={styles.timerLabel}>Session in progress</Text>
            </View>
          )}
        </View>

        <View style={styles.recentActivity}>
          <Text style={styles.activityTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <MessageCircle size={16} color="#48bb78" />
              <Text style={styles.activityText}>
                <Text style={styles.activityUser}>Alex</Text> sent you a cheer for "Drink water" 🎉
              </Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            
            <View style={styles.activityItem}>
              <Timer size={16} color="#805ad5" />
              <Text style={styles.activityText}>
                <Text style={styles.activityUser}>Alex</Text> completed a 10-minute body doubling session with you
              </Text>
              <Text style={styles.activityTime}>Yesterday</Text>
            </View>
          </View>
        </View>

        {/* Pod Management Section */}
        <View style={styles.managementSection}>
          <Text style={styles.managementTitle}>Pod Management</Text>
          <View style={styles.managementActions}>
            <TouchableOpacity 
              style={styles.managementButton}
              onPress={() => router.push('/pod-management')}
            >
              <Settings size={20} color="#48bb78" />
              <Text style={styles.managementButtonText}>Pod Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.managementButton}
              onPress={() => Alert.alert('Invite Members', 'Share your pod invite code with friends!')}
            >
              <Share size={20} color="#805ad5" />
              <Text style={styles.managementButtonText}>Invite Members</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
  },
  podIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48bb7820',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  podCount: {
    color: '#48bb78',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyPodContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    maxWidth: 300,
  },
  joinOptions: {
    width: '100%',
    gap: 20,
  },
  optionCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
  },
  optionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  optionDescription: {
    fontSize: 14,
    color: '#a0aec0',
    marginBottom: 16,
  },
  codeInput: {
    backgroundColor: '#4a5568',
    borderRadius: 12,
    padding: 16,
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 16,
  },
  joinButton: {
    backgroundColor: '#48bb78',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    backgroundColor: '#805ad5',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  partnerCard: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    marginTop: 0,
  },
  partnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#48bb78',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  partnerInfo: {
    flex: 1,
  },
  partnerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  partnerStatus: {
    fontSize: 14,
    color: '#a0aec0',
  },
  streakBadge: {
    backgroundColor: '#ed893620',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakText: {
    color: '#ed8936',
    fontSize: 14,
    fontWeight: '600',
  },
  partnerProgress: {
    gap: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#4a5568',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#48bb78',
    borderRadius: 4,
  },
  progressText: {
    color: '#48bb78',
    fontSize: 14,
    fontWeight: '500',
  },
  actionsContainer: {
    padding: 20,
    paddingTop: 0,
  },
  actionsTitle: {
    fontSize: 20,
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
  bodyDoubleExplainer: {
    fontSize: 12,
    color: '#a0aec0',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  recentActivity: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  activityList: {
    gap: 16,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  activityText: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
  activityUser: {
    fontWeight: '600',
    color: '#48bb78',
  },
  activityTime: {
    color: '#a0aec0',
    fontSize: 12,
  },
  // New styles for enhanced functionality
  inviteSection: {
    backgroundColor: '#2d3748',
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
  },
  inviteTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
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
  disabledButton: {
    opacity: 0.6,
  },
  activeBodyDouble: {
    backgroundColor: '#48bb78',
    opacity: 0.8,
  },
  bodyDoubleTimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#48bb7820',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  timerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#48bb78',
    fontFamily: 'monospace',
  },
  timerLabel: {
    fontSize: 14,
    color: '#a0aec0',
    flex: 1,
  },
  // Pod management styles
  managementSection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  managementTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  managementActions: {
    flexDirection: 'row',
    gap: 12,
  },
  managementButton: {
    flex: 1,
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  managementButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});