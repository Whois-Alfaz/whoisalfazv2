"use client";
import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

export default function CodeBlock({ children, className, ...props }) {
    const [copied, setCopied] = useState(false);
    const codeRef = React.useRef(null);

    const handleCopy = () => {
        if (!codeRef.current) return;
        const codeString = codeRef.current.innerText || codeRef.current.textContent;
        navigator.clipboard.writeText(codeString);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-12 overflow-hidden rounded-xl border border-white/10 shadow-2xl bg-[#0f172a]">
            {/* MacOS Window Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                <div className="text-xs font-mono text-slate-500">JSON Payload</div>
                <button
                    onClick={handleCopy}
                    className="text-slate-500 hover:text-white transition-colors"
                    title="Copy Code"
                >
                    {copied ? <Check size={16} className="text-teal-400" /> : <Copy size={16} />}
                </button>
            </div>

            {/* Code Content */}
            <div className="p-4 overflow-x-auto text-sm">
                <pre ref={codeRef} {...props} className={className}>
                    {children}
                </pre>
            </div>
        </div>
    );
}
