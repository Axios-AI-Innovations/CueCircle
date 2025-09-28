import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart, BarChart, PieChart } from 'react-native-chart-kit';
import { Calendar, TrendingUp, Clock, Zap, Brain, Activity } from 'lucide-react-native';

const screenWidth = Dimensions.get('window').width;

interface AnalyticsData {
  successPatterns: Array<{ day: string; rate: number }>;
  energyCorrelations: Array<{ energy: number; completion: number }>;
  timingAnalysis: Array<{ hour: number; success: number }>;
  habitComparisons: Array<{ name: string; rate: number; trend: 'up' | 'down' | 'stable' }>;
}

export function AdvancedAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('week');
  const [selectedView, setSelectedView] = useState<'patterns' | 'energy' | 'timing' | 'habits'>('patterns');

  // Sample data - would come from Redux store in real implementation
  const analyticsData: AnalyticsData = {
    successPatterns: [
      { day: 'Mon', rate: 85 },
      { day: 'Tue', rate: 92 },
      { day: 'Wed', rate: 78 },
      { day: 'Thu', rate: 88 },
      { day: 'Fri', rate: 75 },
      { day: 'Sat', rate: 95 },
      { day: 'Sun', rate: 90 },
    ],
    energyCorrelations: [
      { energy: 1, completion: 45 },
      { energy: 2, completion: 62 },
      { energy: 3, completion: 78 },
      { energy: 4, completion: 89 },
      { energy: 5, completion: 95 },
    ],
    timingAnalysis: [
      { hour: 6, success: 95 },
      { hour: 7, success: 88 },
      { hour: 8, success: 82 },
      { hour: 9, success: 75 },
      { hour: 10, success: 70 },
      { hour: 11, success: 68 },
      { hour: 12, success: 72 },
      { hour: 13, success: 65 },
      { hour: 14, success: 60 },
      { hour: 15, success: 58 },
      { hour: 16, success: 62 },
      { hour: 17, success: 68 },
      { hour: 18, success: 75 },
      { hour: 19, success: 80 },
      { hour: 20, success: 85 },
      { hour: 21, success: 78 },
      { hour: 22, success: 70 },
    ],
    habitComparisons: [
      { name: 'Morning Water', rate: 92, trend: 'up' },
      { name: 'Journal Entry', rate: 78, trend: 'stable' },
      { name: 'Evening Walk', rate: 85, trend: 'up' },
      { name: 'Meditation', rate: 65, trend: 'down' },
    ],
  };

  const chartConfig = {
    backgroundColor: '#2d3748',
    backgroundGradientFrom: '#2d3748',
    backgroundGradientTo: '#4a5568',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(160, 174, 192, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#48bb78',
    },
  };

  const renderChart = () => {
    switch (selectedView) {
      case 'patterns':
        return (
          <LineChart
            data={{
              labels: analyticsData.successPatterns.map(d => d.day),
              datasets: [{
                data: analyticsData.successPatterns.map(d => d.rate),
                color: (opacity = 1) => `rgba(72, 187, 120, ${opacity})`,
                strokeWidth: 3,
              }],
            }}
            width={screenWidth - 80}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        );
      
      case 'energy':
        return (
          <BarChart
            data={{
              labels: analyticsData.energyCorrelations.map(d => `Energy ${d.energy}`),
              datasets: [{
                data: analyticsData.energyCorrelations.map(d => d.completion),
              }],
            }}
            width={screenWidth - 80}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(237, 137, 54, ${opacity})`,
            }}
            style={styles.chart}
          />
        );
      
      case 'timing':
        return (
          <LineChart
            data={{
              labels: analyticsData.timingAnalysis.filter((_, i) => i % 3 === 0).map(d => `${d.hour}:00`),
              datasets: [{
                data: analyticsData.timingAnalysis.filter((_, i) => i % 3 === 0).map(d => d.success),
                color: (opacity = 1) => `rgba(128, 90, 213, ${opacity})`,
                strokeWidth: 2,
              }],
            }}
            width={screenWidth - 80}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(128, 90, 213, ${opacity})`,
            }}
            style={styles.chart}
          />
        );
      
      case 'habits':
        return (
          <View style={styles.habitsComparison}>
            {analyticsData.habitComparisons.map((habit, index) => (
              <View key={index} style={styles.habitComparisonItem}>
                <View style={styles.habitInfo}>
                  <Text style={styles.habitName}>{habit.name}</Text>
                  <View style={styles.habitTrend}>
                    <TrendingUp 
                      size={16} 
                      color={
                        habit.trend === 'up' ? '#48bb78' : 
                        habit.trend === 'down' ? '#e53e3e' : '#a0aec0'
                      } 
                    />
                    <Text style={[
                      styles.habitRate,
                      { 
                        color: habit.trend === 'up' ? '#48bb78' : 
                               habit.trend === 'down' ? '#e53e3e' : '#a0aec0'
                      }
                    ]}>
                      {habit.rate}%
                    </Text>
                  </View>
                </View>
                <View style={styles.habitProgressBar}>
                  <View 
                    style={[
                      styles.habitProgressFill,
                      { 
                        width: `${habit.rate}%`,
                        backgroundColor: habit.trend === 'up' ? '#48bb78' : 
                                       habit.trend === 'down' ? '#e53e3e' : '#a0aec0'
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Advanced Analytics</Text>
        <View style={styles.periodSelector}>
          {(['week', 'month', 'quarter'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.activePeriodButton,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.activePeriodButtonText,
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.viewSelector}>
        {[
          { key: 'patterns', icon: Calendar, label: 'Success Patterns' },
          { key: 'energy', icon: Zap, label: 'Energy Correlation' },
          { key: 'timing', icon: Clock, label: 'Optimal Timing' },
          { key: 'habits', icon: Activity, label: 'Habit Comparison' },
        ].map(({ key, icon: Icon, label }) => (
          <TouchableOpacity
            key={key}
            style={[
              styles.viewButton,
              selectedView === key && styles.activeViewButton,
            ]}
            onPress={() => setSelectedView(key as any)}
          >
            <Icon 
              size={16} 
              color={selectedView === key ? '#ffffff' : '#a0aec0'} 
            />
            <Text style={[
              styles.viewButtonText,
              selectedView === key && styles.activeViewButtonText,
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartContainer}>
        {renderChart()}
      </View>

      <View style={styles.insightsContainer}>
        <View style={styles.insightHeader}>
          <Brain size={20} color="#805ad5" />
          <Text style={styles.insightTitle}>Key Insights</Text>
        </View>
        
        <View style={styles.insightsList}>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              🌅 Your success rate is 23% higher in the morning (6-9 AM)
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              ⚡ High energy days correlate with 89% completion rates
            </Text>
          </View>
          <View style={styles.insightItem}>
            <Text style={styles.insightText}>
              📈 Your consistency has improved 15% over the past month
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#2d3748',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePeriodButton: {
    backgroundColor: '#48bb78',
  },
  periodButtonText: {
    color: '#a0aec0',
    fontSize: 12,
    fontWeight: '500',
  },
  activePeriodButtonText: {
    color: '#ffffff',
  },
  viewSelector: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 20,
  },
  viewButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d3748',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
    gap: 4,
  },
  activeViewButton: {
    backgroundColor: '#48bb78',
  },
  viewButtonText: {
    color: '#a0aec0',
    fontSize: 10,
    fontWeight: '500',
    textAlign: 'center',
  },
  activeViewButtonText: {
    color: '#ffffff',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  habitsComparison: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    gap: 16,
  },
  habitComparisonItem: {
    gap: 8,
  },
  habitInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  habitTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  habitRate: {
    fontSize: 14,
    fontWeight: '700',
  },
  habitProgressBar: {
    height: 6,
    backgroundColor: '#4a5568',
    borderRadius: 3,
    overflow: 'hidden',
  },
  habitProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightsContainer: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    margin: 20,
    marginBottom: 100,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  insightTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  insightsList: {
    gap: 12,
  },
  insightItem: {
    backgroundColor: '#4a5568',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#805ad5',
  },
  insightText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 20,
  },
});