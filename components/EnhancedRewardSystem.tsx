import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { MicroReward } from '@/types/microHabits';
import { Star, Zap, Trophy, Gift, Sparkles } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface EnhancedRewardSystemProps {
  reward: MicroReward;
  onAnimationComplete: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function EnhancedRewardSystem({ reward, onAnimationComplete }: EnhancedRewardSystemProps) {
  const [animations] = useState({
    scale: new Animated.Value(0),
    opacity: new Animated.Value(0),
    rotation: new Animated.Value(0),
    particles: [...Array(12)].map(() => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(1),
      scale: new Animated.Value(1),
    })),
  });

  useEffect(() => {
    startRewardAnimation();
    
    // Cleanup function to prevent state updates on unmounted component
    return () => {
      // Clear any pending timeouts
      animations.particles.forEach(particle => {
        particle.x.stopAnimation();
        particle.y.stopAnimation();
        particle.opacity.stopAnimation();
        particle.scale.stopAnimation();
      });
      animations.scale.stopAnimation();
      animations.opacity.stopAnimation();
      animations.rotation.stopAnimation();
    };
  }, []);

  const startRewardAnimation = () => {
    // Haptic feedback based on rarity
    switch (reward.rarity) {
      case 'common':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'uncommon':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'rare':
      case 'epic':
      case 'legendary':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
    }

    // Main reward animation
    Animated.parallel([
      Animated.sequence([
        Animated.timing(animations.scale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(animations.scale, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(animations.opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animations.rotation, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();

    // Particle animation for special effects
    if (reward.visual_effect === 'confetti' || reward.visual_effect === 'fireworks') {
      startParticleAnimation();
    }

    // Auto-dismiss after animation
    const timeoutId = setTimeout(() => {
      dismissReward();
    }, 2500);
    
    // Store timeout ID for cleanup
    return timeoutId;
  };

  const startParticleAnimation = () => {
    const particleAnimations = animations.particles.map((particle, index) => {
      const angle = (index / animations.particles.length) * 2 * Math.PI;
      const distance = 100 + Math.random() * 50;
      const targetX = Math.cos(angle) * distance;
      const targetY = Math.sin(angle) * distance;

      return Animated.parallel([
        Animated.timing(particle.x, {
          toValue: targetX,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.timing(particle.y, {
          toValue: targetY,
          duration: 800 + Math.random() * 400,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(particle.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(particle.scale, {
            toValue: 1.5,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(particle.scale, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ]);
    });

    Animated.parallel(particleAnimations).start();
  };

  const dismissReward = () => {
    Animated.parallel([
      Animated.timing(animations.scale, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(animations.opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onAnimationComplete);
  };

  const getRewardIcon = () => {
    switch (reward.type) {
      case 'xp':
        return <Star size={32} color="#ed8936" fill="#ed8936" />;
      case 'badge':
        return <Trophy size={32} color="#805ad5" />;
      case 'unlock':
        return <Gift size={32} color="#48bb78" />;
      case 'streak_bonus':
        return <Zap size={32} color="#e53e3e" />;
      case 'surprise':
        return <Sparkles size={32} color="#ed8936" />;
      default:
        return <Star size={32} color="#48bb78" />;
    }
  };

  const getRarityColor = () => {
    switch (reward.rarity) {
      case 'common': return '#a0aec0';
      case 'uncommon': return '#48bb78';
      case 'rare': return '#805ad5';
      case 'epic': return '#ed8936';
      case 'legendary': return '#e53e3e';
      default: return '#a0aec0';
    }
  };

  const getRarityGlow = () => {
    const color = getRarityColor();
    return {
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 20,
    };
  };

  const rotation = animations.rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.overlay}>
      {/* Particles */}
      {(reward.visual_effect === 'confetti' || reward.visual_effect === 'fireworks') && (
        <View style={styles.particlesContainer}>
          {animations.particles.map((particle, index) => (
            <Animated.View
              key={index}
              style={[
                styles.particle,
                {
                  transform: [
                    { translateX: particle.x },
                    { translateY: particle.y },
                    { scale: particle.scale },
                  ],
                  opacity: particle.opacity,
                },
              ]}
            >
              <View style={[styles.particleDot, { backgroundColor: getRarityColor() }]} />
            </Animated.View>
          ))}
        </View>
      )}

      {/* Main reward display */}
      <Animated.View
        style={[
          styles.rewardContainer,
          getRarityGlow(),
          {
            transform: [
              { scale: animations.scale },
              { rotate: reward.visual_effect === 'rainbow' ? rotation : '0deg' },
            ],
            opacity: animations.opacity,
          },
        ]}
      >
        <View style={[styles.rewardCard, { borderColor: getRarityColor() }]}>
          <View style={styles.rewardHeader}>
            <Text style={[styles.rarityText, { color: getRarityColor() }]}>
              {reward.rarity.toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.rewardIcon}>
            {getRewardIcon()}
          </View>
          
          <Text style={styles.rewardTitle}>{reward.title}</Text>
          <Text style={styles.rewardDescription}>{reward.description}</Text>
          
          {reward.value > 0 && (
            <View style={styles.rewardValue}>
              <Text style={styles.rewardValueText}>+{reward.value}</Text>
            </View>
          )}
        </View>
      </Animated.View>

      {/* Background glow effect */}
      <Animated.View
        style={[
          styles.backgroundGlow,
          {
            opacity: animations.opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.3],
            }),
            backgroundColor: getRarityColor(),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  backgroundGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particlesContainer: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  particle: {
    position: 'absolute',
  },
  particleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  rewardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardCard: {
    backgroundColor: '#2d3748',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 3,
    minWidth: 200,
    maxWidth: 280,
  },
  rewardHeader: {
    marginBottom: 16,
  },
  rarityText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },
  rewardIcon: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 50,
    backgroundColor: '#4a5568',
  },
  rewardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  rewardDescription: {
    fontSize: 14,
    color: '#a0aec0',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  rewardValue: {
    backgroundColor: '#48bb78',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rewardValueText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});