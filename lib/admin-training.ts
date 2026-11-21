
import { apiRequest } from "@/lib/api-client";

// ---------------------------------------------------------
// Types
// ---------------------------------------------------------

export interface TrainingOverview {
    total_roadmaps: number;
    active_users: number;
    completed_roadmaps: number;
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    completion_rate: number;
    total_weeks: number;
}

export interface TrainingUser {
    user_id: string;
    name: string;
    email: string;
    is_verified: boolean;
    roadmap_id: string;
    current_week: number;
    total_weeks: number;
    completed_tasks: number;
    total_tasks: number;
    completion_rate: number;
    roadmap_status: "active" | "completed";
    created_at: string | null;
    updated_at: string | null;
}

export interface TrainingPagination {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
}

export interface TrainingUsersResponse {
    items: TrainingUser[];
    pagination: TrainingPagination;
}

export interface TrainingTask {
    task_id: string;
    title: string;
    description: string;
    estimated_minutes: number;
    required: boolean;
    completed?: boolean;
    completed_at?: string | null;
}

export interface TrainingWeek {
    week_number: number;
    title: string;
    objective: string;
    status: "completed" | "current" | "locked";
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    completion_rate: number;
    tasks: TrainingTask[];
}

export interface TrainingUserDetailsResponse {
    user: {
        id: string;
        name: string;
        email: string;
        is_verified: boolean;
        created_at: string | null;
    };
    roadmap: {
        roadmap_id: string;
        current_week: number;
        total_weeks: number;
        status: "active" | "completed";
        profile_snapshot: {
            age?: number;
            experience_level?: string;
            gender_identity?: string;
            preferences?: string[];
            desired_level?: string;
            role?: string;
        };
        created_at: string | null;
        updated_at: string | null;
        total_tasks: number;
        completed_tasks: number;
        pending_tasks: number;
        completion_rate: number;
        weeks: Array<{
            week_number: number;
            title: string;
            objective: string;
            tasks: TrainingTask[];
        }>;
    };
}

export interface TrainingProgressResponse {
    user_id: string;
    roadmap_id: string;
    current_week: number;
    total_weeks: number;
    total_tasks: number;
    completed_tasks: number;
    pending_tasks: number;
    completion_rate: number;
    weeks: TrainingWeek[];
}

// ---------------------------------------------------------
// API helper
// ---------------------------------------------------------

function getAdminHeaders(): HeadersInit {
    if (typeof window === "undefined") {
        return {};
    }

    const token = localStorage.getItem("admin_access_token");

    return token
        ? { Authorization: `Bearer ${token}` }
        : {};
}

// ---------------------------------------------------------
// API calls
// ---------------------------------------------------------

export function getTrainingOverview() {
    return apiRequest<TrainingOverview>(
        "/admin/training/overview",
        {
            headers: getAdminHeaders(),
        }
    );
}

export function getTrainingUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    roadmap_status?: string;
}) {
    const query = new URLSearchParams();

    query.set("page", String(params.page ?? 1));
    query.set("limit", String(params.limit ?? 10));

    if (params.search?.trim()) {
        query.set("search", params.search.trim());
    }

    if (params.roadmap_status) {
        query.set("roadmap_status", params.roadmap_status);
    }

    return apiRequest<TrainingUsersResponse>(
        `/admin/training/users?${query.toString()}`,
        {
            headers: getAdminHeaders(),
        }
    );
}

export function getTrainingUserDetails(userId: string) {
    return apiRequest<TrainingUserDetailsResponse>(
        `/admin/training/users/${encodeURIComponent(userId)}`,
        {
            headers: getAdminHeaders(),
        }
    );
}

export function getTrainingUserProgress(userId: string) {
    return apiRequest<TrainingProgressResponse>(
        `/admin/training/users/${encodeURIComponent(userId)}/progress`,
        {
            headers: getAdminHeaders(),
        }
    );
}
