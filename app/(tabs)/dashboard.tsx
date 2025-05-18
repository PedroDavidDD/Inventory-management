import DashboardScreen from "@/screens/dashboard/DashboardScreen";
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <DashboardScreen />;
}
