import DashboardScreen from "@/screens/dashboard/DashboardScreen";
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function DashboardPage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <DashboardScreen />;
}
