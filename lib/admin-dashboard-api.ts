const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;

  // Check possible existing token keys used by the admin auth flow.
  const tokenKeys = [
    "admin_access_token",
    "admin_token",
    "adminToken",
    "access_token",
    "token",
  ];

  for (const key of tokenKeys) {
    const token = localStorage.getItem(key);

    if (token) {
      return token;
    }
  }

  // Also support token stored inside an admin object.
  const adminKeys = ["admin", "admin_user", "adminUser"];

  for (const key of adminKeys) {
    const raw = localStorage.getItem(key);

    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);

      const token =
        parsed?.access_token ||
        parsed?.token ||
        parsed?.accessToken;

      if (token) return token;
    } catch {
      // Ignore invalid JSON.
    }
  }

  return null;
}

export async function adminDashboardFetch<T>(
  endpoint: string,
): Promise<T> {
  const token = getAdminToken();

  if (!token) {
    throw new Error("Admin authentication token not found.");
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error("Your admin session is invalid or expired.");
  }

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      message || `API request failed: ${response.status}`,
    );
  }

  return response.json();
}