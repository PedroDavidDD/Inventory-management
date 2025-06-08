import { Button } from "@/components/Button";
import { GradientBackground } from "@/components/GradientBackground";
import { TextInput } from "@/components/TextInput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { validateLoginForm } from "@/utils/validations";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const { isDarkMode } = useThemeStore();
  const { login, isLoading, error, checkAuth } = useAuthStore();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogin = async () => {
    // Validate form
    const errors = validateLoginForm(username, password);
    setValidationErrors(errors);

    // If there are errors, don't proceed
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await login(username, password);
    } catch (err) {
      // Error is handled by the store, but we can add additional handling here if needed
      console.error("Login error:", err);
    }
  };

  return (
    <GradientBackground>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <ThemeToggle />

          <View style={styles.header}>
            <Text style={[styles.appName, { color: theme.text.primary }]}>
              Bodega Bazar Gabby
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Gestión de Inventarios
            </Text>
          </View>

          <View
            style={[styles.loginContainer, { backgroundColor: theme.surface }]}
          >
            <Text style={[styles.loginTitle, { color: theme.text.primary }]}>
              Iniciar Sesión
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            )}

            <TextInput
              label="Usuario"
              placeholder="Ingrese su usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              error={validationErrors.username}
            />

            <TextInput
              label="Contraseña"
              placeholder="Ingrese su contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              error={validationErrors.password}
            />

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={isLoading}
              style={styles.loginButton}
            />

            <View style={styles.registerLinkContainer}>
              <Text style={{ color: theme.text.secondary }}>
                ¿No tienes una cuenta?{" "}
              </Text>
              {/* <Link href="/(auth)/register" asChild> */}
              <TouchableOpacity onPress={() => router.navigate("/(auth)/register")}>
                <Text style={{ color: theme.primary, fontWeight: "500" }}>
                  Regístrate
                </Text>
              </TouchableOpacity>
              {/* </Link> */}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: SPACING.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  appName: {
    fontSize: FONT_SIZE.xxxl,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  loginContainer: {
    borderRadius: 16,
    padding: SPACING.lg,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  loginTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "600",
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  loginButton: {
    marginTop: SPACING.md,
  },
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: SPACING.lg,
  },
  errorContainer: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  errorMessage: {
    color: COLORS.light.error,
    textAlign: "center",
  },
});
