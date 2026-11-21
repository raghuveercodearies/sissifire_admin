
"use client";

import { Suspense } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
    Activity,
    BarChart3,
    Bell,
    Brain,
    CreditCard,
    GraduationCap,
    LayoutDashboard,
    LogOut,
    ShieldCheck,
    Sparkles,
    Users,
    X,
} from "lucide-react";
import toast from "react-hot-toast";

interface AdminSidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen?: (open: boolean) => void;
    onNavigate?: () => void;
}

const navigation = [
    {
        label: "Overview",
        items: [
            { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
            { name: "Users", href: "/admin/users", icon: Users },
            { name: "Billing", href: "/admin/billing", icon: CreditCard },
            // { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ],
    },
    {
        label: "Platform",
        items: [
            // { name: "Activity", href: "/admin/activity", icon: Activity },
            {
                name: "Training",
                href: "/admin/training",
                icon: GraduationCap,
            },
            { name: "Notifications", href: "/admin/notifications", icon: Bell },
            {
                name: "Terms & Conditions",
                href: "/admin/terms-and-conditions",
                icon: Bell,
            },
        ],
    },
];

function AdminSidebarContent({
    sidebarOpen,
    setSidebarOpen,
    onNavigate,
}: AdminSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    function handleLogout() {
        localStorage.removeItem("admin_access_token");
        localStorage.removeItem("admin_user");

        toast.success("Logged out successfully");
        router.push("/admin/login");
    }

    function handleNavigation(href: string) {
        router.push(href);
        setSidebarOpen?.(false);
        onNavigate?.();
    }

    return (
        <>
            {sidebarOpen && (
                <button
                    className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                    onClick={() => setSidebarOpen?.(false)}
                    aria-label="Close sidebar"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r border-border bg-[#0b0810]/95 backdrop-blur-xl transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0`}
            >
                <div className="flex h-[76px] items-center gap-3 border-b border-border px-5">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-brand/10 shadow-glow-logo">
                        <Sparkles className="size-5 text-brand-soft" />
                    </div>

                    <div>
                        <h1 className="text-sm font-semibold text-brand-soft">
                            Sissifier GPT
                        </h1>
                        <p className="mt-0.5 text-[10px] tracking-wider text-muted-foreground">
                            ADMIN CONSOLE
                        </p>
                    </div>

                    <button
                        onClick={() => setSidebarOpen?.(false)}
                        className="ml-auto text-muted-foreground transition hover:text-foreground lg:hidden"
                        aria-label="Close sidebar"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-6">
                    {navigation.map((section) => (
                        <div key={section.label}>
                            <p
                                className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground ${section.label === "Platform" ? "mt-8" : ""
                                    }`}
                            >
                                {section.label}
                            </p>

                            <nav className="space-y-1">
                                {section.items.map((item) => {
                                    const Icon = item.icon;

                                    const active =
                                        pathname === item.href ||
                                        pathname.startsWith(`${item.href}/`);

                                    return (
                                        <button
                                            key={item.href}
                                            onClick={() => handleNavigation(item.href)}
                                            className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-sm transition-all ${active
                                                ? "border-purple-400/10 bg-purple-400/[0.08] text-brand-soft"
                                                : "border-transparent text-muted-foreground hover:bg-white/[0.03] hover:text-foreground"
                                                }`}
                                        >
                                            <Icon className="size-4 shrink-0" />
                                            <span>{item.name}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    ))}
                </div>

                <div className="border-t border-border p-4">
                    <div className="mb-4 flex items-center gap-3 rounded-xl border border-border bg-card/50 p-3">
                        <div className="flex size-9 items-center justify-center rounded-full bg-purple-400/10 text-purple-300">
                            <ShieldCheck className="size-4" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-xs font-medium text-foreground">
                                Administrator
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                                System access
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-red-400/[0.05] hover:text-red-400"
                    >
                        <LogOut className="size-4" />
                        Logout
                    </button>
                </div>
            </aside>
        </>
    );
}

export default function AdminSidebar(props: AdminSidebarProps) {
    return (
        <Suspense
            fallback={
                <aside className="fixed inset-y-0 left-0 z-50 hidden w-[250px] border-r border-border bg-[#0b0810]/95 lg:block" />
            }
        >
            <AdminSidebarContent {...props} />
        </Suspense>
    );
}
