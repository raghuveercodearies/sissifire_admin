
import type { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface LegalSection {
    title: string;
    content: ReactNode;
}

interface LegalPageProps {
    title: string;
    subtitle: string;
    lastUpdated: string;
    effectiveDate?: string;
    sections: LegalSection[];
}

export default function LegalPage({
    title,
    subtitle,
    lastUpdated,
    effectiveDate,
    sections,
}: LegalPageProps) {
    return (
        <main className="relative w-full min-h-screen bg-surface-page overflow-visible">
            {/* Background Effects */}
            <div className="pointer-events-none fixed inset-0 bg-page-gradient" />
            <div className="pointer-events-none fixed inset-0 bg-glow-bottom opacity-60" />

            {/* Main Content */}
            <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-10 lg:py-12">

                {/* Page Header */}
                <header className="mb-10 max-w-4xl">
                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/25 bg-brand/10 px-3 py-1.5">
                        <span className="size-1.5 rounded-full bg-brand shadow-glow-sm" />
                        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brand-soft">
                            Sissifier GPT / Legal
                        </span>
                    </div>

                    <h1 className="font-display text-3xl font-bold tracking-tight text-fg-title sm:text-4xl lg:text-5xl">
                        {title}
                    </h1>

                    <p className="mt-5 max-w-3xl text-sm leading-7 text-fg-muted sm:text-base">
                        {subtitle}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-fg-dim sm:text-sm">
                        <p>
                            Last updated:{" "}
                            <span className="font-medium text-fg-strong">
                                {lastUpdated}
                            </span>
                        </p>

                        {effectiveDate && (
                            <p>
                                Effective date:{" "}
                                <span className="font-medium text-fg-strong">
                                    {effectiveDate}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="mt-7 h-px w-full bg-gradient-to-r from-brand/50 via-brand/15 to-transparent" />
                </header>

                {/* Main Layout */}
                <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">

                    {/* Table of Contents */}
                    <aside className="min-w-0 lg:sticky lg:top-6">
                        <div className="rounded-xl border border-line bg-surface-card/80 p-4 shadow-sm backdrop-blur-sm">
                            <h2 className="mb-4 font-title text-xs font-bold uppercase tracking-wider text-brand-soft">
                                On this page
                            </h2>

                            {/* Desktop Navigation */}
                            <nav
                                aria-label="Table of contents"
                                className="hidden space-y-1 lg:block"
                            >
                                {sections.map((section, index) => (
                                    <a
                                        key={section.title}
                                        href={`#section-${index + 1}`}
                                        className="block rounded-lg px-3 py-2 text-xs leading-5 text-fg-muted transition-all hover:bg-brand/10 hover:text-brand-soft"
                                    >
                                        {String(index + 1).padStart(2, "0")}.{" "}
                                        {section.title}
                                    </a>
                                ))}
                            </nav>

                            {/* Mobile Navigation */}
                            <nav
                                aria-label="Table of contents"
                                className="flex gap-2 overflow-x-auto pb-1 lg:hidden"
                            >
                                {sections.map((section, index) => (
                                    <a
                                        key={section.title}
                                        href={`#section-${index + 1}`}
                                        className="shrink-0 whitespace-nowrap rounded-full border border-line bg-surface-raised px-3 py-2 text-xs text-fg-muted transition-colors hover:border-brand/40 hover:text-brand-soft"
                                    >
                                        {index + 1}. {section.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Legal Sections */}
                    <article className="min-w-0 space-y-5">
                        {sections.map((section, index) => (
                            <section
                                key={section.title}
                                id={`section-${index + 1}`}
                                className={cn(
                                    "scroll-mt-6 rounded-xl border border-line",
                                    "bg-surface-card/90 p-5 shadow-sm backdrop-blur-sm",
                                    "transition-colors hover:border-brand/20",
                                    "sm:p-7"
                                )}
                            >
                                <div className="mb-5 flex items-start gap-3">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-brand/20 bg-brand/10 font-title text-xs font-bold text-brand-soft">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <h2 className="pt-1 font-title text-base font-bold leading-6 text-fg-title sm:text-lg">
                                        {section.title}
                                    </h2>
                                </div>

                                <div className="space-y-4 break-words text-sm leading-7 text-fg-muted sm:text-[15px] [&_a]:text-brand-soft [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-fg-strong [&_ul]:marker:text-brand">
                                    {section.content}
                                </div>
                            </section>
                        ))}

                        {/* Contact Card */}
                        <section className="rounded-xl border border-brand/25 bg-brand/5 p-6 sm:p-8">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="font-title text-lg font-bold text-fg-title">
                                        Need help?
                                    </h2>

                                    <p className="mt-2 max-w-xl text-sm leading-6 text-fg-muted">
                                        Have questions or concerns regarding this document?
                                        Our team is here to help.
                                    </p>
                                </div>

                                <a
                                    href="mailto:contact@sissifiergpt.com"
                                    className="inline-flex w-fit shrink-0 items-center justify-center rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-on-brand shadow-glow-sm transition-all hover:bg-brand-hover hover:shadow-glow-md"
                                >
                                    Contact us
                                </a>
                            </div>
                        </section>

                        {/* Footer */}
                        <footer className="border-t border-line py-7">
                            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-fg-dim">
                                <Link
                                    href="/privacy-policy"
                                    className="transition-colors hover:text-brand-soft"
                                >
                                    Privacy Policy
                                </Link>

                                <Link
                                    href="/terms-and-conditions"
                                    className="transition-colors hover:text-brand-soft"
                                >
                                    Terms & Conditions
                                </Link>
                            </div>

                            <p className="mt-5 text-xs text-fg-faint">
                                © 2026 Sissifier GPT. All rights reserved.
                            </p>
                        </footer>
                    </article>
                </div>
            </div>
        </main>
    );
}
