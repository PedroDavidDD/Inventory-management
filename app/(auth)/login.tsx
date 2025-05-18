import LoginScreen from "@/screens/auth/LoginScreen";
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function LoginPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <LoginScreen />;
}
