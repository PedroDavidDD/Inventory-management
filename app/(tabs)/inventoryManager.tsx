import InventoryScreen from "@/screens/inventory/InventoryScreen";
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function InventoryManagerPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <InventoryScreen />;
}
