import RegisterScreen from "@/screens/auth/RegisterScreen";
import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function RegisterPage() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <RegisterScreen />;
}
