/**
 * WordPress Content Extraction Script
 * 
 * Pulls all posts from the WordPress GraphQL API, converts content to Markdown,
 * downloads images, and generates .mdx files with proper frontmatter.
 * 
 * Usage: node scripts/extract-wp-content.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const WP_GRAPHQL_URL = 'https://v1.whoisalfaz.me/graphql';
const CONTENT_DIR = path.join(ROOT, 'content', 'blog');
const IMAGES_DIR = path.join(ROOT, 'public', 'images', 'blog');

// ─── Turndown-like HTML→Markdown converter (zero-dep) ────────────────────────
function htmlToMarkdown(html) {
    if (!html) return '';

    let md = html;

    // Remove WordPress-specific blocks/comments
    md = md.replace(/<!--[\s\S]*?-->/g, '');

    // Convert headings
    md = md.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n');
    md = md.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n');
    md = md.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n');
    md = md.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, '\n#### $1\n');
    md = md.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, '\n##### $1\n');
    md = md.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, '\n###### $1\n');

    // Convert bold and italic
    md = md.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
    md = md.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
    md = md.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
    md = md.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');

    // Convert links
    md = md.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi, '[$2]($1)');

    // Convert images
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*\/?>/gi, '![$2]($1)');
    md = md.replace(/<img[^>]*src="([^"]*)"[^>]*\/?>/gi, '![]($1)');

    // Convert figure/figcaption
    md = md.replace(/<figure[^>]*>([\s\S]*?)<\/figure>/gi, '$1');
    md = md.replace(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/gi, '*$1*\n');

    // Convert lists
    md = md.replace(/<ul[^>]*>([\s\S]*?)<\/ul>/gi, (match, content) => {
        return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n');
    });
    md = md.replace(/<ol[^>]*>([\s\S]*?)<\/ol>/gi, (match, content) => {
        let i = 1;
        return content.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, () => `${i++}. $1\n`);
    });

    // Convert blockquotes
    md = md.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (match, content) => {
        return content.split('\n').map(line => `> ${line}`).join('\n') + '\n';
    });

    // Convert code blocks
    md = md.replace(/<pre[^>]*><code[^>]*class="language-([^"]*)"[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```$1\n$2\n```\n');
    md = md.replace(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi, '\n```\n$1\n```\n');
    md = md.replace(/<pre[^>]*>([\s\S]*?)<\/pre>/gi, '\n```\n$1\n```\n');

    // Convert inline code
    md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

    // Convert paragraphs
    md = md.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n');

    // Convert line breaks
    md = md.replace(/<br\s*\/?>/gi, '\n');

    // Convert horizontal rules
    md = md.replace(/<hr\s*\/?>/gi, '\n---\n');

    // Remove remaining HTML tags
    md = md.replace(/<div[^>]*>/gi, '');
    md = md.replace(/<\/div>/gi, '');
    md = md.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, '$1');

    // Decode HTML entities
    md = md.replace(/&amp;/g, '&');
    md = md.replace(/&lt;/g, '<');
    md = md.replace(/&gt;/g, '>');
    md = md.replace(/&quot;/g, '"');
    md = md.replace(/&#039;/g, "'");
    md = md.replace(/&nbsp;/g, ' ');
    md = md.replace(/&#8211;/g, '–');
    md = md.replace(/&#8212;/g, '—');
    md = md.replace(/&#8216;/g, "'");
    md = md.replace(/&#8217;/g, "'");
    md = md.replace(/&#8220;/g, '"');
    md = md.replace(/&#8221;/g, '"');
    md = md.replace(/&#8230;/g, '...');

    // Clean up excessive whitespace
    md = md.replace(/\n{3,}/g, '\n\n');
    md = md.trim();

    return md;
}

// ─── Image Downloader ─────────────────────────────────────────────────────────
function downloadFile(url, dest) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(dest);

        protocol.get(url, (response) => {
            // Handle redirects
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                file.close();
                fs.unlinkSync(dest);
                return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
            }

            if (response.statusCode !== 200) {
                file.close();
                fs.unlinkSync(dest);
                return reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close(resolve);
            });
        }).on('error', (err) => {
            file.close();
            if (fs.existsSync(dest)) fs.unlinkSync(dest);
            reject(err);
        });
    });
}

// ─── WordPress GraphQL Fetcher ────────────────────────────────────────────────
async function fetchAllPosts() {
    console.log('📡 Fetching all posts from WordPress GraphQL API...');

    const query = `
    query AllPostsForExtraction {
      posts(first: 100, where: { orderby: { field: DATE, order: DESC } }) {
        nodes {
          slug
          title
          content
          excerpt
          date
          categories {
            nodes {
              name
              slug
            }
          }
          featuredImage {
            node {
              sourceUrl
            }
          }
          seo {
            title
            description
            canonicalUrl
          }
        }
      }
    }
  `;

    const res = await fetch(WP_GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
    });

    if (!res.ok) {
        throw new Error(`GraphQL API returned status ${res.status}`);
    }

    const json = await res.json();
    if (json.errors) {
        console.error('GraphQL Errors:', json.errors);
        throw new Error('GraphQL query failed');
    }

    return json.data.posts.nodes;
}

// ─── Image Path Extraction & Rewriting ────────────────────────────────────────
function extractAndRewriteImages(markdown, slug) {
    const imageUrls = [];
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = imageRegex.exec(markdown)) !== null) {
        const url = match[2];
        if (url.startsWith('http')) {
            imageUrls.push(url);
        }
    }

    // Rewrite image paths
    let rewritten = markdown;
    for (const url of imageUrls) {
        const urlObj = new URL(url);
        const ext = path.extname(urlObj.pathname) || '.jpg';
        const baseName = path.basename(urlObj.pathname, ext);
        const safeFileName = `${slug}-${baseName}${ext}`.replace(/[^a-zA-Z0-9._-]/g, '-');
        const newPath = `/images/blog/${safeFileName}`;

        rewritten = rewritten.replaceAll(url, newPath);
        imageUrls[imageUrls.indexOf(url)] = { original: url, fileName: safeFileName, localPath: newPath };
    }

    return { markdown: rewritten, images: imageUrls.filter(img => typeof img === 'object') };
}

// ─── Frontmatter Generator ───────────────────────────────────────────────────
function generateFrontmatter(post) {
    const title = post.title?.replace(/"/g, '\\"') || 'Untitled';
    const description = (post.seo?.description || post.excerpt?.replace(/<[^>]*>/g, '').trim() || '').replace(/"/g, '\\"').slice(0, 300);
    const seoTitle = (post.seo?.title || post.title || '').replace(/"/g, '\\"');
    const date = post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    const featuredImage = post.featuredImage?.node?.sourceUrl || '';
    const categories = post.categories?.nodes?.map(c => c.name) || [];

    let fm = `---\n`;
    fm += `title: "${title}"\n`;
    fm += `slug: "${post.slug}"\n`;
    fm += `description: "${description}"\n`;
    fm += `date: "${date}"\n`;
    fm += `seoTitle: "${seoTitle}"\n`;
    fm += `seoDescription: "${description}"\n`;
    if (featuredImage) {
        fm += `image: "${featuredImage}"\n`;
    }
    if (categories.length > 0) {
        fm += `categories: [${categories.map(c => `"${c}"`).join(', ')}]\n`;
    }
    fm += `---\n\n`;

    return fm;
}

// ─── Main Extraction Pipeline ─────────────────────────────────────────────────
async function main() {
    console.log('🚀 WordPress Content Extraction Script\n');

    // Create directories
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
    fs.mkdirSync(IMAGES_DIR, { recursive: true });

    // Fetch all posts
    const posts = await fetchAllPosts();
    console.log(`✅ Found ${posts.length} posts\n`);

    let totalImages = 0;
    let failedImages = 0;

    for (const post of posts) {
        console.log(`📝 Processing: ${post.slug}`);

        // 1. Convert HTML content to Markdown
        let markdown = htmlToMarkdown(post.content || '');

        // 2. Extract and rewrite image paths
        const { markdown: rewrittenMd, images } = extractAndRewriteImages(markdown, post.slug);
        markdown = rewrittenMd;

        // 3. Download featured image
        if (post.featuredImage?.node?.sourceUrl) {
            const featUrl = post.featuredImage.node.sourceUrl;
            const ext = path.extname(new URL(featUrl).pathname) || '.jpg';
            const featFileName = `${post.slug}-featured${ext}`;
            const featLocalPath = path.join(IMAGES_DIR, featFileName);

            try {
                if (!fs.existsSync(featLocalPath)) {
                    await downloadFile(featUrl, featLocalPath);
                    console.log(`   📸 Downloaded featured image: ${featFileName}`);
                }
                // Update frontmatter image path
                post.featuredImage.node.sourceUrl = `/images/blog/${featFileName}`;
                totalImages++;
            } catch (err) {
                console.warn(`   ⚠️  Failed to download featured image: ${err.message}`);
                failedImages++;
            }
        }

        // 4. Download content images
        for (const img of images) {
            const imgDest = path.join(IMAGES_DIR, img.fileName);
            try {
                if (!fs.existsSync(imgDest)) {
                    await downloadFile(img.original, imgDest);
                    console.log(`   📸 Downloaded: ${img.fileName}`);
                }
                totalImages++;
            } catch (err) {
                console.warn(`   ⚠️  Failed to download ${img.fileName}: ${err.message}`);
                failedImages++;
            }
        }

        // 5. Generate frontmatter and write .mdx file
        const frontmatter = generateFrontmatter(post);
        const mdxContent = frontmatter + markdown;
        const filePath = path.join(CONTENT_DIR, `${post.slug}.mdx`);

        fs.writeFileSync(filePath, mdxContent, 'utf-8');
        console.log(`   ✅ Written: content/blog/${post.slug}.mdx`);
    }

    console.log(`\n${'═'.repeat(60)}`);
    console.log(`🎉 EXTRACTION COMPLETE`);
    console.log(`${'═'.repeat(60)}`);
    console.log(`   Posts extracted: ${posts.length}`);
    console.log(`   Images downloaded: ${totalImages}`);
    console.log(`   Failed images: ${failedImages}`);
    console.log(`   Output directory: ${CONTENT_DIR}`);
    console.log(`   Images directory: ${IMAGES_DIR}`);
}

main().catch(err => {
    console.error('❌ Extraction failed:', err);
    process.exit(1);
});
