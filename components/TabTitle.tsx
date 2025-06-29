import { COLORS } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface TabTitleProps {
  title: string;
}

export const TabTitle: React.FC<TabTitleProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.light.text.primary,
  },
});
