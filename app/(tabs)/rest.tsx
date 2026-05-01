import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFitnessStore } from '@/store/useStore';

export default function RestScreen() {
  const { restTimerSeconds, isRestTimerRunning, toggleRestTimer, setRestTimerSeconds } = useFitnessStore();

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const addTime = (amount: number) => {
    setRestTimerSeconds(Math.max(0, restTimerSeconds + amount));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Descanso</Text>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={styles.timerText}>{formatTime(restTimerSeconds)}</Text>
          </View>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(-30)}>
            <Text style={styles.adjustText}>-30s</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(30)}>
            <Text style={styles.adjustText}>+30s</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.playButton, isRestTimerRunning ? styles.pauseButton : null]} 
          onPress={toggleRestTimer}
        >
          <Ionicons 
            name={isRestTimerRunning ? "pause" : "play"} 
            size={32} 
            color="#000" 
            style={{ marginLeft: isRestTimerRunning ? 0 : 4 }} 
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Saltar Descanso</Text>
        </TouchableOpacity>
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
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00ffcc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
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
  skipButton: {
    padding: 15,
  },
  skipText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
});
