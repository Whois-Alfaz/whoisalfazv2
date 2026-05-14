const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
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

const contentDir = path.resolve(__dirname, '../content/blog');

// Helper to recursively find all .mdx files
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else if (file.endsWith('.mdx') || file.endsWith('.md')) {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
}

async function migrateMdx() {
  console.log('Starting MDX to Sanity migration...');
  const files = getAllFiles(contentDir, []);
  console.log(`Found ${files.length} MDX files to migrate.`);

  // First, we need to create categories if they don't exist
  const categoryCache = {};

  for (const file of files) {
    const rawContent = fs.readFileSync(file, 'utf-8');
    const { data: frontmatter, content } = matter(rawContent);

    console.log(`Processing: ${frontmatter.title || file}`);

    // Process categories
    const categoryRefs = [];
    if (frontmatter.categories && Array.isArray(frontmatter.categories)) {
      for (const catName of frontmatter.categories) {
        if (!categoryCache[catName]) {
          // Check if category exists or create it
          const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          const existingCat = await client.fetch(`*[_type == "category" && slug.current == $slug][0]`, { slug });
          
          if (existingCat) {
            categoryCache[catName] = existingCat._id;
          } else {
            console.log(`Creating category: ${catName}`);
            const newCat = await client.create({
              _type: 'category',
              name: catName,
              slug: { _type: 'slug', current: slug }
            });
            categoryCache[catName] = newCat._id;
          }
        }
        
        categoryRefs.push({
          _type: 'reference',
          _ref: categoryCache[catName]
        });
      }
    }

    // Build the post document
    const postDoc = {
      _type: 'post',
      title: frontmatter.title,
      slug: { _type: 'slug', current: frontmatter.slug || path.basename(file, '.mdx') },
      description: frontmatter.description || '',
      date: frontmatter.date ? new Date(frontmatter.date).toISOString() : new Date().toISOString(),
      seoTitle: frontmatter.seoTitle || frontmatter.title,
      seoDescription: frontmatter.seoDescription || frontmatter.description || '',
      image: frontmatter.image || '',
      categories: categoryRefs,
      affiliates: frontmatter.affiliates || [],
      body: content, // Stored as markdown string since we use sanity-plugin-markdown
    };

    try {
      // Check if post already exists to avoid duplicates
      const existingPost = await client.fetch(`*[_type == "post" && slug.current == $slug][0]`, { slug: postDoc.slug.current });
      if (existingPost) {
        console.log(`Updating existing post: ${postDoc.title}`);
        await client.patch(existingPost._id).set(postDoc).commit();
      } else {
        console.log(`Creating new post: ${postDoc.title}`);
        await client.create(postDoc);
      }
    } catch (error) {
      console.error(`❌ Error migrating post ${postDoc.title}:`, error.message);
    }
  }

  console.log('Migration complete! 🎉');
}

migrateMdx().catch(console.error);
