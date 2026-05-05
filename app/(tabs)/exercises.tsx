import { Exercise, useFitnessStore } from '@/store/useStore';
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, Image, LayoutAnimation, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FILTERS = ['Todos', 'Pecho', 'Espalda', 'Piernas', 'Hombros', 'Brazos', 'Core'];

export default function ExercisesScreen() {
  const { exercises } = useFitnessStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesSearch = ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.muscle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === 'Todos' || ex.muscle === activeFilter;
      return matchesSearch && matchesFilter;
    });
  }, [exercises, searchQuery, activeFilter]);

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity
        style={styles.exerciseCard}
        activeOpacity={0.8}
        onPress={() => toggleExpand(item.id)}
      >
        <View style={styles.cardHeader}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={styles.tagsRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.muscle}</Text>
              </View>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.equipment}</Text>
              </View>
            </View>
          </View>
          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={20}
            color="#555"
          />
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.description}>{item.description}</Text>

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Nivel</Text>
                <Text style={styles.detailValue}>{item.level}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Músculos Principales</Text>
                <Text style={styles.detailValue}>{item.primaryMuscles?.join(', ')}</Text>
              </View>
            </View>

            {item.secondaryMuscles && item.secondaryMuscles.length > 0 && (
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Músculos Secundarios:</Text>
                <Text style={styles.detailValueLine}>{item.secondaryMuscles.join(', ')}</Text>
              </View>
            )}

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Beneficios:</Text>
              <Text style={styles.detailValueLine}>{item.benefits}</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>


        <View style={styles.infoWrapper}>
          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color="#00ffcc" />
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>Biblioteca</Text>
              <Text style={styles.infoText}>Busca o filtra ejercicios por grupo muscular. Toca cualquier tarjeta para ver información detallada.</Text>
            </View>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar ejercicio..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {FILTERS.map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <TouchableOpacity
                key={filter}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderExerciseItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="barbell-outline" size={48} color="#333" />
            <Text style={styles.emptyText}>No se encontraron ejercicios</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    paddingTop: 20,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  infoWrapper: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 204, 0.3)',
  },
  infoTitle: {
    color: '#00ffcc',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    color: '#e0e0e0',
    fontSize: 14,
    lineHeight: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 44,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: '#fff',
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filtersContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#222',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  filterChipActive: {
    backgroundColor: '#00ffcc',
    borderColor: '#00ffcc',
  },
  filterText: {
    color: '#888',
    fontWeight: 'bold',
  },
  filterTextActive: {
    color: '#000',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  exerciseCard: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 15,
    backgroundColor: '#222',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    color: '#00ffcc',
    fontSize: 10,
    fontWeight: 'bold',
  },
  expandedContent: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  description: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 15,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 15,
  },
  detailItem: {
    flex: 1,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    color: '#888',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#fff',
    fontSize: 13,
  },
  detailValueLine: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 50,
  },
  emptyText: {
    color: '#555',
    fontSize: 16,
    marginTop: 10,
  },
});
