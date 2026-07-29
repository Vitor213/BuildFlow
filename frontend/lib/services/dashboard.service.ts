import { api } from "../api";

export interface DashboardData {
  products: number;
  categories: number;
  customers: number;
  suppliers: number;
  totalSales: number;
  totalPurchases: number;
  lowStock: number;
  outOfStock: number;
}

export async function getDashboard() {
  try {
    const { data } = await api.get<DashboardData>("/dashboard");
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
