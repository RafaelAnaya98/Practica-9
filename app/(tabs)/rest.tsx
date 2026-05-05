import { useRestTimer } from '@/hooks/useRestTimer';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const PRESETS = [
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '1m 30s', value: 90 },
  { label: '2m', value: 120 },
];

export default function RestScreen() {
  const {
    restTimerSeconds,
    isRestTimerRunning,
    lastUsedRestTime,
    startTimer,
    resetTimer,
    skipTimer,
    addTime,
    toggleRestTimer
  } = useRestTimer();

  const [isModalVisible, setModalVisible] = useState(false);
  const [customMin, setCustomMin] = useState('');
  const [customSec, setCustomSec] = useState('');

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleCustomSubmit = () => {
    const m = parseInt(customMin || '0', 10);
    const s = parseInt(customSec || '0', 10);
    const total = m * 60 + s;
    if (total > 0) {
      startTimer(total);
    }
    setModalVisible(false);
    setCustomMin('');
    setCustomSec('');
  };

  const progress = lastUsedRestTime > 0 ? Math.min(100, (restTimerSeconds / lastUsedRestTime) * 100) : 0;

  return (
    <View style={styles.container}>


      <View style={styles.timerContainer}>

        <View style={styles.presetsWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.presetsContainer}
          >
            {PRESETS.map((preset) => (
              <TouchableOpacity
                key={preset.value}
                style={[styles.presetButton, lastUsedRestTime === preset.value && styles.presetButtonActive]}
                onPress={() => startTimer(preset.value)}
              >
                <Text style={[styles.presetText, lastUsedRestTime === preset.value && styles.presetTextActive]}>
                  {preset.label}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.presetButton, !PRESETS.find(p => p.value === lastUsedRestTime) && styles.presetButtonActive]}
              onPress={() => setModalVisible(true)}
            >
              <Text style={[styles.presetText, !PRESETS.find(p => p.value === lastUsedRestTime) && styles.presetTextActive]}>
                Personalizado
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.circleOuter}>
          <View style={styles.circleInner}>
            <Text style={[styles.timerText, restTimerSeconds === 0 && styles.timerTextDone]}>
              {formatTime(restTimerSeconds)}
            </Text>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(30)}>
            <Text style={styles.adjustText}>+30s</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.adjustButton} onPress={() => addTime(60)}>
            <Text style={styles.adjustText}>+1m</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.mainControlsRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={resetTimer}>
            <Ionicons name="refresh" size={24} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.playButton, isRestTimerRunning ? styles.pauseButton : null]}
            onPress={toggleRestTimer}
          >
            <Ionicons
              name={isRestTimerRunning ? "pause" : "play"}
              size={36}
              color="#000"
              style={{ marginLeft: isRestTimerRunning ? 0 : 4 }}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={skipTimer}>
            <Ionicons name="play-skip-forward" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

      </View>

      <Modal visible={isModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tiempo Personalizado</Text>

            <View style={styles.inputRow}>
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={customMin}
                  onChangeText={setCustomMin}
                  placeholder="0"
                  placeholderTextColor="#555"
                  maxLength={2}
                />
                <Text style={styles.inputLabel}>Min</Text>
              </View>

              <Text style={styles.colon}>:</Text>

              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={customSec}
                  onChangeText={setCustomSec}
                  placeholder="0"
                  placeholderTextColor="#555"
                  maxLength={2}
                />
                <Text style={styles.inputLabel}>Seg</Text>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalButtonCancel} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonSubmit} onPress={handleCustomSubmit}>
                <Text style={styles.modalButtonTextSubmit}>Iniciar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  timerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  presetsWrapper: {
    height: 50,
  },
  presetsContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 12,
  },
  presetButton: {
    backgroundColor: '#222',
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
    height: 40,
    justifyContent: 'center',
  },
  presetButtonActive: {
    backgroundColor: 'rgba(0, 255, 204, 0.1)',
    borderColor: '#00ffcc',
  },
  presetText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  presetTextActive: {
    color: '#00ffcc',
  },
  circleOuter: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleInner: {
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: '#121212',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  timerText: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#00ffcc',
    fontVariant: ['tabular-nums'],
  },
  timerTextDone: {
    color: '#ffcc00',
  },
  progressContainer: {
    width: 220,
    height: 8,
    backgroundColor: '#222',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#00ffcc',
    borderRadius: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 20,
  },
  adjustButton: {
    backgroundColor: '#222',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  adjustText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainControlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30,
    width: '100%',
  },
  secondaryButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#00ffcc',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#00ffcc',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  pauseButton: {
    backgroundColor: '#ffcc00',
    shadowColor: '#ffcc00',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 30,
    width: '80%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  inputGroup: {
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#222',
    color: '#00ffcc',
    fontSize: 32,
    fontWeight: 'bold',
    width: 80,
    height: 70,
    borderRadius: 12,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  inputLabel: {
    color: '#888',
    marginTop: 8,
    fontSize: 14,
  },
  colon: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    gap: 15,
  },
  modalButtonCancel: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#333',
    alignItems: 'center',
    marginRight: 7.5,
  },
  modalButtonTextCancel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalButtonSubmit: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: '#00ffcc',
    alignItems: 'center',
    marginLeft: 7.5,
  },
  modalButtonTextSubmit: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
