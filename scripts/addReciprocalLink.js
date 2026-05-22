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

async function addReciprocalLink() {
  try {
    console.log('Fetching post "manychat-pricing-2026" from Sanity...');
    const post = await client.fetch('*[_type == "post" && slug.current == "manychat-pricing-2026"][0]');
    if (!post) {
      console.error('Post "manychat-pricing-2026" not found!');
      return;
    }
    
    let body = post.body || '';
    
    // Check if the link already exists
    if (body.includes('/blog/manychat-to-n8n-integration-lead-scoring/')) {
      console.log('Reciprocal link already exists in the post!');
      return;
    }
    
    // Let's add a new section before the final call to action or at the very end
    const ctaPattern = '## <mark>The Verdict';
    let updatedBody = '';
    
    const insertion = `
## <mark>Next Steps: Build Your Lead Scoring Pipeline</mark>

Now that you understand the 2026 pricing model, the next step is connecting your capture layer to your wider RevOps engine. 

Instead of letting leads sit unsegmented, check out my complete technical guide: **[ManyChat to n8n Integration: The Complete Lead Scoring Pipeline (2025)](/blog/manychat-to-n8n-integration-lead-scoring/)**. You'll learn how to build a production-grade webhook connection, score leads using JavaScript and AI, and automatically sync qualified data to Brevo—all while staying well within ManyChat's new limits.

<br>
`;

    if (body.includes(ctaPattern)) {
      console.log('Found "The Verdict" heading. Inserting reciprocal link section right before it...');
      const parts = body.split(ctaPattern);
      updatedBody = parts[0] + insertion + ctaPattern + parts[1];
    } else {
      console.log('Could not find "The Verdict" heading. Appending to the end of the post...');
      updatedBody = body + '\n\n' + insertion;
    }
    
    console.log('Patching post "manychat-pricing-2026" in Sanity...');
    await client
      .patch(post._id)
      .set({ body: updatedBody })
      .commit();
      
    console.log('✅ Successfully added reciprocal internal link to previous ManyChat post!');
  } catch (error) {
    console.error('❌ Failed to add reciprocal link:', error);
  }
}

addReciprocalLink();
