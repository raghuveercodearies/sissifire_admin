
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Activity,
    ArrowRight,
    BookOpen,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    GraduationCap,
    Loader2,
    Map,
    Search,
    Users,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getTrainingOverview,
    getTrainingUsers,
    type TrainingOverview,
    type TrainingUser,
} from "@/lib/admin-training";

const EMPTY_OVERVIEW: TrainingOverview = {
    total_roadmaps: 0,
    active_users: 0,
    completed_roadmaps: 0,
    total_tasks: 0,
    completed_tasks: 0,
    pending_tasks: 0,
    completion_rate: 0,
    total_weeks: 26,
};

function formatDate(value: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "U";
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card/60 p-5 transition hover:border-purple-400/20">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                        {value}
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>

                <div className="flex size-11 items-center justify-center rounded-xl bg-purple-400/10 text-purple-300">
                    <Icon className="size-5" />
                </div>
            </div>
        </div>
    );
}

export default function AdminTrainingPage() {
    const router = useRouter();

    const [overview, setOverview] = useState(EMPTY_OVERVIEW);
    const [users, setUsers] = useState<TrainingUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);

    const limit = 10;

    const loadOverview = useCallback(async () => {
        try {
            const data = await getTrainingOverview();
            setOverview(data);
        } catch (err) {
            console.error("Training overview error:", err);
            throw err;
        }
    }, []);

    const loadUsers = useCallback(async () => {
        try {
            const data = await getTrainingUsers({
                page,
                limit,
                search,
                roadmap_status: status || undefined,
            });

            setUsers(data.items);
            setTotalPages(data.pagination.total_pages);
            setTotalUsers(data.pagination.total);
        } catch (err) {
            console.error("Training users error:", err);
            throw err;
        }
    }, [page, search, status]);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            await Promise.all([
                loadOverview(),
                loadUsers(),
            ]);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to load training dashboard.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [loadOverview, loadUsers]);

    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);

    function handleSearch(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    }

    function handleStatusChange(value: string) {
        setPage(1);
        setStatus(value);
    }

    const hasUsers = users.length > 0;

    return (
        <div className="min-h-screen space-y-7 p-5 md:p-8">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <GraduationCap className="size-4 text-purple-300" />
                        Admin Console
                        <span>/</span>
                        <span className="text-foreground">Training</span>
                    </div>

                    <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        Training & Roadmaps
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Monitor personalized training roadmaps and user progress.
                    </p>
                </div>

                <button
                    onClick={loadDashboard}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card/60 px-4 py-2.5 text-sm text-foreground transition hover:bg-white/[0.05] disabled:opacity-50"
                >
                    <Activity className={`size-4 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </button>
            </div>

            {/* Statistics */}
            <section>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-foreground">
                        Training Overview
                    </h2>
                    <span className="text-xs text-muted-foreground">
                        {overview.total_weeks}-week roadmap system
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Roadmaps"
                        value={overview.total_roadmaps.toLocaleString("en-IN")}
                        description="Generated roadmaps"
                        icon={Map}
                    />

                    <StatCard
                        title="Active Users"
                        value={overview.active_users.toLocaleString("en-IN")}
                        description="Currently training"
                        icon={Users}
                    />

                    {/* <StatCard
                        title="Completed Tasks"
                        value={overview.completed_tasks.toLocaleString("en-IN")}
                        description={`${overview.pending_tasks.toLocaleString("en-IN")} tasks pending`}
                        icon={CheckCircle2}
                    /> */}

                    <StatCard
                        title="Completion Rate"
                        value={`${overview.completion_rate.toFixed(1)}%`}
                        description={`${overview.completed_roadmaps} completed roadmaps`}
                        icon={GraduationCap}
                    />
                </div>
            </section>

            {/* Task completion summary */}
            <section className="rounded-2xl border border-border bg-card/60 p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            Overall Task Completion
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Completed tasks across all generated roadmaps
                        </p>
                    </div>

                    <span className="text-sm font-semibold text-purple-300">
                        {overview.completion_rate.toFixed(1)}%
                    </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-300 transition-all duration-500"
                        style={{
                            width: `${Math.min(100, Math.max(0, overview.completion_rate))}%`,
                        }}
                    />
                </div>

                <div className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground">
                    <span>{overview.completed_tasks.toLocaleString("en-IN")} completed</span>
                    <span>{overview.total_tasks.toLocaleString("en-IN")} total tasks</span>
                </div>
            </section>

            {/* User table */}
            <section className="overflow-hidden rounded-2xl border border-border bg-card/60">
                <div className="border-b border-border p-5">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-foreground">
                                User Roadmaps
                            </h2>
                            <p className="mt-1 text-xs text-muted-foreground">
                                View and monitor individual training journeys.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            <form
                                onSubmit={handleSearch}
                                className="flex min-w-0 items-center gap-2 rounded-xl border border-border bg-background/50 px-3 sm:w-[280px]"
                            >
                                <Search className="size-4 shrink-0 text-muted-foreground" />

                                <input
                                    value={searchInput}
                                    onChange={(event) => setSearchInput(event.target.value)}
                                    placeholder="Search name, email or ID..."
                                    className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                                />

                                <button
                                    type="submit"
                                    className="text-xs font-medium text-purple-300 hover:text-purple-200"
                                >
                                    Search
                                </button>
                            </form>

                            <select
                                value={status}
                                onChange={(event) => handleStatusChange(event.target.value)}
                                className="h-10 rounded-xl border border-border bg-background/50 px-3 text-sm text-foreground outline-none"
                            >
                                <option value="">All roadmaps</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center gap-3">
                        <Loader2 className="size-7 animate-spin text-purple-300" />
                        <p className="text-sm text-muted-foreground">
                            Loading training data...
                        </p>
                    </div>
                ) : error ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center">
                        <Activity className="mb-3 size-8 text-red-400" />
                        <p className="text-sm font-medium text-foreground">
                            Unable to load training data
                        </p>
                        <p className="mt-2 max-w-md text-xs text-muted-foreground">
                            {error}
                        </p>
                        <button
                            onClick={loadDashboard}
                            className="mt-4 rounded-lg bg-purple-500/15 px-4 py-2 text-sm text-purple-300 hover:bg-purple-500/25"
                        >
                            Try again
                        </button>
                    </div>
                ) : !hasUsers ? (
                    <div className="flex min-h-[260px] flex-col items-center justify-center px-5 text-center">
                        <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-purple-400/10">
                            <BookOpen className="size-6 text-purple-300" />
                        </div>

                        <h3 className="text-sm font-semibold text-foreground">
                            No training roadmaps found
                        </h3>

                        <p className="mt-2 max-w-sm text-xs text-muted-foreground">
                            {search || status
                                ? "Try changing your search or filters."
                                : "Roadmaps will appear here once users generate their training plans."}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[850px] text-left">
                                <thead className="border-b border-border bg-white/[0.02]">
                                    <tr className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                                        <th className="px-5 py-4">User</th>
                                        <th className="px-5 py-4">Current Week</th>
                                        <th className="px-5 py-4">Tasks</th>
                                        <th className="px-5 py-4">Progress</th>
                                        <th className="px-5 py-4">Status</th>
                                        <th className="px-5 py-4">Updated</th>
                                        <th className="px-5 py-4 text-right">Action</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-border">
                                    {users.map((user) => (
                                        <tr
                                            key={user.user_id}
                                            className="transition hover:bg-white/[0.02]"
                                        >
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-purple-400/10 bg-purple-400/10 text-xs font-semibold text-purple-300">
                                                        {getInitials(user.name)}
                                                    </div>

                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-foreground">
                                                            {user.name || "Unnamed user"}
                                                        </p>
                                                        <p className="mt-1 max-w-[210px] truncate text-xs text-muted-foreground">
                                                            {user.email || user.user_id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="text-sm text-foreground">
                                                    Week {user.current_week}
                                                </span>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    of {user.total_weeks}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="text-sm text-foreground">
                                                    {user.completed_tasks} / {user.total_tasks}
                                                </span>
                                                <p className="mt-1 text-xs text-muted-foreground">
                                                    completed
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="w-28">
                                                    <div className="mb-2 flex justify-between text-xs">
                                                        <span className="text-purple-300">
                                                            {user.completion_rate.toFixed(1)}%
                                                        </span>
                                                    </div>
                                                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                                                        <div
                                                            className="h-full rounded-full bg-purple-400"
                                                            style={{
                                                                width: `${Math.min(100, Math.max(0, user.completion_rate))}%`,
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${user.roadmap_status === "completed"
                                                            ? "bg-emerald-400/10 text-emerald-300"
                                                            : "bg-purple-400/10 text-purple-300"
                                                        }`}
                                                >
                                                    {user.roadmap_status === "completed"
                                                        ? "Completed"
                                                        : "Active"}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock3 className="size-3.5" />
                                                    {formatDate(user.updated_at)}
                                                </div>
                                            </td>

                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() =>
                                                        router.push(
                                                            `/admin/training/${encodeURIComponent(user.user_id)}`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-2 rounded-lg border border-purple-400/15 bg-purple-400/[0.06] px-3 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-400/[0.12]"
                                                >
                                                    View
                                                    <ArrowRight className="size-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col gap-3 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-muted-foreground">
                                Showing {totalUsers === 0 ? 0 : (page - 1) * limit + 1}
                                {" - "}
                                {Math.min(page * limit, totalUsers)}
                                {" of "}
                                {totalUsers} users
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((current) => current - 1)}
                                    className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft className="size-4" />
                                </button>

                                <span className="min-w-20 text-center text-xs text-muted-foreground">
                                    Page {page} of {Math.max(1, totalPages)}
                                </span>

                                <button
                                    disabled={page >= totalPages}
                                    onClick={() => setPage((current) => current + 1)}
                                    className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                                    aria-label="Next page"
                                >
                                    <ChevronRight className="size-4" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
