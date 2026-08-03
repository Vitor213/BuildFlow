import { api } from "../api";

export interface PurchaseItem {
  productId: number;
  quantity: number;
  price: number;
}

export interface Purchase {
  id: number;
  supplier: {
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

export interface CreatePurchaseDto {
  supplierId: number;
  items: PurchaseItem[];
}

export async function getPurchases(): Promise<Purchase[]> {
  const { data } = await api.get<Purchase[]>("/purchase");
  return data;
}

export async function createPurchase(dto: CreatePurchaseDto) {
  const { data } = await api.post<Purchase>("/purchase", dto);
  return data;
}

export async function deletePurchase(id: number) {
  await api.delete(`/purchase/${id}`);
}
