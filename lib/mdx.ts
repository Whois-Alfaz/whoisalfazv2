import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'blog');

export interface PostMeta {
    title: string;
    slug: string;
    description: string;
    date: string;
    image?: string;
    categories?: string[];
    seoTitle?: string;
    seoDescription?: string;
}

export interface Post extends PostMeta {
    content: string;
}

/**
 * Helper to recursively get all files in a directory.
 */
function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
    const files = fs.readdirSync(dirPath);

    files.forEach(function (file) {
        const fullPath = path.join(dirPath, file);
        if (fs.statSync(fullPath).isDirectory()) {
            arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    });

    return arrayOfFiles;
}

/**
 * Get a single post by its slug.
 * Returns frontmatter metadata + raw MDX content string.
 */
export function getPostBySlug(slug: string): Post | null {
    const allFiles = getAllFiles(CONTENT_DIR).filter(f => f.endsWith('.mdx'));

    // Find file that has the matching slug in its frontmatter
    for (const filePath of allFiles) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(raw);
        const fileSlug = data.slug || path.basename(filePath).replace(/\.mdx$/, '');

        if (fileSlug === slug) {
            return {
                title: data.title || 'Untitled',
                slug: fileSlug,
                description: data.description || '',
                date: data.date || '',
                image: data.image || '',
                categories: data.categories || [],
                seoTitle: data.seoTitle || data.title || '',
                seoDescription: data.seoDescription || data.description || '',
                content,
            };
        }
    }

    return null;
}

/**
 * Get all posts, sorted by date descending.
 * Returns only metadata (no content body) for listing pages.
 */
export function getAllPosts(): PostMeta[] {
    if (!fs.existsSync(CONTENT_DIR)) {
        return [];
    }

    const files = getAllFiles(CONTENT_DIR).filter(f => f.endsWith('.mdx'));

    const posts: PostMeta[] = files.map(file => {
        const slug = path.basename(file).replace(/\.mdx$/, '');
        const raw = fs.readFileSync(file, 'utf-8');
        const { data } = matter(raw);

        return {
            title: data.title || 'Untitled',
            slug: data.slug || slug,
            description: data.description || '',
            date: data.date || '',
            image: data.image || '',
            categories: data.categories || [],
            seoTitle: data.seoTitle || '',
            seoDescription: data.seoDescription || '',
        };
    });

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

/**
 * Get all unique categories across all posts.
 * Returns array of { name, slug, count }.
 */
export function getAllCategories(): { name: string; slug: string; count: number }[] {
    const posts = getAllPosts();
    const categoryMap = new Map<string, number>();

    for (const post of posts) {
        for (const cat of post.categories || []) {
            categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
        }
    }

    return Array.from(categoryMap.entries()).map(([name, count]) => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        count,
    }));
}

/**
 * Get all posts belonging to a specific category.
 */
export function getPostsByCategory(categorySlug: string): { posts: PostMeta[]; category: { name: string; slug: string } | null } {
    const allPosts = getAllPosts();
    const categories = getAllCategories();

    const matchedCategory = categories.find(c => c.slug === categorySlug) || null;

    if (!matchedCategory) {
        return { posts: [], category: null };
    }

    const posts = allPosts.filter(post =>
        (post.categories || []).some(cat =>
            cat.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') === categorySlug
        )
    );

    return { posts, category: matchedCategory };
}

/**
 * Get sitemap data for all posts.
 */
export function getSitemapData(): { posts: { slug: string; date: string }[] } {
    const posts = getAllPosts();
    return {
        posts: posts.map(p => ({ slug: p.slug, date: p.date })),
    };
}
