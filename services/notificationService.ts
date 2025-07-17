import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  static async registerForPushNotifications() {
    try {
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        throw new Error('Permisos de notificación denegados');
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return token;
    } catch (error) {
      console.error('Error al registrar notificaciones:', error);
      throw error;
    }
  }

  static async scheduleProductAlert(
    productId: string,
    title: string,
    message: string,
    alertDate: Date
  ) {
    try {
      const trigger = {
        seconds: Math.floor(alertDate.getTime() / 1000)
      } as Notifications.TimeIntervalTriggerInput;
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: message,
          data: { productId },
          sound: true,
        },
        trigger: trigger,
      });
    } catch (error) {
      console.error('Error al programar notificación:', error);
      throw error;
    }
  }

  static async scheduleRecurrentAlert(
    productId: string,
    title: string,
    message: string,
    daysOfWeek: number[],
    time: string
  ) {
    try {
      const [hour, minute] = time.split(':').map(Number);
      const trigger = {
        type: 'timeInterval' as const,
        seconds: Math.floor(Date.now() / 1000),
        hour,
        minute,
        repeats: true
      } as Notifications.TimeIntervalTriggerInput;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: title,
          body: message,
          data: { productId },
          sound: true,
        },
        trigger: trigger,
      });
    } catch (error) {
      console.error('Error al programar notificación recurrente:', error);
      throw error;
    }
  }

  static async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Error al cancelar notificaciones:', error);
      throw error;
    }
  }

  static async getDeliveredNotifications() {
    try {
      return await Notifications.getPresentedNotificationsAsync();
    } catch (error) {
      console.error('Error al obtener notificaciones entregadas:', error);
      throw error;
    }
  }
}

// Inicializar notificaciones cuando la app se inicia
export const initializeNotifications = async () => {
  try {
    const token = await NotificationService.registerForPushNotifications();
    if (token) {
      console.log('Expo Push Token:', token);
    }
    return token;
  } catch (error) {
    console.error('Error al inicializar notificaciones:', error);
    throw error;
  }
};
