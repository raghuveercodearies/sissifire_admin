
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    UserRound,
    CreditCard,
    CalendarDays,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getAdminSubscriptionDetails,
    type SubscriptionDetailResponse,
} from "@/lib/admin-billing";

function displayValue(value: unknown) {
    if (value === null || value === undefined || value === "") {
        return "—";
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    return String(value);
}

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: unknown;
}) {
    return (
        <div className="flex flex-col gap-1 border-b border-white/[0.06] py-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs text-copy-muted">{label}</span>
            <span className="break-all text-sm text-foreground sm:max-w-[65%] sm:text-right">
                {displayValue(value)}
            </span>
        </div>
    );
}

export default function AdminSubscriptionDetailsPage() {
    const params = useParams<{ subscriptionId: string }>();
    const subscriptionId = params.subscriptionId;

    const [data, setData] =
        useState<SubscriptionDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function loadDetails() {
            try {
                setLoading(true);

                const result =
                    await getAdminSubscriptionDetails(subscriptionId);

                if (mounted) {
                    setData(result);
                }
            } catch (error) {
                toast.error(
                    error instanceof Error
                        ? error.message
                        : "Unable to load subscription details",
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        }

        if (subscriptionId) {
            loadDetails();
        }

        return () => {
            mounted = false;
        };
    }, [subscriptionId]);

    const subscription = data?.subscription;
    const user = data?.user;

    return (
        <main className="mx-auto max-w-[1600px] space-y-7 p-5 md:p-8">
            <div>
                <Link
                    href="/admin/billing"
                    className="inline-flex items-center gap-2 text-xs text-copy-muted transition hover:text-brand-soft"
                >
                    <ArrowLeft className="size-3.5" />
                    Back to Billing
                </Link>

                <h1 className="mt-4 font-title text-2xl font-semibold text-foreground">
                    Subscription Details
                </h1>

                <p className="mt-2 break-all text-xs text-copy-muted">
                    Subscription ID: {subscriptionId}
                </p>
            </div>

            {loading && (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-10 text-center text-sm text-copy-muted">
                    Loading subscription details...
                </div>
            )}

            {!loading && !data && (
                <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-10 text-center">
                    <p className="text-sm text-copy-soft">
                        Subscription details could not be loaded.
                    </p>
                    <Link
                        href="/admin/billing"
                        className="mt-4 inline-block text-sm text-brand-soft hover:text-brand-hover"
                    >
                        Return to billing
                    </Link>
                </div>
            )}

            {!loading && data && (
                <>
                    {/* User */}
                    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <UserRound className="size-4 text-brand-soft" />
                            <h2 className="font-title text-base font-semibold text-foreground">
                                Subscriber Information
                            </h2>
                        </div>

                        <DetailRow label="User ID" value={user?.id ?? subscription?.user_id} />
                        <DetailRow label="Name" value={user?.name} />
                        <DetailRow label="Email" value={user?.email} />
                        <DetailRow label="Verified" value={user?.is_verified} />
                    </section>

                    {/* Subscription */}
                    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <CreditCard className="size-4 text-brand-soft" />
                            <h2 className="font-title text-base font-semibold text-foreground">
                                Subscription Information
                            </h2>
                        </div>

                        <DetailRow
                            label="Subscription ID"
                            value={subscription?.stripe_subscription_id}
                        />
                        <DetailRow
                            label="Plan"
                            value={subscription?.plan_id}
                        />
                        <DetailRow
                            label="Status"
                            value={subscription?.status}
                        />
                        <DetailRow
                            label="Stripe Customer ID"
                            value={subscription?.stripe_customer_id}
                        />
                        <DetailRow
                            label="Cancel at period end"
                            value={subscription?.cancel_at_period_end}
                        />
                    </section>

                    {/* Billing dates */}
                    <section className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5">
                        <div className="mb-4 flex items-center gap-2">
                            <CalendarDays className="size-4 text-brand-soft" />
                            <h2 className="font-title text-base font-semibold text-foreground">
                                Billing Period
                            </h2>
                        </div>

                        <DetailRow
                            label="Current period start"
                            value={subscription?.current_period_start}
                        />
                        <DetailRow
                            label="Current period end"
                            value={subscription?.current_period_end}
                        />
                        <DetailRow
                            label="Created at"
                            value={subscription?.created_at}
                        />
                        <DetailRow
                            label="Updated at"
                            value={subscription?.updated_at}
                        />
                    </section>

                    <section className="rounded-2xl border border-blue-400/15 bg-blue-400/[0.04] p-4">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-blue-300" />
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Read-only subscription details
                                </p>
                                <p className="mt-1 text-xs leading-relaxed text-copy-muted">
                                    Subscription management actions are not enabled in this
                                    version of the admin billing module.
                                </p>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </main>
    );
}
