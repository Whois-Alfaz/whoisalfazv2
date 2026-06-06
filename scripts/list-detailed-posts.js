const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-13',
  useCdn: false,
});

async function main() {
  const query = `*[_type == "post"] { 
    title, 
    slug, 
    categories[]->{ name }
  }`;
  const posts = await client.fetch(query);
  console.log('--- POSTS DETAIL ---');
  posts.forEach((p, idx) => {
    const cats = p.categories ? p.categories.map(c => c.name).join(', ') : 'No Category';
    console.log(`${idx + 1}. ${p.title} (${cats}) -> ${p.slug?.current}`);
  });
  console.log('Total posts:', posts.length);

  const catQuery = `*[_type == "category"] { _id, name, slug }`;
  const cats = await client.fetch(catQuery);
  console.log('\n--- CATEGORIES ---');
  cats.forEach((c, idx) => {
    console.log(`${idx + 1}. ${c.name} (${c._id}) -> ${c.slug?.current}`);
  });
  console.log('Total categories:', cats.length);
}

main().catch(console.error);
