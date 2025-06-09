import { useAuthStore } from "@/store/authStore";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Componente personalizado para el contenido del drawer
const CustomDrawerContent = (props: any) => {
  const { logout } = useAuthStore();
  const user = useAuthStore(state => state.user); // Obtener usuario del store

  const handleLogout = async () => {
    await logout();
    props.navigation.closeDrawer(); // Cerrar el drawer antes de redirigir
    router.replace("/(auth)/login");
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Encabezado con información del usuario y botón de cerrar sesión */}
      <View style={styles.header}>
        <View>
          <Text style={styles.userName}>Hola, {user?.name || "Usuario"}</Text>
          <Text style={styles.userRole}>{user?.role || "Rol"}</Text>
        </View>
        
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de elementos del drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={{
          headerShown: true,
          headerTitle: "",
        }}
      >
        <Drawer.Screen
          name="/(tabs)"
          options={{
            drawerContentStyle: {
              display: "none",
            },
          }}
        />
        <Drawer.Screen
          name="/(tabs)/index"
          options={{
            drawerLabel: "Dashboard",
            title: "Dashboard",
          }}
        />

        <Drawer.Screen
          name="/(drawer)/(tabs)/inventoryManager"
          options={{
            drawerLabel: "Inventario",
            title: "Gestor de Inventario",
          }}
        />

        <Drawer.Screen
          name="/(drawer)/(tabs)/formProducts"
          options={{
            drawerLabel: "Agregar Productos",
            title: "Agregar",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userRole: {
    fontSize: 14,
    color: "#666",
  },
  logoutButton: {
    padding: 8,
    backgroundColor: "#e74c3c",
    borderRadius: 4,
  },
  logoutText: {
    color: "white",
    fontWeight: "500",
  },
});