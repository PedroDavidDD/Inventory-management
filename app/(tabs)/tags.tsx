import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TagsPage() {
  const { isAuthenticated } = useAuthStore();
  const { tags, addTag, deleteTag } = useProductStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');

  const pastelColors = [
    '#FFD7E9',
    '#B3E5FC',
    '#E8F5E9',
    '#FFF3E0',
    '#E1F5FE'
  ];

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  const handleAddTag = () => {
    setShowAddModal(true);
  };

  const handleAddTagSubmit = () => {
    if (newTagName.trim()) {
      addTag(newTagName.trim());
      setNewTagName('');
    }
    setShowAddModal(false);
  };

  const handleDeleteTag = (tagId: string) => {
    setSelectedTag(tagId);
    setShowDeleteModal(true);
  };

  const handleDeleteTagConfirm = () => {
    if (selectedTag) {
      deleteTag(selectedTag);
      setSelectedTag(null);
    }
    setShowDeleteModal(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.content}>
          <Text style={styles.title}>Etiquetas</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <View key={tag.id} style={[styles.tag, { backgroundColor: pastelColors[index % 5] }]}>
                <Text style={styles.tagName}>{tag.name}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteTag(tag.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#1f2937" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      {/* Modal para agregar etiqueta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAddModal}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nueva etiqueta</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Nombre de la etiqueta"
              value={newTagName}
              onChangeText={setNewTagName}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalSubmitButton]}
                onPress={handleAddTagSubmit}
              >
                <Text style={styles.modalButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal para eliminar etiqueta */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Eliminar etiqueta</Text>
            <Text style={styles.modalMessage}>
              ¿Está seguro de eliminar esta etiqueta?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalDeleteButton]}
                onPress={handleDeleteTagConfirm}
              >
                <Text style={styles.modalButtonText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleAddTag}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    position: 'relative',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    maxWidth: 500,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
  },
  modalInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  modalCancelButton: {
    backgroundColor: '#cbd5e1',
  },
  modalSubmitButton: {
    backgroundColor: '#4ade80',
  },
  modalDeleteButton: {
    backgroundColor: '#ef4444',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalDeleteButtonText: {
    color: 'white',
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
    backgroundColor: COLORS.light.primary,
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
  addButtonText: {
    color: '#1f2937',
    fontWeight: 'bold',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    zIndex: 9,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  fabIcon: {
    color: 'white',
  }
});
