
import HomeScreen from '@/screens/HomeScreen';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  
  // While checking authentication, don't redirect yet
  if (isLoading) {
    return null;
  }
  
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Redirect href="/" />;
  }
  
  return <HomeScreen />;
}