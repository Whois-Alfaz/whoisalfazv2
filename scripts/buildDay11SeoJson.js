const fs = require('fs');
const path = require('path');

const bodyPath = path.resolve(__dirname, './draft-competitor-seo-audit-body.md');
const imagesMetaPath = path.resolve(__dirname, '../uploaded_images.json');
const outputPath = path.resolve(__dirname, '../draft-competitor-seo-audit.json');

function buildJson() {
  try {
    console.log('Compiling Sanity JSON for SEO Article 1...');

    if (!fs.existsSync(bodyPath)) throw new Error(`Body markdown file not found: ${bodyPath}`);
    let bodyContent = fs.readFileSync(bodyPath, 'utf-8');

    let featuredAssetId = '';
    let featuredUrl = '';
    let body1Url = '';
    let body2Url = '';

    if (fs.existsSync(imagesMetaPath)) {
      const imagesMeta = JSON.parse(fs.readFileSync(imagesMetaPath, 'utf-8'));
      if (imagesMeta.competitor_seo_audit_featured) {
        featuredAssetId = imagesMeta.competitor_seo_audit_featured._id;
        featuredUrl = imagesMeta.competitor_seo_audit_featured.url;
      }
      if (imagesMeta.competitor_seo_audit_body1) body1Url = imagesMeta.competitor_seo_audit_body1.url;
      if (imagesMeta.competitor_seo_audit_body2) body2Url = imagesMeta.competitor_seo_audit_body2.url;
    }

    if (featuredUrl) {
      bodyContent = bodyContent.split('competitor_seo_audit_featured.webp').join(featuredUrl);
      console.log('✅ Replaced featured placeholder.');
    }
    if (body1Url) {
      bodyContent = bodyContent.split('competitor_seo_audit_body1.webp').join(body1Url);
      console.log('✅ Replaced body1 placeholder.');
    }
    if (body2Url) {
      bodyContent = bodyContent.split('competitor_seo_audit_body2.webp').join(body2Url);
      console.log('✅ Replaced body2 placeholder.');
    }

    if (!featuredAssetId) {
      console.warn('⚠️ Featured image not found — using fallback.');
      featuredAssetId = 'image-6ec565e97da4f36e1d1539052783e5044dd61637-1280x720-webp';
    }

    // Ingest BlogPosting JSON-LD schema
    const blogSchema = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": "How to Audit Your Competitors' Technical SEO (Without DNS Verification)",
      "description": "Learn how to perform a competitor SEO audit anonymously using public web standards. Check PageSpeed metrics, TLS certificates, sitemaps, and HTTP security headers without domain verification.",
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
        "@id": "https://whoisalfaz.me/blog/how-to-audit-competitor-seo-no-verification/"
      }
    };

    const postJson = {
      _id: 'how-to-audit-competitor-seo-no-verification',
      _type: 'post',
      title: "How to Audit Your Competitors' Technical SEO (Without DNS Verification)",
      slug: { _type: 'slug', current: 'how-to-audit-competitor-seo-no-verification' },
      description: "Learn how to audit competitor SEO parameters anonymously. Step-by-step guide to crawling Core Web Vitals, metadata, SSL, security headers, and robots/sitemaps.",
      date: new Date().toISOString(),
      seoTitle: "How to Audit Your Competitors' Technical SEO (No Verification)",
      seoDescription: "Audit competitor website SEO parameters anonymously. Scan PageSpeed metrics, TLS certificates, HTTP security headers, and robots/sitemap directive crawl gaps.",
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: featuredAssetId }
      },
      categories: [
        { _type: 'reference', _ref: 'h5g7gmeO9wOK6amcKFpnOQ' } // SEO & Optimization
      ],
      affiliates: ['n8n'],
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
