const fs = require('fs');
const path = require('path');

const bodyPath = path.resolve(__dirname, './draft-cold-email-machine-body.md');
const imagesMetaPath = path.resolve(__dirname, '../uploaded_images.json');
const outputPath = path.resolve(__dirname, '../draft-cold-email-machine.json');

function buildJson() {
  try {
    console.log('Compiling Sanity JSON for Cold Email Machine...');

    if (!fs.existsSync(bodyPath)) throw new Error(`Body markdown file not found: ${bodyPath}`);
    let bodyContent = fs.readFileSync(bodyPath, 'utf-8');

    let featuredAssetId = '';
    let featuredUrl = '';
    let body1Url = '';
    let body2Url = '';

    if (fs.existsSync(imagesMetaPath)) {
      const imagesMeta = JSON.parse(fs.readFileSync(imagesMetaPath, 'utf-8'));
      if (imagesMeta.cold_email_machine_featured) {
        featuredAssetId = imagesMeta.cold_email_machine_featured._id;
        featuredUrl = imagesMeta.cold_email_machine_featured.url;
      }
      if (imagesMeta.cold_email_machine_body1) body1Url = imagesMeta.cold_email_machine_body1.url;
      if (imagesMeta.cold_email_machine_body2) body2Url = imagesMeta.cold_email_machine_body2.url;
    }

    if (body1Url) {
      bodyContent = bodyContent.split('cold_email_machine_body1.webp').join(body1Url);
      console.log('✅ Replaced body1 placeholder.');
    }
    if (body2Url) {
      bodyContent = bodyContent.split('cold_email_machine_body2.webp').join(body2Url);
      console.log('✅ Replaced body2 placeholder.');
    }

    if (!featuredAssetId) {
      console.warn('⚠️ Featured image not found — using fallback.');
      featuredAssetId = 'image-59c4ff9e394d98393488392504c83a0ba5ea498a-1024x1024-webp';
    }

    // Ingest BlogPosting JSON-LD schema
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How to Build an Automated Cold Email Machine with Apollo.io, AiSDR, and Brevo",
      "description": "Build a fully automated cold email system using Apollo.io for prospecting, AiSDR for personalized copy, and Brevo for transactional SMTP delivery at scale.",
      "image": [
        featuredUrl || "https://whoisalfaz.me/images/blog/default.jpg"
      ],
      "datePublished": new Date().toISOString(),
      "dateModified": new Date().toISOString(),
      "author": {
        "@type": "Person",
        "name": "Alfaz Mahmud Rizve",
        "url": "https://whoisalfaz.me/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "whoisalfaz.me",
        "logo": {
          "@type": "ImageObject",
          "url": "https://whoisalfaz.me/icon.png"
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://whoisalfaz.me/blog/cold-email-machine-apollo-aisdr-brevo/"
      }
    };

    const postJson = {
      _id: 'cold-email-machine-apollo-aisdr-brevo',
      _type: 'post',
      title: "How to Build an Automated Cold Email Machine with Apollo.io, AiSDR, and Brevo",
      slug: { _type: 'slug', current: 'cold-email-machine-apollo-aisdr-brevo' },
      description: "Build a fully automated cold email system using Apollo.io for prospecting, AiSDR for personalized copy, and Brevo for transactional SMTP delivery at scale.",
      date: new Date().toISOString(),
      seoTitle: "How to Build an Automated Cold Email Machine with Apollo.io, AiSDR, and Brevo",
      seoDescription: "Build a fully automated cold email system using Apollo.io for prospecting, AiSDR for personalized copy, and Brevo for transactional SMTP delivery at scale.",
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: featuredAssetId }
      },
      categories: [
        { _type: 'reference', _ref: 'Al3E26R37amzsHAqPF1yCU' }, // Automation Tools / Case Studies
        { _type: 'reference', _ref: 'pJmrsKLAWC800vFHegUEU1' }  // Architecture Teardowns / RevOps
      ],
      affiliates: ['apollo', 'aisdr', 'brevo', 'n8n'],
      body: bodyContent,
      schemaMarkup: JSON.stringify(blogSchema)
    };

    fs.writeFileSync(outputPath, JSON.stringify(postJson, null, 2), 'utf-8');
    console.log(`✅ Generated Sanity JSON at ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed to compile JSON:', error.message);
  }
}

buildJson();
