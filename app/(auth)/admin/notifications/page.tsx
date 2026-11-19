"use client";

import type React from "react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
    CampaignListResponse,
    NotificationCampaign,
    NotificationStats,
    notificationAPI,
} from "@/lib/admin-notifications";


const INITIAL_STATS: NotificationStats = {
    total: 0,
    draft: 0,
    scheduled: 0,
    processing: 0,
    sent: 0,
    failed: 0,
    cancelled: 0,
    total_recipients: 0,
    delivered_count: 0,
    failed_count: 0,
};

const STATUS_OPTIONS = [
    "all",
    "scheduled",
    "processing",
    "sent",
    "failed",
    "cancelled",
];

const TYPE_OPTIONS = [
    "general",
    "announcement",
    "update",
    "system",
] as const;


function formatDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });
}


function formatRelativeDate(value?: string | null) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "—";
    }

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}


function getStatusStyles(status: string) {
    switch (status) {
        case "sent":
            return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

        case "scheduled":
            return "bg-blue-500/10 text-blue-400 border-blue-500/20";

        case "processing":
            return "bg-amber-500/10 text-amber-400 border-amber-500/20";

        case "failed":
            return "bg-red-500/10 text-red-400 border-red-500/20";

        case "cancelled":
            return "bg-gray-500/10 text-gray-400 border-gray-500/20";

        default:
            return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    }
}


function getTypeStyles(type: string) {
    switch (type) {
        case "announcement":
            return "bg-purple-500/10 text-purple-400";

        case "system":
            return "bg-orange-500/10 text-orange-400";

        case "update":
            return "bg-blue-500/10 text-blue-400";

        default:
            return "bg-gray-500/10 text-gray-400";
    }
}


function StatCard({
    title,
    value,
    description,
    icon,
    accent,
}: {
    title: string;
    value: number | string;
    description: string;
    icon: string;
    accent: string;
}) {
    return (
        <div className="rounded-2xl border border-white/[0.07] bg-[#15131f] p-5 transition hover:border-white/[0.12]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-400">{title}</p>

                    <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                        {value}
                    </h3>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}
                >
                    <span className="text-lg">{icon}</span>
                </div>
            </div>

            <p className="mt-3 text-xs text-gray-500">
                {description}
            </p>
        </div>
    );
}


function StatusBadge({
    status,
}: {
    status: NotificationCampaign["status"];
}) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles(
                status,
            )}`}
        >
            <span className="h-1.5 w-1.5 rounded-full bg-current" />
            {status}
        </span>
    );
}


function TypeBadge({
    type,
}: {
    type: NotificationCampaign["type"];
}) {
    return (
        <span
            className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize ${getTypeStyles(
                type,
            )}`}
        >
            {type}
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
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl">
                🔔
            </div>

            <h3 className="text-base font-semibold text-white">
                {title}
            </h3>

            <p className="mt-2 max-w-sm text-sm text-gray-500">
                {description}
            </p>
        </div>
    )
}


function LoadingRows() {
    return (
        <div className="space-y-3 p-5">
            {Array.from({ length: 5 }).map((_, index) => (
                <div
                    key={index}
                    className="h-16 animate-pulse rounded-xl bg-white/[0.03]"
                />
            ))}
        </div>
    );
}


function Modal({
    children,
    onClose,
    title,
}: {
    children: React.ReactNode;
    onClose: () => void;
    title?: string;
}) {
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#171421] shadow-2xl">
                {title && (
                    <div className="flex items-center justify-between border-b border-white/[0.07] px-6 py-5">
                        <h2 className="text-lg font-semibold text-white">
                            {title}
                        </h2>

                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-white/5 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {children}
            </div>
        </div>
    );
}


function CampaignDetails({
    campaign,
    onClose,
}: {
    campaign: NotificationCampaign;
    onClose: () => void;
}) {
    return (
        <Modal title="Campaign Details" onClose={onClose}>
            <div className="space-y-6 p-6">
                <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={campaign.status} />
                    <TypeBadge type={campaign.type} />
                </div>

                <div>
                    <h3 className="text-xl font-semibold text-white">
                        {campaign.title}
                    </h3>

                    <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-300">
                        {campaign.message}
                    </p>
                </div>

                {campaign.link && (
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-xs text-gray-500">Action link</p>

                        <p className="mt-1 break-all text-sm text-purple-400">
                            {campaign.link}
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-xs text-gray-500">Recipients</p>
                        <p className="mt-2 text-xl font-semibold text-white">
                            {campaign.total_recipients}
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-xs text-gray-500">Delivered</p>
                        <p className="mt-2 text-xl font-semibold text-emerald-400">
                            {campaign.delivered_count}
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-xs text-gray-500">Failed</p>
                        <p className="mt-2 text-xl font-semibold text-red-400">
                            {campaign.failed_count}
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-xs text-gray-500">Success rate</p>

                        <p className="mt-2 text-xl font-semibold text-white">
                            {campaign.total_recipients > 0
                                ? `${Math.round(
                                    (campaign.delivered_count /
                                        campaign.total_recipients) *
                                    100,
                                )}%`
                                : "—"}
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p className="text-xs text-gray-500">Created</p>
                        <p className="mt-1 text-sm text-gray-300">
                            {formatDate(campaign.created_at)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Scheduled for</p>
                        <p className="mt-1 text-sm text-gray-300">
                            {formatDate(campaign.scheduled_at)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Sent at</p>
                        <p className="mt-1 text-sm text-gray-300">
                            {formatDate(campaign.sent_at)}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Campaign ID</p>
                        <p className="mt-1 break-all font-mono text-xs text-gray-400">
                            {campaign.id}
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/5"
                    >
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
}


function CreateCampaignModal({
    onClose,
    onCreated,
}: {
    onClose: () => void;
    onCreated: () => void;
}) {
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [type, setType] =
        useState<NotificationCampaign["type"]>("general");
    const [link, setLink] = useState("");

    const [sendMode, setSendMode] =
        useState<"now" | "schedule">("now");

    const [scheduledAt, setScheduledAt] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [confirmSend, setConfirmSend] = useState(false);

    const canSubmit =
        title.trim().length > 0 &&
        message.trim().length > 0 &&
        (sendMode === "now" || scheduledAt.length > 0);

    async function handleSubmit(
        event: React.FormEvent,
    ) {
        event.preventDefault();

        setError("");

        if (!canSubmit) {
            setError("Please complete all required fields.");
            return;
        }

        if (sendMode === "now" && !confirmSend) {
            setConfirmSend(true);
            return;
        }

        try {
            setLoading(true);

            let scheduleISO: string | null = null;

            if (sendMode === "schedule") {
                const localDate = new Date(scheduledAt);

                if (Number.isNaN(localDate.getTime())) {
                    throw new Error("Invalid scheduled date.");
                }

                if (localDate <= new Date()) {
                    throw new Error(
                        "Scheduled date must be in the future.",
                    );
                }

                scheduleISO = localDate.toISOString();
            }

            await notificationAPI.createCampaign({
                title: title.trim(),
                message: message.trim(),
                type,
                link: link.trim() || null,
                scheduled_at: scheduleISO,
            });

            onCreated();
            onClose();
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to create notification.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal title="Create Notification" onClose={onClose}>
            <form
                onSubmit={handleSubmit}
                className="space-y-5 p-6"
            >
                {/* Title */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Notification title
                    </label>

                    <input
                        value={title}
                        onChange={(event) => {
                            setTitle(event.target.value);
                            setConfirmSend(false);
                        }}
                        maxLength={150}
                        placeholder="Enter notification title"
                        className="w-full rounded-xl border border-white/10 bg-[#100e18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/50"
                    />

                    <div className="mt-1 text-right text-xs text-gray-600">
                        {title.length}/150
                    </div>
                </div>

                {/* Message */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Message
                    </label>

                    <textarea
                        value={message}
                        onChange={(event) => {
                            setMessage(event.target.value);
                            setConfirmSend(false);
                        }}
                        rows={5}
                        maxLength={5000}
                        placeholder="Write your notification message..."
                        className="w-full resize-y rounded-xl border border-white/10 bg-[#100e18] px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/50"
                    />

                    <div className="mt-1 text-right text-xs text-gray-600">
                        {message.length}/5000
                    </div>
                </div>

                {/* Type */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Notification type
                    </label>

                    <select
                        value={type}
                        onChange={(event) => {
                            setType(
                                event.target.value as NotificationCampaign["type"],
                            );
                        }}
                        className="w-full rounded-xl border border-white/10 bg-[#100e18] px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50"
                    >
                        {TYPE_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() +
                                    option.slice(1)}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Link */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-300">
                        Action link{" "}
                        <span className="text-gray-500">(optional)</span>
                    </label>

                    <input
                        value={link}
                        onChange={(event) => setLink(event.target.value)}
                        maxLength={500}
                        placeholder="/dashboard or https://example.com"
                        className="w-full rounded-xl border border-white/10 bg-[#100e18] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/50"
                    />
                </div>

                {/* Send mode */}
                <div>
                    <label className="mb-3 block text-sm font-medium text-gray-300">
                        Delivery
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => {
                                setSendMode("now");
                                setConfirmSend(false);
                            }}
                            className={`rounded-xl border p-4 text-left transition ${sendMode === "now"
                                ? "border-purple-500/40 bg-purple-500/10"
                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                                }`}
                        >
                            <div className="text-sm font-medium text-white">
                                Send immediately
                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                                Broadcast right away
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setSendMode("schedule");
                                setConfirmSend(false);
                            }}
                            className={`rounded-xl border p-4 text-left transition ${sendMode === "schedule"
                                ? "border-purple-500/40 bg-purple-500/10"
                                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                                }`}
                        >
                            <div className="text-sm font-medium text-white">
                                Schedule
                            </div>

                            <p className="mt-1 text-xs text-gray-500">
                                Send at a future date
                            </p>
                        </button>
                    </div>
                </div>

                {/* Schedule */}
                {sendMode === "schedule" && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-300">
                            Scheduled date & time
                        </label>

                        <input
                            type="datetime-local"
                            value={scheduledAt}
                            min={new Date().toISOString().slice(0, 16)}
                            onChange={(event) => setScheduledAt(event.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#100e18] px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                            Your local time will be converted to UTC before sending.
                        </p>
                    </div>
                )}

                {/* Confirmation */}
                {confirmSend && sendMode === "now" && (
                    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                        <p className="text-sm font-medium text-amber-400">
                            Confirm immediate broadcast
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-400">
                            This notification will immediately be sent to all registered users.
                            This action cannot be undone.
                        </p>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col-reverse gap-3 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-gray-300 transition hover:bg-white/5 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !canSubmit}
                        className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {loading
                            ? "Processing..."
                            : sendMode === "schedule"
                                ? "Schedule notification"
                                : confirmSend
                                    ? "Confirm & Send"
                                    : "Send notification"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}


export default function AdminNotificationsPage() {
    const [stats, setStats] =
        useState<NotificationStats>(INITIAL_STATS);

    const [campaignData, setCampaignData] =
        useState<CampaignListResponse>({
            items: [],
            total: 0,
            page: 1,
            limit: 10,
            total_pages: 0,
        });

    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState("");

    const [createOpen, setCreateOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] =
        useState<NotificationCampaign | null>(null);

    const [cancelId, setCancelId] = useState<string | null>(null);
    const [cancelLoading, setCancelLoading] = useState(false);

    const loadStats = useCallback(async () => {
        try {
            const data = await notificationAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error("Failed loading notification stats", error);
        }
    }, []);

    const loadCampaigns = useCallback(async () => {
        try {
            setError("");

            const data = await notificationAPI.getCampaigns({
                page,
                limit: 10,
                status: statusFilter === "all" ? undefined : statusFilter,
                search: search.trim() || undefined,
            });

            setCampaignData(data);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load campaigns.",
            );
        }
    }, [page, statusFilter, search]);

    const refresh = useCallback(async () => {
        setRefreshing(true);

        await Promise.all([
            loadCampaigns(),
            loadStats(),
        ]);

        setRefreshing(false);
    }, [loadCampaigns, loadStats]);

    useEffect(() => {
        setLoading(true);

        loadCampaigns().finally(() => {
            setLoading(false);
        });
    }, [loadCampaigns]);

    useEffect(() => {
        loadStats();
    }, [loadStats]);

    const campaigns = campaignData.items;

    const deliveryRate = useMemo(() => {
        if (!stats.total_recipients) return 0;

        return Math.round(
            (stats.delivered_count / stats.total_recipients) * 100,
        );
    }, [stats.total_recipients, stats.delivered_count]);

    async function handleCancelCampaign(id: string) {
        try {
            setCancelLoading(true);

            await notificationAPI.cancelCampaign(id);

            setCancelId(null);

            await refresh();
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to cancel campaign.",
            );
        } finally {
            setCancelLoading(false);
        }
    }

    async function handleViewCampaign(id: string) {
        try {
            const campaign =
                await notificationAPI.getCampaign(id);

            setSelectedCampaign(campaign);
        } catch (error) {
            alert(
                error instanceof Error
                    ? error.message
                    : "Unable to load campaign.",
            );
        }
    }

    return (
        <div className="min-h-screen bg-[#100e17] text-white">
            <div className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">

                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                            Notifications
                        </h1>

                        <p className="mt-2 text-sm text-gray-400">
                            Manage notification campaigns and broadcast messages to users.
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={refresh}
                            disabled={refreshing}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm text-gray-300 transition hover:bg-white/[0.06] disabled:opacity-50"
                        >
                            <span>{refreshing ? "↻" : "⟳"}</span>
                            Refresh
                        </button>

                        <button
                            onClick={() => setCreateOpen(true)}
                            className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-purple-600/10 transition hover:bg-purple-500"
                        >
                            <span>＋</span>
                            Create notification
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Total campaigns"
                        value={stats.total}
                        description="All notification campaigns"
                        icon="🔔"
                        accent="bg-purple-500/10 text-purple-400"
                    />

                    <StatCard
                        title="Sent"
                        value={stats.sent}
                        description="Successfully completed campaigns"
                        icon="✓"
                        accent="bg-emerald-500/10 text-emerald-400"
                    />

                    <StatCard
                        title="Scheduled"
                        value={stats.scheduled}
                        description="Waiting for delivery"
                        icon="◷"
                        accent="bg-blue-500/10 text-blue-400"
                    />

                    <StatCard
                        title="Total recipients"
                        value={stats.total_recipients.toLocaleString()}
                        description="Users targeted across campaigns"
                        icon="👥"
                        accent="bg-orange-500/10 text-orange-400"
                    />
                </div>

                {/* Delivery metrics */}
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    <div className="rounded-2xl border border-white/[0.07] bg-[#15131f] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Successful deliveries
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-emerald-400">
                                    {stats.delivered_count.toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-xl bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                                Delivered
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-[#15131f] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Failed deliveries
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-red-400">
                                    {stats.failed_count.toLocaleString()}
                                </p>
                            </div>

                            <div className="rounded-xl bg-red-500/10 px-3 py-2 text-sm text-red-400">
                                Failed
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/[0.07] bg-[#15131f] p-5">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-400">
                                    Delivery success rate
                                </p>

                                <p className="mt-2 text-2xl font-semibold text-white">
                                    {deliveryRate}%
                                </p>
                            </div>

                            <div className="rounded-xl bg-purple-500/10 px-3 py-2 text-sm text-purple-400">
                                Performance
                            </div>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.05]">
                            <div
                                className="h-full rounded-full bg-purple-500 transition-all"
                                style={{
                                    width: `${deliveryRate}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Campaign table */}
                <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#15131f]">

                    {/* Table header */}
                    <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="text-base font-semibold text-white">
                                Campaign history
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                View and manage all notification campaigns.
                            </p>
                        </div>

                        <div className="flex flex-col gap-3 sm:flex-row">
                            {/* Search */}
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                    ⌕
                                </span>

                                <input
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                        setPage(1);
                                    }}
                                    placeholder="Search campaigns..."
                                    className="w-full rounded-xl border border-white/10 bg-[#100e18] py-2.5 pl-9 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-purple-500/40 sm:w-64"
                                />
                            </div>

                            {/* Status filter */}
                            <select
                                value={statusFilter}
                                onChange={(event) => {
                                    setStatusFilter(event.target.value);
                                    setPage(1);
                                }}
                                className="rounded-xl border border-white/10 bg-[#100e18] px-3 py-2.5 text-sm text-gray-300 outline-none focus:border-purple-500/40"
                            >
                                {STATUS_OPTIONS.map((status) => (
                                    <option key={status} value={status}>
                                        {status === "all"
                                            ? "All statuses"
                                            : status.charAt(0).toUpperCase() +
                                            status.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="m-5 rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400">
                            {error}

                            <button
                                onClick={refresh}
                                className="ml-3 underline underline-offset-2"
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[950px]">
                            <thead>
                                <tr className="border-b border-white/[0.05] bg-white/[0.015]">
                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Campaign
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Type
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Recipients
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Delivery
                                    </th>

                                    <th className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Created
                                    </th>

                                    <th className="px-5 py-4 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-white/[0.04]">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <LoadingRows />
                                        </td>
                                    </tr>
                                ) : campaigns.length === 0 ? (
                                    <tr>
                                        <td colSpan={7}>
                                            <EmptyState
                                                title="No campaigns found"
                                                description={
                                                    search || statusFilter !== "all"
                                                        ? "Try changing your search or filters."
                                                        : "Create your first notification campaign to get started."
                                                }
                                            />
                                        </td>
                                    </tr>
                                ) : (
                                    campaigns.map((campaign) => (
                                        <tr
                                            key={campaign.id}
                                            className="transition hover:bg-white/[0.02]"
                                        >
                                            {/* Campaign */}
                                            <td className="px-5 py-4">
                                                <div className="max-w-[280px]">
                                                    <p className="truncate text-sm font-medium text-white">
                                                        {campaign.title}
                                                    </p>

                                                    <p className="mt-1 truncate text-xs text-gray-500">
                                                        {campaign.message}
                                                    </p>

                                                    {campaign.scheduled_at && (
                                                        <p className="mt-1 text-xs text-blue-400">
                                                            ◷ {formatDate(campaign.scheduled_at)}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Type */}
                                            <td className="px-5 py-4">
                                                <TypeBadge type={campaign.type} />
                                            </td>

                                            {/* Status */}
                                            <td className="px-5 py-4">
                                                <StatusBadge status={campaign.status} />
                                            </td>

                                            {/* Recipients */}
                                            <td className="px-5 py-4 text-sm text-gray-300">
                                                {campaign.total_recipients.toLocaleString()}
                                            </td>

                                            {/* Delivery */}
                                            <td className="px-5 py-4">
                                                <div className="space-y-1.5">
                                                    <p className="text-sm text-gray-300">
                                                        <span className="text-emerald-400">
                                                            {campaign.delivered_count}
                                                        </span>
                                                        {" / "}
                                                        {campaign.total_recipients}
                                                    </p>

                                                    {campaign.failed_count > 0 && (
                                                        <p className="text-xs text-red-400">
                                                            {campaign.failed_count} failed
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Created */}
                                            <td className="px-5 py-4 text-sm text-gray-400">
                                                {formatRelativeDate(campaign.created_at)}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleViewCampaign(campaign.id)
                                                        }
                                                        title="View campaign"
                                                        className="rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 transition hover:bg-white/[0.05] hover:text-white"
                                                    >
                                                        View
                                                    </button>

                                                    {campaign.status === "scheduled" && (
                                                        <button
                                                            onClick={() =>
                                                                setCancelId(campaign.id)
                                                            }
                                                            title="Cancel scheduled campaign"
                                                            className="rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/10"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && campaignData.total > 0 && (
                        <div className="flex flex-col gap-3 border-t border-white/[0.07] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-gray-500">
                                Showing{" "}
                                <span className="text-gray-300">
                                    {(page - 1) * campaignData.limit + 1}
                                </span>
                                {" – "}
                                <span className="text-gray-300">
                                    {Math.min(
                                        page * campaignData.limit,
                                        campaignData.total,
                                    )}
                                </span>
                                {" of "}
                                <span className="text-gray-300">
                                    {campaignData.total}
                                </span>
                                {" campaigns"}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    disabled={page <= 1}
                                    onClick={() => setPage((current) => current - 1)}
                                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    Previous
                                </button>

                                <span className="px-2 text-sm text-gray-500">
                                    {page} / {campaignData.total_pages || 1}
                                </span>

                                <button
                                    disabled={page >= campaignData.total_pages}
                                    onClick={() => setPage((current) => current + 1)}
                                    className="rounded-lg border border-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-30"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Create modal */}
            {createOpen && (
                <CreateCampaignModal
                    onClose={() => setCreateOpen(false)}
                    onCreated={refresh}
                />
            )}

            {/* Details modal */}
            {selectedCampaign && (
                <CampaignDetails
                    campaign={selectedCampaign}
                    onClose={() => setSelectedCampaign(null)}
                />
            )}

            {/* Cancel confirmation */}
            {cancelId && (
                <Modal
                    title="Cancel scheduled notification?"
                    onClose={() => setCancelId(null)}
                >
                    <div className="space-y-5 p-6">
                        <p className="text-sm leading-6 text-gray-400">
                            Are you sure you want to cancel this scheduled notification?
                            It will not be delivered to users.
                        </p>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setCancelId(null)}
                                disabled={cancelLoading}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5"
                            >
                                Keep campaign
                            </button>

                            <button
                                onClick={() => handleCancelCampaign(cancelId)}
                                disabled={cancelLoading}
                                className="rounded-xl bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                            >
                                {cancelLoading
                                    ? "Cancelling..."
                                    : "Cancel campaign"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
}
