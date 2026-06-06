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

// Paths
const caseStudyPath = 'e:/Ai Agents/whoisalfaz.me/Web Projects/antigravity/urban cafe/CASE_STUDY.md';
const imagesMetaPath = path.resolve(__dirname, '../uploaded_images.json');
const slug = 'case-study-urban-cafe-foodtech-platform';
const categoryId = 'pJmrsKLAWC800vFHegUEU1'; // Architecture Teardowns

async function main() {
  try {
    if (!fs.existsSync(caseStudyPath)) {
      throw new Error(`CASE_STUDY.md not found at ${caseStudyPath}`);
    }

    console.log('Reading CASE_STUDY.md...');
    const fileContent = fs.readFileSync(caseStudyPath, 'utf-8');

    // Parse Frontmatter and Body
    const match = fileContent.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    if (!match) {
      throw new Error('Invalid frontmatter format in CASE_STUDY.md');
    }

    const frontmatterStr = match[1];
    const body = match[2].trim();

    const frontmatter = {};
    frontmatterStr.split('\n').forEach(line => {
      const colIndex = line.indexOf(':');
      if (colIndex !== -1) {
        const key = line.substring(0, colIndex).trim();
        let val = line.substring(colIndex + 1).trim();
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        frontmatter[key] = val;
      }
    });

    console.log('Parsed Frontmatter:', frontmatter);

    // Fetch the uploaded featured image ID from metadata
    let featuredAssetId = '';
    if (fs.existsSync(imagesMetaPath)) {
      const imagesMeta = JSON.parse(fs.readFileSync(imagesMetaPath, 'utf-8'));
      if (imagesMeta.case_study_urban_cafe_featured) {
        featuredAssetId = imagesMeta.case_study_urban_cafe_featured._id;
        console.log(`Found uploaded featured image asset ID: ${featuredAssetId}`);
      }
    }

    if (!featuredAssetId) {
      console.warn('⚠️  Uploaded featured image not found in metadata — checking current post...');
      const existing = await client.fetch(
        `*[_type == "post" && slug.current == $slug][0] { image }`,
        { slug }
      );
      if (existing && existing.image && existing.image.asset) {
        featuredAssetId = existing.image.asset._ref;
        console.log(`Using existing Sanity image asset ID: ${featuredAssetId}`);
      } else {
        throw new Error('No cover image reference found.');
      }
    }

    // Prepare updated post document
    const updatedPost = {
      _id: 'Al3E26R37amzsHAqPF24Uo', // The Sanity document ID for Urban Cafe post
      _type: 'post',
      title: frontmatter.title,
      slug: { _type: 'slug', current: slug },
      seoTitle: frontmatter.seoTitle,
      seoDescription: frontmatter.seoDescription,
      description: frontmatter.description,
      body: body,
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: featuredAssetId,
        }
      },
      categories: [
        {
          _type: 'reference',
          _ref: categoryId,
        }
      ],
      date: frontmatter.datePublished || new Date().toISOString(),
    };

    console.log(`Updating post "${updatedPost.title}" in Sanity...`);
    const result = await client.createOrReplace(updatedPost);
    console.log('✅ Successfully updated live post in Sanity:', result._id);

  } catch (error) {
    console.error('❌ Failed to publish case study:', error);
    process.exit(1);
  }
}

main();
