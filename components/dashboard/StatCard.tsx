import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}

export const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <View style={[styles.card, { backgroundColor: `${color}20` }]}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.title}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    minHeight: 100,
    borderRadius: 12,
    padding: 16,
    backgroundColor: 'white',
    boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.1)', // Web
    shadowColor: '#000', // Móvil
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // Android
    flexDirection: 'row', // Cambiamos a fila horizontal
    alignItems: 'center', // Centramos verticalmente
    justifyContent: 'space-between', // Espaciado horizontal
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1, // Ocupa el espacio restante
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#64748b',
  },
});