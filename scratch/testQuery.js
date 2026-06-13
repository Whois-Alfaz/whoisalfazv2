const { createClient } = require('@sanity/client');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  apiVersion: '2026-05-13',
});

async function run() {
  const slug = 'elevenlabs-n8n-voice-ai-sales-agent';
  const query = `*[_type == "post" && slug.current == $slug][0] {
    title,
    slug,
    description,
    date,
    seoTitle,
    seoDescription,
    "image": image.asset->url,
    affiliates,
    "categories": categories[]->name,
    body
  }`;

  try {
    const post = await client.fetch(query, { slug });
    console.log('--- QUERY RESULT ---');
    console.log(JSON.stringify(post, null, 2));
  } catch (err) {
    console.error('Query failed:', err);
  }
}

run();
