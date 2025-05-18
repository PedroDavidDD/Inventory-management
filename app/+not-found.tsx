import { MaterialIcons } from '@expo/vector-icons';
import { Link, Stack } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Página no encontrada" }} />
      <ThemedView style={styles.container}>
        <MaterialIcons name="error-outline" size={80} color="#8B5CF6" />
        <ThemedText type="title" style={styles.title}>
          ¡Página no encontrada!
        </ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>
          Parece que no podemos encontrar la página que estás buscando.
        </ThemedText>
        <Link href="/" style={styles.link} asChild>
          <Pressable>
            <ThemedView style={styles.button}>
              <ThemedText type="defaultSemiBold" style={styles.buttonText}>
                Volver al inicio
              </ThemedText>
            </ThemedView>
          </Pressable>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});
