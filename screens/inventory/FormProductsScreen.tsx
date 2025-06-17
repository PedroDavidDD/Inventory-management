import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { DayOfWeek, Product, ProductStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
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
    notifyDaysBefore: 5,
    lowStockThreshold: 5,
    alertTime: '09:00',
    alertDays: [],
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
      notifyDaysBefore: 5,
      lowStockThreshold: 5,
      alertTime: '09:00',
      alertDays: [],
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
      userId: user.id,
      status: calculateProductStatus(formData.expirationDate, formData.notifyDaysBefore),
      
    };

    if (isEditing && editId) {
      updateProduct(editId, productData);
      Alert.alert("Producto actualizado");
    } else {
      addProduct(productData);
      Alert.alert("Producto agregado");
    }

    resetForm();
    router.replace('/formProducts');
  };

  const handleCancel = () => {
    resetForm();
    router.replace('/formProducts');
  };

  const daysOfWeekLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const calculateProductStatus = (expirationDate: string, notifyDaysBefore: number | undefined): ProductStatus => {
    const today = new Date();
    const expiration = new Date(expirationDate);

    // Asegúrate de que `notifyDaysBefore` tenga valor
    const daysBeforeThreshold = notifyDaysBefore ?? 5;

    // Limpiar horas para comparación precisa
    today.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);

    if (expiration < today) {
      return 'vencido';
    }

    const diffDays = Math.ceil((expiration.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays <= daysBeforeThreshold) {
      return 'próximo a vencer';
    }

    return 'activo';
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Nombre del producto */}
      <Text>Nombre del producto</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto*"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />

      {/* Cantidad */}
      <Text>Cantidad</Text>
      <TextInput
        style={styles.input}
        placeholder="Cantidad"
        keyboardType="numeric"
        value={formData.quantity.toString()}
        onChangeText={(text) =>
          setFormData({ ...formData, quantity: Number(text) || 0 })
        }
      />

      {/* Estado de acción */}
      <View style={styles.toggleContainer}>
        <Text>Estado de acción</Text>
        <View style={styles.toggleRow}>
          <Text>Habilitado / Deshabilitado</Text>
          <Switch
            value={formData.isEnabled}
            onValueChange={(newValue) => setFormData({ ...formData, isEnabled: newValue })}
          />
        </View>
      </View>

      {/* Configuración de alertas */}
      <View style={styles.alertsContainer}>
        <Text>Tipo de alertas</Text>
        <View style={styles.alertRow}>
          <Text>Alerta de vencimiento</Text>
          <Switch
            value={formData.useExpirationAlert}
            onValueChange={(newValue) => setFormData({ ...formData, useExpirationAlert: newValue })}
          />
        </View>
        <View style={styles.alertRow}>
          <Text>Alerta de bajo stock</Text>
          <Switch
            value={formData.useLowStockAlert}
            onValueChange={(newValue) => setFormData({ ...formData, useLowStockAlert: newValue })}
          />
        </View>
        <View style={styles.alertRow}>
          <Text>Alerta semanal</Text>
          <Switch
            value={formData.useRecurrentAlert}
            onValueChange={(newValue) => setFormData({ ...formData, useRecurrentAlert: newValue })}
          />
        </View>
      </View>

      {/* Días antes de notificar */}
      {formData.useExpirationAlert && (
        <View style={styles.inputRow}>
          <Text>Días antes de notificar</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5 o 10 días antes"
            keyboardType="numeric"
            value={formData.notifyDaysBefore?.toString()}
            onChangeText={(text) =>
              setFormData({ ...formData, notifyDaysBefore: Number(text) || 0 })
            }
          />
        </View>
      )}

      {/* Cantidad mínima */}
      {formData.useLowStockAlert && (
        <View style={styles.inputRow}>
          <Text>Cantidad mínima</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej: 5"
            keyboardType="numeric"
            value={formData.lowStockThreshold?.toString()}
            onChangeText={(text) =>
              setFormData({ ...formData, lowStockThreshold: Number(text) || 0 })
            }
          />
        </View>
      )}

      {/* Hora de alerta */}
      <Text>Hora de alerta</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Hora de alerta"
          value={formData.alertTime}
          onChangeText={(text) => setFormData({ ...formData, alertTime: text })}
        />
      </View>

      {/* Días de alerta semanal */}
      {formData.useRecurrentAlert && (
        <>
          <Text>Días de alerta semanal</Text>
          <View style={styles.daysOfWeekContainer}>
            <View style={styles.daysOfWeekRow}>
              {daysOfWeekLabels.map((day, index) => {
                const dayIndex = index as DayOfWeek;
                return (
                  <TouchableOpacity
                    key={day}
                    style={[
                      styles.dayOfWeekButton,
                      (formData.alertDays || []).includes(dayIndex) && styles.selectedDayOfWeekButton,
                    ]}
                    onPress={() => {
                      const currentDays = formData.alertDays || [];
                      if (currentDays.includes(dayIndex)) {
                        setFormData({
                          ...formData,
                          alertDays: currentDays.filter(d => d !== dayIndex),
                        });
                      } else {
                        setFormData({
                          ...formData,
                          alertDays: [...currentDays, dayIndex],
                        });
                      }
                    }}
                  >
                    <Text>{day}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </>
      )}

      {/* Etiquetas */}
      <Text>Etiquetas</Text>
      <View style={styles.tagsContainer}>
        <View style={styles.tagsRow}>
          <TextInput
            style={styles.tagInput}
            placeholder="Ej: Frutas, Verduras, Lácteos"
            value={formData.tags.join(', ')}
            onChangeText={(text) => {
              const newTags = text.split(',').map(tag => tag.trim());
              setFormData({ ...formData, tags: newTags });
            }}
          />
          <TouchableOpacity style={styles.addTagButton} onPress={() => console.log('Agregar etiqueta')}>
            <Text>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botones de fecha */}
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

      {/* Botones de acción */}
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
    </ScrollView>
  );
};

export default FormProducts;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  toggleContainer: {
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  alertsContainer: {
    marginBottom: 16,
  },
  alertRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  daysOfWeekContainer: {
    marginBottom: 16,
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  dayOfWeekButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
    borderColor: '#cbd5e1',
    borderWidth: 1,
  },
  selectedDayOfWeekButton: {
    backgroundColor: '#6b7280',
    borderColor: '#6b7280',
    color: 'white',
  },
  tagsContainer: {
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagInput: {
    height: 50,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
    flex: 1,
  },
  addTagButton: {
    backgroundColor: '#6b7280',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
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