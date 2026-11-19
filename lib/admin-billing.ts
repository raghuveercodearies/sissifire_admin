
import { apiRequest } from "@/lib/api-client";

export interface BillingOverview {
    total_subscriptions: number;
    active_subscriptions: number;
    trialing_subscriptions: number;
    canceled_subscriptions: number;
    past_due_subscriptions: number;
    cancel_at_period_end: number;
    plan_breakdown: {
        plan: string;
        count: number;
    }[];
    status_breakdown: {
        status: string;
        count: number;
    }[];
}

export interface AdminSubscription {
    subscription_id: string | null;
    user_id: string;
    name: string | null;
    email: string | null;
    plan_id: string;
    status: string;
    stripe_customer_id: string | null;
    current_period_start: string | null;
    current_period_end: string | null;
    cancel_at_period_end: boolean;
}

export interface SubscriptionListResponse {
    subscriptions: AdminSubscription[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface AdminPlan {
    plan_id: string;
    name: string;
    amount: number;
    currency: string;
    interval: string;
    description: string;
    subscriber_count: number;
    active_subscriber_count: number;
}

export interface AdminPlansResponse {
    plans: AdminPlan[];
}

export interface SubscriptionDetailResponse {
    subscription: Record<string, unknown>;
    user: Record<string, unknown> | null;
}

function getAdminHeaders(): HeadersInit {
    if (typeof window === "undefined") {
        return {};
    }

    const token = localStorage.getItem("admin_access_token");

    if (!token) {
        throw new Error("Admin session expired. Please log in again.");
    }

    return {
        Authorization: `Bearer ${token}`,
    };
}

export async function getBillingOverview() {
    return apiRequest<BillingOverview>(
        "/admin/billing/overview",
        { headers: getAdminHeaders() },
    );
}

export async function getAdminPlans() {
    return apiRequest<AdminPlansResponse>(
        "/admin/billing/plans",
        { headers: getAdminHeaders() },
    );
}

export async function getAdminSubscriptions(params: {
    page?: number;
    page_size?: number;
    plan_id?: string;
    status?: string;
    search?: string;
}) {
    const query = new URLSearchParams();

    query.set("page", String(params.page ?? 1));
    query.set("page_size", String(params.page_size ?? 10));

    if (params.plan_id) query.set("plan_id", params.plan_id);
    if (params.status) query.set("status", params.status);
    if (params.search) query.set("search", params.search);

    return apiRequest<SubscriptionListResponse>(
        `/admin/billing/subscriptions?${query.toString()}`,
        { headers: getAdminHeaders() },
    );
}

export async function getAdminSubscriptionDetails(
    subscriptionId: string,
) {
    return apiRequest<SubscriptionDetailResponse>(
        `/admin/billing/subscriptions/${encodeURIComponent(subscriptionId)}`,
        { headers: getAdminHeaders() },
    );
}
