import { api } from "../api";

export interface LoginDto {
  email: string;
  password: string;
}

export async function login(dto: LoginDto) {
  const { data } = await api.post("/auth/login", dto);

  return data;
}