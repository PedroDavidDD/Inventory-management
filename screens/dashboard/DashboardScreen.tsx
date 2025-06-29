import { StatCard } from "@/components/dashboard/StatCard";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { TabTitle } from "@/components/TabTitle";
import {
  getExpiredProducts,
  getExpiringProducts,
  getLowStockProducts,
  getTotalProducts,
  getWastePercentage,
} from "@/store/productSelectors";
import { useProductStore } from "@/store/productStore";

export default function DashboardScreen() {
  const lowStockProducts = useProductStore(getLowStockProducts);
  const expiringProducts = useProductStore(getExpiringProducts);
  const expiredProducts = useProductStore(getExpiredProducts);
  const totalProducts = useProductStore(getTotalProducts);
  const wastePercentage = useProductStore(getWastePercentage);

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