interface LoadingScreenProps {
    label?: string;
    fullScreen?: boolean;
}

export function LoadingScreen({
    label = "Loading",
    fullScreen = true,
}: LoadingScreenProps) {
    return (
        <div
            role="status"
            aria-live="polite"
            className={`relative flex flex-col items-center justify-center overflow-hidden bg-zinc-50 dark:bg-zinc-950 ${fullScreen ? "min-h-dvh w-full" : "min-h-80 w-full rounded-2xl"
                }`}
        >
            {/* Ambient Background Glow */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute h-72 w-72 rounded-full bg-linear-to-tr from-indigo-500/20 via-violet-500/20 to-cyan-400/20 blur-3xl animate-pulse"
            />

            {/* Orbital Loader */}
            <div className="relative flex h-24 w-24 items-center justify-center">
                {/* Subtle static base ring */}
                <div className="absolute inset-0 rounded-full border border-zinc-200/80 dark:border-zinc-800/80" />

                {/* Outer rotating gradient arc */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 border-r-violet-500/50 animate-[spin_1.4s_cubic-bezier(0.4,0,0.2,1)_infinite]" />

                {/* Inner counter-rotating arc */}
                <div className="absolute inset-3 rounded-full border-2 border-transparent border-b-cyan-400 border-l-indigo-400/60 animate-[spin_2s_linear_infinite_reverse]" />

                {/* Innermost glowing core */}
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-white/80 shadow-lg shadow-indigo-500/20 backdrop-blur-md dark:bg-zinc-900/80">
                    <span className="h-2.5 w-2.5 rounded-full bg-linear-to-tr from-indigo-500 to-cyan-400 animate-pulse" />
                </div>
            </div>

            {/* Label & Animated Dots */}
            <div className="relative mt-7 flex items-center gap-1.5">
                <span className="text-sm font-medium tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-400">
                    {label}
                </span>
                <span className="flex gap-1" aria-hidden="true">
                    <span className="h-1 w-1 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="h-1 w-1 rounded-full bg-violet-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="h-1 w-1 rounded-full bg-cyan-400 animate-bounce" />
                </span>
            </div>

            <span className="sr-only">{label}...</span>
        </div>
    );
}
