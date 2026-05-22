const fs = require('fs');
const path = require('path');

const bodyPath = 'C:\\Users\\user\\.gemini\\antigravity\\brain\\405637ef-39a5-48a2-8637-cb7a83c0babc\\draft-manychat-n8n-body.md';
const imagesPath = path.resolve(__dirname, '../uploaded_images.json');
const outputPath = path.resolve(__dirname, '../draft-manychat-n8n.json');

function buildJson() {
  try {
    console.log('Compiling Sanity JSON for the blog post...');
    
    if (!fs.existsSync(bodyPath)) {
      throw new Error(`Body markdown file not found: ${bodyPath}`);
    }
    const bodyContent = fs.readFileSync(bodyPath, 'utf-8');
    
    if (!fs.existsSync(imagesPath)) {
      throw new Error(`Uploaded images metadata not found: ${imagesPath}`);
    }
    const imagesData = JSON.parse(fs.readFileSync(imagesPath, 'utf-8'));
    const featuredAssetId = imagesData.featured?._id;
    
    if (!featuredAssetId) {
      throw new Error('Featured image asset ID not found in uploaded_images.json');
    }
    
    const postJson = {
      _type: 'post',
      title: 'ManyChat to n8n Integration: The Complete Lead Scoring Pipeline (2025)',
      slug: {
        _type: 'slug',
        current: 'manychat-to-n8n-integration-lead-scoring'
      },
      description: 'Learn how to build a production-grade ManyChat to n8n integration using webhooks. Includes AI lead scoring, Brevo CRM sync, and how to beat the 10-second timeout — with real code.',
      date: new Date().toISOString(),
      seoTitle: 'ManyChat to n8n Integration: Automated Lead Scoring Pipeline (2025)',
      seoDescription: 'A complete technical guide to building a ManyChat to n8n integration. Learn webhook architecture, AI lead scoring, Brevo sync, and how to fix the 10-second timeout.',
      image: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: featuredAssetId
        }
      },
      categories: [
        {
          _type: 'reference',
          _ref: 'Al3E26R37amzsHAqPF1yCU' // Automation Tools
        },
        {
          _type: 'reference',
          _ref: 'pJmrsKLAWC800vFHegUEU1' // Architecture Teardowns
        }
      ],
      affiliates: [
        'n8n',
        'brevo',
        'apollo',
        'manychat'
      ],
      body: bodyContent
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(postJson, null, 2), 'utf-8');
    console.log(`✅ Successfully generated Sanity JSON at ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to compile post JSON:', error);
  }
}

buildJson();
