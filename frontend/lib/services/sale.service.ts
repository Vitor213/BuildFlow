import { api } from "../api";

export interface SaleItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Sale {
  id: number;

  customer: {
    id: number;
    name: string;
  };

  total: number;

  items: {
    id: number;
    quantity: number;
    price: number;

    product: {
      id: number;
      name: string;
    };
  }[];

  createdAt: string;
}

export interface CreateSaleDto {
  customerId: number;
  items: SaleItem[];
}

export async function getSales(): Promise<Sale[]> {
  const { data } = await api.get<Sale[]>("/sale");
  return data;
}

export async function createSale(dto: CreateSaleDto) {
  const { data } = await api.post<Sale>("/sale", dto);
  return data;
}

export async function deleteSale(id: number) {
  await api.delete(`/sale/${id}`);
}
