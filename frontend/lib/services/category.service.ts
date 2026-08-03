import { api } from "../api";

export interface Category {
  id: number;
  name: string;
}

export interface CreateCategoryDto {
  name: string;
}

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get<Category[]>("/category");
  return data;
}

export async function createCategory(dto: CreateCategoryDto) {
  const { data } = await api.post<Category>("/category", dto);
  return data;
}

export async function updateCategory(id: number, dto: CreateCategoryDto) {
  const { data } = await api.patch<Category>(`/category/${id}`, dto);

  return data;
}

export async function deleteCategory(id: number) {
  await api.delete(`/category/${id}`);
}
