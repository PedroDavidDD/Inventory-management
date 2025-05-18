import { COLORS } from '@/constants/theme';
import { useThemeStore } from '@/store/themeStore';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface GradientBackgroundProps {
  children: React.ReactNode;
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  const { isDarkMode } = useThemeStore();
  
  const colors = isDarkMode 
    ? [COLORS.dark.background.start, COLORS.dark.background.end]
    : [COLORS.light.background.start, COLORS.light.background.end];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={colors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {children}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
});