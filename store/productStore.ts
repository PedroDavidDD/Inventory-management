// store/productStore.ts
import { Product, Tag } from "@/types";
import 'react-native-get-random-values';
import { v4 as uuidv4 } from "uuid";
import { create } from "zustand";

// Interfaz del estado del store
export interface ProductState {
  products: Product[];
  tags: Tag[];

  // Métodos
  addProduct: (product: Omit<Product, "id" | "createdAt" | "status">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addTag: (name: string) => void;
  deleteTag: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByUser: (userId: string) => Product[];
}

const initialProducts: Product[] = [
  // 🟢 Activo (vence el 10/08/2025 → aún tiene tiempo)
  {
    id: "p1",
    userId: "2",
    name: "Leche",
    entryDate: "2025-04-01T09:00:00Z",
    expirationDate: "2025-08-10T09:00:00Z",
    quantity: 10,
    isEnabled: true,
    useLowStockAlert: true,
    useExpirationAlert: true,
    useRecurrentAlert: false,
    tags: ["lácteos"],
    notifyDaysBefore: 3,
    lowStockThreshold: 2,
    alertTime: "08:00",
    alertDays: [],
    createdAt: new Date().toISOString(),
    status: "activo" // Dinámico, recalculado al cargar
  },

  // 🟡 Próximo a vencer (vence el 05/07/2025 → faltan 19 días)
  {
    id: "p2",
    userId: "2",
    name: "Yogurt",
    entryDate: "2025-04-05T09:00:00Z",
    expirationDate: "2025-07-05T09:00:00Z",
    quantity: 5,
    isEnabled: true,
    useLowStockAlert: true,
    useExpirationAlert: true,
    useRecurrentAlert: false,
    tags: ["lácteos", "snacks"],
    notifyDaysBefore: 5,
    lowStockThreshold: 2,
    alertTime: "08:00",
    alertDays: [],
    createdAt: new Date().toISOString(),
    status: "próximo a vencer" // Dinámico, recalculado al cargar
  },

  // 🟢 Activo (vence el 30/09/2025 → mucho tiempo antes)
  {
    id: "p3",
    userId: "2",
    name: "Manzanas",
    entryDate: "2025-04-10T09:00:00Z",
    expirationDate: "2025-09-30T09:00:00Z",
    quantity: 15,
    isEnabled: true,
    useLowStockAlert: false,
    useExpirationAlert: false,
    useRecurrentAlert: false,
    tags: ["frutas"],
    notifyDaysBefore: undefined,
    lowStockThreshold: undefined,
    alertTime: undefined,
    alertDays: undefined,
    createdAt: new Date().toISOString(),
    status: "activo" // Dinámico
  },

  // 🔴 Vencido (vence el 01/04/2025 → ya pasó)
  {
    id: "p4",
    userId: "2",
    name: "Queso",
    entryDate: "2025-03-20T09:00:00Z",
    expirationDate: "2025-04-01T09:00:00Z",
    quantity: 3,
    isEnabled: true,
    useLowStockAlert: true,
    useExpirationAlert: true,
    useRecurrentAlert: false,
    tags: ["lácteos"],
    notifyDaysBefore: 2,
    lowStockThreshold: 5,
    alertTime: "09:00",
    alertDays: [],
    createdAt: new Date().toISOString(),
    status: "vencido" // Dinámico
  },

  // 🟡 Próximo a vencer (vence el 15/07/2025 → faltan 29 días)
  {
    id: "p5",
    userId: "2",
    name: "Pan Integral",
    entryDate: "2025-04-15T09:00:00Z",
    expirationDate: "2025-07-15T09:00:00Z",
    quantity: 20,
    isEnabled: true,
    useLowStockAlert: false,
    useExpirationAlert: true,
    useRecurrentAlert: false,
    tags: ["panadería"],
    notifyDaysBefore: 10, // Umbral de alerta: 10 días
    lowStockThreshold: undefined,
    alertTime: "09:00",
    alertDays: [],
    createdAt: new Date().toISOString(),
    status: "próximo a vencer" // Dinámico
  },
];

// Zustand Store
export const useProductStore = create<ProductState>((set, get) => ({
  products: initialProducts,
  tags: [
    { id: "1", name: "Frutas" },
    { id: "2", name: "Verduras" },
    { id: "3", name: "Lácteos" },
  ],

  addProduct: (product) => {
    const newProduct: Product = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      status: "activo",
      ...product,
    };
    set((state) => ({ products: [...state.products, newProduct] }));
  },

  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),

  deleteProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  addTag: (name) =>
    set((state) => ({
      tags: [...state.tags, { id: uuidv4(), name }],
    })),

  deleteTag: (id) =>
    set((state) => ({
      tags: state.tags.filter((t) => t.id !== id),
      products: state.products.map((p) => ({
        ...p,
        tags: p.tags.filter((tagId) => tagId !== id),
      })),
    })),

  getProductById: (id) => get().products.find((p) => p.id === id),

  getProductsByUser: (userId) => get().products.filter((p) => p.userId === userId),
}));