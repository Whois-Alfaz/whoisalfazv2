const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2026-05-13',
});

async function migrateImages() {
  console.log('Fetching all posts...');
  // Fetch posts that have a string image or missing image
  const posts = await client.fetch('*[_type == "post"] { _id, title, image }');
  
  console.log(`Found ${posts.length} posts. Checking for local images to upload...`);

  for (const post of posts) {
    if (typeof post.image === 'string' && post.image.startsWith('/images/')) {
      // Decode URI component in case there are spaces (e.g. %20) in the URL string
      const decodedImagePath = decodeURIComponent(post.image);
      const localFilePath = path.join(__dirname, '../public', decodedImagePath);
      
      if (fs.existsSync(localFilePath)) {
        console.log(`Uploading image for post "${post.title}": ${decodedImagePath}`);
        try {
          // Upload the file to Sanity's Asset CDN
          const imageAsset = await client.assets.upload('image', fs.createReadStream(localFilePath), {
            filename: path.basename(localFilePath)
          });
          
          // Patch the document to replace the string with a Sanity Image object reference
          await client
            .patch(post._id)
            .set({
              image: {
                _type: 'image',
                asset: {
                  _type: 'reference',
                  _ref: imageAsset._id
                }
              }
            })
            .commit();
            
          console.log(`✅ Successfully updated image for "${post.title}"`);
        } catch (error) {
          console.error(`❌ Failed to upload image for "${post.title}":`, error.message);
        }
      } else {
        console.warn(`⚠️ Local file not found for "${post.title}": ${localFilePath}`);
      }
    } else {
      console.log(`⏭️ Skipping "${post.title}" - image is already migrated or empty.`);
    }
  }
  
  console.log('Migration complete!');
}

migrateImages();
