import { api } from "../api";

export interface Profile {
  sub: number;
  name: string;
  email: string;
  role: string;
}

export async function getProfile() {
  const { data } = await api.get<Profile>("/auth/profile");
  return data;
}
