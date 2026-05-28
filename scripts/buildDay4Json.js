const fs = require('fs');
const path = require('path');

const bodyPath = path.resolve(__dirname, './draft-manychat-n8n-body.md');
const imagesMetaPath = path.resolve(__dirname, '../uploaded_images.json');
const outputPath = path.resolve(__dirname, '../draft-manychat-n8n.json');

function buildJson() {
  try {
    console.log('Compiling Sanity JSON for Day 4 blog post...');
    
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
      
      if (imagesMeta.manychat_n8n_featured) {
        featuredAssetId = imagesMeta.manychat_n8n_featured._id;
        featuredUrl = imagesMeta.manychat_n8n_featured.url;
      }
      if (imagesMeta.manychat_n8n_body1) {
        body1Url = imagesMeta.manychat_n8n_body1.url;
      }
      if (imagesMeta.manychat_n8n_body2) {
        body2Url = imagesMeta.manychat_n8n_body2.url;
      }
    }
    
    // Replace placeholder image paths in the body text with live CDN URLs
    if (featuredUrl) {
      bodyContent = bodyContent.split('manychat_n8n_featured').join(featuredUrl);
      console.log('✅ Replaced manychat_n8n_featured placeholder with live CDN URL.');
    }
    if (body1Url) {
      bodyContent = bodyContent.split('manychat_n8n_body1').join(body1Url);
      console.log('✅ Replaced manychat_n8n_body1 placeholder with live CDN URL.');
    }
    if (body2Url) {
      bodyContent = bodyContent.split('manychat_n8n_body2').join(body2Url);
      console.log('✅ Replaced manychat_n8n_body2 placeholder with live CDN URL.');
    }
    
    if (!featuredAssetId) {
      console.warn('⚠️ Warning: Featured image asset ID not found in uploaded_images.json. Using fallback.');
      featuredAssetId = 'image-07eb0d7215a8bf36acde7d1f3fba6e7dcfb8e309-1024x1024-webp';
    }
    
    const postJson = {
      _id: 'manychat-n8n-async-timeout-fix',
      _type: 'post',
      title: 'ManyChat + n8n: How to Beat the 10-Second Response Timeout and Build Async Chat Flows',
      slug: {
        _type: 'slug',
        current: 'manychat-n8n-async-timeout-fix'
      },
      description: "Fix ManyChat's 10-second webhook timeout using n8n async queues. Step-by-step tutorial covering decoupled webhooks, n8n queue architectures, and async REST API handoffs.",
      date: new Date().toISOString(),
      seoTitle: 'ManyChat + n8n: Beat the 10-Second Webhook Timeout (Async Guide)',
      seoDescription: "Fix ManyChat's 10-second webhook timeout using n8n async queues. Step-by-step tutorial covering decoupled webhooks, n8n queue architectures, and async REST API handoffs.",
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
        'manychat',
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
