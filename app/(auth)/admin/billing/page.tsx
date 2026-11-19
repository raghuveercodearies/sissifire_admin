
"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import {
    CreditCard,
    Users,
    CheckCircle2,
    Clock3,
    XCircle,
    AlertCircle,
    Search,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    ArrowUpRight,
    CalendarDays,
    Crown,
    Zap,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getBillingOverview,
    getAdminPlans,
    getAdminSubscriptions,
    type BillingOverview,
    type AdminPlan,
    type AdminSubscription,
    type SubscriptionListResponse,
} from "@/lib/admin-billing";

const currencySymbols: Record<string, string> = {
    gbp: "£",
    usd: "$",
    inr: "₹",
    eur: "€",
};

function formatPrice(amount: number, currency: string) {
    const symbol = currencySymbols[currency.toLowerCase()] ?? currency.toUpperCase() + " ";

    return `${symbol}${(amount / 100).toFixed(2)}`;
}

function formatDate(value: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function statusClasses(status: string) {
    switch (status.toLowerCase()) {
        case "active":
            return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
        case "trialing":
            return "border-blue-400/20 bg-blue-400/10 text-blue-300";
        case "past_due":
            return "border-amber-400/20 bg-amber-400/10 text-amber-300";
        case "canceled":
        case "cancelled":
            return "border-red-400/20 bg-red-400/10 text-red-300";
        default:
            return "border-white/10 bg-white/[0.04] text-copy-soft";
    }
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: number;
    description: string;
    icon: typeof Users;
}) {
    return (
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
            <div className="flex items-center justify-between">
                <p className="text-sm text-copy-soft">{title}</p>
                <div className="rounded-xl border border-brand/20 bg-brand/10 p-2.5">
                    <Icon className="size-4 text-brand-soft" />
                </div>
            </div>

            <p className="mt-5 font-title text-3xl font-semibold text-foreground">
                {value.toLocaleString()}
            </p>

            <p className="mt-2 text-xs text-copy-muted">{description}</p>
        </div>
    );
}

export default function AdminBillingPage() {
    const [overview, setOverview] = useState<BillingOverview | null>(null);
    const [plans, setPlans] = useState<AdminPlan[]>([]);
    const [subscriptionData, setSubscriptionData] =
        useState<SubscriptionListResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);

    const [page, setPage] = useState(1);
    const [searchInput, setSearchInput] = useState("");
    const [search, setSearch] = useState("");
    const [planFilter, setPlanFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const pageSize = 10;

    const loadOverview = useCallback(async () => {
        try {
            const [overviewData, planData] = await Promise.all([
                getBillingOverview(),
                getAdminPlans(),
            ]);

            setOverview(overviewData);
            setPlans(planData.plans);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to load billing overview",
            );
        }
    }, []);

    const loadSubscriptions = useCallback(async () => {
        try {
            setTableLoading(true);

            const data = await getAdminSubscriptions({
                page,
                page_size: pageSize,
                plan_id: planFilter,
                status: statusFilter,
                search,
            });

            setSubscriptionData(data);
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to load subscriptions",
            );
        } finally {
            setTableLoading(false);
        }
    }, [page, planFilter, statusFilter, search]);

    useEffect(() => {
        async function initialize() {
            setLoading(true);
            await loadOverview();
            setLoading(false);
        }

        initialize();
    }, [loadOverview]);

    useEffect(() => {
        loadSubscriptions();
    }, [loadSubscriptions]);

    function handleSearch(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    }

    function handlePlanChange(value: string) {
        setPlanFilter(value);
        setPage(1);
    }

    function handleStatusChange(value: string) {
        setStatusFilter(value);
        setPage(1);
    }

    async function refreshData() {
        await Promise.all([
            loadOverview(),
            loadSubscriptions(),
        ]);
        toast.success("Billing data refreshed");
    }

    const subscriptions = subscriptionData?.subscriptions ?? [];

    return (
        <main className="mx-auto max-w-[1600px] space-y-7 p-5 md:p-8">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <div className="flex items-center gap-2 text-xs text-copy-muted">
                        <span>Admin</span>
                        <span>/</span>
                        <span className="text-brand-soft">Billing</span>
                    </div>

                    <h1 className="mt-3 font-title text-2xl font-semibold text-foreground sm:text-3xl">
                        Billing & Subscriptions
                    </h1>

                    <p className="mt-2 text-sm text-copy-soft">
                        Monitor subscription plans and manage subscriber information.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={refreshData}
                    disabled={loading || tableLoading}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-copy-soft transition hover:bg-white/[0.08] disabled:opacity-50"
                >
                    <RefreshCw className="size-4" />
                    Refresh
                </button>
            </div>

            {/* Overview */}
            <section>
                <div className="mb-4 flex items-center gap-2">
                    <CreditCard className="size-4 text-brand-soft" />
                    <h2 className="font-title text-base font-semibold text-foreground">
                        Subscription Overview
                    </h2>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total Subscriptions"
                        value={overview?.total_subscriptions ?? 0}
                        description="All recorded subscription records"
                        icon={Users}
                    />

                    <StatCard
                        title="Active Subscriptions"
                        value={overview?.active_subscriptions ?? 0}
                        description="Currently active subscriptions"
                        icon={CheckCircle2}
                    />

                    <StatCard
                        title="Trialing"
                        value={overview?.trialing_subscriptions ?? 0}
                        description="Subscriptions in trial"
                        icon={Clock3}
                    />

                    <StatCard
                        title="Cancellation Pending"
                        value={overview?.cancel_at_period_end ?? 0}
                        description="Set to cancel at period end"
                        icon={AlertCircle}
                    />
                </div>

                {overview && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                            <div className="flex items-center gap-2 text-sm text-copy-soft">
                                <XCircle className="size-4 text-red-300" />
                                Cancelled subscriptions
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                                {overview.canceled_subscriptions.toLocaleString()}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
                            <div className="flex items-center gap-2 text-sm text-copy-soft">
                                <AlertCircle className="size-4 text-amber-300" />
                                Past due subscriptions
                            </div>
                            <p className="mt-2 text-2xl font-semibold text-foreground">
                                {overview.past_due_subscriptions.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </section>

            {/* Plans */}
            <section>
                <div className="mb-4 flex items-center gap-2">
                    <Crown className="size-4 text-brand-soft" />
                    <h2 className="font-title text-base font-semibold text-foreground">
                        Subscription Plans
                    </h2>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {plans.map((plan) => {
                        const Icon =
                            plan.plan_id === "pro"
                                ? Crown
                                : plan.plan_id === "basic"
                                    ? Zap
                                    : Users;

                        return (
                            <div
                                key={plan.plan_id}
                                className={`rounded-2xl border p-5 ${plan.plan_id === "pro"
                                    ? "border-brand/30 bg-brand/[0.06]"
                                    : "border-white/[0.07] bg-white/[0.025]"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10">
                                        <Icon className="size-5 text-brand-soft" />
                                    </div>

                                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-wider text-copy-muted">
                                        {plan.interval}
                                    </span>
                                </div>

                                <h3 className="mt-5 font-title text-lg font-semibold text-foreground">
                                    {plan.name}
                                </h3>

                                <p className="mt-2 font-title text-3xl font-semibold text-foreground">
                                    {plan.amount === 0
                                        ? "Free"
                                        : formatPrice(plan.amount, plan.currency)}
                                    {plan.amount > 0 && (
                                        <span className="ml-1 text-xs font-normal text-copy-muted">
                                            / {plan.interval}
                                        </span>
                                    )}
                                </p>

                                <p className="mt-3 min-h-10 text-xs leading-relaxed text-copy-soft">
                                    {plan.description}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                                    <div>
                                        <p className="text-xs text-copy-muted">Subscribers</p>
                                        <p className="mt-1 text-lg font-semibold text-foreground">
                                            {plan.subscriber_count.toLocaleString()}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs text-copy-muted">Active</p>
                                        <p className="mt-1 text-lg font-semibold text-emerald-300">
                                            {plan.active_subscriber_count.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {!loading && plans.length === 0 && (
                        <p className="text-sm text-copy-muted">No plans available.</p>
                    )}
                </div>
            </section>

            {/* Subscribers */}
            <section className="space-y-4">
                <div>
                    <h2 className="font-title text-base font-semibold text-foreground">
                        Subscribers
                    </h2>
                    <p className="mt-1 text-xs text-copy-muted">
                        Search and inspect user subscription records.
                    </p>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4 lg:flex-row">
                    <form
                        onSubmit={handleSearch}
                        className="flex min-w-0 flex-1 gap-2"
                    >
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-copy-muted" />
                            <input
                                value={searchInput}
                                onChange={(event) => setSearchInput(event.target.value)}
                                placeholder="Search name, email or user ID..."
                                className="h-10 w-full rounded-xl border border-white/10 bg-black/10 pl-10 pr-3 text-sm text-foreground outline-none transition placeholder:text-copy-muted focus:border-brand/50"
                            />
                        </div>

                        <button
                            type="submit"
                            className="rounded-xl bg-brand px-4 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
                        >
                            Search
                        </button>
                    </form>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <select
                            value={planFilter}
                            onChange={(event) => handlePlanChange(event.target.value)}
                            className="h-10 rounded-xl border border-white/10 bg-black/10 px-3 text-sm text-foreground outline-none focus:border-brand/50"
                        >
                            <option value="">All plans</option>
                            <option value="free">Free</option>
                            <option value="basic">Basic</option>
                            <option value="pro">Pro</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(event) => handleStatusChange(event.target.value)}
                            className="h-10 rounded-xl border border-white/10 bg-black/10 px-3 text-sm text-foreground outline-none focus:border-brand/50"
                        >
                            <option value="">All statuses</option>
                            <option value="active">Active</option>
                            <option value="trialing">Trialing</option>
                            <option value="past_due">Past due</option>
                            <option value="canceled">Canceled</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025]">
                    <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Subscription Records
                            </h3>
                            <p className="mt-1 text-xs text-copy-muted">
                                {subscriptionData?.total ?? 0} records found
                            </p>
                        </div>

                        <CalendarDays className="size-4 text-copy-muted" />
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[850px] text-left">
                            <thead className="border-b border-white/[0.07] bg-white/[0.02]">
                                <tr className="text-[11px] uppercase tracking-wider text-copy-muted">
                                    <th className="px-5 py-4 font-medium">Subscriber</th>
                                    <th className="px-5 py-4 font-medium">Plan</th>
                                    <th className="px-5 py-4 font-medium">Status</th>
                                    <th className="px-5 py-4 font-medium">Period ends</th>
                                    <th className="px-5 py-4 font-medium">Cancellation</th>
                                    <th className="px-5 py-4 text-right font-medium">Details</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/[0.06]">
                                {subscriptions.map((subscription: AdminSubscription) => (
                                    <tr
                                        key={`${subscription.user_id}-${subscription.subscription_id ?? "none"}`}
                                        className="transition hover:bg-white/[0.025]"
                                    >
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-medium text-foreground">
                                                {subscription.name || "Unnamed user"}
                                            </p>
                                            <p className="mt-1 text-xs text-copy-muted">
                                                {subscription.email || subscription.user_id}
                                            </p>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs font-medium capitalize text-copy-soft">
                                                {subscription.plan_id}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize ${statusClasses(subscription.status)}`}
                                            >
                                                {subscription.status.replaceAll("_", " ")}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4 text-xs text-copy-soft">
                                            {formatDate(subscription.current_period_end)}
                                        </td>

                                        <td className="px-5 py-4">
                                            {subscription.cancel_at_period_end ? (
                                                <span className="text-xs text-amber-300">
                                                    At period end
                                                </span>
                                            ) : (
                                                <span className="text-xs text-copy-muted">
                                                    No
                                                </span>
                                            )}
                                        </td>

                                        <td className="px-5 py-4 text-right">
                                            {subscription.subscription_id ? (
                                                <Link
                                                    href={`/admin/billing/${encodeURIComponent(subscription.subscription_id)}`}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-brand-soft transition hover:text-brand-hover"
                                                >
                                                    View
                                                    <ArrowUpRight className="size-3.5" />
                                                </Link>
                                            ) : (
                                                <span className="text-xs text-copy-muted">—</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                {!tableLoading && subscriptions.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-14 text-center text-sm text-copy-muted"
                                        >
                                            No subscriptions found.
                                        </td>
                                    </tr>
                                )}

                                {tableLoading && (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-5 py-14 text-center text-sm text-copy-muted"
                                        >
                                            Loading subscriptions...
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-xs text-copy-muted">
                            Page {subscriptionData?.page ?? page} of{" "}
                            {subscriptionData?.total_pages ?? 0}
                        </p>

                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page <= 1 || tableLoading}
                                onClick={() => setPage((current) => current - 1)}
                                className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 px-3 text-xs text-copy-soft transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft className="size-3.5" />
                                Previous
                            </button>

                            <button
                                type="button"
                                disabled={
                                    tableLoading ||
                                    page >= (subscriptionData?.total_pages ?? 0)
                                }
                                onClick={() => setPage((current) => current + 1)}
                                className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/10 px-3 text-xs text-copy-soft transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                Next
                                <ChevronRight className="size-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
