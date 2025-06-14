// screens/DashboardScreen.tsx
import { StatCard } from "@/components/dashboard/StatCard";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Zustand + Selectores
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Saludo */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hola, Admin</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

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
  greeting: {
    marginBottom: 24,
  },
  greetingText: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1e293b",
  },
  dateText: {
    fontSize: 16,
    color: "#64748b",
    marginTop: 4,
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
  },
});