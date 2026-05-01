import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFitnessStore } from '@/store/useStore';

export default function WorkoutScreen() {
  const { currentWorkout } = useFitnessStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Día de Pecho y Tríceps</Text>
        <Text style={styles.headerSubtitle}>Volumen actual: 0 kg</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {currentWorkout.map((item, index) => (
          <View key={item.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Image source={{ uri: item.exercise.thumbnail }} style={styles.thumbnail} />
              <View>
                <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                <Text style={styles.exerciseMuscle}>{item.exercise.muscle} • {item.exercise.equipment}</Text>
              </View>
              <TouchableOpacity style={styles.menuButton}>
                <Ionicons name="ellipsis-vertical" size={20} color="#888" />
              </TouchableOpacity>
            </View>

            {/* Column Headers */}
            <View style={styles.tableHeader}>
              <Text style={[styles.tableHeaderText, { width: 40 }]}>Set</Text>
              <Text style={[styles.tableHeaderText, { flex: 1 }]}>Anterior</Text>
              <Text style={[styles.tableHeaderText, { width: 70, textAlign: 'center' }]}>kg</Text>
              <Text style={[styles.tableHeaderText, { width: 70, textAlign: 'center' }]}>Reps</Text>
              <Text style={[styles.tableHeaderText, { width: 40, textAlign: 'center' }]}>✓</Text>
            </View>

            {/* Sets rows */}
            {item.sets.map((set, setIndex) => (
              <View key={set.id} style={styles.setRow}>
                <View style={styles.setNumberBadge}>
                  <Text style={styles.setNumberText}>{setIndex + 1}</Text>
                </View>
                
                <Text style={styles.previousText}>{set.weight}kg x {set.reps}</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder={set.weight}
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                />
                
                <TextInput
                  style={styles.input}
                  placeholder={set.reps}
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                />

                <TouchableOpacity style={styles.checkButton}>
                  <Ionicons name="checkmark" size={18} color="#555" />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addSetButton}>
              <Ionicons name="add" size={18} color="#00ffcc" />
              <Text style={styles.addSetText}>Añadir Serie</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.floatingAction}>
        <TouchableOpacity style={styles.finishButton}>
          <Text style={styles.finishButtonText}>Terminar Entrenamiento</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#00ffcc',
    marginTop: 5,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  exerciseCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  exerciseMuscle: {
    fontSize: 12,
    color: '#888888',
    marginTop: 2,
  },
  menuButton: {
    marginLeft: 'auto',
    padding: 5,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  tableHeaderText: {
    color: '#888888',
    fontSize: 12,
    fontWeight: '600',
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  setNumberBadge: {
    width: 30,
    height: 30,
    backgroundColor: '#222',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  setNumberText: {
    color: '#888',
    fontSize: 12,
    fontWeight: 'bold',
  },
  previousText: {
    flex: 1,
    color: '#888',
    fontSize: 14,
  },
  input: {
    width: 60,
    height: 36,
    backgroundColor: '#222',
    borderRadius: 8,
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkButton: {
    width: 36,
    height: 36,
    backgroundColor: '#222',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
  },
  addSetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 10,
  },
  addSetText: {
    color: '#00ffcc',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  bottomSpacer: {
    height: 80,
  },
  floatingAction: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  finishButton: {
    backgroundColor: '#00ffcc',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  finishButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
