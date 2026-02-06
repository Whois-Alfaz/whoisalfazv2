'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-center px-6">
            <h2 className="text-4xl font-bold text-white mb-6">Something went wrong!</h2>
            <p className="text-slate-400 max-w-lg mx-auto mb-10 text-lg leading-relaxed">
                We apologize for the inconvenience. Our team has been notified of this technical issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={
                        // Attempt to recover by trying to re-render the segment
                        () => reset()
                    }
                    className="px-8 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors shadow-lg shadow-red-500/20"
                >
                    Try Again
                </button>
                <Link
                    href="/"
                    className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg border border-white/10 transition-colors"
                >
                    Return Home
                </Link>
            </div>
        </div>
    );
}
