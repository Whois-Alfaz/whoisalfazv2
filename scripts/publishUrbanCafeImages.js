const { createClient } = require('@sanity/client');
const fs = require('fs');
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

const tmpDir = path.resolve(__dirname, '../tmp_images');
const publicDir = path.resolve(__dirname, '../public/images/blog');
const metaPath = path.resolve(__dirname, '../uploaded_images.json');

async function uploadImage(srcFile, destName) {
  const filePath = path.join(tmpDir, srcFile);
  if (!fs.existsSync(filePath)) {
    throw new Error(`WebP source not found: ${filePath}`);
  }

  console.log(`Uploading ${srcFile} to Sanity as ${destName}...`);
  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: destName,
    contentType: 'image/webp',
  });
  console.log(`✅ Uploaded to Sanity. Asset ID: ${asset._id}, URL: ${asset.url}`);

  // Also copy to public directory for fallback/local loading
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const localDestPath = path.join(publicDir, destName);
  fs.copyFileSync(filePath, localDestPath);
  console.log(`✅ Copied locally to public folder: ${localDestPath}`);

  return { _id: asset._id, url: asset.url };
}

async function main() {
  try {
    const featured = await uploadImage('featured.webp', 'case-study-urban-cafe-foodtech-platform-featured.webp');
    const body1 = await uploadImage('body1.webp', 'case-study-urban-cafe-foodtech-platform-body1.webp');
    const body2 = await uploadImage('body2.webp', 'case-study-urban-cafe-foodtech-platform-body2.webp');

    let meta = {};
    if (fs.existsSync(metaPath)) {
      try {
        meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
      } catch (e) {}
    }

    meta.case_study_urban_cafe_featured = featured;
    meta.case_study_urban_cafe_body1 = body1;
    meta.case_study_urban_cafe_body2 = body2;

    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
    console.log('💾 Successfully saved image metadata to uploaded_images.json!');
  } catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
  }
}

main();
