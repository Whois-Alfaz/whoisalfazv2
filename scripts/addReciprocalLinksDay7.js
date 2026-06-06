/**
 * addReciprocalLinksDay7.js
 * Patches two existing Sanity posts to add inbound links pointing to the Day 7 RevOps definition post.
 * Posts patched:
 *   1. revops-automation-stack-saas-2026  (Day 2)
 *   2. services page is static, so only Sanity posts are patched here
 */

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

// Sentence to inject at the END of each post's body (before the final CTA paragraph)
const LINK_SENTENCE_STACK = `\n\n> For the foundational technical definition of what RevOps is and how it's structured at each ARR stage, read our [complete RevOps technical definition guide](/blog/what-is-revops-technical-definition-saas/) before diving into the stack architecture above.`;

const LINK_SENTENCE_APOLLO = `\n\n> New to RevOps and unsure how all these tools fit together? Start with our [technical RevOps definition guide](/blog/what-is-revops-technical-definition-saas/) — it explains the full architecture before you build the outbound pipeline.`;

async function patchPost(id, linkSentence, label) {
  try {
    console.log(`\nFetching: ${id}...`);
    const post = await client.fetch(`*[_id == $id][0]{ _id, body }`, { id });

    if (!post) {
      console.error(`❌ Post not found: ${id}`);
      return;
    }

    // Check if link already exists to avoid duplicates
    if (post.body && post.body.includes('what-is-revops-technical-definition-saas')) {
      console.log(`⏭️  Skipped ${label} — link already present.`);
      return;
    }

    const updatedBody = (post.body || '') + linkSentence;

    await client.patch(id).set({ body: updatedBody }).commit();
    console.log(`✅ Patched ${label} with inbound link to Day 7 post.`);
  } catch (err) {
    console.error(`❌ Failed to patch ${label}:`, err.message);
  }
}

async function run() {
  await patchPost(
    'revops-automation-stack-saas-2026',
    LINK_SENTENCE_STACK,
    'Day 2 — RevOps Automation Stack'
  );

  await patchPost(
    'apollo-brevo-n8n-outbound-pipeline',
    LINK_SENTENCE_APOLLO,
    'Day 6 — Apollo→Brevo Pipeline'
  );

  console.log('\n✅ All inbound links added.');
}

run();
