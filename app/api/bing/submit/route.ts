import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/mdx';
import { submitToBing, submitToIndexNow, pingGoogle } from '@/lib/bing';

// Explicitly set dynamic force so Next.js doesn't cache this route and always executes it
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const secret = searchParams.get('secret');

        // Check for Cron Secret to prevent unauthorized access
        if (secret !== process.env.CRON_SECRET) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const baseUrl = 'https://whoisalfaz.me';

        // 1. Static Routes (Same as sitemap.ts)
        const staticRoutes = [
            '',
            '/portfolio',
            '/blog',
            '/contact',
            '/services',
            '/labs',
            '/labs/roi',
        ].map(route => `${baseUrl}${route}`);

        // 2. Dynamic Routes (Blog Posts)
        const posts = await getAllPosts();
        const blogRoutes = posts.map((post: any) => `${baseUrl}/blog/${post.slug}`);

        const allUrls = [...staticRoutes, ...blogRoutes];

        // 3. Trigger Triple Threat Indexing Fire-and-Forget
        const [bingResult, indexNowResult, googleResult] = await Promise.allSettled([
            submitToBing(allUrls),
            submitToIndexNow(allUrls),
            pingGoogle()
        ]);

        return NextResponse.json({
            success: true,
            submittedUrls: allUrls.length,
            results: {
                bing: bingResult.status === 'fulfilled' ? bingResult.value : bingResult.reason.message,
                indexNow: indexNowResult.status === 'fulfilled' ? indexNowResult.value : indexNowResult.reason.message,
                google: googleResult.status === 'fulfilled' ? googleResult.value : googleResult.reason.message
            }
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
