import { jwtDecode } from "jwt-decode";

export interface AuthUser {
  sub: number;
  name: string;
  email: string;
  role: string;
}

export function getUserFromToken(): AuthUser | null {
  const token = localStorage.getItem("token");

  if (!token) return null;

  try {
    return jwtDecode<AuthUser>(token);
  } catch {
    return null;
  }
}
