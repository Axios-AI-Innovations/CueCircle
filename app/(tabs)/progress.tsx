import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ConstellationView } from '@/components/ConstellationView';
import { Calendar, TrendingUp, Award } from 'lucide-react-native';

export default function ProgressScreen() {
  const { logs } = useSelector((state: RootState) => state.habits);
  
  // Calculate consistency percentage (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toDateString();
  });
  
  const completedDays = last30Days.filter(day => 
    logs.some(log => 
      new Date(log.logged_at).toDateString() === day && log.completed
    )
  ).length;
  
  const consistencyPercentage = Math.round((completedDays / 30) * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Your Journey</Text>
          <Text style={styles.subtitle}>Progress, not perfection 🌟</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <TrendingUp size={24} color="#48bb78" />
            <Text style={styles.statNumber}>{consistencyPercentage}%</Text>
            <Text style={styles.statLabel}>Consistency</Text>
            <Text style={styles.statSubtext}>Last 30 days</Text>
          </View>
          
          <View style={styles.statCard}>
            <Award size={24} color="#ed8936" />
            <Text style={styles.statNumber}>{completedDays}</Text>
            <Text style={styles.statLabel}>Active Days</Text>
            <Text style={styles.statSubtext}>This month</Text>
          </View>
        </View>

        <ConstellationView logs={logs} days={7} />
        
        <View style={styles.encouragementContainer}>
          <Text style={styles.encouragementTitle}>Remember</Text>
          <Text style={styles.encouragementText}>
            Every habit you complete is a victory. Some days you'll do the full version, 
            some days just the starter - both count as progress. You're building something 
            meaningful, one small step at a time.
          </Text>
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#2d3748',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeToggle: {
    backgroundColor: '#48bb78',
  },
  toggleText: {
    color: '#a0aec0',
    fontSize: 14,
    fontWeight: '500',
  },
  activeToggleText: {
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0aec0',
  },
  statSubtext: {
    fontSize: 12,
    color: '#718096',
  },
  encouragementContainer: {
    backgroundColor: '#2d3748',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  encouragementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#48bb78',
    marginBottom: 12,
  },
  encouragementText: {
    fontSize: 16,
    color: '#a0aec0',
    lineHeight: 24,
  },
});