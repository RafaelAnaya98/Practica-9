import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useFitnessStore } from '@/store/useStore';

export default function ProgressModal() {
  const router = useRouter();
  const { progressRecords, addProgressRecord } = useFitnessStore();

  const [weight, setWeight] = useState('');
  const [waist, setWaist] = useState('');
  const [chest, setChest] = useState('');
  const [hips, setHips] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setPhotos([...photos, result.assets[0].uri]);
    }
  };

  const handleSave = () => {
    if (!weight && !waist && !chest && !hips && photos.length === 0) {
      Alert.alert('Error', 'Debes ingresar al menos un dato o foto para guardar.');
      return;
    }

    addProgressRecord({
      date: new Date().toLocaleDateString(),
      weight,
      waist,
      chest,
      hips,
      photos
    });

    setWeight('');
    setWaist('');
    setChest('');
    setHips('');
    setPhotos([]);
    Alert.alert('Éxito', 'Progreso guardado correctamente.');
  };

  const renderWeightChart = () => {
    const validRecords = progressRecords.filter(r => r.weight).slice(-7); // Last 7 records
    if (validRecords.length === 0) {
      return <Text style={styles.emptyText}>No hay datos de peso para la gráfica.</Text>;
    }

    const weights = validRecords.map(r => parseFloat(r.weight) || 0);
    const maxWeight = Math.max(...weights);
    const minWeight = Math.min(...weights);
    const range = maxWeight - minWeight === 0 ? 1 : maxWeight - minWeight;

    return (
      <View style={styles.chartContainer}>
        {validRecords.map((record) => {
          const val = parseFloat(record.weight) || 0;
          // Normalize height between 20% and 100% based on min/max
          const heightPercent = 20 + ((val - minWeight) / range) * 80;
          return (
            <View key={record.id} style={styles.barContainer}>
              <Text style={styles.barLabelTop}>{val}</Text>
              <View style={[styles.bar, { height: `${heightPercent}%` }]} />
              <Text style={styles.barLabelBottom} numberOfLines={1}>{record.date.slice(0, 5)}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mi Progreso</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        
        {/* Gráfica de evolución */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evolución de Peso</Text>
          <View style={styles.card}>
            {renderWeightChart()}
          </View>
        </View>

        {/* Formulario de registro */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nuevo Registro</Text>
          <View style={styles.card}>
            
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Peso (kg)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor="#555"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cintura (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor="#555"
                  value={waist}
                  onChangeText={setWaist}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Pecho (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor="#555"
                  value={chest}
                  onChangeText={setChest}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cadera (cm)</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0.0"
                  placeholderTextColor="#555"
                  value={hips}
                  onChangeText={setHips}
                />
              </View>
            </View>

            <Text style={styles.inputLabel}>Fotos de progreso</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {photos.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.photoThumb} />
              ))}
              <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
                <Ionicons name="camera" size={24} color="#00ffcc" />
              </TouchableOpacity>
            </ScrollView>

            <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
              <Ionicons name="save" size={20} color="#000" />
              <Text style={styles.buttonText}>Guardar Registro</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Historial */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historial Completo</Text>
          {progressRecords.slice().reverse().map(record => (
            <View key={record.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyDate}>{record.date}</Text>
              </View>
              <View style={styles.historyBody}>
                {record.weight ? <Text style={styles.historyText}>Peso: <Text style={styles.historyValue}>{record.weight} kg</Text></Text> : null}
                {record.waist ? <Text style={styles.historyText}>Cintura: <Text style={styles.historyValue}>{record.waist} cm</Text></Text> : null}
                {record.chest ? <Text style={styles.historyText}>Pecho: <Text style={styles.historyValue}>{record.chest} cm</Text></Text> : null}
                {record.hips ? <Text style={styles.historyText}>Cadera: <Text style={styles.historyValue}>{record.hips} cm</Text></Text> : null}
              </View>
              {record.photos && record.photos.length > 0 && (
                <ScrollView horizontal style={styles.historyPhotos}>
                  {record.photos.map((p, i) => (
                    <Image key={i} source={{ uri: p }} style={styles.historyPhotoThumb} />
                  ))}
                </ScrollView>
              )}
            </View>
          ))}
          {progressRecords.length === 0 && (
            <Text style={styles.emptyText}>Aún no hay registros. ¡Empieza hoy!</Text>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: '#121212',
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 50,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#121212',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333333',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 150,
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
    width: 35,
  },
  bar: {
    width: 20,
    backgroundColor: '#00ffcc',
    borderRadius: 4,
    minHeight: 5,
  },
  barLabelTop: {
    color: '#ffffff',
    fontSize: 10,
    marginBottom: 4,
  },
  barLabelBottom: {
    color: '#888888',
    fontSize: 10,
    marginTop: 4,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputContainer: {
    width: '48%',
  },
  inputLabel: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333333',
  },
  photosScroll: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 20,
  },
  photoThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
  },
  addPhotoBtn: {
    width: 70,
    height: 70,
    borderRadius: 8,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'dashed',
  },
  primaryButton: {
    backgroundColor: '#00ffcc',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 30,
    marginTop: 10,
    gap: 10,
  },
  buttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888888',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  historyCard: {
    backgroundColor: '#121212',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333333',
  },
  historyHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    paddingBottom: 8,
    marginBottom: 8,
  },
  historyDate: {
    color: '#00ffcc',
    fontWeight: 'bold',
    fontSize: 16,
  },
  historyBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  historyText: {
    color: '#888888',
    fontSize: 14,
    width: '45%',
  },
  historyValue: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  historyPhotos: {
    flexDirection: 'row',
    marginTop: 10,
  },
  historyPhotoThumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 8,
  }
});
