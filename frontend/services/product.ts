import { api } from "./api";

export async function getProducts() {
  const response = await api.get("/product");

  return response.data;
}
