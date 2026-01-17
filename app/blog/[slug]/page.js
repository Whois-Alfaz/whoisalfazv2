import { getPostBySlug } from '../../../lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default async function Post({ params }) {
  // 1. Fetch the post data
  const { slug } = await params; // Awaiting params is required in Next.js 15
  const post = await getPostBySlug(slug);

  if (!post) {
    return <div className="text-white text-center mt-20">Post not found.</div>;
  }

  return (
    <article className="min-h-screen bg-black text-slate-300 selection:bg-blue-500 selection:text-white pb-20">
      {/* Navigation */}
      <nav className="p-6 max-w-4xl mx-auto">
        <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300 transition w-fit">
          <ArrowLeft size={20} /> Back to Audit Tool
        </Link>
      </nav>

      {/* Header */}
      <header className="max-w-4xl mx-auto px-6 mt-10 mb-12 border-b border-slate-800 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center gap-4 text-sm text-slate-500 font-mono">
          <span>{new Date(post.date).toLocaleDateString()}</span>
          <span>•</span>
          <span>By Alfaz Mahmud</span>
        </div>
      </header>

      {/* Featured Image (Optimized) */}
      {post.featuredImage?.node?.sourceUrl && (
        <div className="max-w-4xl mx-auto px-6 mb-12">
          <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden border border-slate-800">
            <Image
              src={post.featuredImage.node.sourceUrl}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* Content Body */}
      <div 
        className="max-w-3xl mx-auto px-6 prose prose-invert prose-lg prose-blue"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
}