
"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    BookOpen,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    Circle,
    Clock3,
    GraduationCap,
    Loader2,
    Mail,
    Target,
    User,
    UserRound,
} from "lucide-react";
import toast from "react-hot-toast";

import {
    getTrainingUserDetails,
    getTrainingUserProgress,
    type TrainingUserDetailsResponse,
    type TrainingProgressResponse,
    type TrainingWeek,
} from "@/lib/admin-training";

function formatDate(value: string | null | undefined) {
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

function getInitials(name: string) {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("") || "U";
}

function InfoCard({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="rounded-xl border border-border bg-background/40 p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-2 break-words text-sm font-medium text-foreground">
                {value}
            </p>
        </div>
    );
}

function WeekCard({
    week,
    expanded,
    onToggle,
}: {
    week: TrainingWeek;
    expanded: boolean;
    onToggle: () => void;
}) {
    const isCompleted = week.status === "completed";
    const isCurrent = week.status === "current";
    const isLocked = week.status === "locked";

    return (
        <div
            className={`overflow-hidden rounded-2xl border transition ${isCurrent
                    ? "border-purple-400/30 bg-purple-400/[0.035]"
                    : "border-border bg-card/50"
                }`}
        >
            <button
                type="button"
                onClick={onToggle}
                className="flex w-full items-center gap-4 p-4 text-left transition hover:bg-white/[0.02] sm:p-5"
            >
                <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${isCompleted
                            ? "bg-emerald-400/10 text-emerald-300"
                            : isCurrent
                                ? "bg-purple-400/10 text-purple-300"
                                : "bg-white/[0.04] text-muted-foreground"
                        }`}
                >
                    {isCompleted ? (
                        <CheckCircle2 className="size-5" />
                    ) : (
                        <span className="text-sm font-semibold">
                            {week.week_number}
                        </span>
                    )}
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-sm font-semibold text-foreground">
                            Week {week.week_number}: {week.title}
                        </h3>

                        {isCurrent && (
                            <span className="rounded-full bg-purple-400/10 px-2 py-0.5 text-[10px] font-medium text-purple-300">
                                Current
                            </span>
                        )}

                        {isCompleted && (
                            <span className="rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                                Completed
                            </span>
                        )}

                        {isLocked && (
                            <span className="rounded-full bg-white/[0.05] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                Locked
                            </span>
                        )}
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                        {week.completed_tasks} of {week.total_tasks} tasks completed
                    </p>
                </div>

                <div className="hidden w-28 shrink-0 sm:block">
                    <p className="mb-2 text-right text-xs text-muted-foreground">
                        {week.completion_rate.toFixed(1)}%
                    </p>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                        <div
                            className={`h-full rounded-full ${isCompleted ? "bg-emerald-400" : "bg-purple-400"
                                }`}
                            style={{
                                width: `${Math.min(100, Math.max(0, week.completion_rate))}%`,
                            }}
                        />
                    </div>
                </div>

                {expanded ? (
                    <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                ) : (
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
                )}
            </button>

            {expanded && (
                <div className="border-t border-border p-4 sm:p-5">
                    <div className="mb-5 rounded-xl border border-border bg-background/40 p-4">
                        <div className="mb-2 flex items-center gap-2 text-xs font-medium text-purple-300">
                            <Target className="size-4" />
                            Weekly Objective
                        </div>
                        <p className="text-sm leading-6 text-muted-foreground">
                            {week.objective || "No objective provided."}
                        </p>
                    </div>

                    <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-foreground">
                            Tasks
                        </h4>
                        <span className="text-xs text-muted-foreground">
                            {week.total_tasks} total
                        </span>
                    </div>

                    <div className="space-y-3">
                        {week.tasks.map((task) => (
                            <div
                                key={task.task_id}
                                className="rounded-xl border border-border bg-background/30 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 shrink-0">
                                        {task.completed ? (
                                            <CheckCircle2 className="size-5 text-emerald-400" />
                                        ) : (
                                            <Circle className="size-5 text-muted-foreground" />
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h5 className="text-sm font-medium text-foreground">
                                                {task.title}
                                            </h5>

                                            <span
                                                className={`rounded-full px-2 py-0.5 text-[10px] ${task.required
                                                        ? "bg-purple-400/10 text-purple-300"
                                                        : "bg-white/[0.05] text-muted-foreground"
                                                    }`}
                                            >
                                                {task.required ? "Required" : "Optional"}
                                            </span>
                                        </div>

                                        <p className="mt-2 text-xs leading-5 text-muted-foreground">
                                            {task.description}
                                        </p>

                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Clock3 className="size-3.5" />
                                                {task.estimated_minutes} minutes
                                            </span>

                                            {task.completed && task.completed_at && (
                                                <span className="flex items-center gap-1.5 text-emerald-300">
                                                    <CalendarDays className="size-3.5" />
                                                    Completed {formatDate(task.completed_at)}
                                                </span>
                                            )}

                                            {task.completed && !task.completed_at && (
                                                <span className="text-emerald-300">
                                                    Completed
                                                </span>
                                            )}

                                            {!task.completed && (
                                                <span>Pending</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {week.tasks.length === 0 && (
                        <p className="py-5 text-center text-xs text-muted-foreground">
                            No tasks available for this week.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function AdminTrainingUserPage() {
    const params = useParams<{ userId: string }>();
    const router = useRouter();

    const userId = params.userId;

    const [details, setDetails] =
        useState<TrainingUserDetailsResponse | null>(null);

    const [progress, setProgress] =
        useState<TrainingProgressResponse | null>(null);

    const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadDetails = useCallback(async () => {
        if (!userId) return;

        setLoading(true);
        setError("");

        try {
            const [detailsData, progressData] = await Promise.all([
                getTrainingUserDetails(userId),
                getTrainingUserProgress(userId),
            ]);

            setDetails(detailsData);
            setProgress(progressData);

            setExpandedWeek(progressData.current_week);
        } catch (err) {
            console.error("Training user details error:", err);

            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to load user training details.";

            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        loadDetails();
    }, [loadDetails]);

    if (loading) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center gap-3">
                <Loader2 className="size-8 animate-spin text-purple-300" />
                <p className="text-sm text-muted-foreground">
                    Loading training roadmap...
                </p>
            </div>
        );
    }

    if (error || !details || !progress) {
        return (
            <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
                <BookOpen className="mb-4 size-9 text-muted-foreground" />

                <h2 className="text-lg font-semibold text-foreground">
                    Unable to load roadmap
                </h2>

                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                    {error || "Training roadmap not found."}
                </p>

                <button
                    onClick={() => router.push("/admin/training")}
                    className="mt-5 rounded-xl border border-border px-4 py-2.5 text-sm text-foreground hover:bg-white/[0.05]"
                >
                    Back to Training
                </button>
            </div>
        );
    }

    const { user, roadmap } = details;
    const profile = roadmap.profile_snapshot;
    const completedWeeks = progress.weeks.filter(
        (week) => week.status === "completed"
    ).length;

    return (
        <div className="min-h-screen space-y-7 p-5 md:p-8">
            {/* Breadcrumb and back */}
            <div>
                <button
                    onClick={() => router.push("/admin/training")}
                    className="mb-5 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-purple-300"
                >
                    <ArrowLeft className="size-4" />
                    Back to Training
                </button>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                            <GraduationCap className="size-4 text-purple-300" />
                            Training
                            <span>/</span>
                            <span className="text-foreground">User Roadmap</span>
                        </div>

                        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">
                            Training Roadmap
                        </h1>

                        <p className="mt-2 text-sm text-muted-foreground">
                            Inspect this user's personalized training journey.
                        </p>
                    </div>

                    <span
                        className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${roadmap.status === "completed"
                                ? "bg-emerald-400/10 text-emerald-300"
                                : "bg-purple-400/10 text-purple-300"
                            }`}
                    >
                        {roadmap.status === "completed"
                            ? "Roadmap Completed"
                            : "Active Roadmap"}
                    </span>
                </div>
            </div>

            {/* User profile */}
            <section className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-2xl border border-purple-400/15 bg-purple-400/10 text-lg font-semibold text-purple-300">
                        {getInitials(user.name)}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-xl font-semibold text-foreground">
                                {user.name || "Unnamed user"}
                            </h2>

                            {user.is_verified && (
                                <span className="rounded-full bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-300">
                                    Verified
                                </span>
                            )}
                        </div>

                        <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="size-4" />
                            {user.email || "No email available"}
                        </p>

                        <p className="mt-2 break-all text-[11px] text-muted-foreground">
                            User ID: {user.id}
                        </p>
                    </div>
                </div>
            </section>

            {/* Progress cards */}
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <InfoCard
                    label="Current Week"
                    value={`${progress.current_week} / ${progress.total_weeks}`}
                />

                <InfoCard
                    label="Completed Tasks"
                    value={`${progress.completed_tasks} / ${progress.total_tasks}`}
                />

                <InfoCard
                    label="Pending Tasks"
                    value={String(progress.pending_tasks)}
                />

                <InfoCard
                    label="Overall Completion"
                    value={`${progress.completion_rate.toFixed(1)}%`}
                />
            </section>

            {/* Main progress */}
            <section className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h2 className="text-sm font-semibold text-foreground">
                            Roadmap Progress
                        </h2>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Progress through the 26-week training plan
                        </p>
                    </div>

                    <span className="text-lg font-semibold text-purple-300">
                        {progress.completion_rate.toFixed(1)}%
                    </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-white/[0.06]">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-300 transition-all duration-500"
                        style={{
                            width: `${Math.min(100, Math.max(0, progress.completion_rate))}%`,
                        }}
                    />
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <div>
                        <p className="text-xs text-muted-foreground">Completed weeks</p>
                        <p className="mt-1 text-lg font-semibold text-emerald-300">
                            {completedWeeks}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">Current week</p>
                        <p className="mt-1 text-lg font-semibold text-purple-300">
                            {progress.current_week}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-muted-foreground">Total weeks</p>
                        <p className="mt-1 text-lg font-semibold text-foreground">
                            {progress.total_weeks}
                        </p>
                    </div>
                </div>
            </section>

            {/* Onboarding profile */}
            <section className="rounded-2xl border border-border bg-card/60 p-5 md:p-6">
                <div className="mb-5 flex items-center gap-2">
                    <UserRound className="size-5 text-purple-300" />
                    <h2 className="text-base font-semibold text-foreground">
                        Onboarding Profile
                    </h2>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoCard
                        label="Role"
                        value={profile.role || "—"}
                    />

                    <InfoCard
                        label="Experience Level"
                        value={profile.experience_level || "—"}
                    />

                    <InfoCard
                        label="Desired Level"
                        value={profile.desired_level || "—"}
                    />

                    <InfoCard
                        label="Age"
                        value={profile.age != null ? String(profile.age) : "—"}
                    />

                    <InfoCard
                        label="Gender Identity"
                        value={profile.gender_identity || "—"}
                    />

                    <InfoCard
                        label="Preferences"
                        value={
                            profile.preferences?.length
                                ? profile.preferences.join(", ")
                                : "—"
                        }
                    />
                </div>
            </section>

            {/* Roadmap metadata */}
            <section className="grid gap-3 sm:grid-cols-2">
                <InfoCard
                    label="Roadmap Created"
                    value={formatDate(roadmap.created_at)}
                />
                <InfoCard
                    label="Last Updated"
                    value={formatDate(roadmap.updated_at)}
                />
            </section>

            {/* Weekly roadmap */}
            <section>
                <div className="mb-5">
                    <h2 className="text-base font-semibold text-foreground">
                        26-Week Roadmap
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Expand a week to inspect its objective and individual tasks.
                    </p>
                </div>

                <div className="space-y-3">
                    {progress.weeks.map((week) => (
                        <WeekCard
                            key={week.week_number}
                            week={week}
                            expanded={expandedWeek === week.week_number}
                            onToggle={() =>
                                setExpandedWeek((current) =>
                                    current === week.week_number
                                        ? null
                                        : week.week_number
                                )
                            }
                        />
                    ))}
                </div>

                {progress.weeks.length === 0 && (
                    <div className="rounded-2xl border border-border p-8 text-center">
                        <BookOpen className="mx-auto mb-3 size-7 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                            No roadmap weeks are available.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
}
