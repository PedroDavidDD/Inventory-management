// types/index.ts
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface Tag {
  id: string;
  name: string;
}

export type ProductStatus = 'activo' | 'próximo a vencer' | 'vencido';
export type UserRole = 'admin' | 'owner' | 'employee' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  entryDate: string;
  expirationDate: string;
  quantity: number;
  isEnabled: boolean;
  status: ProductStatus;
  notifyDaysBefore?: number;
  lowStockThreshold?: number;
  useLowStockAlert: boolean;
  useExpirationAlert: boolean;
  useRecurrentAlert: boolean;
  alertTime?: string;
  tags: string[];
  alertDays?: DayOfWeek[];
  createdAt: string;
}