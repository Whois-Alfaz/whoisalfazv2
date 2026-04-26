
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ContactForm from '../../../components/ContactForm';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { serviceData } from '../../../lib/serviceData';

export const generateMetadata = async ({ params }) => {
    const { slug } = await params;
    const service = serviceData[slug];
    if (!service) return { title: 'Service Not Found' };

    return {
        title: `${service.title} | Services`,
        description: service.subtitle,
        alternates: {
            canonical: `/services/${slug}/`,
        },
        openGraph: {
            title: `${service.title} | Services`,
            description: service.subtitle,
            url: `https://whoisalfaz.me/services/${slug}/`,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: `${service.title} | Services`,
            description: service.subtitle,
        }
    };
}

export default async function ServiceDetailPage({ params }) {
    const { slug } = await params;
    let service = serviceData[slug];

    if (!service) {
        notFound();
    }

    const { title, subtitle, themeColor, icon: Icon, detailedContent, features, contactOption, price } = service;

    return (
        <main className="min-h-screen pt-32 pb-20 px-6 bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-300">
            {/* SERVICE SCHEMA — Rich Result Signal */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Service",
                    "name": title,
                    "description": subtitle,
                    "serviceType": title,
                    "provider": {
                        "@type": "Person",
                        "name": "Alfaz Mahmud Rizve",
                        "url": "https://whoisalfaz.me",
                        "jobTitle": "RevOps Architect & Full Stack Automation Engineer"
                    },
                    "url": `https://whoisalfaz.me/services/${slug}/`,
                    "areaServed": "Worldwide",
                    "offers": {
                        "@type": "Offer",
                        "price": price.replace(/[^0-9.]/g, ''),
                        "priceCurrency": "USD",
                        "priceSpecification": {
                            "@type": "UnitPriceSpecification",
                            "price": price.replace(/[^0-9.]/g, ''),
                            "priceCurrency": "USD"
                        }
                    }
                }) }}
            />

            {/* BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100 via-slate-50 to-slate-50 dark:from-transparent dark:via-[#0a0a0a] dark:to-[#0a0a0a] -z-20 transition-colors duration-300" />

            {/* Dynamic Background Gradient */}
            <div
                className="fixed inset-0 -z-10 opacity-[0.05] dark:opacity-20 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(ellipse at top right, ${themeColor} 0%, transparent 70%)`
                }}
            />

            <div className="max-w-6xl mx-auto">
                <Link href="/services" className="inline-flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest hover:text-slate-900 dark:hover:text-white transition-colors mb-12 text-xs">
                    <ArrowRight className="rotate-180" size={16} /> Back to Services
                </Link>

                <div className="grid lg:grid-cols-2 gap-16 items-start">

                    {/* LEFT CONTENT */}
                    <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                        <div
                            className="w-20 h-20 rounded-2xl flex items-center justify-center mb-10 backdrop-blur-sm shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10"
                            style={{
                                backgroundColor: `color-mix(in srgb, ${themeColor} 10%, transparent)`,
                                color: themeColor
                            }}
                        >
                            <Icon size={40} />
                        </div>

                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-8 leading-tight uppercase tracking-tight">
                            {title}
                        </h1>

                        <div className="inline-block px-6 py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-lg font-black uppercase tracking-widest text-slate-900 dark:text-white mb-8 shadow-sm dark:shadow-none">
                            Starting at <span style={{ color: themeColor }}>{price}</span>
                        </div>

                        <h2
                            className="text-xl md:text-2xl font-bold mb-12 leading-relaxed"
                            style={{ color: themeColor }}
                        >
                            {subtitle}
                        </h2>

                        <div className="prose prose-slate dark:prose-invert prose-lg mb-16 max-w-none">
                            {detailedContent ? (
                                detailedContent.map((paragraph, index) => (
                                    <p key={index} className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-6">
                                        {paragraph}
                                    </p>
                                ))
                            ) : (
                                <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed text-lg">
                                    Service description unavailable.
                                </p>
                            )}
                        </div>

                        <div className="mb-12 bg-white dark:bg-[#111] p-10 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl dark:shadow-none transition-colors duration-300">
                            <h3 className="text-slate-900 dark:text-white font-black text-xl mb-8 uppercase tracking-widest border-b border-slate-100 dark:border-white/10 pb-4">What's Included</h3>
                            <ul className="space-y-5">
                                {features?.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-600 dark:text-slate-300 font-medium">
                                        <CheckCircle2 size={24} className="shrink-0 mt-0.5" style={{ color: themeColor }} />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* RIGHT CONTENT (CONTACT FORM) */}
                    <div className="lg:sticky lg:top-32 animate-in fade-in slide-in-from-right-8 duration-1000 delay-150 fill-mode-both">
                        <div className="relative">
                            {/* Decorative Glow */}
                            <div
                                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"
                                style={{
                                    backgroundColor: themeColor,
                                    opacity: 0.15
                                }}
                            ></div>

                            <h3 className="text-slate-900 dark:text-white font-black text-2xl mb-4 relative z-10 pl-2 uppercase tracking-tight">Get Started</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-[15px] mb-8 relative z-10 pl-2">
                                Ready to scale with <span className="font-bold" style={{ color: themeColor }}>{title}</span>? Fill out the form below.
                            </p>

                            <div className="relative z-10 shadow-2xl dark:shadow-none rounded-[3rem]">
                                <ContactForm initialServiceOfInterest={contactOption} source={`service-${slug}`} />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
