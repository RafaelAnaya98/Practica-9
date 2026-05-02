import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  thumbnail: string;
}

export interface SetData {
  id: string;
  reps: string;
  weight: string;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  exercise: Exercise;
  sets: SetData[];
}

export interface PastWorkout {
  id: string;
  date: string;
  duration: string;
  volume: number;
  muscles: string[];
}

export interface UserStats {
  lastWorkoutDate: string;
  streak: number;
  recommendedRest: string;
}

interface FitnessState {
  // Ejercicios (Mock Data)
  exercises: Exercise[];
  
  // Historial (Mock Data)
  history: PastWorkout[];
  
  // Inicio / Stats (Mock Data)
  userStats: UserStats;
  
  // Entrenar - Plantilla activa (Mock Data)
  currentWorkout: WorkoutExercise[];
  
  // Descanso (State)
  restTimerSeconds: number;
  isRestTimerRunning: boolean;

  // Acciones (vacías o básicas por ahora ya que es solo UI)
  setRestTimerSeconds: (seconds: number) => void;
  toggleRestTimer: () => void;

  // Acciones de Entrenamiento Activo
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (workoutExerciseId: string) => void;
  addSetToExercise: (workoutExerciseId: string) => void;
  updateSet: (workoutExerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => void;
  toggleSetCompletion: (workoutExerciseId: string, setId: string) => void;
}

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Press' },
  { id: 'e2', name: 'Aperturas', muscle: 'Pecho', equipment: 'Mancuernas', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Aperturas' },
  { id: 'e3', name: 'Extensión de Tríceps', muscle: 'Tríceps', equipment: 'Polea', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Triceps' },
  { id: 'e4', name: 'Sentadilla', muscle: 'Piernas', equipment: 'Barra', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Sentadilla' },
  { id: 'e5', name: 'Dominadas', muscle: 'Espalda', equipment: 'Peso Corporal', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Dominadas' },
];

// currentWorkout starts empty
const mockWorkout: WorkoutExercise[] = [];

const mockHistory: PastWorkout[] = [
  { id: 'h1', date: 'Ayer', duration: '1h 15m', volume: 5400, muscles: ['Espalda', 'Bíceps'] },
  { id: 'h2', date: 'Hace 3 días', duration: '1h 05m', volume: 4800, muscles: ['Piernas', 'Hombros'] },
  { id: 'h3', date: 'Hace 5 días', duration: '1h 20m', volume: 6100, muscles: ['Pecho', 'Tríceps'] },
];

const mockStats: UserStats = {
  lastWorkoutDate: 'Ayer',
  streak: 3,
  recommendedRest: 'Pecho, Tríceps' // Sugerencia de descanso muscular
};

export const useFitnessStore = create<FitnessState>()(
  persist(
    (set, get) => ({
      exercises: mockExercises,
      history: mockHistory,
      userStats: mockStats,
      currentWorkout: mockWorkout,
      restTimerSeconds: 90, // 1:30 min por defecto
      isRestTimerRunning: false,
      
      setRestTimerSeconds: (seconds) => set({ restTimerSeconds: seconds }),
      toggleRestTimer: () => set((state) => ({ isRestTimerRunning: !state.isRestTimerRunning })),

      addExerciseToWorkout: (exercise) => set((state) => ({
        currentWorkout: [
          ...state.currentWorkout,
          {
            id: Date.now().toString() + Math.random().toString(),
            exercise,
            sets: [{ id: Date.now().toString(), reps: '', weight: '', completed: false }]
          }
        ]
      })),
      
      removeExerciseFromWorkout: (workoutExerciseId) => set((state) => ({
        currentWorkout: state.currentWorkout.filter(w => w.id !== workoutExerciseId)
      })),
      
      addSetToExercise: (workoutExerciseId) => set((state) => ({
        currentWorkout: state.currentWorkout.map(workout => {
          if (workout.id === workoutExerciseId) {
            // copy previous set values if possible
            const lastSet = workout.sets[workout.sets.length - 1];
            return {
              ...workout,
              sets: [
                ...workout.sets, 
                { 
                  id: Date.now().toString() + Math.random().toString(), 
                  reps: lastSet ? lastSet.reps : '', 
                  weight: lastSet ? lastSet.weight : '', 
                  completed: false 
                }
              ]
            };
          }
          return workout;
        })
      })),

      updateSet: (workoutExerciseId, setId, field, value) => set((state) => ({
        currentWorkout: state.currentWorkout.map(workout => {
          if (workout.id === workoutExerciseId) {
            return {
              ...workout,
              sets: workout.sets.map(set => set.id === setId ? { ...set, [field]: value } : set)
            };
          }
          return workout;
        })
      })),

      toggleSetCompletion: (workoutExerciseId, setId) => set((state) => ({
        currentWorkout: state.currentWorkout.map(workout => {
          if (workout.id === workoutExerciseId) {
            return {
              ...workout,
              sets: workout.sets.map(set => set.id === setId ? { ...set, completed: !set.completed } : set)
            };
          }
          return workout;
        })
      })),
    }),
    {
      name: 'fitness-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
