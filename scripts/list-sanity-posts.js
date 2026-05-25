const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-05-13',
  useCdn: false,
});

async function main() {
  const query = `*[_type == "post"] { title, slug }`;
  const posts = await client.fetch(query);
  console.log('--- POSTS ---');
  posts.forEach(p => {
    console.log(`- ${p.title} -> ${p.slug?.current}`);
  });

  const catQuery = `*[_type == "category"] { name, slug }`;
  const cats = await client.fetch(catQuery);
  console.log('--- CATEGORIES ---');
  cats.forEach(c => {
    console.log(`- ${c.name} -> ${c.slug?.current}`);
  });
}

main().catch(console.error);
