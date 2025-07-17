import { createSelector } from "reselect";
import { ProductState } from "./productStore";

/**
 * Selecciona los productos actuales
 */
export const getProducts = (state: ProductState) => state.products;

/**
 * Selecciona los tags actuales
 */
export const getTags = (state: ProductState, userId: string) => state.tags.filter(t => t.userId === userId);

/**
 * Filtra productos en bajo stock
 */
export const getLowStockProducts = createSelector(
  [getProducts],
  (products) =>
    products.filter(
      (p) => p.useLowStockAlert && p.lowStockThreshold !== undefined && p.quantity < p.lowStockThreshold
    )
);

/**
 * Filtra productos próximos a vencer
 */
export const getExpiringProducts = createSelector(
  [getProducts],
  (products) => products.filter((p) => p.status === "próximo a vencer")
);

/**
 * Filtra productos vencidos
 */
export const getExpiredProducts = createSelector(
  [getProducts],
  (products) => products.filter((p) => p.status === "vencido")
);

/**
 * Devuelve la cantidad total de productos
 */
export const getTotalProducts = createSelector([getProducts], (products) => products.length);

/**
 * Calcula el porcentaje de merma
 */
export const getWastePercentage = createSelector(
  [getExpiredProducts, getTotalProducts],
  (expiredProducts, total) => {
    const expiredCount = expiredProducts.length;
    return total > 0 ? ((expiredCount / total) * 100).toFixed(1) : "0.0";
  }
);