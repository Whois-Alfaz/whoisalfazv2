import { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/mdx';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://whoisalfaz.me';

    // 1. Static Routes
    const routes = [
        '',
        '/portfolio',
        '/blog',
        '/contact',
        '/services',
        '/labs',
        '/labs/roi',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // 2. Dynamic Blog Posts
    const posts = await getAllPosts();
    const blogRoutes = posts.map((post: any) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.modified || post.date),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }));

    return [...routes, ...blogRoutes];
}
