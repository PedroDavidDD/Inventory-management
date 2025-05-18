
import LoginScreen from '@/screens/auth/LoginScreen';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function HomeScreen() {

  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  return (
    <LoginScreen />
  );
}