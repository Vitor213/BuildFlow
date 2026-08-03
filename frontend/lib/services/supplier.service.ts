import { api } from "../api";

export interface Supplier {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  cnpj?: string;
}

export interface CreateSupplierDto {
  name: string;
  email?: string;
  phone?: string;
  cnpj?: string;
}

export async function getSuppliers(): Promise<Supplier[]> {
  const { data } = await api.get<Supplier[]>("/supplier");
  return data;
}

export async function createSupplier(dto: CreateSupplierDto) {
  const { data } = await api.post<Supplier>("/supplier", dto);
  return data;
}

export async function updateSupplier(id: number, dto: CreateSupplierDto) {
  const { data } = await api.patch<Supplier>(`/supplier/${id}`, dto);

  return data;
}

export async function deleteSupplier(id: number) {
  await api.delete(`/supplier/${id}`);
}
