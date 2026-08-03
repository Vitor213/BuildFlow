import { api } from "../api";

export interface StockItem {
  id: number;
  name: string;
  quantity: number;

  category: {
    name: string;
  };
}

export async function getStock(): Promise<StockItem[]> {
  const { data } = await api.get<StockItem[]>("/stock");
  return data;
}
