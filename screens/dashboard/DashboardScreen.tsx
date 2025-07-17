import { StatCard } from "@/components/dashboard/StatCard";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Product } from "@/types";

import { TabTitle } from "@/components/TabTitle";
import {
  getExpiredProducts,
  getExpiringProducts,
  getLowStockProducts,
  getTotalProducts,
  getWastePercentage,
} from "@/store/productSelectors";
import { useProductStore } from "@/store/productStore";
import { useAuthStore } from "@/store/authStore";

// Tipos para los selectores
const getProducts = (state: { products: Product[] }) => state.products;

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const allProducts = useProductStore(getProducts);
  
  // Verificar si hay un usuario autenticado
  if (!user) {
    return null;
  }
  
  // Filtrar productos por usuario
  const userProducts = allProducts.filter((product: Product) => product.userId === user.id);
  
  // Calcular métricas
  const lowStockProducts = userProducts.filter((p: Product) =>
    p.useLowStockAlert && p.lowStockThreshold !== undefined && p.quantity < p.lowStockThreshold
  );
  
  const expiringProducts = userProducts.filter((p: Product) => p.status === "próximo a vencer");
  const expiredProducts = userProducts.filter((p: Product) => p.status === "vencido");
  const totalProducts = userProducts.length;
  
  // Calcular porcentaje de merma
  const wastePercentage = totalProducts > 0 ? 
    ((expiredProducts.length / totalProducts) * 100).toFixed(1) : "0.0";

  return (
    <SafeAreaView style={styles.container}>
      <TabTitle title="Dashboard" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Estadísticas */}
          <View style={styles.statsContainer}>
            <StatCard
              title="Total Productos"
              value={totalProducts.toString()}
              icon="inventory"
              color="#8b5cf6"
            />
            <StatCard
              title="Bajo Stock"
              value={lowStockProducts.length.toString()}
              icon="warning"
              color="#f59e0b"
            />
            <StatCard
              title="Próximos a Vencer"
              value={expiringProducts.length.toString()}
              icon="schedule"
              color="#10b981"
            />
            <StatCard
              title="Vencidos"
              value={expiredProducts.length.toString()}
              icon="delete"
              color="#ef4444"
            />
            <StatCard
              title="% Merma"
              value={`${wastePercentage}%`}
              icon="trending-down"
              color="#6366f1"
            />
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
  },
});