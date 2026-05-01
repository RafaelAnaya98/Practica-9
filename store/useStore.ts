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
}

const mockExercises: Exercise[] = [
  { id: 'e1', name: 'Press de Banca', muscle: 'Pecho', equipment: 'Barra', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Press' },
  { id: 'e2', name: 'Aperturas', muscle: 'Pecho', equipment: 'Mancuernas', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Aperturas' },
  { id: 'e3', name: 'Extensión de Tríceps', muscle: 'Tríceps', equipment: 'Polea', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Triceps' },
  { id: 'e4', name: 'Sentadilla', muscle: 'Piernas', equipment: 'Barra', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Sentadilla' },
  { id: 'e5', name: 'Dominadas', muscle: 'Espalda', equipment: 'Peso Corporal', thumbnail: 'https://via.placeholder.com/150/121212/00ffcc?text=Dominadas' },
];

const mockWorkout: WorkoutExercise[] = [
  {
    id: 'w1',
    exercise: mockExercises[0],
    sets: [
      { id: 's1', reps: '10', weight: '60', completed: false },
      { id: 's2', reps: '8', weight: '65', completed: false },
      { id: 's3', reps: '6', weight: '70', completed: false },
    ],
  },
  {
    id: 'w2',
    exercise: mockExercises[2],
    sets: [
      { id: 's4', reps: '12', weight: '20', completed: false },
      { id: 's5', reps: '12', weight: '20', completed: false },
      { id: 's6', reps: '10', weight: '25', completed: false },
    ],
  }
];

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
    }),
    {
      name: 'fitness-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
