'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function SearchWidget() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [query, setQuery] = useState('');

    useEffect(() => {
        // Sync local state with URL param on load
        if (searchParams.has('q')) {
            setQuery(searchParams.get('q'));
        }
    }, [searchParams]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Redirect to search page with query param
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    return (
        <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 block">Search</label>
            <form onSubmit={handleSearch} className="relative">
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg py-3 pl-4 pr-10 text-slate-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                    <Search size={16} />
                </button>
            </form>
        </div>
    );
}
