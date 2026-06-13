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

async function main() {
  const categorySlug = 'seo-optimization';
  
  try {
    console.log(`Checking if category '${categorySlug}' exists...`);
    const existing = await client.fetch(
      `*[_type == "category" && slug.current == $slug][0]`,
      { slug: categorySlug }
    );

    if (existing) {
      console.log(`✅ Category already exists! ID: ${existing._id}`);
      console.log(`Name: ${existing.name}`);
      return;
    }

    console.log(`Creating new category 'SEO & Optimization'...`);
    const doc = {
      _type: 'category',
      name: 'SEO & Optimization',
      slug: {
        _type: 'slug',
        current: categorySlug,
      },
      description: 'Technical SEO audits, search engine optimization checklists, security headers guide, and Core Web Vitals optimization techniques.',
    };

    const created = await client.create(doc);
    console.log(`🎉 Category successfully created! ID: ${created._id}`);
  } catch (err) {
    console.error(`❌ Failed to check/create category:`, err.message);
    process.exit(1);
  }
}

main();
