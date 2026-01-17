import Image from 'next/image';
import Link from 'next/link';
import { MapPin, GraduationCap, Briefcase, ArrowRight, ExternalLink } from 'lucide-react';

export const metadata = {
    title: "Portfolio | Alfaz Mahmud",
    description: "AI Automation, Business Growth, and Technical SEO.",
};

export default function Portfolio() {
    return (
        <main className="min-h-screen selection:bg-blue-500 selection:text-white pb-20 pt-32">
            {/* BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 bg-[#0a0a0a] -z-20" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0a0a] to-[#0a0a0a] -z-10" />

            <div className="max-w-6xl mx-auto px-6 space-y-24">

                {/* HERO SECTION */}
                <section className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono uppercase tracking-wider">
                            n8n Automation • WordPress • Technical SEO • Meta Ads
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                Alfaz Mahmud Rizve – <br />
                                <span className="text-slate-400">AI automation, business growth & SEO</span>
                            </h1>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                                Computer Science student building automation workflows, SEO-optimized websites, and performance marketing systems at the intersection of engineering and business operations.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <Link href="/resume.pdf" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2">
                                View Resume <ArrowRight size={18} />
                            </Link>
                            <Link href="mailto:a.m.rizve3905@gmail.com" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-lg transition-colors">
                                Get in touch
                            </Link>
                        </div>
                    </div>

                    {/* PROFILE CARD */}
                    <div className="relative">
                        <div className="absolute inset-0 bg-blue-500/20 blur-3xl -z-10 rounded-full"></div>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 space-y-8">
                            <div className="flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full border-2 border-blue-500 p-1 relative">
                                    <div className="w-full h-full rounded-full bg-slate-800 overflow-hidden relative group">
                                        <Image
                                            src="/profile.jpg"
                                            alt="Alfaz Mahmud"
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            priority
                                        />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full border-4 border-[#0a0a0a] flex items-center justify-center text-white text-xs z-10 animate-bounce">
                                        🚀
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <MapPin className="text-blue-500 shrink-0" size={20} />
                                    <div>
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Location</span>
                                        <span className="text-white font-medium">Chittagong, Bangladesh</span>
                                        <span className="text-slate-500 block text-xs mt-0.5">(GMT+6)</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <GraduationCap className="text-blue-500 shrink-0" size={20} />
                                    <div>
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Education</span>
                                        <span className="text-white font-medium">BSc Computer Science, IIUC</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <Briefcase className="text-blue-500 shrink-0" size={20} />
                                    <div>
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Availability</span>
                                        <span className="text-green-400 font-medium flex items-center gap-1.5">
                                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                                            Freelance & projects
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* EXPERIENCE "Who is Alfaz..." */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-8">Who is Alfaz Mahmud Rizve? For AI automation for SaaS & agencies</h2>
                    <div className="grid md:grid-cols-1 gap-6">

                        {/* Experience Item 1 */}
                        <div className="group bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-8 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Automation, Web & SEO Practice</h3>
                                    <Link href="#" className="text-blue-400 text-sm hover:underline">Personal Portfolio / whorisfaz.me</Link>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-mono">2023 - Present</span>
                            </div>
                            <ul className="space-y-3 text-slate-400 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1.5">•</span>
                                    Designed automation workflows for lead handling, data organization, and onboarding.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1.5">•</span>
                                    Built WordPress websites and conversion funnels focused on usability and performance.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1.5">•</span>
                                    Conducted technical SEO audits, on-page optimization, and search monitoring.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1.5">•</span>
                                    Documented workflows and case studies through blog posts and templates.
                                </li>
                            </ul>
                        </div>

                        {/* Experience Item 2 */}
                        <div className="group bg-white/5 border border-white/10 hover:border-blue-500/30 rounded-2xl p-8 transition-colors">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">Social Media & Content Management</h3>
                                    <span className="text-slate-500 text-sm">Artist UD - Chattogram</span>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-white/5 text-slate-400 text-xs font-mono">2020 - Present</span>
                            </div>
                            <ul className="space-y-3 text-slate-400 leading-relaxed">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1.5">•</span>
                                    Planned and managed brand content across social platforms.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1.5">•</span>
                                    Ran Facebook ad campaigns with audience research and performance analysis.
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500 mt-1.5">•</span>
                                    Improved engagement through aligned content and paid strategies.
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* EDUCATION & CERTIFICATIONS */}
                <section className="grid lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Education</h2>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                            <h3 className="text-lg font-bold text-white mb-1">Bachelor of Science in Computer Science</h3>
                            <p className="text-slate-400 text-sm mb-4">International Islamic University Chittagong</p>
                            <span className="text-xs font-mono text-slate-500">2022 - 2026</span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-white">Certifications</h2>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span className="text-slate-300">Facebook Ads Manager - <span className="text-slate-500">Meta/Coursera</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span className="text-slate-300">Gemini Certified Educator - <span className="text-slate-500">Google</span></span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span className="text-slate-300">GA4 Analytics - <span className="text-slate-500">Google</span></span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* KEY PROJECTS */}
                <section>
                    <h2 className="text-2xl font-bold text-white mb-2">Key projects & experiments</h2>
                    <p className="text-slate-400 mb-8 max-w-2xl">Hands-on automation, SEO, and web projects serving as live testing grounds.</p>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-mono text-blue-400 mb-2 block uppercase">Web Development + Funnels</span>
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">n8n automation workflows</h3>
                                <p className="text-slate-400 max-w-xl">Custom landing pages, lead capture forms, and booking flows with performance focus.</p>
                            </div>
                            <ArrowRight className="text-slate-500 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-20 text-center space-y-8">
                    <div className="space-y-4">
                        <h2 className="text-3xl font-bold text-white">Need automation, SEO, or funnel work?</h2>
                        <p className="text-slate-400 max-w-xl mx-auto">Share your world-view challenge or site audit needs for a practical implementation approach.</p>
                    </div>
                    <Link href="mailto:contact@whoisalfaz.me" className="inline-block bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105">
                        Start project discussion
                    </Link>
                </section>

            </div >
        </main >
    );
}
