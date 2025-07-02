import { useAuth } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      // Redirigir a las rutas protegidas si el usuario está autenticado
      return;
    }
  }, [isAuthenticated]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}
