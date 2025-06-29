import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TagsPage() {
  const { isAuthenticated } = useAuthStore();
  const { tags, addTag, deleteTag } = useProductStore();

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  const handleAddTag = () => {
    const newTag = prompt('Ingrese el nombre de la nueva etiqueta');
    if (newTag) {
      addTag(newTag);
    }
  };

  const handleDeleteTag = (tagId: string) => {
    Alert.alert(
      'Eliminar etiqueta',
      '¿Está seguro de eliminar esta etiqueta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => deleteTag(tagId)
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddTag}
        >
          <Ionicons name="add-circle-outline" size={24} color="#1f2937" />
          <Text style={styles.addButtonText}>Agregar nueva etiqueta</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Etiquetas</Text>

        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View
              key={tag.id}
              style={styles.tag}
            >
              <Text style={styles.tagName}>{tag.name}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteTag(tag.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ))}
        </View>


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
  addTagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    marginBottom: 20,
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
    backgroundColor: '#4550e6',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagName: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    gap: 10,
    marginBottom: 20,
  },
  addButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
});
