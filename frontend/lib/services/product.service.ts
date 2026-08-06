import { api } from "../api";

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  deletedAt?: string | null;

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
  file?: File;
}

export interface GetProductsParams {
  search?: string;
  page?: number;
  limit?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  showDeleted?: boolean;
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<Product[]> {
  const { data } = await api.get<Product[]>("/product", {
    params,
  });

  return data;
}

export async function createProduct(dto: CreateProductDto) {
  const formData = new FormData();

  formData.append("name", dto.name);
  formData.append("description", dto.description ?? "");
  formData.append("price", String(dto.price));
  formData.append("quantity", String(dto.quantity));
  formData.append("categoryId", String(dto.categoryId));

  if (dto.file) {
    formData.append("file", dto.file);
  }

  const { data } = await api.post<Product>("/product", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function updateProduct(id: number, dto: CreateProductDto) {
  const { data } = await api.patch<Product>(`/product/${id}`, dto);

  return data;
}

export async function deleteProduct(id: number) {
  return api.delete(`/product/${id}`);
}

export async function restoreProduct(id: number) {
  return api.patch(`/product/${id}/restore`);
}
