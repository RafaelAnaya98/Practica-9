import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFitnessStore } from '@/store/useStore';

export default function HomeScreen() {
  const { userStats } = useFitnessStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, Atleta</Text>
        <Text style={styles.subtitle}>Listo para destruir tus límites?</Text>
      </View>

      <View style={styles.grid}>
        <View style={[styles.card, styles.cardAccent]}>
          <Ionicons name="flame" size={24} color="#000" />
          <Text style={styles.cardTitleBlack}>Racha Actual</Text>
          <Text style={styles.cardValueBlack}>{userStats.streak} días</Text>
        </View>

        <View style={styles.card}>
          <Ionicons name="calendar" size={24} color="#00ffcc" />
          <Text style={styles.cardTitle}>Último Entrenamiento</Text>
          <Text style={styles.cardValue}>{userStats.lastWorkoutDate}</Text>
        </View>

        <View style={[styles.card, { width: '100%' }]}>
          <Ionicons name="body" size={24} color="#00ffcc" />
          <Text style={styles.cardTitle}>Descanso Recomendado</Text>
          <Text style={styles.cardValue}>{userStats.recommendedRest}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.primaryButton}>
        <Ionicons name="play" size={20} color="#000" />
        <Text style={styles.buttonText}>Comenzar Entrenamiento</Text>
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
