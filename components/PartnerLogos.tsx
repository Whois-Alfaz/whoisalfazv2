"use client";

import Image from 'next/image';

interface Partner {
    name: string;
    logo?: string;
}

const partners: Partner[] = [
    { name: "n8n" },
    { name: "HubSpot" },
    { name: "Elementor" },
    { name: "Apollo.io" },
    { name: "Databox" },
    { name: "Brevo" },
    { name: "monday.com" },
    { name: "Pinecone" },
    { name: "Weaviate" },
    { name: "Surfer SEO" },
    { name: "Wati" }
];

interface PartnerLogosProps {
    title: string;
    subtitle?: string;
    variant?: 'grid' | 'marquee';
}

export default function PartnerLogos({ title, subtitle, variant = 'grid' }: PartnerLogosProps) {
    return (
        <div className="w-full">
            <div className="text-center mb-10">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 font-mono">
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-slate-400 text-sm">{subtitle}</p>
                )}
            </div>

            <div className={variant === 'grid'
                ? "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-80"
                : "flex flex-wrap items-center justify-center gap-12 opacity-80"
            }>
                {partners.map((partner) => (
                    <div
                        key={partner.name}
                        className="relative group transition-all duration-500"
                    >
                        {/* Placeholder until logos are provided */}
                        <div className="h-8 md:h-10 px-4 flex items-center justify-center filter grayscale contrast-125 brightness-75 group-hover:grayscale-0 group-hover:brightness-100 group-hover:contrast-100 transition-all duration-500">
                            <span className="text-slate-500 text-[10px] md:text-xs font-bold tracking-tighter uppercase group-hover:text-white transition-colors">
                                {partner.name}
                            </span>
                        </div>

                        {/* Soft Glow on Hover */}
                        <div className="absolute inset-0 bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 rounded-full"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
