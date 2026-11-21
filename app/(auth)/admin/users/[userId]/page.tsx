
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock,
    Copy,
    Mail,
    RefreshCw,
    ShieldCheck,
    UserRound,
    XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { adminDashboardFetch } from "@/lib/admin-dashboard-api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface AdminUser {
    id: string;
    name?: string | null;
    email: string;
    is_verified: boolean;
    created_at?: string | null;
}

interface UserDetailsResponse {
    user: AdminUser;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function formatDateTime(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function getInitials(name?: string | null) {
    if (!name?.trim()) return "U";

    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

/* -------------------------------------------------------------------------- */
/* Small Components                                                           */
/* -------------------------------------------------------------------------- */

function InfoCard({
    label,
    value,
    icon: Icon,
    description,
}: {
    label: string;
    value: string;
    icon: typeof UserRound;
    description: string;
}) {
    return (
        <div className="rounded-2xl border border-border bg-card/80 p-5">
            <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>

                <div className="flex size-9 items-center justify-center rounded-xl border border-purple-400/15 bg-purple-400/[0.06] text-purple-300">
                    <Icon className="size-4" />
                </div>
            </div>

            <h3 className="mt-4 truncate text-lg font-semibold text-foreground">
                {value}
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
                {description}
            </p>
        </div>
    );
}

function VerificationBadge({ verified }: { verified: boolean }) {
    return verified ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-xs text-emerald-300">
            <CheckCircle2 className="size-3.5" />
            Verified
        </span>
    ) : (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-400/15 bg-yellow-400/[0.06] px-3 py-1.5 text-xs text-yellow-300">
            <Clock className="size-3.5" />
            Unverified
        </span>
    );
}

/* -------------------------------------------------------------------------- */
/* User Details Page                                                          */
/* -------------------------------------------------------------------------- */

export default function AdminUserDetailsPage() {
    const router = useRouter();
    const params = useParams<{ userId: string }>();

    const userId = params.userId;

    const [user, setUser] = useState<AdminUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /* ---------------------------------------------------------------------- */
    /* Fetch User                                                             */
    /* ---------------------------------------------------------------------- */

    const fetchUser = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError(null);

            const response =
                await adminDashboardFetch<UserDetailsResponse>(
                    `/admin/users/${encodeURIComponent(userId)}`
                );

            setUser(response.user);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to load user details.";

            setError(message);

            if (
                message.toLowerCase().includes("session") ||
                message.toLowerCase().includes("authentication token")
            ) {
                toast.error(message);
                router.push("/admin/login");
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [userId, router]);

    useEffect(() => {
        if (userId) {
            fetchUser();
        }
    }, [userId, fetchUser]);

    /* ---------------------------------------------------------------------- */
    /* Copy User ID                                                           */
    /* ---------------------------------------------------------------------- */

    async function copyUserId() {
        if (!user?.id) return;

        try {
            await navigator.clipboard.writeText(user.id);
            toast.success("User ID copied");
        } catch {
            toast.error("Unable to copy user ID");
        }
    }

    /* ---------------------------------------------------------------------- */
    /* Loading State                                                          */
    /* ---------------------------------------------------------------------- */

    if (loading) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-page-gradient">
                <div className="flex flex-col items-center">
                    <div className="size-10 animate-spin rounded-full border-2 border-purple-400/15 border-t-purple-400" />

                    <p className="mt-4 text-sm text-muted-foreground">
                        Loading user details...
                    </p>
                </div>
            </main>
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Error State                                                            */
    /* ---------------------------------------------------------------------- */

    if (error || !user) {
        return (
            <main className="min-h-screen bg-page-gradient p-5 text-foreground md:p-8">
                <div className="mx-auto max-w-5xl">
                    <button
                        onClick={() => router.push("/admin/users")}
                        className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Users
                    </button>

                    <div className="rounded-2xl border border-red-400/20 bg-red-400/[0.04] p-8 text-center">
                        <XCircle className="mx-auto size-10 text-red-300" />

                        <h2 className="mt-4 text-lg font-semibold text-foreground">
                            Unable to load user
                        </h2>

                        <p className="mt-2 text-sm text-muted-foreground">
                            {error || "The requested user could not be found."}
                        </p>

                        <button
                            onClick={() => fetchUser(true)}
                            className="mt-6 rounded-xl border border-border bg-card px-4 py-2 text-sm text-foreground transition hover:border-purple-400/30"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    /* ---------------------------------------------------------------------- */
    /* Main Layout                                                            */
    /* ---------------------------------------------------------------------- */

    return (
        <main className="min-h-screen bg-page-gradient text-foreground">
            <div className="mx-auto max-w-[1400px] space-y-7 p-5 md:p-8">

                {/* Header */}
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="flex items-start gap-3">
                        <button
                            onClick={() => router.push("/admin/users")}
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
                                User Details
                            </h1>

                            <p className="mt-1 text-sm text-muted-foreground">
                                View account information and verification status.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => fetchUser(true)}
                        disabled={refreshing}
                        className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/70 px-4 py-2.5 text-xs text-muted-foreground transition hover:border-purple-400/20 hover:text-brand-soft disabled:opacity-50"
                    >
                        <RefreshCw
                            className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
                        />
                        {refreshing ? "Refreshing..." : "Refresh"}
                    </button>
                </header>

                {/* User Profile */}
                <section className="overflow-hidden rounded-2xl border border-border bg-card/80 backdrop-blur-xl">
                    <div className="h-28 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/10 to-transparent" />

                    <div className="px-5 pb-6 md:px-8">
                        <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="flex size-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card bg-purple-400/10 text-2xl font-semibold text-purple-300 shadow-xl">
                                    {getInitials(user.name)}
                                </div>

                                <div className="pb-1">
                                    <h2 className="text-xl font-semibold text-foreground">
                                        {user.name || "Unnamed User"}
                                    </h2>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            <VerificationBadge verified={user.is_verified} />
                        </div>

                        <div className="mt-7 flex flex-col gap-2 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                                    User ID
                                </p>

                                <p className="mt-1 break-all font-mono text-xs text-muted-foreground">
                                    {user.id}
                                </p>
                            </div>

                            <button
                                onClick={copyUserId}
                                className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-2 text-xs text-muted-foreground transition hover:border-purple-400/20 hover:text-brand-soft"
                            >
                                <Copy className="size-3.5" />
                                Copy ID
                            </button>
                        </div>
                    </div>
                </section>

                {/* Overview */}
                <section>
                    <div className="mb-4">
                        <h2 className="text-base font-semibold text-foreground">
                            Account Overview
                        </h2>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Summary of this user's account.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <InfoCard
                            label="Account Status"
                            value={user.is_verified ? "Verified" : "Unverified"}
                            icon={ShieldCheck}
                            description="Email verification status"
                        />

                        <InfoCard
                            label="Registration"
                            value={formatDate(user.created_at)}
                            icon={CalendarDays}
                            description="Account creation date"
                        />

                        <InfoCard
                            label="Email Address"
                            value={user.email}
                            icon={Mail}
                            description="Registered email address"
                        />
                    </div>
                </section>

                {/* Account Information */}
                <section className="rounded-2xl border border-border bg-card/80 p-5 backdrop-blur-xl md:p-7">
                    <div className="mb-6">
                        <h2 className="text-base font-semibold text-foreground">
                            Account Information
                        </h2>

                        <p className="mt-1 text-xs text-muted-foreground">
                            Basic information associated with this account.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Full Name
                            </p>

                            <p className="mt-2 text-sm font-medium text-foreground">
                                {user.name || "Not provided"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Email Address
                            </p>

                            <p className="mt-2 break-all text-sm font-medium text-foreground">
                                {user.email}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Verification
                            </p>

                            <div className="mt-2">
                                <VerificationBadge verified={user.is_verified} />
                            </div>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Account Created
                            </p>

                            <p className="mt-2 text-sm font-medium text-foreground">
                                {formatDateTime(user.created_at)}
                            </p>
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
