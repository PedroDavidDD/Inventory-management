import FormProductsScreen from "@/screens/inventory/FormProductsScreen";
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function FormProductsPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <FormProductsScreen />;
}
