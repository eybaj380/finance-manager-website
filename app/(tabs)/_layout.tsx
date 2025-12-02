import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="budget_tracker"
        options={{
          title: 'Budget Tracker',
          tabBarIcon: ({color}) => <MaterialCommunityIcons name="bullseye-arrow" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="savings"
        options={{
          title: 'Savings',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name='0.square' color={color} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Budget Timeline',
          tabBarIcon: ({ color }) => <IconSymbol size={26} name='0.square' color={color} />,
        }}
      />
    </Tabs>
  );
}
