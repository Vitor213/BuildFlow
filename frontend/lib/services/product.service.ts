import { api } from "../api";

export async function getProducts() {
  const { data } = await api.get("/product");

  return data;
}

export async function getProduct(id: number) {
  const { data } = await api.get(`/product/${id}`);

  return data;
}