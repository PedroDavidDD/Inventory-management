import { StatCard } from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Datos temporales de prueba
const tempUser = {
  name: "Sofia",
  role: "admin",
};

const tempProducts = [
  {
    id: 1,
    name: "Leche Entera",
    stock: 15,
    minStock: 10,
    expirationDate: "2023-12-15",
  },
  {
    id: 2,
    name: "Pan Integral",
    stock: 5,
    minStock: 8,
    expirationDate: "2023-11-30",
  },
  {
    id: 3,
    name: "Manzanas",
    stock: 20,
    minStock: 5,
    expirationDate: "2023-12-10",
  },
  {
    id: 4,
    name: "Yogur Natural",
    stock: 8,
    minStock: 10,
    expirationDate: "2023-11-25",
  },
];

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = React.useState(false);
  const [products] = React.useState(tempProducts);

  const { logout } = useAuthStore();

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Funciones para calcular estadísticas
  const getLowStockProducts = () =>
    products.filter((p) => p.stock < p.minStock);
  const getExpiringProducts = () =>
    products.filter((p) => {
      const expDate = new Date(p.expirationDate);
      const today = new Date();
      const diffDays =
        (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7 && diffDays >= 0;
    });
  const getExpiredProducts = () =>
    products.filter((p) => new Date(p.expirationDate) < new Date());

  // Calcular estadísticas
  const totalProducts = products.length;
  const lowStockProducts = getLowStockProducts().length;
  const expiringProducts = getExpiringProducts().length;
  const expiredProducts = getExpiredProducts().length;
  const wastePercentage =
    totalProducts > 0
      ? ((expiredProducts / totalProducts) * 100).toFixed(1)
      : "0.0";

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Hola, {tempUser.name}</Text>
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>

        <Text onPress={() => handleLogout()}>Cerrar</Text>

        <View style={styles.statsContainer}>
          <StatCard
            title="Total Productos"
            value={totalProducts.toString()}
            icon="inventory"
            color="#8b5cf6"
          />
          <StatCard
            title="Stock Crítico"
            value={lowStockProducts.toString()}
            icon="warning"
            color="#f59e0b"
          />
          <StatCard
            title="Por Vencer"
            value={expiringProducts.toString()}
            icon="schedule"
            color="#10b981"
          />
          <StatCard
            title="Vencidos"
            value={expiredProducts.toString()}
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
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 24,
  },
  section: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e293b",
  },
  seeAll: {
    color: "#6366f1",
    fontWeight: "500",
  },
  productItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  productName: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "500",
  },
  productDate: {
    fontSize: 14,
    color: "#64748b",
    marginTop: 4,
  },
  activityItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  activityText: {
    fontSize: 15,
    color: "#1e293b",
  },
  activityDate: {
    fontSize: 13,
    color: "#64748b",
    marginTop: 2,
  },
});
