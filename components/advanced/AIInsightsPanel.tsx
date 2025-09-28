import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { dismissInsight, implementInsight } from '@/store/slices/insightsSlice';
import { Brain, TrendingUp, Clock, Zap, X, Check } from 'lucide-react-native';

export function AIInsightsPanel() {
  const dispatch = useDispatch();
  const { insights, patterns } = useSelector((state: RootState) => state.insights);
  
  const activeInsights = insights.filter(insight => !insight.dismissed).slice(0, 3);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'pattern_recognition':
        return <TrendingUp size={20} color="#805ad5" />;
      case 'recommendation':
        return <Brain size={20} color="#48bb78" />;
      case 'prediction':
        return <Clock size={20} color="#ed8936" />;
      case 'optimization':
        return <Zap size={20} color="#e53e3e" />;
      default:
        return <Brain size={20} color="#a0aec0" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return '#48bb78';
    if (confidence >= 0.6) return '#ed8936';
    return '#e53e3e';
  };

  if (activeInsights.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Brain size={32} color="#4a5568" />
        <Text style={styles.emptyText}>AI insights will appear here as you build habits</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Brain size={20} color="#805ad5" />
        <Text style={styles.headerTitle}>AI Insights</Text>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {activeInsights.map((insight) => (
          <View key={insight.id} style={styles.insightCard}>
            <View style={styles.insightHeader}>
              {getInsightIcon(insight.type)}
              <View style={styles.insightTitleContainer}>
                <Text style={styles.insightTitle}>{insight.title}</Text>
                <View style={styles.confidenceContainer}>
                  <View 
                    style={[
                      styles.confidenceDot, 
                      { backgroundColor: getConfidenceColor(insight.confidence_score) }
                    ]} 
                  />
                  <Text style={styles.confidenceText}>
                    {Math.round(insight.confidence_score * 100)}% confidence
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => dispatch(dismissInsight(insight.id))}
                style={styles.dismissButton}
              >
                <X size={16} color="#718096" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.insightDescription}>{insight.description}</Text>
            
            {insight.actionable_steps.length > 0 && (
              <View style={styles.actionsContainer}>
                <Text style={styles.actionsTitle}>Suggested Actions:</Text>
                {insight.actionable_steps.slice(0, 2).map((step, index) => (
                  <Text key={index} style={styles.actionStep}>• {step}</Text>
                ))}
              </View>
            )}
            
            <TouchableOpacity
              onPress={() => dispatch(implementInsight(insight.id))}
              style={styles.implementButton}
            >
              <Check size={16} color="#ffffff" />
              <Text style={styles.implementButtonText}>Try This</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      
      {patterns.length > 0 && (
        <View style={styles.patternsContainer}>
          <Text style={styles.patternsTitle}>Behavioral Patterns Detected</Text>
          <View style={styles.patternsList}>
            {patterns.slice(0, 2).map((pattern, index) => (
              <View key={index} style={styles.patternItem}>
                <View style={styles.patternStrength}>
                  <View 
                    style={[
                      styles.strengthBar,
                      { width: `${pattern.strength * 100}%` }
                    ]} 
                  />
                </View>
                <Text style={styles.patternDescription}>{pattern.description}</Text>
                <Text style={styles.patternSample}>
                  {pattern.sample_size} data points
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    margin: 20,
    marginTop: 0,
  },
  emptyContainer: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 32,
    margin: 20,
    marginTop: 0,
    alignItems: 'center',
  },
  emptyText: {
    color: '#718096',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  insightCard: {
    backgroundColor: '#4a5568',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    width: 280,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 8,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  confidenceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  confidenceText: {
    color: '#a0aec0',
    fontSize: 12,
  },
  dismissButton: {
    padding: 4,
  },
  insightDescription: {
    color: '#e2e8f0',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  actionsContainer: {
    marginBottom: 16,
  },
  actionsTitle: {
    color: '#48bb78',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
  },
  actionStep: {
    color: '#a0aec0',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
  implementButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#48bb78',
    borderRadius: 8,
    paddingVertical: 8,
    gap: 6,
  },
  implementButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  patternsContainer: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#4a5568',
  },
  patternsTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  patternsList: {
    gap: 12,
  },
  patternItem: {
    backgroundColor: '#4a5568',
    borderRadius: 8,
    padding: 12,
  },
  patternStrength: {
    height: 4,
    backgroundColor: '#718096',
    borderRadius: 2,
    marginBottom: 8,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
    backgroundColor: '#805ad5',
    borderRadius: 2,
  },
  patternDescription: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  patternSample: {
    color: '#a0aec0',
    fontSize: 12,
  },
});