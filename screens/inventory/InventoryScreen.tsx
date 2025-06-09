// app/(drawer)/(tabs)/inventoryManager.tsx
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { Product, ProductStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const InventoryManager = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  
  // Obtenemos todos los productos del store
  const products = useProductStore(state => state.products);
  const deleteProduct = useProductStore(state => state.deleteProduct);

  // Efecto para filtrar productos cuando cambian los filtros o los productos
  useEffect(() => {
    if (!user) return;

    // Filtramos primero por usuario
    const userProducts = products.filter(p => p.userId === user.id);
    
    // Luego aplicamos los otros filtros
    const filtered = userProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });

    setFilteredProducts(filtered);
  }, [products, user, searchQuery, selectedStatus]);

  const handleEdit = (id: string) => {
    router.push(`/(drawer)/(tabs)/formProducts?editId=${id}`);
  };

  const handleDelete = (id: string) => {
    deleteProduct(id);
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.itemActions}>
          <TouchableOpacity onPress={() => handleEdit(item.id)}>
            <Ionicons name="pencil" size={20} color="#4a90e2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Ionicons name="trash" size={20} color="#e74c3c" />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text>Cantidad: {item.quantity}</Text>
        <Text>Vence: {new Date(item.expirationDate).toLocaleDateString('es-ES')}</Text>
        <Text>Estado: {item.status}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View style={styles.filterRow}>
        {(['all', 'activo', 'próximo a vencer', 'vencido'] as const).map(status => (
          <TouchableOpacity 
            key={status}
            style={[
              styles.filterButton, 
              selectedStatus === status && styles.activeFilter
            ]}
            onPress={() => setSelectedStatus(status)}
          >
            <Text style={styles.filterText}>
              {status === 'all' ? 'Todos' : status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredProducts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay productos que coincidan con los filtros</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
  searchInput: {
    height: 48,
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: '#e2e8f0',
  },
  activeFilter: {
    backgroundColor: '#cbd5e1',
  },
  filterText: {
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 32,
  },
  itemContainer: {
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
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    color: '#1e293b',
  },
  itemActions: {
    flexDirection: 'row',
    gap: 16,
  },
  itemDetails: {
    gap: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#64748b',
  },
});

export default InventoryManager;