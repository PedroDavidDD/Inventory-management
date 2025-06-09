import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const FormProducts = () => {
  const { editId } = useLocalSearchParams<{ editId?: string }>();
  const { user } = useAuthStore();
  const isEditing = !!editId;

  const { addProduct, updateProduct, getProductById } = useProductStore();

  // Estado inicial del formulario
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'createdAt' | 'status'>>({
    userId: user?.id || '',
    name: '',
    entryDate: new Date().toISOString(),
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    quantity: 1,
    isEnabled: true,
    useLowStockAlert: false,
    useExpirationAlert: false,
    useRecurrentAlert: false,
    tags: [],
  });

  const [showDatePicker, setShowDatePicker] = useState<'entry' | 'expiration' | null>(null);

  const resetForm = () => {
    setFormData({
      userId: user?.id || '',
      name: '',
      entryDate: new Date().toISOString(),
      expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      quantity: 1,
      isEnabled: true,
      useLowStockAlert: false,
      useExpirationAlert: false,
      useRecurrentAlert: false,
      tags: [],
    });
  };

  const loadProductForEdit = (editId: string) => {
    const product = getProductById(editId);
    if (product) {
      const { id, createdAt, status, ...rest } = product;
      setFormData(rest);
    }
  };

  useEffect(() => {
    if (!user) return;

    if (isEditing && editId) {
      loadProductForEdit(editId);
    } else {
      resetForm();
    }
  }, [isEditing, editId, user]);

  const handleSubmit = () => {
    if (!formData.name) {
      Alert.alert('Error', 'El nombre del producto es requerido');
      return;
    }

    if (!user?.id) {
      Alert.alert('Error', 'Usuario no autenticado');
      return;
    }

    const productData = {
      ...formData,
      userId: user.id
    };

    if (isEditing && editId) {
      updateProduct(editId, productData);
      Alert.alert("Producto actualizado");
    } else {
      addProduct(productData);
      Alert.alert("Producto agregado");
    }

    // Reinicia el estado del formulario
    resetForm();

    // Navegar y limpiar el parámetro `editId`
    router.replace('/(drawer)/(tabs)/inventoryManager'); // 👈 Reemplaza con tu ruta correcta
  };

  const handleCancel = () => {
    resetForm();
    router.replace('/(drawer)/(tabs)/inventoryManager');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto*"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={formData.quantity.toString()}
        onChangeText={(text) =>
          setFormData({ ...formData, quantity: Number(text) || 0 })
        }
      />

      <View style={styles.dateRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker('entry')}
        >
          <Ionicons name="calendar" size={20} color="#4a90e2" />
          <Text>Ingreso: {new Date(formData.entryDate).toLocaleDateString('es-ES')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker('expiration')}
        >
          <Ionicons name="calendar" size={20} color="#e74c3c" />
          <Text>Vencimiento: {new Date(formData.expirationDate).toLocaleDateString('es-ES')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitText}>
            {isEditing ? 'Actualizar Producto' : 'Agregar Producto'}
          </Text>
        </TouchableOpacity>

        {isEditing && (
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={new Date(showDatePicker === 'entry' ? formData.entryDate : formData.expirationDate)}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowDatePicker(null);
            if (date) {
              const field = showDatePicker === 'entry' ? 'entryDate' : 'expirationDate';
              setFormData({ ...formData, [field]: date.toISOString() });
            }
          }}
        />
      )}
    </View>
  );
};

export default FormProducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  input: {
    height: 50,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginTop: 16,
    flexDirection: 'row',
    gap: 12,
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#4a90e2',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#d1d5db',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#1f2937',
    fontWeight: 'bold',
    fontSize: 16,
  },
});