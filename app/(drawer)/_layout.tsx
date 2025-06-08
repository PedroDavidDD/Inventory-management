import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="/(tabs)"
          options={{
            drawerContentStyle: {
              display: "none",
          }}}
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