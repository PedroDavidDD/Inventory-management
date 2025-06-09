// components/ProductItem.tsx
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type ProductItemProps = {
  product: {
    id: string;
    name: string;
    quantity: number;
    expirationDate: string;
    status: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const ProductItem = ({ product, onEdit, onDelete }: ProductItemProps) => (
  <View style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.name}>{product.name}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(product.id)}>
          <Ionicons name="pencil" size={20} color="#4a90e2" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(product.id)}>
          <Ionicons name="trash" size={20} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
    
    <View style={styles.details}>
      <Text>Cantidad: {product.quantity}</Text>
      <Text>Vence: {new Date(product.expirationDate).toLocaleDateString('es-ES')}</Text>
      <Text>Estado: {product.status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#1e293b',
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  details: {
    gap: 4,
  },
});