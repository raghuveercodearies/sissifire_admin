
"use client";

import { Suspense, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#08080b]" />}>
            <AdminLayoutContent>{children}</AdminLayoutContent>
        </Suspense>
    );
}

function AdminLayoutContent({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    if (
        pathname === "/admin/login" ||
        pathname === "/admin/signup"
    ) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-page-gradient text-foreground">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/70 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="relative h-full">
                    <AdminSidebar
                        sidebarOpen={sidebarOpen}
                        setSidebarOpen={setSidebarOpen}
                    />

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="absolute right-3 top-5 flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground lg:hidden"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </div>

            {/* Main area */}
            <div className="min-w-0 lg:ml-[250px]">
                {/* Mobile navigation bar */}
                <div className="sticky top-0 z-30 flex h-[60px] items-center border-b border-border bg-[#08080b]/80 px-5 backdrop-blur-xl lg:hidden">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex size-9 items-center justify-center rounded-xl border border-border bg-card/70 text-muted-foreground hover:text-brand-soft"
                    >
                        <Menu className="size-4" />
                    </button>

                    <div className="ml-3 flex items-center gap-2">
                        <SparklesIcon />

                        <span className="text-sm font-semibold text-brand-soft">
                            Sissifier GPT
                        </span>
                    </div>
                </div>

                {/* Page content */}
                {children}
            </div>

            {/* Bottom glow */}
            <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent" />
        </div>
    );
}

function SparklesIcon() {
    return (
        <div className="flex size-7 items-center justify-center rounded-lg bg-brand/10">
            <span className="text-xs text-brand-soft">✦</span>
        </div>
    );
}
