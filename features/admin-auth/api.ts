import { apiRequest } from "@/lib/api-client";

import type {
  AdminAuthResponse,
  AdminLoginRequest,
  AdminSignupRequest,
  Admin,
} from "./types";

export async function adminLogin(
  payload: AdminLoginRequest,
): Promise<AdminAuthResponse> {
  return apiRequest<AdminAuthResponse>("/admin/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function adminSignup(
  payload: AdminSignupRequest,
): Promise<AdminAuthResponse> {
  return apiRequest<AdminAuthResponse>("/admin/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentAdmin(
  token: string,
): Promise<Admin> {
  return apiRequest<Admin>("/admin/auth/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function verifyAdminToken(
  token: string,
): Promise<{ message: string }> {
  return apiRequest("/admin/auth/verify", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}