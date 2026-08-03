import { api } from "../api";

export interface Customer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
}

export interface CreateCustomerDto {
  name: string;
  email?: string;
  phone?: string;
}

export async function getCustomers(): Promise<Customer[]> {
  const { data } = await api.get<Customer[]>("/customer");
  return data;
}

export async function createCustomer(dto: CreateCustomerDto) {
  const { data } = await api.post<Customer>("/customer", dto);
  return data;
}

export async function updateCustomer(id: number, dto: CreateCustomerDto) {
  const { data } = await api.patch<Customer>(`/customer/${id}`, dto);

  return data;
}

export async function deleteCustomer(id: number) {
  await api.delete(`/customer/${id}`);
}
