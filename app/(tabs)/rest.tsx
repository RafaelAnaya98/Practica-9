import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFitnessStore } from '@/store/useStore';

const PRESETS = [
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '1m 30s', value: 90 },
  { label: '2m', value: 120 },
  { label: '3m', value: 180 },
];

export default function RestScreen() {
  const { restTimerSeconds, isRestTimerRunning, toggleRestTimer, setRestTimerSeconds } = useFitnessStore();
  const [initialTime, setInitialTime] = useState(90);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    
    if (isRestTimerRunning && restTimerSeconds > 0) {
      timeout = setTimeout(() => {
        setRestTimerSeconds(restTimerSeconds - 1);
      }, 1000);
    } else if (restTimerSeconds === 0 && isRestTimerRunning) {
      toggleRestTimer(); // Auto-pause when 0
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isRestTimerRunning, restTimerSeconds, setRestTimerSeconds, toggleRestTimer]);

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const addTime = (amount: number) => {
    const newTime = Math.max(0, restTimerSeconds + amount);
    setRestTimerSeconds(newTime);
    setInitialTime(newTime);
  };

  const setPreset = (seconds: number) => {
    setInitialTime(seconds);
    setRestTimerSeconds(seconds);
    if (isRestTimerRunning) {
      toggleRestTimer();
    }
  };

  const restartTimer = () => {
    setRestTimerSeconds(initialTime);
    if (!isRestTimerRunning && initialTime > 0) {
      toggleRestTimer();
    }
  };

  const skipTimer = () => {
    setRestTimerSeconds(0);
    if (isRestTimerRunning) {
      toggleRestTimer();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Descanso</Text>
      </View>

      <View style={styles.timerContainer}>
        
        <View style={styles.presetsWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={styles.presetsContainer}
          >
            {PRESETS.map((preset) => (
              <TouchableOpacity 
                key={preset.value} 
                style={[styles.presetButton, initialTime === preset.value && styles.presetButtonActive]}
                onPress={() => setPreset(preset.value)}
              >
                <Text style={[styles.presetText, initialTime === preset.value && styles.presetTextActive]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={[styles.timerText, restTimerSeconds === 0 && styles.timerTextDone]}>
              {formatTime(restTimerSeconds)}
            </Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(30)}>
            <Text style={styles.adjustText}>+30s</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(60)}>
            <Text style={styles.adjustText}>+1m</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainControlsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={restartTimer}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.playButton, isRestTimerRunning ? styles.pauseButton : null]} 
            onPress={toggleRestTimer}
          >
            <Ionicons 
              name={isRestTimerRunning ? "pause" : "play"} 
              size={36} 
              color="#000" 
              style={{ marginLeft: isRestTimerRunning ? 0 : 4 }} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={skipTimer}>
            <Ionicons name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  presetsWrapper: {
    height: 50,
    marginBottom: 40,
  },
  presetsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 12,
  },
  presetButton: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    height: 40,
    justifyContent: 'center',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    borderColor: '#00ffcc',
  },
  presetText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  presetTextActive: {
    color: '#00ffcc',
  },
  circleOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 4,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  circleInner: {
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#00ffcc',
    fontVariant: ['tabular-nums'],
  },
  timerTextDone: {
    color: '#ffcc00',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 40,
  },
  adjustButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  adjustText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    width: '100%',
  },
  secondaryButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00ffcc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pauseButton: {
    backgroundColor: '#ffcc00',
    shadowColor: '#ffcc00',
  },
});
