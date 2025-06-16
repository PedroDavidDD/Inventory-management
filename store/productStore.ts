// store/productStore.ts
import { Product, Tag } from "@/types";
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

// Zustand Store
export const useProductStore = create<ProductState>((set, get) => ({
  products: [
    {
      id: "p1",
      userId: "u1",
      name: "Leche",
      entryDate: "2025-04-01T09:00:00Z",
      expirationDate: "2025-04-10T09:00:00Z",
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
      status: "vencido"
    },
    {
      id: "p2",
      userId: "u1",
      name: "Yogurt",
      entryDate: "2025-04-05T09:00:00Z",
      expirationDate: "2025-04-20T09:00:00Z",
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
      status: "próximo a vencer"
    },
    {
      id: "p3",
      userId: "u1",
      name: "Manzanas",
      entryDate: "2025-04-10T09:00:00Z",
      expirationDate: "2025-04-30T09:00:00Z",
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
      status: "activo"
    },
    {
      id: "p4",
      userId: "u1",
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
      status: "vencido"
    },
    {
      id: "p5",
      userId: "u1",
      name: "Pan Integral",
      entryDate: "2025-04-15T09:00:00Z",
      expirationDate: "2025-04-22T09:00:00Z",
      quantity: 20,
      isEnabled: true,
      useLowStockAlert: false,
      useExpirationAlert: true,
      useRecurrentAlert: false,
      tags: ["panadería"],
      notifyDaysBefore: 3,
      lowStockThreshold: undefined,
      alertTime: "09:00",
      alertDays: [],
      createdAt: new Date().toISOString(),
      status: "activo"
    }
  ],
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