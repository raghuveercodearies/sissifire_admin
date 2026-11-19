"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
    Activity,
    ArrowDownRight,
    ArrowUpRight,
    BarChart3,
    Brain,
    CalendarDays,
    CheckCircle2,
    Clock,
    CreditCard,
    LayoutDashboard,
    LogOut,
    Menu,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import toast from "react-hot-toast";

import { adminDashboardFetch } from "@/lib/admin-dashboard-api";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type Period = "7d" | "30d" | "90d" | "12m";

interface Overview {
    total_users: number;
    verified_users: number;
    unverified_users: number;
    new_users_today: number;
    new_users_this_week: number;
    new_users_this_month: number;
    active_users_today: number;
    active_users_this_week: number;
    active_users_this_month: number;
    total_conversations: number;
    total_messages: number;
    total_subscribers: number;
    active_subscribers: number;
    total_roadmaps: number;
    completed_training_tasks: number;
}

interface GrowthData {
    period: Period;
    total_new_users: number;
    data: {
        date: string;
        users: number;
        cumulative_users: number;
    }[];
}

interface ActivityData {
    period: Period;
    total_conversations: number;
    total_messages: number;
    data: {
        date: string;
        conversations: number;
        messages: number;
    }[];
}

interface RecentUsersResponse {
    users: {
        id: string;
        name: string;
        email: string;
        is_verified: boolean;
        created_at: string | null;
    }[];
    total: number;
}

interface SubscriptionData {
    total_subscriptions: number;
    active_subscribers: number;
    canceled_subscriptions: number;
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

interface UsageData {
    total_free_tokens_used: number;
    total_paid_tokens_used: number;
    total_tokens_used: number;
    users_with_usage: number;
}

interface TrainingData {
    total_roadmaps: number;
    users_with_roadmaps: number;
    completed_tasks: number;
    pending_tasks: number;
    total_tasks: number;
    completion_rate: number;
}

interface DashboardData {
    overview: Overview;
    growth: GrowthData;
    activity: ActivityData;
    recentUsers: RecentUsersResponse;
    subscriptions: SubscriptionData;
    usage: UsageData;
    training: TrainingData;
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const PERIODS: { label: string; value: Period }[] = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
    { label: "12 Months", value: "12m" },
];

const PIE_COLORS = ["#c084fc", "#a855f7", "#7c3aed", "#4c1d95"];

function formatNumber(value?: number) {
    return new Intl.NumberFormat("en-IN").format(value ?? 0);
}

function formatCompact(value?: number) {
    return new Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value ?? 0);
}

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
/*                                Components                                 */
/* -------------------------------------------------------------------------- */

function SectionTitle({
    title,
    description,
    action,
}: {
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="mb-5 flex items-center justify-between gap-4">
            <div>
                <h2 className="text-base font-semibold text-foreground">{title}</h2>

                {description && (
                    <p className="mt-1 text-xs text-muted-foreground">{description}</p>
                )}
            </div>

            {action}
        </div>
    );
}

function Panel({
    children,
    className = "",
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl ${className}`}
        >
            {children}
        </div>
    );
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    accent = "purple",
}: {
    title: string;
    value: string | number;
    description: string;
    icon: typeof Users;
    accent?: "purple" | "blue" | "green" | "pink";
}) {
    const accentStyles = {
        purple: "bg-purple-400/10 text-purple-300 border-purple-400/15",
        blue: "bg-blue-400/10 text-blue-300 border-blue-400/15",
        green: "bg-emerald-400/10 text-emerald-300 border-emerald-400/15",
        pink: "bg-pink-400/10 text-pink-300 border-pink-400/15",
    };

    return (
        <Panel className="group transition-all duration-200 hover:border-purple-400/25">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs text-muted-foreground">{title}</p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                        {value}
                    </h3>

                    <p className="mt-2 text-xs text-muted-foreground">{description}</p>
                </div>

                <div
                    className={`flex size-10 items-center justify-center rounded-xl border ${accentStyles[accent]}`}
                >
                    <Icon className="size-4" />
                </div>
            </div>
        </Panel>
    );
}

function PeriodSelector({
    value,
    onChange,
}: {
    value: Period;
    onChange: (value: Period) => void;
}) {
    return (
        <div className="flex rounded-xl border border-border bg-background/70 p-1">
            {PERIODS.map((period) => (
                <button
                    key={period.value}
                    onClick={() => onChange(period.value)}
                    className={`rounded-lg px-3 py-1.5 text-xs transition-all ${value === period.value
                            ? "bg-purple-400/15 text-brand-soft"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    {period.label}
                </button>
            ))}
        </div>
    );
}

function EmptyChart() {
    return (
        <div className="flex h-full min-h-[240px] items-center justify-center">
            <div className="text-center">
                <BarChart3 className="mx-auto size-8 text-muted-foreground/40" />

                <p className="mt-3 text-sm text-muted-foreground">
                    No data available yet
                </p>
            </div>
        </div>
    );
}

/* -------------------------------------------------------------------------- */
/*                                Dashboard                                   */
/* -------------------------------------------------------------------------- */

export default function AdminDashboardPage() {
    const router = useRouter();

    const [period, setPeriod] = useState<Period>("30d");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [dashboard, setDashboard] = useState<DashboardData | null>(null);

    const fetchDashboard = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const [
                    overview,
                    growth,
                    activity,
                    recentUsers,
                    subscriptions,
                    usage,
                    training,
                ] = await Promise.all([
                    adminDashboardFetch<Overview>("/admin/dashboard/overview"),

                    adminDashboardFetch<GrowthData>(
                        `/admin/dashboard/user-growth?period=${period}`,
                    ),

                    adminDashboardFetch<ActivityData>(
                        `/admin/dashboard/activity?period=${period}`,
                    ),

                    adminDashboardFetch<RecentUsersResponse>(
                        "/admin/dashboard/recent-users?limit=10",
                    ),

                    adminDashboardFetch<SubscriptionData>(
                        "/admin/dashboard/subscriptions",
                    ),

                    adminDashboardFetch<UsageData>("/admin/dashboard/usage"),

                    adminDashboardFetch<TrainingData>("/admin/dashboard/training"),
                ]);

                setDashboard({
                    overview,
                    growth,
                    activity,
                    recentUsers,
                    subscriptions,
                    usage,
                    training,
                });
            } catch (err) {
                const message =
                    err instanceof Error ? err.message : "Unable to load dashboard";

                setError(message);

                if (
                    message.includes("session") ||
                    message.includes("authentication token")
                ) {
                    toast.error(message);
                    router.push("/admin/login");
                    return;
                }
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [period, router],
    );

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    function handleLogout() {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_user");

        toast.success("Logged out successfully");

        router.push("/admin/login");
    }

    /* ------------------------------------------------------------------------ */
    /*                                  Loading                                 */
    /* ------------------------------------------------------------------------ */

    if (loading && !dashboard) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-page-gradient">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="size-12 animate-spin rounded-full border-2 border-purple-400/15 border-t-purple-400" />

                        <Sparkles className="absolute inset-0 m-auto size-4 text-brand-soft" />
                    </div>

                    <p className="mt-5 text-sm text-muted-foreground">
                        Loading admin dashboard...
                    </p>
                </div>
            </main>
        );
    }

    /* ------------------------------------------------------------------------ */
    /*                                  Layout                                  */
    /* ------------------------------------------------------------------------ */

    return (
        <main className="min-h-screen bg-page-gradient text-foreground">
            <div className="flex min-h-screen">
                {/* ------------------------------------------------------------------ */}
                {/* Sidebar                                                             */}
                {/* ------------------------------------------------------------------ */}

                {/* ------------------------------------------------------------------ */}
                {/* Main Content                                                        */}
                {/* ------------------------------------------------------------------ */}

                <div className="min-w-0 flex-1">
                    {/* Header */}
                    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-border bg-[#08080b]/75 px-5 backdrop-blur-xl md:px-8">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setSidebarOpen(true)}
                                className="rounded-lg p-2 text-muted-foreground hover:bg-white/[0.03] lg:hidden"
                            >
                                <Menu className="size-5" />
                            </button>

                            <div>
                                <h1 className="text-lg font-semibold text-foreground">
                                    Dashboard
                                </h1>

                                <p className="hidden text-xs text-muted-foreground sm:block">
                                    Overview of your platform performance
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => fetchDashboard(true)}
                                disabled={refreshing}
                                className="flex items-center gap-2 rounded-xl border border-border bg-card/70 px-3 py-2 text-xs text-muted-foreground transition hover:border-purple-400/20 hover:text-brand-soft disabled:opacity-50"
                            >
                                <RefreshCw
                                    className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
                                />

                                <span className="hidden sm:inline">
                                    {refreshing ? "Refreshing..." : "Refresh"}
                                </span>
                            </button>

                            <div className="flex size-9 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/10">
                                <ShieldCheck className="size-4 text-brand-soft" />
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Body */}
                    <div className="mx-auto max-w-[1600px] space-y-7 p-5 md:p-8">
                        {/* Welcome */}
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                            <div>
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="size-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]" />

                                    <span className="text-[10px] uppercase tracking-[0.2em] text-brand-soft">
                                        System Overview
                                    </span>
                                </div>

                                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                    Welcome back, Admin
                                </h2>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    Here&apos;s what&apos;s happening with Sissifier GPT today.
                                </p>
                            </div>

                            <div className="flex items-center gap-2 rounded-xl border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground">
                                <CalendarDays className="size-3.5 text-brand-soft" />

                                {new Date().toLocaleDateString("en-IN", {
                                    weekday: "long",
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="flex items-start justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/[0.05] p-4">
                                <div>
                                    <p className="text-sm font-medium text-red-300">
                                        Dashboard data could not be loaded
                                    </p>

                                    <p className="mt-1 text-xs text-red-300/70">{error}</p>
                                </div>

                                <button
                                    onClick={() => fetchDashboard(true)}
                                    className="shrink-0 rounded-lg border border-red-400/20 px-3 py-1.5 text-xs text-red-300 hover:bg-red-400/10"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        {dashboard && (
                            <>
                                {/* ---------------------------------------------------------------- */}
                                {/* KPI Cards                                                        */}
                                {/* ---------------------------------------------------------------- */}

                                <section>
                                    <SectionTitle
                                        title="Platform Statistics"
                                        description="Key metrics across your platform"
                                    />

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                        <StatCard
                                            title="Total Users"
                                            value={formatNumber(dashboard.overview.total_users)}
                                            description={`${formatNumber(
                                                dashboard.overview.verified_users,
                                            )} verified users`}
                                            icon={Users}
                                            accent="purple"
                                        />

                                        <StatCard
                                            title="Active Today"
                                            value={formatNumber(
                                                dashboard.overview.active_users_today,
                                            )}
                                            description={`${formatNumber(
                                                dashboard.overview.active_users_this_week,
                                            )} active this week`}
                                            icon={Activity}
                                            accent="blue"
                                        />

                                        <StatCard
                                            title="Subscriptions"
                                            value={formatNumber(
                                                dashboard.overview.active_subscribers,
                                            )}
                                            description={`${formatNumber(
                                                dashboard.overview.total_subscribers,
                                            )} total subscribers`}
                                            icon={CreditCard}
                                            accent="green"
                                        />

                                        <StatCard
                                            title="Conversations"
                                            value={formatNumber(
                                                dashboard.overview.total_conversations,
                                            )}
                                            description={`${formatNumber(
                                                dashboard.overview.total_messages,
                                            )} total messages`}
                                            icon={Brain}
                                            accent="pink"
                                        />
                                    </div>
                                </section>

                                {/* ---------------------------------------------------------------- */}
                                {/* User Growth                                                      */}
                                {/* ---------------------------------------------------------------- */}

                                <section>
                                    <Panel>
                                        <SectionTitle
                                            title="User Growth"
                                            description="New user registrations over time"
                                            action={
                                                <PeriodSelector
                                                    value={period}
                                                    onChange={setPeriod}
                                                />
                                            }
                                        />

                                        <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    New Users
                                                </p>

                                                <p className="mt-1 text-xl font-semibold text-foreground">
                                                    {formatNumber(dashboard.growth.total_new_users)}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="text-xs text-muted-foreground">
                                                    This Month
                                                </p>

                                                <p className="mt-1 text-xl font-semibold text-brand-soft">
                                                    {formatNumber(
                                                        dashboard.overview.new_users_this_month,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="hidden sm:block">
                                                <p className="text-xs text-muted-foreground">
                                                    This Week
                                                </p>

                                                <p className="mt-1 text-xl font-semibold text-foreground">
                                                    {formatNumber(
                                                        dashboard.overview.new_users_this_week,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="h-[280px]">
                                            {dashboard.growth.data?.length ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart data={dashboard.growth.data}>
                                                        <defs>
                                                            <linearGradient
                                                                id="userGrowthGradient"
                                                                x1="0"
                                                                y1="0"
                                                                x2="0"
                                                                y2="1"
                                                            >
                                                                <stop
                                                                    offset="0%"
                                                                    stopColor="#c084fc"
                                                                    stopOpacity={0.3}
                                                                />

                                                                <stop
                                                                    offset="100%"
                                                                    stopColor="#c084fc"
                                                                    stopOpacity={0}
                                                                />
                                                            </linearGradient>
                                                        </defs>

                                                        <CartesianGrid
                                                            stroke="rgba(255,255,255,0.05)"
                                                            vertical={false}
                                                        />

                                                        <XAxis
                                                            dataKey="date"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: "#9992a4", fontSize: 11 }}
                                                        />

                                                        <YAxis
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: "#9992a4", fontSize: 11 }}
                                                        />

                                                        <Tooltip
                                                            contentStyle={{
                                                                background: "#111116",
                                                                border: "1px solid #29232f",
                                                                borderRadius: "12px",
                                                                color: "#f4f2f7",
                                                            }}
                                                        />

                                                        <Area
                                                            type="monotone"
                                                            dataKey="users"
                                                            stroke="#c084fc"
                                                            strokeWidth={2.5}
                                                            fill="url(#userGrowthGradient)"
                                                            activeDot={{
                                                                r: 5,
                                                                fill: "#c084fc",
                                                                stroke: "#08080b",
                                                                strokeWidth: 2,
                                                            }}
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <EmptyChart />
                                            )}
                                        </div>
                                    </Panel>
                                </section>

                                {/* ---------------------------------------------------------------- */}
                                {/* Activity and Subscription Charts                                 */}
                                {/* ---------------------------------------------------------------- */}

                                <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                                    {/* Activity */}
                                    <Panel className="xl:col-span-2">
                                        <SectionTitle
                                            title="Platform Activity"
                                            description="Conversations and messages"
                                        />

                                        <div className="mb-5 flex flex-wrap gap-5">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-purple-400" />

                                                    <span className="text-xs text-muted-foreground">
                                                        Conversations
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-xl font-semibold">
                                                    {formatNumber(
                                                        dashboard.activity.total_conversations,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="size-2 rounded-full bg-pink-400" />

                                                    <span className="text-xs text-muted-foreground">
                                                        Messages
                                                    </span>
                                                </div>

                                                <p className="mt-2 text-xl font-semibold">
                                                    {formatNumber(dashboard.activity.total_messages)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="h-[260px]">
                                            {dashboard.activity.data?.length ? (
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <BarChart
                                                        data={dashboard.activity.data}
                                                        barGap={4}
                                                    >
                                                        <CartesianGrid
                                                            stroke="rgba(255,255,255,0.05)"
                                                            vertical={false}
                                                        />

                                                        <XAxis
                                                            dataKey="date"
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: "#9992a4", fontSize: 11 }}
                                                        />

                                                        <YAxis
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fill: "#9992a4", fontSize: 11 }}
                                                        />

                                                        <Tooltip
                                                            contentStyle={{
                                                                background: "#111116",
                                                                border: "1px solid #29232f",
                                                                borderRadius: "12px",
                                                                color: "#f4f2f7",
                                                            }}
                                                        />

                                                        <Bar
                                                            dataKey="conversations"
                                                            fill="#c084fc"
                                                            radius={[5, 5, 0, 0]}
                                                        />

                                                        <Bar
                                                            dataKey="messages"
                                                            fill="#ec4899"
                                                            radius={[5, 5, 0, 0]}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            ) : (
                                                <EmptyChart />
                                            )}
                                        </div>
                                    </Panel>

                                    {/* Subscription Breakdown */}
                                    <Panel>
                                        <SectionTitle
                                            title="Subscriptions"
                                            description="Current subscription distribution"
                                        />

                                        <div className="relative h-[220px]">
                                            {dashboard.subscriptions.plan_breakdown?.length ? (
                                                <>
                                                    <ResponsiveContainer width="100%" height="100%">
                                                        <PieChart>
                                                            <Pie
                                                                data={dashboard.subscriptions.plan_breakdown}
                                                                dataKey="count"
                                                                nameKey="plan"
                                                                innerRadius={65}
                                                                outerRadius={88}
                                                                paddingAngle={4}
                                                            >
                                                                {dashboard.subscriptions.plan_breakdown.map(
                                                                    (_, index) => (
                                                                        <Cell
                                                                            key={index}
                                                                            fill={
                                                                                PIE_COLORS[
                                                                                index % PIE_COLORS.length
                                                                                ]
                                                                            }
                                                                        />
                                                                    ),
                                                                )}
                                                            </Pie>

                                                            <Tooltip
                                                                contentStyle={{
                                                                    background: "#111116",
                                                                    border: "1px solid #29232f",
                                                                    borderRadius: "12px",
                                                                    color: "#f4f2f7",
                                                                }}
                                                            />
                                                        </PieChart>
                                                    </ResponsiveContainer>

                                                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                        <p className="text-2xl font-semibold">
                                                            {formatNumber(
                                                                dashboard.subscriptions.active_subscribers,
                                                            )}
                                                        </p>

                                                        <p className="text-[10px] text-muted-foreground">
                                                            Active
                                                        </p>
                                                    </div>
                                                </>
                                            ) : (
                                                <EmptyChart />
                                            )}
                                        </div>

                                        <div className="mt-3 space-y-3">
                                            {dashboard.subscriptions.plan_breakdown?.map(
                                                (plan, index) => (
                                                    <div
                                                        key={plan.plan}
                                                        className="flex items-center justify-between"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="size-2 rounded-full"
                                                                style={{
                                                                    backgroundColor:
                                                                        PIE_COLORS[
                                                                        index % PIE_COLORS.length
                                                                        ],
                                                                }}
                                                            />

                                                            <span className="text-xs capitalize text-muted-foreground">
                                                                {plan.plan}
                                                            </span>
                                                        </div>

                                                        <span className="text-xs font-medium text-foreground">
                                                            {formatNumber(plan.count)}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </Panel>
                                </section>

                                {/* ---------------------------------------------------------------- */}
                                {/* AI Usage and Training                                           */}
                                {/* ---------------------------------------------------------------- */}

                                <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                                    {/* AI Usage */}
                                    <Panel>
                                        <SectionTitle
                                            title="AI Usage"
                                            description="Token usage across the platform"
                                        />

                                        <div className="mb-6 rounded-xl border border-purple-400/10 bg-purple-400/[0.04] p-4">
                                            <p className="text-xs text-muted-foreground">
                                                Total Tokens Used
                                            </p>

                                            <p className="mt-2 text-2xl font-semibold text-brand-soft">
                                                {formatCompact(
                                                    dashboard.usage.total_tokens_used,
                                                )}
                                            </p>

                                            <p className="mt-1 text-xs text-muted-foreground">
                                                {formatNumber(
                                                    dashboard.usage.users_with_usage,
                                                )}{" "}
                                                users with AI usage
                                            </p>
                                        </div>

                                        <div className="space-y-5">
                                            {/* Free */}
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        Free Users
                                                    </span>

                                                    <span className="text-xs font-medium text-foreground">
                                                        {formatCompact(
                                                            dashboard.usage.total_free_tokens_used,
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                                                    <div
                                                        className="h-full rounded-full bg-purple-400 transition-all"
                                                        style={{
                                                            width: `${dashboard.usage.total_tokens_used
                                                                    ? (dashboard.usage.total_free_tokens_used /
                                                                        dashboard.usage.total_tokens_used) *
                                                                    100
                                                                    : 0
                                                                }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Paid */}
                                            <div>
                                                <div className="mb-2 flex items-center justify-between">
                                                    <span className="text-xs text-muted-foreground">
                                                        Paid Users
                                                    </span>

                                                    <span className="text-xs font-medium text-foreground">
                                                        {formatCompact(
                                                            dashboard.usage.total_paid_tokens_used,
                                                        )}
                                                    </span>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                                                    <div
                                                        className="h-full rounded-full bg-pink-400 transition-all"
                                                        style={{
                                                            width: `${dashboard.usage.total_tokens_used
                                                                    ? (dashboard.usage.total_paid_tokens_used /
                                                                        dashboard.usage.total_tokens_used) *
                                                                    100
                                                                    : 0
                                                                }%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </Panel>

                                    {/* Training */}
                                    <Panel>
                                        <SectionTitle
                                            title="Training & Roadmaps"
                                            description="User learning progress"
                                        />

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="rounded-xl border border-border bg-background/50 p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Total Roadmaps
                                                </p>

                                                <p className="mt-2 text-xl font-semibold">
                                                    {formatNumber(
                                                        dashboard.training.total_roadmaps,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="rounded-xl border border-border bg-background/50 p-4">
                                                <p className="text-xs text-muted-foreground">
                                                    Users Training
                                                </p>

                                                <p className="mt-2 text-xl font-semibold text-brand-soft">
                                                    {formatNumber(
                                                        dashboard.training.users_with_roadmaps,
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="text-xs text-muted-foreground">
                                                    Completion Rate
                                                </span>

                                                <span className="text-sm font-semibold text-brand-soft">
                                                    {dashboard.training.completion_rate?.toFixed(1) ?? 0}%
                                                </span>
                                            </div>

                                            <div className="h-2.5 overflow-hidden rounded-full bg-secondary">
                                                <div
                                                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-300 transition-all"
                                                    style={{
                                                        width: `${Math.min(
                                                            Math.max(
                                                                dashboard.training.completion_rate ?? 0,
                                                                0,
                                                            ),
                                                            100,
                                                        )}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-5 grid grid-cols-3 gap-3">
                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="size-3.5 text-emerald-400" />

                                                    <span className="text-[10px] text-muted-foreground">
                                                        Completed
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-lg font-semibold text-emerald-300">
                                                    {formatNumber(
                                                        dashboard.training.completed_tasks,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="size-3.5 text-yellow-400" />

                                                    <span className="text-[10px] text-muted-foreground">
                                                        Pending
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-lg font-semibold text-yellow-300">
                                                    {formatNumber(
                                                        dashboard.training.pending_tasks,
                                                    )}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="flex items-center gap-1.5">
                                                    <Activity className="size-3.5 text-purple-400" />

                                                    <span className="text-[10px] text-muted-foreground">
                                                        Total
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-lg font-semibold">
                                                    {formatNumber(
                                                        dashboard.training.total_tasks,
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </Panel>
                                </section>

                                {/* ---------------------------------------------------------------- */}
                                {/* Recent Users                                                     */}
                                {/* ---------------------------------------------------------------- */}

                                <section>
                                    <Panel>
                                        <SectionTitle
                                            title="Recent Users"
                                            description="Latest registrations on the platform"
                                            action={
                                                <button
                                                    onClick={() => router.push("/admin/users")}
                                                    className="text-xs text-brand-soft transition hover:text-purple-200"
                                                >
                                                    View all
                                                </button>
                                            }
                                        />

                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-[600px]">
                                                <thead>
                                                    <tr className="border-b border-border">
                                                        <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                            User
                                                        </th>

                                                        <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                            Email
                                                        </th>

                                                        <th className="pb-3 text-left text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                            Status
                                                        </th>

                                                        <th className="pb-3 text-right text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                                            Joined
                                                        </th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {dashboard.recentUsers.users?.length ? (
                                                        dashboard.recentUsers.users.map((user) => (
                                                            <tr
                                                                key={user.id}
                                                                className="border-b border-border/50 transition hover:bg-white/[0.015]"
                                                            >
                                                                <td className="py-3.5">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-purple-400/10 bg-purple-400/[0.07] text-[10px] font-semibold text-brand-soft">
                                                                            {getInitials(user.name)}
                                                                        </div>

                                                                        <span className="text-xs font-medium text-foreground">
                                                                            {user.name || "Unnamed User"}
                                                                        </span>
                                                                    </div>
                                                                </td>

                                                                <td className="py-3.5 text-xs text-muted-foreground">
                                                                    {user.email}
                                                                </td>

                                                                <td className="py-3.5">
                                                                    {user.is_verified ? (
                                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-2 py-1 text-[10px] text-emerald-300">
                                                                            <CheckCircle2 className="size-3" />

                                                                            Verified
                                                                        </span>
                                                                    ) : (
                                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/15 bg-yellow-400/[0.06] px-2 py-1 text-[10px] text-yellow-300">
                                                                            <Clock className="size-3" />

                                                                            Pending
                                                                        </span>
                                                                    )}
                                                                </td>

                                                                <td className="py-3.5 text-right text-xs text-muted-foreground">
                                                                    {formatDate(user.created_at)}
                                                                </td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td
                                                                colSpan={4}
                                                                className="py-12 text-center text-sm text-muted-foreground"
                                                            >
                                                                No users found
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Panel>
                                </section>

                                {/* ---------------------------------------------------------------- */}
                                {/* Footer                                                           */}
                                {/* ---------------------------------------------------------------- */}

                                <footer className="flex flex-col items-center justify-between gap-3 border-t border-border pt-5 sm:flex-row">
                                    <p className="text-[10px] text-muted-foreground">
                                        Sissifier GPT Admin Console
                                    </p>

                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                        <span className="size-1.5 rounded-full bg-emerald-400" />

                                        System operational
                                    </div>
                                </footer>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom subtle purple glow */}
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
        </main>
    );
}