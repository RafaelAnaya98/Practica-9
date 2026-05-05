import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Exercise {
  id: string;
  name: string;
  muscle: string;
  equipment: string;
  thumbnail: string;
  description: string;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  benefits: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
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

export interface TemplateExercise {
  exerciseId: string;
  sets: number;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  exercises: TemplateExercise[];
}

export interface PastWorkout {
  name?: string;
  id: string;
  date: string;
  duration: string;
  volume: number;
  muscles: string[];
  exercises: WorkoutExercise[];
}

export interface UserStats {
  lastWorkoutDate: string;
  streak: number;
  recommendedRest: string;
}

export interface ProgressRecord {
  id: string;
  date: string;
  weight: string;
  waist: string;
  chest: string;
  hips: string;
  photos: string[];
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
  currentWorkoutName: string | null;
  templates: WorkoutTemplate[];
  
  // Descanso (State)
  restTimerSeconds: number;
  isRestTimerRunning: boolean;
  lastUsedRestTime: number;

  // Acciones (vacías o básicas por ahora ya que es solo UI)
  setRestTimerSeconds: (seconds: number) => void;
  toggleRestTimer: () => void;
  setLastUsedRestTime: (seconds: number) => void;

  // Acciones de Entrenamiento Activo
  addExerciseToWorkout: (exercise: Exercise) => void;
  removeExerciseFromWorkout: (workoutExerciseId: string) => void;
  addSetToExercise: (workoutExerciseId: string) => void;
  updateSet: (workoutExerciseId: string, setId: string, field: 'reps' | 'weight', value: string) => void;
  toggleSetCompletion: (workoutExerciseId: string, setId: string) => void;
  finishWorkout: () => void;
  
  workoutStartTime: number | null;
  loadTemplate: (templateId: string) => void;

  // Progreso
  progressRecords: ProgressRecord[];
  addProgressRecord: (record: Omit<ProgressRecord, 'id'>) => void;
}

const mockExercises: Exercise[] = [
  // PECHO
  {
    id: 'e_pecho_1',
    name: 'Press de Banca Plano',
    muscle: 'Pecho',
    equipment: 'Barra',
    thumbnail: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=150&q=80',
    description: 'Acuéstate en el banco, agarra la barra un poco más ancho que los hombros. Baja controladamente hasta el pecho y empuja de vuelta a la posición inicial.',
    primaryMuscles: ['Pectoral Mayor'],
    secondaryMuscles: ['Tríceps', 'Deltoides Anterior'],
    benefits: 'Desarrollo de fuerza y masa muscular en la parte superior del cuerpo.',
    level: 'Intermedio'
  },
  {
    id: 'e_pecho_2',
    name: 'Press Inclinado',
    muscle: 'Pecho',
    equipment: 'Mancuernas',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&q=80',
    description: 'En un banco inclinado a 30-45 grados, empuja las mancuernas hacia arriba hasta extender los brazos y bájala lentamente.',
    primaryMuscles: ['Pectoral Superior'],
    secondaryMuscles: ['Tríceps', 'Hombros'],
    benefits: 'Enfatiza el desarrollo de la porción superior del pecho.',
    level: 'Intermedio'
  },
  {
    id: 'e_pecho_3',
    name: 'Aperturas',
    muscle: 'Pecho',
    equipment: 'Mancuernas',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80',
    description: 'Tumbado en banco plano, brazos ligeramente flexionados, abre los brazos hasta sentir estiramiento en el pecho y vuelve a cerrar abrazando un barril imaginario.',
    primaryMuscles: ['Pectoral Mayor'],
    secondaryMuscles: ['Deltoides Anterior'],
    benefits: 'Aislamiento del pecho y gran estiramiento muscular.',
    level: 'Principiante'
  },
  {
    id: 'e_pecho_4',
    name: 'Cruces en Polea',
    muscle: 'Pecho',
    equipment: 'Polea',
    thumbnail: 'https://images.unsplash.com/photo-1584865288642-42078afe6942?w=150&q=80',
    description: 'De pie en medio de las poleas altas, tira de los agarres hacia abajo y hacia el centro, cruzando ligeramente las manos al final del movimiento.',
    primaryMuscles: ['Pectoral Mayor (Porción Inferior)'],
    secondaryMuscles: ['Hombros'],
    benefits: 'Tensión constante durante todo el movimiento, ideal para el bombeo final.',
    level: 'Intermedio'
  },
  {
    id: 'e_pecho_5',
    name: 'Flexiones',
    muscle: 'Pecho',
    equipment: 'Peso Corporal',
    thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=150&q=80',
    description: 'En posición de plancha con manos un poco más anchas que los hombros, baja el cuerpo hasta que el pecho casi toque el suelo y empuja hacia arriba.',
    primaryMuscles: ['Pectoral Mayor'],
    secondaryMuscles: ['Tríceps', 'Core'],
    benefits: 'Ejercicio fundamental con peso corporal, mejora la fuerza funcional.',
    level: 'Principiante'
  },

  // ESPALDA
  {
    id: 'e_espalda_1',
    name: 'Dominadas',
    muscle: 'Espalda',
    equipment: 'Peso Corporal',
    thumbnail: 'https://images.unsplash.com/photo-1598971484999-687a030db801?w=150&q=80',
    description: 'Cuelga de una barra con agarre prono. Tira de tu cuerpo hacia arriba hasta que la barbilla pase la barra. Baja controladamente.',
    primaryMuscles: ['Dorsal Ancho'],
    secondaryMuscles: ['Bíceps', 'Antebrazos'],
    benefits: 'El mejor ejercicio con peso corporal para la amplitud de la espalda.',
    level: 'Avanzado'
  },
  {
    id: 'e_espalda_2',
    name: 'Remo con Barra',
    muscle: 'Espalda',
    equipment: 'Barra',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80',
    description: 'Con el torso inclinado hacia adelante y espalda recta, tira de la barra hacia tu ombligo retrayendo las escápulas.',
    primaryMuscles: ['Dorsal Ancho', 'Romboides'],
    secondaryMuscles: ['Bíceps', 'Lumbares'],
    benefits: 'Construye grosor y fuerza general en la espalda.',
    level: 'Intermedio'
  },
  {
    id: 'e_espalda_3',
    name: 'Jalón al Pecho',
    muscle: 'Espalda',
    equipment: 'Máquina',
    thumbnail: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=150&q=80',
    description: 'Sentado en la máquina, agarra la barra ancha y tira hacia la parte superior de tu pecho, juntando las escápulas.',
    primaryMuscles: ['Dorsal Ancho'],
    secondaryMuscles: ['Bíceps'],
    benefits: 'Excelente alternativa a las dominadas para ganar fuerza inicial.',
    level: 'Principiante'
  },
  {
    id: 'e_espalda_4',
    name: 'Remo Gironda',
    muscle: 'Espalda',
    equipment: 'Polea',
    thumbnail: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=150&q=80',
    description: 'Sentado en polea baja, tira del maneral hacia tu abdomen manteniendo el torso recto y apretando la espalda.',
    primaryMuscles: ['Romboides', 'Dorsal Ancho'],
    secondaryMuscles: ['Bíceps'],
    benefits: 'Mejora la postura y el grosor de la espalda media.',
    level: 'Principiante'
  },

  // PIERNAS
  {
    id: 'e_piernas_1',
    name: 'Sentadilla',
    muscle: 'Piernas',
    equipment: 'Barra',
    thumbnail: 'https://images.unsplash.com/photo-1566241440091-ec10de8db2e1?w=150&q=80',
    description: 'Con la barra en la parte alta de la espalda, flexiona rodillas y caderas como si fueras a sentarte hasta romper el paralelo, y sube.',
    primaryMuscles: ['Cuádriceps', 'Glúteos'],
    secondaryMuscles: ['Isquiotibiales', 'Core'],
    benefits: 'Rey de los ejercicios de piernas, gran respuesta hormonal.',
    level: 'Avanzado'
  },
  {
    id: 'e_piernas_2',
    name: 'Prensa',
    muscle: 'Piernas',
    equipment: 'Máquina',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80',
    description: 'Sentado en la máquina, empuja la plataforma con las piernas hasta casi bloquear rodillas, luego desciende controladamente.',
    primaryMuscles: ['Cuádriceps'],
    secondaryMuscles: ['Glúteos', 'Isquiotibiales'],
    benefits: 'Permite mover mucho peso de forma segura, gran estímulo para los muslos.',
    level: 'Principiante'
  },
  {
    id: 'e_piernas_3',
    name: 'Peso Muerto Rumano',
    muscle: 'Piernas',
    equipment: 'Barra',
    thumbnail: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=150&q=80',
    description: 'De pie con la barra en las manos, empuja la cadera hacia atrás manteniendo las piernas casi estiradas hasta sentir estiramiento, y contrae glúteos para subir.',
    primaryMuscles: ['Isquiotibiales', 'Glúteos'],
    secondaryMuscles: ['Lumbares'],
    benefits: 'Desarrolla fuertemente la cadena posterior y previene lesiones.',
    level: 'Intermedio'
  },
  {
    id: 'e_piernas_4',
    name: 'Extensiones de Cuádriceps',
    muscle: 'Piernas',
    equipment: 'Máquina',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&q=80',
    description: 'Sentado en la máquina, extiende las piernas hacia arriba hasta que estén rectas, apretando los muslos en la parte superior.',
    primaryMuscles: ['Cuádriceps'],
    secondaryMuscles: [],
    benefits: 'Aísla el cuádriceps al máximo para generar detalle muscular.',
    level: 'Principiante'
  },

  // HOMBROS
  {
    id: 'e_hombros_1',
    name: 'Press Militar',
    muscle: 'Hombros',
    equipment: 'Barra',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&q=80',
    description: 'De pie o sentado, empuja la barra desde las clavículas hacia arriba hasta extender los brazos por completo.',
    primaryMuscles: ['Deltoides Anterior', 'Deltoides Medio'],
    secondaryMuscles: ['Tríceps', 'Core'],
    benefits: 'Construye fuerza masiva en los hombros y estabiliza el core.',
    level: 'Intermedio'
  },
  {
    id: 'e_hombros_2',
    name: 'Elevaciones Laterales',
    muscle: 'Hombros',
    equipment: 'Mancuernas',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80',
    description: 'De pie con mancuernas a los lados, elévalas lateralmente hasta la altura de los hombros manteniendo una ligera flexión de codo.',
    primaryMuscles: ['Deltoides Medio'],
    secondaryMuscles: [],
    benefits: 'Da amplitud y redondez a los hombros (forma de V).',
    level: 'Principiante'
  },
  {
    id: 'e_hombros_3',
    name: 'Face Pull',
    muscle: 'Hombros',
    equipment: 'Polea',
    thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=150&q=80',
    description: 'Con polea alta y cuerda, tira hacia tu cara separando las manos y rotando externamente los hombros al final.',
    primaryMuscles: ['Deltoides Posterior', 'Manguito Rotador'],
    secondaryMuscles: ['Trapecios'],
    benefits: 'Excelente para la salud del hombro y corregir la postura.',
    level: 'Principiante'
  },

  // BRAZOS
  {
    id: 'e_brazos_1',
    name: 'Curl con Barra',
    muscle: 'Brazos',
    equipment: 'Barra',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&q=80',
    description: 'De pie, agarra la barra a la anchura de los hombros y flexiona los codos subiendo el peso sin balancear el cuerpo.',
    primaryMuscles: ['Bíceps'],
    secondaryMuscles: ['Antebrazos'],
    benefits: 'Ejercicio base para el volumen y fuerza del bíceps.',
    level: 'Principiante'
  },
  {
    id: 'e_brazos_2',
    name: 'Extensión de Tríceps',
    muscle: 'Brazos',
    equipment: 'Polea',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80',
    description: 'En polea alta con cuerda o barra recta, extiende los codos hacia abajo manteniendo los brazos pegados al torso.',
    primaryMuscles: ['Tríceps'],
    secondaryMuscles: [],
    benefits: 'Aísla las tres cabezas del tríceps para máximo desarrollo.',
    level: 'Principiante'
  },
  {
    id: 'e_brazos_3',
    name: 'Curl Martillo',
    muscle: 'Brazos',
    equipment: 'Mancuernas',
    thumbnail: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=150&q=80',
    description: 'Sube las mancuernas con agarre neutro (palmas mirándose) manteniendo los codos fijos.',
    primaryMuscles: ['Braquial', 'Bíceps'],
    secondaryMuscles: ['Braquiorradial'],
    benefits: 'Desarrolla grosor en los brazos y fuerza de agarre.',
    level: 'Principiante'
  },
  {
    id: 'e_brazos_4',
    name: 'Fondos de Tríceps',
    muscle: 'Brazos',
    equipment: 'Peso Corporal',
    thumbnail: 'https://images.unsplash.com/photo-1598971484999-687a030db801?w=150&q=80',
    description: 'En barras paralelas o al borde de un banco, baja el cuerpo flexionando los codos y luego empuja hasta extender.',
    primaryMuscles: ['Tríceps'],
    secondaryMuscles: ['Pecho', 'Hombros'],
    benefits: 'Construye masa masiva en tríceps y fuerza de empuje.',
    level: 'Intermedio'
  },

  // CORE
  {
    id: 'e_core_1',
    name: 'Crunch Abdominal',
    muscle: 'Core',
    equipment: 'Peso Corporal',
    thumbnail: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=150&q=80',
    description: 'Acostado boca arriba con rodillas flexionadas, eleva los hombros del suelo contrayendo el abdomen y exhala.',
    primaryMuscles: ['Recto Abdominal'],
    secondaryMuscles: [],
    benefits: 'Aísla la zona superior del abdomen.',
    level: 'Principiante'
  },
  {
    id: 'e_core_2',
    name: 'Plancha (Plank)',
    muscle: 'Core',
    equipment: 'Peso Corporal',
    thumbnail: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=150&q=80',
    description: 'Apóyate en antebrazos y puntas de los pies. Mantén el cuerpo en línea recta y aprieta el abdomen y glúteos.',
    primaryMuscles: ['Transverso Abdominal'],
    secondaryMuscles: ['Hombros', 'Glúteos'],
    benefits: 'Fortalece la estabilidad central y protege la columna.',
    level: 'Principiante'
  },
  {
    id: 'e_core_3',
    name: 'Elevación de Piernas',
    muscle: 'Core',
    equipment: 'Barra de Dominadas',
    thumbnail: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?w=150&q=80',
    description: 'Colgado de una barra, eleva las piernas rectas (o rodillas flexionadas) hacia tu pecho usando solo la fuerza del abdomen.',
    primaryMuscles: ['Recto Abdominal Inferior'],
    secondaryMuscles: ['Flexores de cadera'],
    benefits: 'Desarrolla fuerza bruta en el core y marca la zona inferior.',
    level: 'Avanzado'
  }
];

const mockTemplates: WorkoutTemplate[] = [
  {
    id: 't_push',
    name: 'Push (Pecho, Hombro, Tríceps)',
    exercises: [
      { exerciseId: 'e_pecho_1', sets: 4 },
      { exerciseId: 'e_pecho_2', sets: 3 },
      { exerciseId: 'e_hombros_1', sets: 4 },
      { exerciseId: 'e_hombros_2', sets: 3 },
      { exerciseId: 'e_brazos_2', sets: 3 },
    ]
  },
  {
    id: 't_pull',
    name: 'Pull (Espalda, Bíceps)',
    exercises: [
      { exerciseId: 'e_espalda_1', sets: 4 },
      { exerciseId: 'e_espalda_2', sets: 4 },
      { exerciseId: 'e_espalda_4', sets: 3 },
      { exerciseId: 'e_brazos_1', sets: 4 },
      { exerciseId: 'e_brazos_3', sets: 3 },
    ]
  },
  {
    id: 't_pierna',
    name: 'Pierna Completa',
    exercises: [
      { exerciseId: 'e_piernas_1', sets: 4 },
      { exerciseId: 'e_piernas_2', sets: 4 },
      { exerciseId: 'e_piernas_3', sets: 4 },
      { exerciseId: 'e_piernas_4', sets: 3 },
    ]
  },
  {
    id: 't_torso',
    name: 'Torso',
    exercises: [
      { exerciseId: 'e_pecho_1', sets: 4 },
      { exerciseId: 'e_espalda_2', sets: 4 },
      { exerciseId: 'e_hombros_1', sets: 3 },
      { exerciseId: 'e_brazos_1', sets: 3 },
      { exerciseId: 'e_brazos_2', sets: 3 },
    ]
  },
  {
    id: 't_fullbody',
    name: 'Full Body',
    exercises: [
      { exerciseId: 'e_piernas_1', sets: 3 },
      { exerciseId: 'e_pecho_1', sets: 3 },
      { exerciseId: 'e_espalda_2', sets: 3 },
      { exerciseId: 'e_hombros_2', sets: 3 },
      { exerciseId: 'e_core_2', sets: 3 },
    ]
  }
];

// currentWorkout starts empty
const mockWorkout: WorkoutExercise[] = [];

const mockHistory: PastWorkout[] = [];

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
      currentWorkoutName: null,
      templates: mockTemplates,
      workoutStartTime: null,
      restTimerSeconds: 90, // 1:30 min por defecto
      isRestTimerRunning: false,
      lastUsedRestTime: 90,
      progressRecords: [],
      
      setRestTimerSeconds: (seconds) => set({ restTimerSeconds: seconds }),
      toggleRestTimer: () => set((state) => ({ isRestTimerRunning: !state.isRestTimerRunning })),
      setLastUsedRestTime: (seconds) => set({ lastUsedRestTime: seconds }),

      loadTemplate: (templateId) => set((state) => {
        const template = state.templates.find(t => t.id === templateId);
        if (!template) return state;

        const newWorkout: WorkoutExercise[] = template.exercises.map(te => {
          const ex = state.exercises.find(e => e.id === te.exerciseId);
          if (!ex) return null;
          
          const sets: SetData[] = Array.from({ length: te.sets }).map((_, i) => ({
            id: Date.now().toString() + Math.random().toString() + i,
            reps: '',
            weight: '',
            completed: false
          }));

          return {
            id: Date.now().toString() + Math.random().toString(),
            exercise: ex,
            sets
          };
        }).filter(Boolean) as WorkoutExercise[];

        return {
          currentWorkoutName: template.name,
          currentWorkout: newWorkout,
          workoutStartTime: Date.now()
        };
      }),

      addProgressRecord: (record) => set((state) => ({
        progressRecords: [
          ...state.progressRecords,
          { ...record, id: Date.now().toString() }
        ]
      })),

      addExerciseToWorkout: (exercise) => set((state) => ({
        workoutStartTime: state.workoutStartTime || Date.now(),
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

      finishWorkout: () => set((state) => {
        if (state.currentWorkout.length === 0) return state;
        
        let volume = 0;
        const muscles = new Set<string>();
        
        state.currentWorkout.forEach(item => {
          muscles.add(item.exercise.muscle);
          item.sets.forEach(set => {
            if (set.completed && set.weight && set.reps) {
              volume += parseFloat(set.weight) * parseInt(set.reps, 10);
            }
          });
        });

        const endTime = Date.now();
        const startTime = state.workoutStartTime || endTime;
        const diffMs = endTime - startTime;
        const diffMins = Math.floor(diffMs / 60000);
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        const duration = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;

        const newWorkout: PastWorkout = {
          id: Date.now().toString(),
          name: state.currentWorkoutName || 'Entrenamiento libre',
          date: new Date().toLocaleDateString(),
          duration: duration,
          volume: volume,
          muscles: Array.from(muscles),
          exercises: [...state.currentWorkout],
        };

        return {
          history: [newWorkout, ...state.history],
          currentWorkout: [],
          currentWorkoutName: null,
          workoutStartTime: null,
        };
      }),
    }),
    {
      name: 'fitness-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        history: state.history,
        userStats: state.userStats,
        currentWorkout: state.currentWorkout,
        currentWorkoutName: state.currentWorkoutName,
        restTimerSeconds: state.restTimerSeconds,
        lastUsedRestTime: state.lastUsedRestTime,
        progressRecords: state.progressRecords,
        // we omit exercises so the mock data updates correctly when reloading the app
      } as any),
    }
  )
);
