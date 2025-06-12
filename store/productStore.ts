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
  products: [],
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