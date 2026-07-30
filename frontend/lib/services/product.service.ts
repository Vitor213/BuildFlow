import { api } from "../api";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;

  category: {
    id: number;
    name: string;
  };
}

export interface CreateProductDto {
  name: string;
  description?: string;
  price: number;
  quantity: number;
  categoryId: number;
}

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/product");
  return data;
}

export async function createProduct(dto: CreateProductDto) {
  const { data } = await api.post<Product>("/product", dto);
  return data;
}
export async function deleteProduct(id: number) {
  await api.delete(`/product/${id}`);
}
