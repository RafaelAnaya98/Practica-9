import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFitnessStore } from '@/store/useStore';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  const { currentWorkout, history, isRestTimerRunning, restTimerSeconds, exercises, progressRecords } = useFitnessStore();

  const isWorkoutActive = currentWorkout.length > 0;
  const entrenarSummary = isWorkoutActive ? `${currentWorkout.length} ej. activos` : 'Sin iniciar';

  const lastWorkout = history.length > 0 ? history[0].date : 'Sin registros';

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  const descansoSummary = isRestTimerRunning ? `${formatTime(restTimerSeconds)}` : 'Inactivo';

  const ejerciciosSummary = `${exercises.length} rutinas`; // Or exercises, but keeping it brief

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Atleta</Text>
        <Text style={styles.subtitle}>¿Listo para destruir tus límites?</Text>
      </View>

      <View style={styles.grid}>
        {/* Card 1: Entrenar */}
        <TouchableOpacity 
          style={[styles.card, isWorkoutActive && styles.cardAccent]} 
          onPress={() => router.navigate('/workout')}
          activeOpacity={0.8}
        >
          <Ionicons name="barbell" size={24} color={isWorkoutActive ? "#000" : "#00ffcc"} />
          <Text style={isWorkoutActive ? styles.cardTitleBlack : styles.cardTitle}>Entrenar</Text>
          <Text style={isWorkoutActive ? styles.cardValueBlack : styles.cardValue}>{entrenarSummary}</Text>
        </TouchableOpacity>

        {/* Card 2: Historial */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.navigate('/history')}
          activeOpacity={0.8}
        >
          <Ionicons name="time" size={24} color="#00ffcc" />
          <Text style={styles.cardTitle}>Último entreno</Text>
          <Text style={styles.cardValue}>{lastWorkout}</Text>
        </TouchableOpacity>

        {/* Card 3: Descanso */}
        <TouchableOpacity 
          style={[styles.card, isRestTimerRunning && styles.cardAccent]} 
          onPress={() => router.navigate('/rest')}
          activeOpacity={0.8}
        >
          <Ionicons name="timer" size={24} color={isRestTimerRunning ? "#000" : "#00ffcc"} />
          <Text style={isRestTimerRunning ? styles.cardTitleBlack : styles.cardTitle}>Descanso</Text>
          <Text style={isRestTimerRunning ? styles.cardValueBlack : styles.cardValue}>{descansoSummary}</Text>
        </TouchableOpacity>

        {/* Card 4: Ejercicios */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.navigate('/exercises')}
          activeOpacity={0.8}
        >
          <Ionicons name="library" size={24} color="#00ffcc" />
          <Text style={styles.cardTitle}>Ejercicios</Text>
          <Text style={styles.cardValue}>{exercises.length} disp.</Text>
        </TouchableOpacity>

        {/* Card 5: Progreso */}
        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.navigate('/progress')}
          activeOpacity={0.8}
        >
          <Ionicons name="trending-up" size={24} color="#00ffcc" />
          <Text style={styles.cardTitle}>Progreso</Text>
          <Text style={styles.cardValue}>{progressRecords.length} reg.</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.primaryButton}
        onPress={() => router.navigate('/workout')}
        activeOpacity={0.8}
      >
        <Ionicons name="play" size={20} color="#000" />
        <Text style={styles.buttonText}>{isWorkoutActive ? 'Continuar Entrenamiento' : 'Comenzar Entrenamiento'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 30,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    color: '#888888',
    marginTop: 5,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  card: {
    width: '47%',
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  cardAccent: {
    backgroundColor: '#00ffcc',
    borderColor: '#00ffcc',
  },
  cardTitle: {
    color: '#888888',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  cardValue: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardTitleBlack: {
    color: '#333333',
    fontSize: 14,
    marginTop: 10,
    marginBottom: 5,
  },
  cardValueBlack: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  primaryButton: {
    backgroundColor: '#00ffcc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    marginTop: 40,
    gap: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
