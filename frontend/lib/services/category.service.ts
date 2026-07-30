import { api } from "../api";

export interface Category {
  id: number;
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/category");
  return data;
}
