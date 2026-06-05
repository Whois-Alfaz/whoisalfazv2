const fs = require('fs');
const path = require('path');

const bodyPath = path.resolve(__dirname, './draft-apollo-brevo-n8n-body.md');
const imagesMetaPath = path.resolve(__dirname, '../uploaded_images.json');
const outputPath = path.resolve(__dirname, '../draft-apollo-brevo-n8n.json');

function buildJson() {
  try {
    console.log('Compiling Sanity JSON for Day 6 blog post...');
    
    if (!fs.existsSync(bodyPath)) {
      throw new Error(`Body markdown file not found: ${bodyPath}`);
    }
    let bodyContent = fs.readFileSync(bodyPath, 'utf-8');
    
    let featuredAssetId = '';
    let featuredUrl = '';
    let body1Url = '';
    let body2Url = '';

    if (fs.existsSync(imagesMetaPath)) {
      const imagesMeta = JSON.parse(fs.readFileSync(imagesMetaPath, 'utf-8'));
      
      if (imagesMeta.apollo_brevo_n8n_featured) {
        featuredAssetId = imagesMeta.apollo_brevo_n8n_featured._id;
        featuredUrl = imagesMeta.apollo_brevo_n8n_featured.url;
      }
      if (imagesMeta.apollo_brevo_n8n_body1) {
        body1Url = imagesMeta.apollo_brevo_n8n_body1.url;
      }
      if (imagesMeta.apollo_brevo_n8n_body2) {
        body2Url = imagesMeta.apollo_brevo_n8n_body2.url;
      }
    }
    
    // Replace placeholder image paths in the body text with live CDN URLs
    if (featuredUrl) {
      bodyContent = bodyContent.split('apollo_brevo_n8n_featured').join(featuredUrl);
      console.log('✅ Replaced apollo_brevo_n8n_featured placeholder with live CDN URL.');
    }
    if (body1Url) {
      bodyContent = bodyContent.split('apollo_brevo_n8n_body1').join(body1Url);
      console.log('✅ Replaced apollo_brevo_n8n_body1 placeholder with live CDN URL.');
    }
    if (body2Url) {
      bodyContent = bodyContent.split('apollo_brevo_n8n_body2').join(body2Url);
      console.log('✅ Replaced apollo_brevo_n8n_body2 placeholder with live CDN URL.');
    }
    
    if (!featuredAssetId) {
      console.warn('⚠️ Warning: Featured image asset ID not found in uploaded_images.json. Using fallback.');
      featuredAssetId = 'image-07eb0d7215a8bf36acde7d1f3fba6e7dcfb8e309-1024x1024-webp';
    }
    
    const postJson = {
      _id: 'apollo-brevo-n8n-outbound-pipeline',
      _type: 'post',
      title: 'How to Sync Apollo.io Leads to Brevo CRM Using n8n: Full Outbound Pipeline Walkthrough',
      slug: {
        _type: 'slug',
        current: 'apollo-brevo-n8n-outbound-pipeline'
      },
      description: "Automate lead sync from Apollo.io to Brevo CRM with n8n. Includes deduplication logic, ICP scoring, sequence triggering, circular sync protection, and SMTP email delivery automation.",
      date: new Date().toISOString(),
      seoTitle: 'Apollo.io to Brevo CRM via n8n: Full Outbound Pipeline Tutorial (2026)',
      seoDescription: "Build a production-grade Apollo.io → n8n → Brevo outbound pipeline with deduplication, ICP scoring, sequence triggering, and circular sync protection. Step-by-step with code.",
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
        }
      ],
      affiliates: [
        'n8n',
        'apollo',
        'brevo'
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
