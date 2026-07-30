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
    const response = await api.get("/dashboard");

    console.log("STATUS:", response.status);
    console.log("DATA:", response.data);

    return response.data;
  } catch (error) {
    console.error("ERRO AXIOS:", error);
    throw error;
  }
}
