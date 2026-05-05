import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#00ffcc', // Neon green/cyan accent
        tabBarInactiveTintColor: '#888888',
        tabBarStyle: {
          backgroundColor: '#121212',
          borderTopWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 88 : 100,
          paddingBottom: Platform.OS === 'ios' ? 28 : 40,
          paddingTop: 8,
        },
        headerStyle: {
          backgroundColor: '#121212',
          borderBottomWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: '#ffffff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        // We'll use a dark background for all screens by default here or in individual screens.
        sceneStyle: { backgroundColor: '#000000' }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="workout"
        options={{
          title: 'Entrenar',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="barbell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Historial',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="time" color={color} />,
        }}
      />
      <Tabs.Screen
        name="rest"
        options={{
          title: 'Descanso',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="timer" color={color} />,
        }}
      />
      <Tabs.Screen
        name="exercises"
        options={{
          title: 'Ejercicios',
          tabBarIcon: ({ color }) => <FontAwesome5 size={20} name="dumbbell" color={color} />,
        }}
      />
    </Tabs>
  );
}
