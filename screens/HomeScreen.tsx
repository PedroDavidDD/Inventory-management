import { Button } from "@/components/Button";
import { GradientBackground } from "@/components/GradientBackground";
import { ThemeToggle } from "@/components/ThemeToggle";
import { COLORS, FONT_SIZE, SPACING } from "@/constants/theme";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface IModules {
  name: string;
  icon: React.ReactNode | null;
  description: string;
  role: "owner" | "admin" | "employee";
  comingSoon: boolean;
}

export default function HomeScreen() {
  const { isDarkMode } = useThemeStore();
  const { user, logout } = useAuthStore();

  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  const modules: IModules[] = useMemo(
    () => [
      {
        name: "Productos",
        icon: <MaterialIcons name="category" size={32} color={theme.primary} />,
        description: "Administra el catálogo de productos",
        role: "owner",
        comingSoon: false,
      },
      {
        name: "Inventario",
        icon: (
          <MaterialIcons name="bar-chart" size={32} color={theme.primary} />
        ),
        description: "Gestiona el stock y movimientos",
        role: "owner",
        comingSoon: false,
      },
      {
        name: "Agregar Productos",
        icon: <MaterialIcons name="add-box" size={32} color={theme.primary} />,
        description: "Formulario de productos",
        role: "owner",
        comingSoon: false,
      },
      {
        name: "Usuarios",
        icon: <MaterialIcons name="group" size={32} color={theme.primary} />,
        description: "Administración de usuarios",
        role: "admin",
        comingSoon: true,
      },
    ],
    [theme.primary]
  );

  const [dataModules, setDataModules] = useState(modules);

  useEffect(() => {
    if (!modules) return;

    const isAdmin = user?.role === "admin";

    const filteredModules: IModules[] =
      modules?.filter(
        (module) =>
          module.role === "owner" || (isAdmin && module.role === "admin")
      ) || [];

    setDataModules(filteredModules);
  }, [modules, user]);

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  return (
    <GradientBackground>
      <View style={styles.container}>
        <ThemeToggle />

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={[styles.welcomeText, { color: theme.text.primary }]}>
              Bienvenido, {user?.name}
            </Text>
            <Text style={[styles.subText, { color: theme.text.secondary }]}>
              Sistema de Gestión de Inventarios
            </Text>
          </View>

          <View style={styles.modulesContainer}>
            {dataModules.map((module, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.moduleCard, { backgroundColor: theme.surface }]}
                disabled={module.comingSoon}
                activeOpacity={0.7}
              >
                <View style={styles.moduleIconContainer}>{module.icon}</View>
                <Text
                  style={[styles.moduleName, { color: theme.text.primary }]}
                >
                  {module.name}
                </Text>
                <Text
                  style={[styles.moduleDesc, { color: theme.text.secondary }]}
                >
                  {module.description}
                </Text>
                {module.comingSoon && (
                  <View
                    style={[
                      styles.comingSoonBadge,
                      { backgroundColor: theme.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.comingSoonText,
                        { color: theme.text.inverse },
                      ]}
                    >
                      Próximamente
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Button
            title="Cerrar Sesión"
            onPress={handleLogout}
            variant="outline"
            style={styles.logoutButton}
            textStyle={{ color: theme.error }}
          />
        </ScrollView>
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  header: {
    marginTop: SPACING.xxl,
    marginBottom: SPACING.xl,
  },
  welcomeText: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: "700",
  },
  subText: {
    fontSize: FONT_SIZE.md,
    marginTop: SPACING.xs,
  },
  modulesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moduleCard: {
    width: "48%",
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
    overflow: "hidden",
  },
  moduleIconContainer: {
    marginBottom: SPACING.sm,
  },
  moduleName: {
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
    marginBottom: SPACING.xs,
  },
  moduleDesc: {
    fontSize: FONT_SIZE.sm,
  },
  comingSoonBadge: {
    position: "absolute",
    top: 10,
    right: -25,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs / 2,
    transform: [{ rotate: "45deg" }],
  },
  comingSoonText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: "500",
  },
  logoutButton: {
    marginTop: SPACING.xl,
    borderColor: COLORS.light.error,
  },
});
