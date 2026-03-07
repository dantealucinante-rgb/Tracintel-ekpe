"use client";

export default function AuthError({ error, reset }: { error: Error; reset: () => void }) {
    return (
        <div className="flex h-screen items-center justify-center flex-col gap-4 bg-white">
            <h2 className="text-xl font-semibold text-black font-sans">Something went wrong</h2>
            <p className="text-sm text-gray-500 font-medium max-w-lg text-center">{error.message}</p>
            <button onClick={reset} className="px-5 py-2.5 bg-black text-white text-sm font-bold uppercase tracking-widest rounded-lg hover:bg-black/80 transition-all">
                Try again
            </button>
        </div>
    );
}
