import { Product } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductItemProps {
  product: Product;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const daysOfWeekLabels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ProductItem = ({ product, onEdit, onDelete }: ProductItemProps) => {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleEdit = () => {
    onEdit(product.id);
    setIsMenuVisible(false);
  };

  const handleDelete = () => {
    onDelete(product.id);
    setIsMenuVisible(false);
  };

  const handleCancel = () => {
    setIsMenuVisible(false);
  };

  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  // Helper para formatear fechas
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-ES');
  };

  // Helper para formatear días de alerta semanal
  const formatAlertDays = () => {
    if (!product.alertDays || product.alertDays.length === 0) return 'Ninguno';
    return product.alertDays.map(day => daysOfWeekLabels[day]).join(', ');
  };

  // Colores por estado
  const statusColors = {
    activo: '#10b981',
    'próximo a vencer': '#f59e0b',
    vencido: '#ef4444',
  };

  return (
    <View style={styles.card}>
      {/* Nombre del producto */}
      <View style={styles.header}>
        <Text style={styles.title}>{product.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColors[product.status] }]}>
          <Text style={styles.statusText}>{product.status}</Text>
        </View>
        <TouchableOpacity onPress={toggleMenu}>
          <Ionicons name="ellipsis-vertical" size={20} color="#6b7280" />
        </TouchableOpacity>
        <Modal
          visible={isMenuVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.menuContainer}>
              {/* Header del producto */}
              <View style={styles.productHeader}>
                <Text style={styles.productTitle}>{product.name}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusColors[product.status] }]}>
                  <Text style={styles.statusText}>{product.status}</Text>
                </View>
              </View>
              
              {/* Separador */}
              <View style={styles.separator} />
              
              {/* Botones de acción */}
              <TouchableOpacity onPress={handleEdit} style={[styles.menuItem, styles.menuButton]}>
                <Ionicons name="create-outline" size={20} color="#10b981" />
                <Text style={styles.menuText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={[styles.menuItem, styles.menuButton]}>
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
                <Text style={styles.menuText}>Eliminar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCancel} style={[styles.menuItem, styles.menuButton, styles.cancelButton]}>
                <Ionicons name="close-outline" size={20} color="#6b7280" />
                <Text style={styles.menuText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>

      {/* Información principal */}
      <View style={styles.infoContainer}>
        <Text style={styles.detail}>
          <Ionicons name="cube" size={16} color="#6b7280" /> Cantidad: {product.quantity}
        </Text>
        <Text style={styles.detail}>
          <Ionicons name="calendar-number" size={16} color="#6b7280" /> Vencimiento: {formatDate(product.expirationDate)}
        </Text>
      </View>
      {/* Alertas configuradas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alertas</Text>
        {product.useExpirationAlert && (
          <Text style={styles.alertDetail}>
            • Vencimiento: {product.notifyDaysBefore} días antes
          </Text>
        )}
        {product.useLowStockAlert && (
          <Text style={styles.alertDetail}>
            • Bajo stock: <Text style={styles.highlight}>{product.lowStockThreshold}</Text> unidades
          </Text>
        )}
        {product.useRecurrentAlert && product.alertDays && product.alertDays?.length > 0 && (
          <Text style={styles.alertDetail}>
            • Alerta semanal: {formatAlertDays()} a las {product.alertTime}
          </Text>
        )}
      </View>

      {/* Etiquetas */}
      {product.tags.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Etiquetas</Text>
          <View style={styles.tagsContainer}>
            {product.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    color: '#1e293b',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 8,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    gap: 8,
    marginBottom: 12,
  },
  detail: {
    fontSize: 14,
    color: '#374151',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 8,
    color: '#6b7280',
    fontSize: 14,
  },
  alertDetail: {
    fontSize: 13,
    color: '#4b5563',
    marginLeft: 20,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#ef4444',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginLeft: 20,
  },
  tag: {
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#4b5563',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  edit: {
    color: '#4a90e2',
    fontWeight: 'bold',
  },
  delete: {
    color: '#ef4444',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    maxWidth: 300,
    alignItems: 'center',
    minHeight: 200,
    maxHeight: '90%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    width: '100%',
    justifyContent: 'center',
    borderRadius: 8,
  },
  menuButton: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '500',
    marginLeft: 12,
  },
  cancelButton: {
    marginTop: 16,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingVertical: 12,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  separator: {
    width: '100%',
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },

});