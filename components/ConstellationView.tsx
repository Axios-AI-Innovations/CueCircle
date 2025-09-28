import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle,
  withSequence,
  withDelay
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';
import { HabitLog } from '@/types';

interface ConstellationViewProps {
  logs: HabitLog[];
  days: number;
}

interface Star {
  x: number;
  y: number;
  completed: boolean;
  day: number;
}

export function ConstellationView({ logs, days = 7 }: ConstellationViewProps) {
  const [stars, setStars] = useState<Star[]>([]);
  const screenWidth = Dimensions.get('window').width - 40;
  const screenHeight = 200;

  useEffect(() => {
    generateStars();
  }, [logs, days]);

  const generateStars = () => {
    const newStars: Star[] = [];
    const today = new Date();
    
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.logged_at);
        return logDate.toDateString() === date.toDateString() && log.completed;
      });
      
      // Position stars in constellation pattern
      const angle = (i / days) * 2 * Math.PI;
      const radius = Math.min(screenWidth, screenHeight) * 0.3;
      const centerX = screenWidth / 2;
      const centerY = screenHeight / 2;
      
      newStars.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        completed: dayLogs.length > 0,
        day: i,
      });
    }
    
    setStars(newStars);
  };

  return (
    <View style={styles.container}>
      <Svg width={screenWidth} height={screenHeight}>
        {/* Draw constellation lines */}
        {stars.map((star, index) => {
          const nextStar = stars[index + 1];
          if (nextStar && star.completed && nextStar.completed) {
            return (
              <Line
                key={`line-${index}`}
                x1={star.x}
                y1={star.y}
                x2={nextStar.x}
                y2={nextStar.y}
                stroke="#48bb78"
                strokeWidth="1"
                opacity="0.6"
              />
            );
          }
          return null;
        })}
        
        {/* Draw stars */}
        {stars.map((star, index) => (
          <StarComponent
            key={index}
            star={star}
            index={index}
          />
        ))}
      </Svg>
    </View>
  );
}

function StarComponent({ star, index }: { star: Star; index: number }) {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    scale.value = withDelay(
      index * 100,
      withSequence(
        withSpring(1.2, { damping: 10 }),
        withSpring(1, { damping: 15 })
      )
    );
    opacity.value = withDelay(index * 100, withSpring(1));
  }, [star.completed]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: star.x - 8,
          top: star.y - 8,
        },
        animatedStyle,
      ]}
    >
      <Circle
        cx="8"
        cy="8"
        r="6"
        fill={star.completed ? "#48bb78" : "#4a5568"}
        stroke={star.completed ? "#38a169" : "#718096"}
        strokeWidth="2"
      />
      {star.completed && (
        <Circle
          cx="8"
          cy="8"
          r="3"
          fill="#ffffff"
          opacity="0.8"
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a202c',
    borderRadius: 16,
    padding: 20,
    margin: 20,
  },
});