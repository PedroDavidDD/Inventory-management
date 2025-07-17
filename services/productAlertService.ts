import { useEffect } from 'react';
import { initializeNotifications, NotificationService } from './notificationService';

export class ProductAlertService {
  static async checkAndScheduleAlerts(products: any[]) {
    try {
      const today = new Date();
      
      for (const product of products) {
        // Verificar alerta de vencimiento
        if (product.use_expiration_alert && product.expiration_date) {
          const alertDate = new Date(product.expiration_date);
          alertDate.setDate(alertDate.getDate() - product.notify_days_before);
          
          if (alertDate > today) {
            await this.scheduleExpirationAlert(product, alertDate);
          }
        }

        // Verificar alerta de stock bajo
        if (product.use_low_stock_alert && product.quantity !== undefined && product.low_stock_threshold !== undefined) {
          if (product.quantity <= product.low_stock_threshold) {
            await this.scheduleLowStockAlert(product);
          }
        }

        // Verificar alertas recurrentes
        if (product.use_recurrent_alert && product.alert_time) {
          await this.scheduleRecurrentAlert(product);
        }
      }
    } catch (error) {
      console.error('Error al verificar alertas de productos:', error);
      throw error;
    }
  }

  static async scheduleExpirationAlert(product: any, alertDate: Date) {
    try {
      const daysUntilExpiration = Math.ceil((alertDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
      
      await NotificationService.scheduleProductAlert(
        product.id,
        'Alerta de Vencimiento',
        `El producto ${product.name} se vence en ${daysUntilExpiration} días`,
        alertDate
      );
    } catch (error) {
      console.error('Error al programar alerta de vencimiento:', error);
      throw error;
    }
  }

  static async scheduleLowStockAlert(product: any) {
    try {
      await NotificationService.scheduleProductAlert(
        product.id,
        'Alerta de Stock Bajo',
        `El producto ${product.name} tiene stock bajo (${product.quantity} unidades)`,
        new Date() // Notificar inmediatamente
      );
    } catch (error) {
      console.error('Error al programar alerta de stock bajo:', error);
      throw error;
    }
  }

  static async scheduleRecurrentAlert(product: any) {
    try {
      if (product.alert_time) {
        await NotificationService.scheduleRecurrentAlert(
          product.id,
          'Recordatorio Diario',
          `Recordatorio: Revisa el producto ${product.name}`,
          [1, 2, 3, 4, 5, 6, 7], // Lunes a Domingo
          product.alert_time
        );
      }
    } catch (error) {
      console.error('Error al programar alerta recurrente:', error);
      throw error;
    }
  }
}

// Hook para inicializar las alertas cuando la app se inicia
export function useProductAlerts() {
  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeNotifications();
        
        // Ejemplo de carga de productos (en producción, esto vendría del backend)
        const testProducts = [
          {
            id: 'p1',
            name: 'Leche Entera',
            expiration_date: '2025-07-22',
            notify_days_before: 3,
            use_expiration_alert: true,
            quantity: 2,
            low_stock_threshold: 3,
            use_low_stock_alert: true,
            alert_time: '09:00',
            use_recurrent_alert: true
          }
        ];

        await ProductAlertService.checkAndScheduleAlerts(testProducts);
      } catch (error) {
        console.error('Error al inicializar alertas:', error);
      }
    };

    initialize();
  }, []);
}
