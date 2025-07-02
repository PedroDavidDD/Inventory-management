import { Button } from "@/components/Button";
import { GradientBackground } from "@/components/GradientBackground";
import { TextInput } from "@/components/TextInput";
import { ThemeToggle } from "@/components/ThemeToggle";
import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";
import { useThemeStore } from "@/store/themeStore";
import { validateRegisterForm } from "@/utils/validations";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const { isDarkMode } = useThemeStore();
  const { register, isLoading, error } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const handleRegister = async () => {
    // Validate form
    const errors = validateRegisterForm(
      name,
      email,
      username,
      password,
      confirmPassword
    );
    setValidationErrors(errors);

    // If there are errors, don't proceed
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await register(name, email, username, password);
    } catch (err) {
      // Error is handled by the store, but we can add additional handling here if needed
      console.error("Registration error:", err);
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

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-left" size={32} color={theme.primary} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.appName, { color: theme.text.primary }]}>
              Bodega Bazar Gabby
            </Text>
            <Text style={[styles.subtitle, { color: theme.text.secondary }]}>
              Gestión de Inventarios
            </Text>
          </View>

          <View
            style={[
              styles.registerContainer,
              { backgroundColor: theme.surface },
            ]}
          >
            <Text style={[styles.registerTitle, { color: theme.text.primary }]}>
              Crear Cuenta
            </Text>

            {error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            )}

            <TextInput
              label="Nombre"
              placeholder="Ingrese su nombre completo"
              value={name}
              onChangeText={setName}
              error={validationErrors.name}
            />

            <TextInput
              label="Correo Electrónico"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              error={validationErrors.email}
            />

            <TextInput
              label="Usuario"
              placeholder="Elija un nombre de usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              error={validationErrors.username}
            />

            <TextInput
              label="Contraseña"
              placeholder="Elija una contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              error={validationErrors.password}
            />

            <TextInput
              label="Confirmar Contraseña"
              placeholder="Confirme su contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              showPasswordToggle
              error={validationErrors.confirmPassword}
            />

            <Button
              title="Registrarse"
              onPress={handleRegister}
              loading={isLoading}
              style={styles.registerButton}
            />

            <View style={styles.loginLinkContainer}>
              <Text style={{ color: theme.text.secondary }}>
                ¿Ya tienes una cuenta?{" "}
              </Text>
              {/* <Link href="/auth/login" asChild> */}
              <TouchableOpacity onPress={() => router.navigate("../")}>
                <Text style={{ color: theme.primary, fontWeight: "500" }}>
                  Iniciar Sesión
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
  backButton: {
    position: "absolute",
    top: SPACING.md,
    left: SPACING.md,
    zIndex: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  appName: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
    textAlign: "center",
  },
  registerContainer: {
    borderRadius: 16,
    padding: SPACING.lg,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
    backgroundColor: "red", 
  },
  registerTitle: {
    fontSize: FONT_SIZE.xl,
    fontWeight: "600",
    marginBottom: SPACING.lg,
    textAlign: "center",
  },
  registerButton: {
    marginTop: SPACING.md,
  },
  loginLinkContainer: {
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
