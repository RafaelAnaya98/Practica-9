import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFitnessStore, PastWorkout, WorkoutExercise } from '@/store/useStore';
import { useState } from 'react';

const HistoryCard = ({ item }: { item: PastWorkout }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.historyCard}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={16} color="#00ffcc" />
            <Text style={styles.dateText}>{item.date}</Text>
          </View>
          <Ionicons name={expanded ? "chevron-down" : "chevron-forward"} size={20} color="#555" />
        </View>
        <Text style={styles.workoutTitle}>
          {item.name ? item.name : (item.muscles && item.muscles.length > 0 ? item.muscles.join(', ') : 'Entrenamiento general')}
        </Text>
        
        {item.name && item.muscles && item.muscles.length > 0 && (
          <Text style={styles.workoutSubtitle}>
            Músculos: {item.muscles.join(', ')}
          </Text>
        )}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={16} color="#888" />
            <Text style={styles.statText}>{item.duration}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="barbell-outline" size={16} color="#888" />
            <Text style={styles.statText}>{item.volume} kg</Text>
          </View>
        </View>
      </TouchableOpacity>

      {expanded && item.exercises && item.exercises.length > 0 && (
        <View style={styles.detailsContainer}>
          {item.exercises.map((workoutExercise: WorkoutExercise, index: number) => (
            <View key={workoutExercise.id || index} style={styles.exerciseDetail}>
              <Text style={styles.exerciseDetailName}>{workoutExercise.exercise.name}</Text>
              
              <View style={styles.setsContainer}>
                <View style={styles.setHeaderRow}>
                  <Text style={[styles.setHeaderText, { width: 40 }]}>Set</Text>
                  <Text style={[styles.setHeaderText, { flex: 1, textAlign: 'center' }]}>kg</Text>
                  <Text style={[styles.setHeaderText, { flex: 1, textAlign: 'center' }]}>Reps</Text>
                  <Text style={[styles.setHeaderText, { width: 40, textAlign: 'center' }]}>✓</Text>
                </View>
                
                {workoutExercise.sets.map((set, setIndex) => (
                  <View key={set.id || setIndex} style={styles.setRow}>
                    <Text style={[styles.setText, { width: 40 }]}>{setIndex + 1}</Text>
                    <Text style={[styles.setText, { flex: 1, textAlign: 'center' }]}>{set.weight || '0'}</Text>
                    <Text style={[styles.setText, { flex: 1, textAlign: 'center' }]}>{set.reps || '0'}</Text>
                    <View style={{ width: 40, alignItems: 'center' }}>
                      {set.completed ? (
                        <Ionicons name="checkmark-circle" size={16} color="#00ffcc" />
                      ) : (
                        <Ionicons name="close-circle" size={16} color="#555" />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default function HistoryScreen() {
  const { history } = useFitnessStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Historial</Text>
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="time-outline" size={64} color="#333" />
          <Text style={styles.emptyText}>No hay entrenamientos guardados</Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HistoryCard item={item} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  listContent: {
    padding: 20,
  },
  historyCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dateText: {
    color: '#00ffcc',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
  },
  workoutTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  workoutSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 5,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    color: '#888888',
    fontSize: 14,
    marginLeft: 6,
  },
  detailsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  exerciseDetail: {
    marginBottom: 20,
  },
  exerciseDetailName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  setsContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
  },
  setHeaderRow: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  setHeaderText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  setText: {
    color: '#ddd',
    fontSize: 14,
  },
});
