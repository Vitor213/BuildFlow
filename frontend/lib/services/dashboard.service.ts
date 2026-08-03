import { api } from "../api";

export interface DashboardData {
  products: number;
  categories: number;
  customers: number;
  suppliers: number;

  totalSales: number;
  totalPurchases: number;

  lowStock: {
    id: number;
    name: string;
    quantity: number;
  }[];

  recentSales: {
    id: number;
    total: number;
    createdAt: string;

    customer: {
      name: string;
    };
  }[];

  recentPurchases: {
    id: number;
    total: number;
    createdAt: string;

    supplier: {
      name: string;
    };
  }[];
}

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get<DashboardData>("/dashboard");
  return data;
}
