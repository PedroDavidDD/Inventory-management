import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';

interface FormProps {
  children: React.ReactNode;
  onSubmit: () => void;
}

export const Form = ({ children, onSubmit }: FormProps) => {
  return (
    <View style={styles.container}>
      <form onSubmit={onSubmit}>
        {children}
      </form>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    ...(Platform.OS === 'web' && {
      display: 'flex',
      flexDirection: 'column',
    }),
  },
});
