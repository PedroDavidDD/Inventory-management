import { FilterButton } from '@/components/inventory/FilterButton';
import { ProductItem } from '@/components/inventory/ProductItem';
import { TabTitle } from '@/components/TabTitle';
import { COLORS } from '@/constants/theme';
import { useAuthStore } from '@/store/authStore';
import { useProductStore } from '@/store/productStore';
import { ProductStatus } from '@/types';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const statusFilters: (ProductStatus | 'all')[] = ['all', 'activo', 'próximo a vencer', 'vencido'];

export const InventoryManager = () => {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProductStatus | 'all'>('all');
  
  const products = useProductStore(state => state.products);
  const deleteProduct = useProductStore(state => state.deleteProduct);

  const filteredProducts = useMemo(() => {
    if (!user) return [];
    console.log("User ID:", user?.id);
    return products
      .filter(p => p.userId === user.id)
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus;
        return matchesSearch && matchesStatus;
      });
  }, [products, user, searchQuery, selectedStatus]);

  const handleEdit = (id: string) => {
    router.push(`/(tabs)/formProducts?editId=${id}`);
  };

  return (
    <View style={styles.container}>
      <TabTitle title="Inventario" />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/(tabs)/formProducts')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      
      <View style={styles.filterRow}>
        {statusFilters.map(status => (
          <FilterButton
            key={status}
            label={status === 'all' ? 'Todos' : status}
            isActive={selectedStatus === status}
            onPress={() => setSelectedStatus(status)}
            activeBgColor={COLORS.light.primary}
            inactiveBgColor="#e2e8f0"
            activeTextColor={COLORS.light.text.inverse}
            inactiveTextColor={COLORS.light.primary}
          />
        ))}
      </View>
      
      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductItem 
            product={item} 
            onEdit={handleEdit}
            onDelete={deleteProduct}
          />
        )}
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
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 16,
    gap: 8,
  },
  listContent: {
    paddingBottom: 32,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    color: '#64748b',
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
  },
});

export default InventoryManager;