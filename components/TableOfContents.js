'use client';

import { useState, useEffect } from 'react';

export default function TableOfContents() {
    const [headings, setHeadings] = useState([]);
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        // 1. Find all headings inside the prose content
        const elements = Array.from(document.querySelectorAll('.prose h2, .prose h3'));

        // 2. Generate IDs and create data structure
        const headingData = elements.map((elem, index) => {
            const id = elem.id || `heading-${index}`;
            elem.id = id; // Ensure it has an ID
            return {
                id,
                text: elem.textContent,
                level: elem.tagName.toLowerCase()
            };
        });

        setHeadings(headingData);

        // 3. Optional: Intersection Observer for active state
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        elements.forEach((elem) => observer.observe(elem));

        return () => observer.disconnect();
    }, []);

    if (headings.length === 0) return null;

    return (
        <ul className="space-y-3 text-sm border-l border-white/10">
            {headings.map((heading) => (
                <li key={heading.id} className={`pl-4 transition-colors ${heading.level === 'h3' ? 'ml-2' : ''} ${activeId === heading.id ? 'border-l-2 border-blue-500 text-white font-medium -ml-[1px]' : 'text-slate-400 hover:text-blue-400'}`}>
                    <a href={`#${heading.id}`} className="block py-1" onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                    }}>
                        {heading.text}
                    </a>
                </li>
            ))}
        </ul>
    );
}
