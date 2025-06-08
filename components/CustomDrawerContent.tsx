import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";

export default function CustomDrawerContent(props:any) {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Dashboard" onPress={() => props.navigation.navigate("Dashboard")} />

      <DrawerItem label="Perfil" onPress={() => props.navigation.navigate("Profile")} />
      <DrawerItem label="Cerrar sesión" onPress={() => console.log("Logout")} />
    </DrawerContentScrollView>
  );
}