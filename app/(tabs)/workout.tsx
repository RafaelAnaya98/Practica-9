import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFitnessStore, Exercise, WorkoutTemplate } from '@/store/useStore';

export default function WorkoutScreen() {
  const { 
    currentWorkout, 
    currentWorkoutName,
    templates,
    loadTemplate,
    exercises,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSetToExercise,
    updateSet,
    toggleSetCompletion,
    finishWorkout
  } = useFitnessStore();

  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddExercise = (exercise: Exercise) => {
    addExerciseToWorkout(exercise);
    setModalVisible(false);
  };

  const calculateTotalVolume = () => {
    let volume = 0;
    currentWorkout.forEach(item => {
      item.sets.forEach(set => {
        if (set.completed && set.weight && set.reps) {
          volume += parseFloat(set.weight) * parseInt(set.reps, 10);
        }
      });
    });
    return volume;
  };

  const renderExerciseModal = () => (
    <Modal visible={isModalVisible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Añadir Ejercicio</Text>
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={exercises}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.modalExerciseCard} onPress={() => handleAddExercise(item)}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              <View>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseMuscle}>{item.muscle} • {item.equipment}</Text>
              </View>
              <Ionicons name="add-circle-outline" size={24} color="#00ffcc" style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: 20 }}
        />
      </SafeAreaView>
    </Modal>
  );

  if (currentWorkout.length === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.emptyContainer}>
        <Ionicons name="barbell-outline" size={60} color="#333" style={{ marginTop: 40 }} />
        <Text style={styles.emptyTitle}>¿Qué entrenamos hoy?</Text>
        
        <TouchableOpacity style={styles.primaryButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={20} color="#000" />
          <Text style={styles.primaryButtonText}>Entrenamiento Libre</Text>
        </TouchableOpacity>

        <View style={styles.templatesSection}>
          <Text style={styles.templatesTitle}>Rutinas Prediseñadas</Text>
          <View style={styles.templatesGrid}>
            {templates && templates.map(template => (
              <TouchableOpacity 
                key={template.id} 
                style={styles.templateCard}
                onPress={() => loadTemplate(template.id)}
              >
                <Text style={styles.templateName}>{template.name}</Text>
                <Text style={styles.templateDetail}>{template.exercises.length} ejercicios</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {renderExerciseModal()}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{currentWorkoutName || 'Entrenamiento Libre'}</Text>
        <Text style={styles.headerSubtitle}>Volumen actual: {calculateTotalVolume()} kg</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {currentWorkout.map((item) => (
          <View key={item.id} style={styles.exerciseCard}>
            <View style={styles.exerciseHeader}>
              <Image source={{ uri: item.exercise.thumbnail }} style={styles.thumbnail} />
              <View style={{ flex: 1 }}>
                <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                <Text style={styles.exerciseMuscle}>{item.exercise.muscle} • {item.exercise.equipment}</Text>
              </View>
              <TouchableOpacity style={styles.menuButton} onPress={() => removeExerciseFromWorkout(item.id)}>
                <Ionicons name="trash-outline" size={20} color="#ff4444" />
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
              <View key={set.id} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                <View style={styles.setNumberBadge}>
                  <Text style={styles.setNumberText}>{setIndex + 1}</Text>
                </View>
                
                <Text style={styles.previousText}>-</Text>
                
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={set.weight}
                  onChangeText={(val) => updateSet(item.id, set.id, 'weight', val)}
                />
                
                <TextInput
                  style={styles.input}
                  placeholder="0"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  value={set.reps}
                  onChangeText={(val) => updateSet(item.id, set.id, 'reps', val)}
                />

                <TouchableOpacity 
                  style={[styles.checkButton, set.completed && styles.checkButtonActive]}
                  onPress={() => toggleSetCompletion(item.id, set.id)}
                >
                  <Ionicons name="checkmark" size={18} color={set.completed ? "#000" : "#555"} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={styles.addSetButton} onPress={() => addSetToExercise(item.id)}>
              <Ionicons name="add" size={18} color="#00ffcc" />
              <Text style={styles.addSetText}>Añadir Serie</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        <TouchableOpacity style={styles.addExerciseCardButton} onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={24} color="#00ffcc" />
          <Text style={styles.addExerciseCardText}>Añadir Ejercicio</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.floatingAction}>
        <TouchableOpacity style={styles.finishButton} onPress={finishWorkout}>
          <Text style={styles.finishButtonText}>Terminar Entrenamiento</Text>
        </TouchableOpacity>
      </View>

      {renderExerciseModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  emptyContainer: {
    flexGrow: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 50,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#00ffcc',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    gap: 8,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  templatesSection: {
    width: '100%',
    marginTop: 40,
  },
  templatesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 15,
  },
  templateCard: {
    width: '47%',
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  templateName: {
    color: '#00ffcc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  templateDetail: {
    color: '#888',
    fontSize: 12,
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
  addExerciseCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    borderStyle: 'dashed',
    marginBottom: 20,
    gap: 10,
  },
  addExerciseCardText: {
    color: '#00ffcc',
    fontSize: 16,
    fontWeight: 'bold',
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
    padding: 4,
    borderRadius: 8,
  },
  setRowCompleted: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
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
  checkButtonActive: {
    backgroundColor: '#00ffcc',
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#121212',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalExerciseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  }
});
