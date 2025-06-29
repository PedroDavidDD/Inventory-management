import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TagsPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  const tags = [
    { id: 1, name: 'Alimentos', color: '#FF6B6B' },
    { id: 2, name: 'Bebidas', color: '#4ECDC4' },
    { id: 3, name: 'Utensilios', color: '#45B7D1' },
    { id: 4, name: 'Limpieza', color: '#96CEB4' },
    { id: 5, name: 'Higiene', color: '#FFEEAD' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Etiquetas</Text>

        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tag, { backgroundColor: tag.color }]}
            >
              <Text style={styles.tagName}>{tag.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#1f2937" />
          <Text style={styles.addButtonText}>Agregar nueva etiqueta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  tag: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagName: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    gap: 10,
  },
  addButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
});
