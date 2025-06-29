import { useAuthStore } from '@/store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function ProfilePage() {
  const { user, logout, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: '#f8fafc',
      }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Sección de foto y nombre */}
      <View style={{ alignItems: 'center', marginBottom: 30 }}>
        
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#1f2937',
          marginTop: 10,
        }}>
          {user?.name || 'Usuario'}
        </Text>
        <Text style={{
          color: '#475569',
        }}>
          {user?.email}
        </Text>
      </View>

      {/* Información básica */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: 10,
        }}>
          Información básica
        </Text>
        <View style={{
          backgroundColor: '#f1f5f9',
          borderRadius: 8,
          padding: 15,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{
              color: '#334155',
            }}>Nombre:</Text>
            <Text style={{
              fontWeight: 'bold',
              color: '#1f2937',
            }}>{user?.name || 'No disponible'}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{
              color: '#334155',
            }}>Email:</Text>
            <Text style={{
              fontWeight: 'bold',
              color: '#1f2937',
            }}>{user?.email || 'No disponible'}</Text>
          </View>
        </View>
      </View>

      {/* Opciones */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#1f2937',
          marginBottom: 10,
        }}>
          Opciones
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#f1f5f9',
            padding: 15,
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
          }}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color="#1f2937"
          />
          <Text style={{
            marginLeft: 10,
            color: '#1f2937',
          }}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
