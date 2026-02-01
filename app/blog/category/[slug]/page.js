
import { Suspense } from 'react';
import xss from 'xss';
import { getPostsByCategory, getAllCategories, getAllPosts } from '../../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronRight, BookOpen, Clock, ArrowRight } from 'lucide-react';
import SearchWidget from '../../../../components/SearchWidget';

// Helper to get cached posts for sidebar (optional optimization)
async function getSidebarData() {
    const posts = await getAllPosts();
    return posts?.slice(0, 5) || [];
}

export async function generateMetadata({ params }) {
    const { slug } = await params;
    // We could fetch the category name here for a better title, or just capitalize the slug
    return {
        title: `${slug.charAt(0).toUpperCase() + slug.slice(1)} | Blog Categories`,
        description: `Articles about ${slug}`,
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    const { posts, category } = await getPostsByCategory(slug);
    const allCategories = await getAllCategories();
    const recentPosts = await getSidebarData();

    return (
        <main className="min-h-screen pt-32 pb-20 px-6">
            {/* BACKGROUND */}
            <div className="fixed inset-0 bg-[#0a0a0a] -z-20" />
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0a0a] to-[#0a0a0a] -z-10" />

            <div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_350px] gap-16">

                {/* === LEFT COLUMN: MAIN CONTENT === */}
                <div>
                    {/* HEADER */}
                    <section className="mb-12">
                        <div className="flex items-center gap-2 text-sm text-slate-400 mb-4">
                            <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
                            <ChevronRight size={14} />
                            <span className="text-blue-400">Category</span>
                            <ChevronRight size={14} />
                            <span className="text-white capitalize">{category?.name || slug}</span>
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-4">
                            <span className="text-blue-500">#</span> {category?.name || slug}
                        </h1>
                        <p className="text-slate-400">
                            Browsing all articles in <span className="text-white font-medium">"{category?.name || slug}"</span>.
                        </p>
                    </section>

                    {/* BLOG ARCHIVE */}
                    <section>
                        {posts.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                {posts.map((post) => (
                                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
                                        <article className="h-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all hover:-translate-y-1">
                                            <div className="h-48 bg-slate-800 relative">
                                                {post.featuredImage?.node?.sourceUrl ? (
                                                    <Image src={post.featuredImage.node.sourceUrl} alt={post.title} fill className="object-cover" />
                                                ) : (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-700">
                                                        <span className="text-xs">No Image</span>
                                                    </div>
                                                )}
                                                {/* Overlay Date */}
                                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] text-white font-mono flex items-center gap-1">
                                                    <Clock size={10} />
                                                    {new Date(post.date).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-white font-bold text-lg mb-3 group-hover:text-blue-400 transition-colors leading-snug">
                                                    {post.title}
                                                </h3>
                                                <div className="text-slate-400 text-xs line-clamp-3 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: xss(post.excerpt) }} />
                                                <span className="text-blue-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1 group-hover:gap-2 transition-all">
                                                    Read Article <ArrowRight size={12} />
                                                </span>
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white/5 rounded-2xl border border-white/10">
                                <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
                                <p className="text-slate-400">We couldn't find any articles in this category.</p>
                                <Link href="/blog" className="inline-block mt-6 px-6 py-2 bg-blue-600 text-white rounded-full font-bold text-sm hover:bg-blue-500 transition-colors">
                                    Return to Blog
                                </Link>
                            </div>
                        )}
                    </section>
                </div>

                {/* === RIGHT COLUMN: SIDEBAR === */}
                <aside className="space-y-12 h-fit sticky top-32">

                    {/* SEARCH */}
                    <Suspense fallback={<div className="h-12 bg-white/5 rounded-lg animate-pulse" />}>
                        <SearchWidget />
                    </Suspense>

                    {/* RECENT POSTS */}
                    <div>
                        <h4 className="text-xl font-bold text-white mb-6">Recent Posts</h4>
                        <ul className="space-y-4">
                            {recentPosts?.map(post => (
                                <li key={post.slug}>
                                    <Link href={`/blog/${post.slug}`} className="group block">
                                        <h5 className="text-slate-300 text-sm font-medium group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                                            {post.title}
                                        </h5>
                                        <span className="text-xs text-slate-600 block">{new Date(post.date).toLocaleDateString()}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CATEGORIES (Sidebar Duplicate) */}
                    <div>
                        <h4 className="text-xl font-bold text-white mb-6">Categories</h4>
                        <ul className="space-y-2">
                            {allCategories?.map(cat => (
                                <li key={cat.slug}>
                                    <Link href={`/blog/category/${cat.slug}`} className={`text-sm block py-1 border-b border-white/5 pb-2 transition-colors ${cat.slug === slug ? 'text-blue-400 font-bold' : 'text-slate-400 hover:text-blue-400'}`}>
                                        {cat.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </aside>

            </div>
        </main>
    );
}
