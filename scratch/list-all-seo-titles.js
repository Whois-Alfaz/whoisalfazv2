const { createClient } = require('@sanity/client');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2026-05-13',
});

async function listTitles() {
  try {
    console.log('Querying all posts from Sanity...');
    const posts = await client.fetch('*[_type == "post"] | order(date desc) { slug, title, seoTitle, seoDescription }');
    console.log(`\nFound ${posts.length} posts total:\n`);
    
    posts.forEach((post, i) => {
      const slug = post.slug?.current || 'N/A';
      console.log(`[${i + 1}] SLUG: ${slug}`);
      console.log(`    TITLE: ${post.title}`);
      console.log(`    SEO TITLE: ${post.seoTitle}`);
      console.log(`    SEO DESC: ${post.seoDescription}`);
      console.log('----------------------------------------------------');
    });
  } catch (error) {
    console.error('❌ Error querying posts:', error);
  }
}

listTitles();
