import Link from "next/link";

const QUICK_LINKS = [
    {
        title: "Appointments",
        description: "Book or manage your visits",
        href: "/appointments",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
            >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <line x1="16" x2="16" y1="2" y2="6" />
                <line x1="8" x2="8" y1="2" y2="6" />
                <line x1="3" x2="21" y1="10" y2="10" />
            </svg>
        ),
    },
    {
        title: "Find a Specialist",
        description: "Browse doctors & clinics",
        href: "/doctors",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
            >
                <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
                <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
                <circle cx="20" cy="10" r="2" />
            </svg>
        ),
    },
    {
        title: "Patient Support",
        description: "Get help from our team",
        href: "/support",
        icon: (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
            >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <path d="M12 17h.01" />
            </svg>
        ),
    },
];

export default function NotFound() {
    return (
        <main className="relative flex min-h-dvh w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12 dark:bg-slate-950">
            {/* Subtle Clinical Ambient Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-linear-to-tr from-teal-500/15 via-cyan-400/15 to-emerald-400/10 blur-3xl"
            />

            <div className="relative w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl shadow-slate-200/50 backdrop-blur-xl sm:p-10 dark:border-slate-800/80 dark:bg-slate-900/90 dark:shadow-none">
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

                {/* 404 Visual Emblem */}
                <div className="flex flex-col items-center text-center">
                    <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 ring-8 ring-teal-50/60 dark:bg-teal-950/60 dark:ring-teal-950/30">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8 text-teal-600 dark:text-teal-400"
                            aria-hidden="true"
                        >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <circle cx="11.5" cy="14.5" r="2.5" />
                            <path d="M13.3 16.3 15 18" />
                        </svg>
                    </div>

                    <span className="inline-flex items-center rounded-full border border-teal-200/80 bg-teal-50/80 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-teal-700 dark:border-teal-800/60 dark:bg-teal-950/60 dark:text-teal-300">
                        Error 404
                    </span>

                    <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-50">
                        We couldn&apos;t find that page
                    </h1>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-400">
                        The resource or link you followed may have been moved, updated, or
                        removed. Let&apos;s get you back to the right place.
                    </p>
                </div>

                {/* Primary Action */}
                <div className="mt-7 flex justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-6 py-3 text-sm font-medium text-white shadow-sm shadow-teal-600/20 transition-all hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 active:scale-[0.98]"
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
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Return to Home
                    </Link>
                </div>

                {/* Helpful Quick Links */}
                <div className="mt-8 border-t border-slate-100 pt-6 dark:border-slate-800/80">
                    <p className="mb-3 text-center text-xs font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500">
                        Popular destinations
                    </p>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                        {QUICK_LINKS.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="group flex flex-col items-start rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3.5 transition-all hover:border-teal-300 hover:bg-teal-50/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-teal-800 dark:hover:bg-teal-950/30"
                            >
                                <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-teal-600 shadow-xs ring-1 ring-slate-200/70 transition-colors group-hover:bg-teal-600 group-hover:text-white group-hover:ring-teal-600 dark:bg-slate-900 dark:text-teal-400 dark:ring-slate-800">
                                    {item.icon}
                                </span>
                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                    {item.title}
                                </span>
                                <span className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                    {item.description}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
