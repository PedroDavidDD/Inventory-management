
import LoginScreen from '@/screens/auth/LoginScreen';
import DashboardScreen from '@/screens/dashboard/DashboardScreen';
import { useAuthStore } from '@/store/authStore';

export default function HomeScreen() {

  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    return <DashboardScreen />;
  }

  return (
    <LoginScreen />
  );
}