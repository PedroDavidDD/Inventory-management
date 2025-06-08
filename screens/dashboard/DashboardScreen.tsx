import { StatCard } from "@/components/dashboard/StatCard";
import { useAuthStore } from "@/store/authStore";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tipos
interface Product {
  id: number;
  name: string;
  stock: number;
  minStock: number;
  expirationDate: string; // Formato YYYY-MM-DD
}

// Datos temporales de prueba
const tempUser = {
  name: "Sofia",
  role: "admin",
};

const tempProducts: Product[] = [
  { id: 1, name: "Leche Entera", stock: 15, minStock: 10, expirationDate: "2023-12-15" },
  { id: 2, name: "Pan Integral", stock: 5, minStock: 8, expirationDate: "2023-11-30" },
  { id: 3, name: "Manzanas", stock: 20, minStock: 5, expirationDate: "2023-12-10" },
  { id: 4, name: "Yogur Natural", stock: 8, minStock: 10, expirationDate: "2023-11-25" },
];

// Hook personalizado para calcular estadísticas
function useProductStats(products: Product[]) {
  const getLowStockProducts = () =>
    products.filter((p) => p.stock < p.minStock);

  const getExpiringProducts = () => {
    const today = new Date();
    return products.filter((p) => {
      const expDate = new Date(p.expirationDate);
      const diffDays = (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diffDays <= 7 && diffDays >= 0;
    });
  };

  const getExpiredProducts = () =>
    products.filter((p) => new Date(p.expirationDate) < new Date());

  const totalProducts = products.length;
  const lowStockProducts = getLowStockProducts().length;
  const expiringProducts = getExpiringProducts().length;
  const expiredProducts = getExpiredProducts().length;
  const wastePercentage =
    totalProducts > 0
      ? ((expiredProducts / totalProducts) * 100).toFixed(1)
      : "0.0";

  return {
    totalProducts,
    lowStockProducts,
    expiringProducts,
    expiredProducts,
    wastePercentage,
  };
}

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [products] = useState<Product[]>(tempProducts);
  const { logout } = useAuthStore();

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const {
    totalProducts,
    lowStockProducts,
    expiringProducts,
    expiredProducts,
    wastePercentage,
  } = useProductStats(products);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Saludo */}
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

        {/* Botón de cerrar sesión */}
        <Text onPress={handleLogout} style={styles.logoutText}>
          Cerrar Sesión
        </Text>

        {/* Estadísticas */}
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
  logoutText: {
    fontSize: 16,
    color: "#6366f1",
    fontWeight: "500",
    alignSelf: "flex-end",
    marginBottom: 24,
    textDecorationLine: "underline",
  },
  statsContainer: {
    gap: 16,
    marginBottom: 24,
  },
});