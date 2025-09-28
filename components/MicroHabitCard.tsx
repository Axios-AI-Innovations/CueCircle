import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { MicroHabit, FunVariant } from '@/types/microHabits';
import { Check, Star, Zap, Clock, Sparkles, Heart, Target } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface MicroHabitCardProps {
  habit: MicroHabit;
  onComplete: (habitId: string, method: string, funVariant?: FunVariant) => void;
  showFunVariants?: boolean;
}

export function MicroHabitCard({ habit, onComplete, showFunVariants = true }: MicroHabitCardProps) {
  const [selectedVariant, setSelectedVariant] = useState<FunVariant>(habit.fun_variants[0]);
  const [showVariants, setShowVariants] = useState(false);
  const [celebrationAnim] = useState(new Animated.Value(0));

  const handleComplete = () => {
    // Trigger celebration animation
    Animated.sequence([
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(celebrationAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Haptic feedback based on difficulty
    if (habit.difficulty_level <= 2) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onComplete(habit.id, selectedVariant.method, selectedVariant);
  };

  const getEnergyColor = (energy: string) => {
    switch (energy) {
      case 'none': return '#48bb78';
      case 'minimal': return '#ed8936';
      case 'low': return '#805ad5';
      case 'medium': return '#e53e3e';
      case 'high': return '#c53030';
      default: return '#a0aec0';
    }
  };

  const getEnergyIcon = (energy: string) => {
    switch (energy) {
      case 'none': return <Heart size={12} color={getEnergyColor(energy)} />;
      case 'minimal': return <Sparkles size={12} color={getEnergyColor(energy)} />;
      default: return <Zap size={12} color={getEnergyColor(energy)} />;
    }
  };

  const celebrationScale = celebrationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  const celebrationOpacity = celebrationAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });

  if (!habit.unlocked) {
    return (
      <View style={[styles.card, styles.lockedCard]}>
        <View style={styles.lockIcon}>
          <Text style={styles.lockText}>🔒</Text>
        </View>
        <Text style={styles.lockedText}>Complete previous habits to unlock</Text>
      </View>
    );
  }

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: celebrationScale }] }]}>
      {/* Celebration overlay */}
      <Animated.View 
        style={[
          styles.celebrationOverlay,
          { opacity: celebrationOpacity }
        ]}
        pointerEvents="none"
      >
        <Text style={styles.celebrationText}>🎉 Amazing! 🎉</Text>
      </Animated.View>

      <View style={styles.header}>
        <View style={styles.habitInfo}>
          <Text style={styles.habitTitle}>{habit.title}</Text>
          <View style={styles.metaInfo}>
            {getEnergyIcon(habit.energy_requirement)}
            <Text style={styles.metaText}>{habit.energy_requirement} energy</Text>
            <Clock size={12} color="#a0aec0" />
            <Text style={styles.metaText}>{habit.estimated_time}s</Text>
            <Star size={12} color="#ed8936" />
            <Text style={styles.metaText}>+{habit.xp_reward} XP</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.completeButton,
            habit.completed && styles.completedButton,
            { backgroundColor: getEnergyColor(habit.energy_requirement) }
          ]}
          onPress={handleComplete}
          disabled={habit.completed}
        >
          {habit.completed ? (
            <Check size={20} color="#ffffff" />
          ) : (
            <Target size={20} color="#ffffff" />
          )}
        </TouchableOpacity>
      </View>

      {showFunVariants && habit.fun_variants.length > 1 && (
        <View style={styles.variantsContainer}>
          <TouchableOpacity
            style={styles.variantsToggle}
            onPress={() => setShowVariants(!showVariants)}
          >
            <Sparkles size={16} color="#805ad5" />
            <Text style={styles.variantsToggleText}>
              {showVariants ? 'Hide' : 'Show'} Fun Ways ({habit.fun_variants.length})
            </Text>
          </TouchableOpacity>
          
          {showVariants && (
            <View style={styles.variantsList}>
              {habit.fun_variants.map((variant) => (
                <TouchableOpacity
                  key={variant.id}
                  style={[
                    styles.variantOption,
                    selectedVariant.id === variant.id && styles.selectedVariant,
                    !variant.unlocked && styles.lockedVariant,
                  ]}
                  onPress={() => variant.unlocked && setSelectedVariant(variant)}
                  disabled={!variant.unlocked}
                >
                  <Text style={[
                    styles.variantName,
                    selectedVariant.id === variant.id && styles.selectedVariantText,
                    !variant.unlocked && styles.lockedVariantText,
                  ]}>
                    {variant.unlocked ? variant.name : `🔒 ${variant.name}`}
                  </Text>
                  <Text style={styles.variantDescription}>{variant.description}</Text>
                  {variant.unlocked && (
                    <View style={styles.variantBonus}>
                      <Text style={styles.variantBonusText}>
                        +{Math.round((variant.engagement_boost - 1) * 100)}% XP
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      <View style={styles.progressIndicator}>
        <View style={styles.difficultyStars}>
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={12}
              color={i < habit.difficulty_level ? '#ed8936' : '#4a5568'}
              fill={i < habit.difficulty_level ? '#ed8936' : 'transparent'}
            />
          ))}
        </View>
        <Text style={styles.orderText}>Step {habit.order_index + 1}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#2d3748',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginVertical: 6,
    position: 'relative',
    overflow: 'hidden',
  },
  lockedCard: {
    backgroundColor: '#4a556820',
    borderWidth: 1,
    borderColor: '#4a5568',
    borderStyle: 'dashed',
  },
  celebrationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#48bb7840',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    zIndex: 10,
  },
  celebrationText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  habitInfo: {
    flex: 1,
    marginRight: 12,
  },
  habitTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  metaText: {
    color: '#a0aec0',
    fontSize: 12,
    fontWeight: '500',
  },
  completeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  completedButton: {
    backgroundColor: '#48bb78',
  },
  variantsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#4a5568',
  },
  variantsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  variantsToggleText: {
    color: '#805ad5',
    fontSize: 14,
    fontWeight: '500',
  },
  variantsList: {
    gap: 8,
  },
  variantOption: {
    backgroundColor: '#4a5568',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedVariant: {
    borderColor: '#805ad5',
    backgroundColor: '#805ad520',
  },
  lockedVariant: {
    backgroundColor: '#4a556820',
    opacity: 0.6,
  },
  variantName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedVariantText: {
    color: '#805ad5',
  },
  lockedVariantText: {
    color: '#718096',
  },
  variantDescription: {
    color: '#a0aec0',
    fontSize: 12,
    marginBottom: 4,
  },
  variantBonus: {
    alignSelf: 'flex-start',
  },
  variantBonusText: {
    color: '#ed8936',
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: '#ed893620',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  progressIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  difficultyStars: {
    flexDirection: 'row',
    gap: 2,
  },
  orderText: {
    color: '#718096',
    fontSize: 12,
    fontWeight: '500',
  },
  lockIcon: {
    alignItems: 'center',
    marginBottom: 8,
  },
  lockText: {
    fontSize: 24,
  },
  lockedText: {
    color: '#718096',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});