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

async function runUploader() {
  const imagePath = process.argv[2];
  if (!imagePath) {
    console.error('Usage: node uploadImageToSanity.js <path-to-image>');
    process.exit(1);
  }

  const absolutePath = path.resolve(imagePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ Image file not found: ${absolutePath}`);
    process.exit(1);
  }

  try {
    console.log(`Uploading asset to Sanity CDN: ${path.basename(absolutePath)}...`);
    const fileStream = fs.createReadStream(absolutePath);
    
    const asset = await client.assets.upload('image', fileStream, {
      filename: path.basename(absolutePath),
      contentType: 'image/webp', // Defaulting to WebP for maximum page speed performance
    });
    
    console.log('✅ Success! Image uploaded programmatically.');
    console.log(`Asset ID Reference: ${asset._id}`);
    console.log(`Asset URL: ${asset.url}`);
    
    // Save to temp file so other automated scripts can read it
    const tempOutputPath = path.resolve(__dirname, '../uploaded_images.json');
    const imagesMeta = {
      featured: {
        _id: asset._id,
        url: asset.url
      }
    };
    fs.writeFileSync(tempOutputPath, JSON.stringify(imagesMeta, null, 2), 'utf-8');
    console.log(`💾 Image asset meta saved to: ${tempOutputPath}`);
  } catch (error) {
    console.error('❌ Sanity CDN Image Upload Failed:', error.message);
    process.exit(1);
  }
}

runUploader();
