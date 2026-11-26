"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Log the error to your monitoring service (e.g., Sentry, Datadog)
        console.error("[WellNexus Error Boundary]:", error);
    }, [error]);

    const handleCopyDigest = async () => {
        if (!error.digest) return;
        try {
            await navigator.clipboard.writeText(error.digest);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard API unavailable
        }
    };

    return (
        <main
            role="alert"
            aria-live="assertive"
            className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950"
        >
            {/* Subtle Clinical Ambient Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-tr from-teal-500/15 via-cyan-400/15 to-emerald-400/10 blur-3xl"
            />

            <div className="relative w-full max-w-lg rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none">
                {/* WellNexus Brand Header */}
                <div className="mb-8 flex items-center justify-center gap-2.5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-600 text-white shadow-sm shadow-teal-600/20">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                    </span>
                    <span className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-100">
                        Well<span className="text-teal-600 dark:text-teal-400">Nexus</span>
                    </span>
                </div>

                {/* Calming Status Emblem */}
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 ring-8 ring-rose-50/60 dark:bg-rose-950/50 dark:ring-rose-950/30">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-8 w-8 text-rose-600 dark:text-rose-400"
                        aria-hidden="true"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </div>

                {/* Reassuring Copy */}
                <div className="text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
                        We hit a brief interruption
                    </h1>
                    <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                        Something went wrong while loading this section. Your health records
                        and account information remain completely safe.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        type="button"
                        onClick={() => reset()}
                        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-teal-600/20 transition-all hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.98]"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                            aria-hidden="true"
                        >
                            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                            <path d="M21 3v5h-5" />
                        </svg>
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                        Return to Home
                    </Link>
                </div>

                {/* Support Reference Digest (Production Safe) */}
                {error.digest && (
                    <div className="mt-7 flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/80 px-4 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-950/60">
                        <span className="text-slate-500 dark:text-slate-400">
                            Reference ID:{" "}
                            <code className="font-mono font-medium text-slate-700 dark:text-slate-300">
                                {error.digest}
                            </code>
                        </span>
                        <button
                            type="button"
                            onClick={handleCopyDigest}
                            className="cursor-pointer font-medium text-teal-600 transition-colors hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300"
                        >
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                )}

                {/* Dev-only Error Details */}
                {process.env.NODE_ENV === "development" && error.message && (
                    <details className="mt-4 rounded-xl border border-amber-200/80 bg-amber-50/60 p-3 text-left text-xs text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-200">
                        <summary className="cursor-pointer font-medium">
                            Developer details
                        </summary>
                        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] opacity-90">
                            {error.message}
                        </pre>
                    </details>
                )}

                {/* Footer Reassurance */}
                <div className="mt-8 flex items-center justify-center gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 dark:border-slate-800/80 dark:text-slate-400">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400"
                        aria-hidden="true"
                    >
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    <span>
                        Encrypted session · Need help?{" "}
                        <Link
                            href="/support"
                            className="font-medium text-teal-600 underline-offset-4 hover:underline dark:text-teal-400"
                        >
                            Contact WellNexus Support
                        </Link>
                    </span>
                </div>
            </div>
        </main>
    );
}
