const fs = require('fs');
const path = require('path');

const bodyPath = path.resolve(__dirname, './draft-elevenlabs-n8n-voice-ai-sales-agent-body.md');
const imagesMetaPath = path.resolve(__dirname, '../uploaded_images.json');
const outputPath = path.resolve(__dirname, '../draft-elevenlabs-n8n-voice-ai-sales-agent.json');

function buildJson() {
  try {
    console.log('Compiling Sanity JSON for Day 8 blog post...');

    if (!fs.existsSync(bodyPath)) throw new Error(`Body markdown file not found: ${bodyPath}`);
    let bodyContent = fs.readFileSync(bodyPath, 'utf-8');

    let featuredAssetId = '';
    let featuredUrl = '';
    let body1Url = '';
    let body2Url = '';

    if (fs.existsSync(imagesMetaPath)) {
      const imagesMeta = JSON.parse(fs.readFileSync(imagesMetaPath, 'utf-8'));
      if (imagesMeta.elevenlabs_n8n_featured) {
        featuredAssetId = imagesMeta.elevenlabs_n8n_featured._id;
        featuredUrl = imagesMeta.elevenlabs_n8n_featured.url;
      }
      if (imagesMeta.elevenlabs_n8n_body1) body1Url = imagesMeta.elevenlabs_n8n_body1.url;
      if (imagesMeta.elevenlabs_n8n_body2) body2Url = imagesMeta.elevenlabs_n8n_body2.url;
    }

    if (featuredUrl) { bodyContent = bodyContent.split('elevenlabs_n8n_featured').join(featuredUrl); console.log('✅ Replaced featured placeholder.'); }
    if (body1Url)    { bodyContent = bodyContent.split('elevenlabs_n8n_body1').join(body1Url);    console.log('✅ Replaced body1 placeholder.'); }
    if (body2Url)    { bodyContent = bodyContent.split('elevenlabs_n8n_body2').join(body2Url);    console.log('✅ Replaced body2 placeholder.'); }

    if (!featuredAssetId) {
      console.warn('⚠️  Featured image not found — using fallback.');
      featuredAssetId = 'image-07eb0d7215a8bf36acde7d1f3fba6e7dcfb8e309-1024x1024-webp';
    }

    const postJson = {
      _id: 'elevenlabs-n8n-voice-ai-sales-agent',
      _type: 'post',
      title: 'Building a Voice AI Sales Agent with ElevenLabs and n8n: End-to-End Architecture',
      slug: { _type: 'slug', current: 'elevenlabs-n8n-voice-ai-sales-agent' },
      description: "Build a production voice AI sales agent using ElevenLabs + n8n. Covers STT, LLM routing, TTS synthesis, CRM logging, and fallback error handling.",
      date: new Date().toISOString(),
      seoTitle: 'Voice AI Sales Agent: ElevenLabs & n8n Blueprint (2026)',
      seoDescription: "Build a production-grade voice AI sales agent with ElevenLabs and n8n. Complete architecture guide covering Twilio, HubSpot, calendar booking, and latency.",
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: featuredAssetId }
      },
      categories: [
        { _type: 'reference', _ref: 'Al3E26R37amzsHAqPF1yCU' }, // 30 Days of n8n & Automation
        { _type: 'reference', _ref: 'pJmrsKLAWC800vFHegUEU1' }  // Architecture Teardowns
      ],
      affiliates: ['n8n', 'elevenlabs', 'twilio', 'hubspot'],
      body: bodyContent
    };

    fs.writeFileSync(outputPath, JSON.stringify(postJson, null, 2), 'utf-8');
    console.log(`✅ Generated Sanity JSON at ${outputPath}`);
  } catch (error) {
    console.error('❌ Failed:', error);
  }
}

buildJson();
