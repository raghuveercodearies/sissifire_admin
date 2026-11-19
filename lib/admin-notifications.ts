
const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:8000/api/v1";

export interface NotificationCampaign {
    id: string;
    title: string;
    message: string;
    type: "announcement" | "update" | "general" | "system";
    link: string | null;
    status:
    | "draft"
    | "scheduled"
    | "processing"
    | "sent"
    | "failed"
    | "cancelled";
    scheduled_at: string | null;
    created_at: string;
    sent_at: string | null;
    created_by: string;
    total_recipients: number;
    delivered_count: number;
    failed_count: number;
}

export interface NotificationStats {
    total: number;
    draft: number;
    scheduled: number;
    processing: number;
    sent: number;
    failed: number;
    cancelled: number;
    total_recipients: number;
    delivered_count: number;
    failed_count: number;
}

export interface CampaignListResponse {
    items: NotificationCampaign[];
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface CreateCampaignPayload {
    title: string;
    message: string;
    type: NotificationCampaign["type"];
    link?: string | null;
    scheduled_at?: string | null;
}

async function adminFetch<T>(
    endpoint: string,
    options: RequestInit = {},
): Promise<T> {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("admin_access_token")
            : null;

    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (response.status === 401) {
        if (typeof window !== "undefined") {
            localStorage.removeItem("admin_access_token");
            localStorage.removeItem("admin_user");

            window.location.href = "/admin/login";
        }

        throw new Error("Your admin session has expired.");
    }

    if (!response.ok) {
        let message = "Something went wrong.";

        try {
            const data = await response.json();

            message =
                data.detail ||
                data.message ||
                message;
        } catch {
            // Keep default error.
        }

        throw new Error(message);
    }

    return response.json();
}

export const notificationAPI = {
    getCampaigns(params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
    }) {
        const query = new URLSearchParams();

        query.set("page", String(params?.page ?? 1));
        query.set("limit", String(params?.limit ?? 10));

        if (params?.status) {
            query.set("status", params.status);
        }

        if (params?.search) {
            query.set("search", params.search);
        }

        return adminFetch<CampaignListResponse>(
            `/admin/notifications?${query.toString()}`,
        );
    },

    getStats() {
        return adminFetch<NotificationStats>(
            "/admin/notifications/stats",
        );
    },

    getCampaign(id: string) {
        return adminFetch<NotificationCampaign>(
            `/admin/notifications/${id}`,
        );
    },

    createCampaign(payload: CreateCampaignPayload) {
        return adminFetch<NotificationCampaign>(
            "/admin/notifications",
            {
                method: "POST",
                body: JSON.stringify(payload),
            },
        );
    },

    cancelCampaign(id: string) {
        return adminFetch<{ message: string }>(
            `/admin/notifications/${id}/cancel`,
            {
                method: "POST",
            },
        );
    },
};
