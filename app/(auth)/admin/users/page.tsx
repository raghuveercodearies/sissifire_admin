"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Filter,
    RefreshCw,
    Search,
    ShieldCheck,
    UserRound,
    Users,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminDashboardFetch } from "@/lib/admin-dashboard-api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type UserStatus = "all" | "verified" | "unverified";

interface AdminUser {
    id: string;
    name?: string;
    email: string;
    is_verified: boolean;
    created_at?: string | null;
    plan?: string | null;
    status?: string | null;
}

interface UserStats {
    total_users: number;
    verified_users: number;
    unverified_users: number;
    new_users_today?: number;
    new_users_this_week?: number;
    new_users_this_month?: number;
}

interface UsersResponse {
    items: AdminUser[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
    };
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatNumber(value?: number) {
    return new Intl.NumberFormat("en-IN").format(value ?? 0);
}

function formatDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getInitials(name?: string) {
    if (!name) return "U";

    return name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Components                                                                 */
/* -------------------------------------------------------------------------- */

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    color,
}: {
    title: string;
    value: number;
    description: string;
    icon: typeof Users;
    color: "purple" | "green" | "yellow";
}) {
    const colors = {
        purple: "border-purple-400/15 bg-purple-400/[0.06] text-purple-300",
        green: "border-emerald-400/15 bg-emerald-400/[0.06] text-emerald-300",
        yellow: "border-yellow-400/15 bg-yellow-400/[0.06] text-yellow-300",
    };

    return (
        <div className="rounded-2xl border border-border bg-card/80 p-5 transition hover:border-purple-400/20">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">{title}</p>

                    <h3 className="mt-3 text-2xl font-semibold text-foreground">
                        {formatNumber(value)}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div
                    className={`flex size-10 items-center justify-center rounded-xl border ${colors[color]}`}
                >
                    <Icon className="size-4" />
                </div>
            </div>
        </div>
    );
}

function VerificationBadge({ verified }: { verified: boolean }) {
    return verified ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2.5 py-1 text-[10px] text-emerald-300">
            <CheckCircle2 className="size-3" />
            Verified
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/15 bg-yellow-400/[0.06] px-2.5 py-1 text-[10px] text-yellow-300">
            <Clock className="size-3" />
            Unverified
        </span>
    );
}

function EmptyState({
    title,
    description,
}: {
    title: string;
    description: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl border border-purple-400/10 bg-purple-400/[0.05]">
                <Users className="size-6 text-purple-300/60" />
            </div>

            <h3 className="mt-4 text-sm font-medium text-foreground">
                {title}
            </h3>

            <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/* Users Page                                                                 */
/* -------------------------------------------------------------------------- */

export default function AdminUsersPage() {
    const router = useRouter();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [stats, setStats] = useState<UserStats | null>(null);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<UserStatus>("all");

    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(limit),
                });

                if (search.trim()) {
                    params.set("search", search.trim());
                }

                if (status !== "all") {
                    params.set("status", status);
                }

                const [usersResponse, statsResponse] = await Promise.all([
                    adminDashboardFetch<UsersResponse>(
                        `/admin/users?${params.toString()}`,
                    ),
                    adminDashboardFetch<UserStats>("/admin/users/stats"),
                ]);

                setUsers(usersResponse.items ?? []);
                setTotal(usersResponse.pagination?.total ?? 0);
                setTotalPages(usersResponse.pagination?.total_pages ?? 1);

                setStats(statsResponse);
            } catch (err) {
                const message =
                    err instanceof Error
                        ? err.message
                        : "Unable to load users";

                setError(message);

                if (
                    message.includes("session") ||
                    message.includes("authentication token")
                ) {
                    toast.error(message);
                    router.push("/admin/login");
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [page, limit, search, status, router],
    );

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    /* ------------------------------------------------------------------------ */
    /* Search                                                                   */
    /* ------------------------------------------------------------------------ */

    function handleSearch(value: string) {
        setSearch(value);
        setPage(1);
    }

    /* ------------------------------------------------------------------------ */
    /* Status Filter                                                            */
    /* ------------------------------------------------------------------------ */

    function handleStatusChange(value: UserStatus) {
        setStatus(value);
        setPage(1);
    }

    /* ------------------------------------------------------------------------ */
    /* Pagination                                                               */
    /* ------------------------------------------------------------------------ */

    function previousPage() {
        if (page > 1) {
            setPage((current) => current - 1);
        }
    }

    function nextPage() {
        if (page < totalPages) {
            setPage((current) => current + 1);
        }
    }

    /* ------------------------------------------------------------------------ */
    /* Logout                                                                   */
    /* ------------------------------------------------------------------------ */

    function handleLogout() {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_user");

        toast.success("Logged out successfully");
        router.push("/admin/login");
    }

    /* ------------------------------------------------------------------------ */
    /* Loading                                                                  */
    /* ------------------------------------------------------------------------ */

    if (loading && !stats) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-page-gradient">
                <div className="flex flex-col items-center">
                    <div className="size-10 animate-spin rounded-full border-2 border-purple-400/15 border-t-purple-400" />

                    <p className="mt-4 text-sm text-muted-foreground">
                        Loading users...
                    </p>
                </div>
            </main>
        );
    }

    /* ------------------------------------------------------------------------ */
    /* Layout                                                                   */
    /* ------------------------------------------------------------------------ */

    return (
        <main className="min-h-screen bg-page-gradient text-foreground">
            <div className="mx-auto max-w-[1600px] space-y-7 p-5 md:p-8">
                {/* ------------------------------------------------------------------ */}
                {/* Header                                                              */}
                {/* ------------------------------------------------------------------ */}

                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => router.push("/admin/dashboard")}
                            className="mt-1 flex size-9 items-center justify-center rounded-xl border border-border bg-card/70 text-muted-foreground transition hover:border-purple-400/20 hover:text-brand-soft"
                        >
                            <ArrowLeft className="size-4" />
                        </button>

                        <div>
                            <div className="mb-1 flex items-center gap-2">
                                <span className="size-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />

                                <span className="text-[10px] uppercase tracking-[0.2em] text-brand-soft">
                                    User Management
                                </span>
                            </div>

                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Users
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Manage and monitor your platform users.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => fetchUsers(true)}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-2.5 text-xs text-muted-foreground transition hover:border-purple-400/20 hover:text-brand-soft disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
                        />

                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </header>

                {/* ------------------------------------------------------------------ */}
                {/* Stats                                                               */}
                {/* ------------------------------------------------------------------ */}

                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <StatCard
                        title="Total Users"
                        value={stats?.total_users ?? 0}
                        description="All registered accounts"
                        icon={Users}
                        color="purple"
                    />

                    <StatCard
                        title="Verified Users"
                        value={stats?.verified_users ?? 0}
                        description="Email verified accounts"
                        icon={CheckCircle2}
                        color="green"
                    />

                    <StatCard
                        title="Unverified Users"
                        value={stats?.unverified_users ?? 0}
                        description="Awaiting email verification"
                        icon={Clock}
                        color="yellow"
                    />
                </section>

                {/* ------------------------------------------------------------------ */}
                {/* Error                                                               */}
                {/* ------------------------------------------------------------------ */}

                {error && (
                    <div className="flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">
                        <div>
                            <p className="text-sm font-medium text-red-300">
                                Unable to load users
                            </p>

                            <p className="mt-1 text-xs text-red-300/70">
                                {error}
                            </p>
                        </div>

                        <button
                            onClick={() => fetchUsers(true)}
                            className="rounded-lg border border-red-400/20 px-3 py-1.5 text-xs text-red-300 transition hover:bg-red-400/10"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* ------------------------------------------------------------------ */}
                {/* User Table                                                          */}
                {/* ------------------------------------------------------------------ */}

                <section className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl">
                    {/* Table Header */}
                    <div className="border-b border-border p-5">
                        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                            <div>
                                <h2 className="text-base font-semibold text-foreground">
                                    All Users
                                </h2>

                                <p className="mt-1 text-xs text-muted-foreground">
                                    Search, filter and view registered users.
                                </p>
                            </div>

                            <div className="flex flex-col gap-3 sm:flex-row">
                                {/* Search */}
                                <div className="relative sm:w-[280px]">
                                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

                                    <input
                                        type="text"
                                        placeholder="Search name or email..."
                                        value={search}
                                        onChange={(event) =>
                                            handleSearch(event.target.value)
                                        }
                                        className="h-10 w-full rounded-xl border border-border bg-background/70 pl-10 pr-10 text-xs text-foreground placeholder:text-muted-foreground transition focus:border-purple-400/40"
                                    />

                                    {search && (
                                        <button
                                            onClick={() => handleSearch("")}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                        >
                                            <X className="size-3.5" />
                                        </button>
                                    )}
                                </div>

                                {/* Verification Filter */}
                                <div className="relative">
                                    <Filter className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />

                                    <select
                                        value={status}
                                        onChange={(event) =>
                                            handleStatusChange(
                                                event.target.value as UserStatus,
                                            )
                                        }
                                        className="h-10 w-full appearance-none rounded-xl border border-border bg-background/70 pl-9 pr-8 text-xs text-foreground outline-none transition focus:border-purple-400/40 sm:w-[170px]"
                                    >
                                        <option value="all">All Users</option>
                                        <option value="verified">Verified</option>
                                        <option value="unverified">Unverified</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ---------------------------------------------------------------- */}
                    {/* Table                                                              */}
                    {/* ---------------------------------------------------------------- */}

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px]">
                            <thead>
                                <tr className="border-b border-border bg-background/30">
                                    <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        User
                                    </th>

                                    <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Email
                                    </th>

                                    <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Verification
                                    </th>

                                    <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Plan
                                    </th>

                                    <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Joined
                                    </th>

                                    <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="py-16">
                                            <div className="flex justify-center">
                                                <div className="size-7 animate-spin rounded-full border-2 border-purple-400/15 border-t-purple-400" />
                                            </div>
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6}>
                                            <EmptyState
                                                title="No users found"
                                                description={
                                                    search
                                                        ? "Try searching with another name or email."
                                                        : "There are no users matching this filter."
                                                }
                                            />
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-border/50 transition hover:bg-white/[0.015]"
                                        >
                                            {/* User */}
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-purple-400/10 bg-purple-400/[0.07] text-[10px] font-semibold text-brand-soft">
                                                        {getInitials(user.name)}
                                                    </div>

                                                    <div>
                                                        <p className="text-xs font-medium text-foreground">
                                                            {user.name || "Unnamed User"}
                                                        </p>

                                                        <p className="mt-0.5 max-w-[150px] truncate text-[10px] text-muted-foreground">
                                                            ID: {user.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Email */}
                                            <td className="px-5 py-4">
                                                <span className="text-xs text-muted-foreground">
                                                    {user.email}
                                                </span>
                                            </td>

                                            {/* Verification */}
                                            <td className="px-5 py-4">
                                                <VerificationBadge verified={user.is_verified} />
                                            </td>

                                            {/* Plan */}
                                            <td className="px-5 py-4">
                                                <span className="inline-flex items-center rounded-lg border border-border bg-background/50 px-2.5 py-1 text-[10px] capitalize text-muted-foreground">
                                                    {user.plan || "Free"}
                                                </span>
                                            </td>

                                            {/* Joined */}
                                            <td className="px-5 py-4">
                                                <span className="text-xs text-muted-foreground">
                                                    {formatDate(user.created_at)}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        router.push(`/admin/users/${user.id}`)
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-lg border border-purple-400/10 bg-purple-400/[0.04] px-3 py-1.5 text-[10px] text-brand-soft transition hover:border-purple-400/20 hover:bg-purple-400/[0.08]"
                                                >
                                                    View

                                                    <ArrowRight className="size-3" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ---------------------------------------------------------------- */}
                    {/* Pagination                                                         */}
                    {/* ---------------------------------------------------------------- */}

                    <div className="flex flex-col justify-between gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center">
                        <p className="text-xs text-muted-foreground">
                            Showing{" "}
                            <span className="font-medium text-foreground">
                                {total === 0 ? 0 : (page - 1) * limit + 1}
                            </span>
                            {" – "}
                            <span className="font-medium text-foreground">
                                {Math.min(page * limit, total)}
                            </span>
                            {" of "}
                            <span className="font-medium text-foreground">
                                {formatNumber(total)}
                            </span>{" "}
                            users
                        </p>

                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                            <p className="text-xs text-muted-foreground">
                                Page {page} of {Math.max(totalPages, 1)}
                            </p>

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={previousPage}
                                    disabled={page <= 1 || loading}
                                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-purple-400/20 hover:text-brand-soft disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>

                                <button
                                    onClick={nextPage}
                                    disabled={page >= totalPages || loading}
                                    className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:border-purple-400/20 hover:text-brand-soft disabled:pointer-events-none disabled:opacity-30"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="flex items-center justify-between border-t border-border pt-5">
                    <p className="text-[10px] text-muted-foreground">
                        Sissifier GPT Admin Console
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-emerald-400" />

                        System operational
                    </div>
                </footer>
            </div>
        </main>
    );
}