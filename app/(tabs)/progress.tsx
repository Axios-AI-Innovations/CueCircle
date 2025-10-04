import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ConstellationView } from '@/components/ConstellationView';
import { Calendar, TrendingUp, Award } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { createThemedStyles } from '@/utils/themeStyles';

export default function ProgressScreen() {
  const { logs } = useSelector((state: RootState) => state.habits);
  const { currentTheme } = useTheme();
  
  const styles = useMemo(() => createThemedStyles(currentTheme), [currentTheme]);
  
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

