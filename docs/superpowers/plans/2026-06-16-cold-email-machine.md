# Automated Cold Email Machine Blog Publication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Research, design, draft, compile, and publish the Day 11 blog post "How to Build an Automated Cold Email Machine with Apollo.io, AiSDR, and Brevo" and set up syndication.

**Architecture:** Sourced leads in Apollo will trigger real-time webhooks processed through n8n for signature validation, CRM contact deduplication via sparse updates, and rate-limiting loops, before routing to AiSDR for AI copy and Brevo for transactional SMTP delivery. 4 WebP assets will be generated, compressed under 100KB, uploaded to Sanity CDN, and compiled into the post JSON containing BlogPosting schema markup for database ingestion.

**Tech Stack:** Node.js, Next.js, Sanity CMS API (@sanity/client), WebP image compression, n8n webhook/SMTP integrations.

---

### Task 1: Generate and Compress WebP Image Assets

**Files:**
- Create: `tmp_images/cold_email_machine_featured.png`
- Create: `tmp_images/cold_email_machine_body1.png`
- Create: `tmp_images/cold_email_machine_body2.png`
- Create: `tmp_images/cold_email_machine_social.png`
- Create: `tmp_images/cold_email_machine_featured.webp`
- Create: `tmp_images/cold_email_machine_body1.webp`
- Create: `tmp_images/cold_email_machine_body2.webp`
- Create: `tmp_images/cold_email_machine_social.webp`
- Create: `scratch/processColdEmailMachineImages.py`

- [ ] **Step 1: Generate raw featured image**
  Run `generate_image` with prompt: "Premium tech-minimalist UI/UX, glassmorphic automated email engine flywheel with glowing cyan node paths, digital grid dark navy background, volumetric lighting, 3D render style" to save as `cold_email_machine_featured.png`.
- [ ] **Step 2: Generate raw body 1 image**
  Run `generate_image` with prompt: "Premium tech-minimalist UI/UX, glassmorphic pipeline diagram showing Apollo webhook, n8n parser, and Brevo SMTP connector blocks, digital grid dark navy background, 3D render style" to save as `cold_email_machine_body1.png`.
- [ ] **Step 3: Generate raw body 2 image**
  Run `generate_image` with prompt: "Premium tech-minimalist UI/UX, glassmorphic split panel comparing async callback queues on the left vs webhook timeout alerts on the right, digital grid dark navy background, 3D render style" to save as `cold_email_machine_body2.png`.
- [ ] **Step 4: Generate raw social cover image**
  Run `generate_image` with prompt: "Premium tech-minimalist UI/UX, glassmorphic card with Title text 'Automated Cold Email Stack' floating on a cyber-cyan neon-purple grid mesh background, 3D render style" to save as `cold_email_machine_social.png`.
- [ ] **Step 5: Write the image compression python script**
  Create `scratch/processColdEmailMachineImages.py`:
  ```python
  import os
  from PIL import Image

  img_dir = "tmp_images"
  targets = ["cold_email_machine_featured", "cold_email_machine_body1", "cold_email_machine_body2", "cold_email_machine_social"]

  for target in targets:
      png_path = os.path.join(img_dir, f"{target}.png")
      webp_path = os.path.join(img_dir, f"{target}.webp")
      if os.path.exists(png_path):
          im = Image.open(png_path)
          im.save(webp_path, "WEBP", quality=75)
          size = os.path.getsize(webp_path) / 1024
          print(f"Compressed {target}.webp to {size:.2f} KB")
  ```
- [ ] **Step 6: Execute compression script and verify sizes**
  Run: `python scratch/processColdEmailMachineImages.py`
  Expected: WebP files generated under `tmp_images/` with sizes strictly under 100KB.
- [ ] **Step 7: Commit image assets**
  Run:
  ```bash
  git add tmp_images/*.webp scratch/processColdEmailMachineImages.py
  git commit -m "feat(media): add compressed webp assets for cold email machine blog post"
  ```

---

### Task 2: Upload Assets to Sanity CDN

**Files:**
- Create: `scripts/uploadColdEmailMachineImages.js`
- Modify: `uploaded_images.json`

- [ ] **Step 1: Write Sanity image upload script**
  Create `scripts/uploadColdEmailMachineImages.js`:
  ```javascript
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

  async function upload() {
    const images = ['featured', 'body1', 'body2', 'social'];
    const metaPath = path.resolve(__dirname, '../uploaded_images.json');
    let meta = {};
    if (fs.existsSync(metaPath)) {
      meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    }

    for (const img of images) {
      const filename = `cold_email_machine_${img}.webp`;
      const filePath = path.resolve(__dirname, `../tmp_images/${filename}`);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        continue;
      }
      console.log(`Uploading ${filename} to Sanity...`);
      const fileStream = fs.createReadStream(filePath);
      const asset = await client.assets.upload('image', fileStream, {
        filename: filename,
        contentType: 'image/webp',
      });
      meta[`cold_email_machine_${img}`] = {
        _id: asset._id,
        url: asset.url,
      };
      console.log(`✅ Uploaded ${filename}: ${asset._id} (${asset.url})`);
    }
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2), 'utf-8');
    console.log('✅ Metadata saved to uploaded_images.json');
  }

  upload().catch(console.error);
  ```
- [ ] **Step 2: Run upload script**
  Run: `node scripts/uploadColdEmailMachineImages.js`
  Expected: Successful upload message with URLs printed.
- [ ] **Step 3: Verify metadata registration**
  Check `uploaded_images.json` to confirm the keys `cold_email_machine_featured`, `cold_email_machine_body1`, `cold_email_machine_body2`, and `cold_email_machine_social` are present.
- [ ] **Step 4: Commit scripts & metadata updates**
  Run:
  ```bash
  git add scripts/uploadColdEmailMachineImages.js uploaded_images.json
  git commit -m "feat(media): upload cold email machine blog images to Sanity CDN"
  ```

---

### Task 3: Technical Copywriting (Body & Syndication Drafts)

**Files:**
- Create: `scripts/draft-cold-email-machine-body.md`
- Create: `scripts/draft-cold-email-machine-devto.md`
- Modify: `C:\Users\user\.gemini\antigravity\brain\64c9a70c-f003-45c7-a4f8-0a372322e422\link_wheel_contents.md`

- [ ] **Step 1: Write technical blog body draft**
  Create `scripts/draft-cold-email-machine-body.md` with:
  *   2,300+ words of content targeting primary and secondary keywords.
  *   Direct-answer H2 subheadings wrapped in `<mark>`.
  *   E-E-A-T elements (match rates, SDR hours saved, email warmup metrics, circular sync loops).
  *   HMAC webhook signature validation JavaScript block.
  *   Sparse update merge JavaScript block.
  *   Mermaid diagram mapping system integration.
  *   DNS records table.
  *   Reciprocal internal links to `/blog/apollo-brevo-n8n-outbound-pipeline/`, `/blog/aisdr-vs-human-sdr-performance-teardown/`, and `/blog/self-healing-n8n-automation-architecture/`.
- [ ] **Step 2: Write Dev.to developer-centric draft**
  Create `scripts/draft-cold-email-machine-devto.md` detailing the n8n webhook setup, verification scripts, and SMTP settings with absolute URLs.
- [ ] **Step 3: Write Medium, LinkedIn, and Substack drafts**
  Append these drafts to `C:\Users\user\.gemini\antigravity\brain\64c9a70c-f003-45c7-a4f8-0a372322e422\link_wheel_contents.md` starting at the end of the file.
- [ ] **Step 4: Commit draft files**
  Run:
  ```bash
  git add scripts/draft-cold-email-machine-body.md scripts/draft-cold-email-machine-devto.md
  git commit -m "feat(blog): write body and Dev.to drafts for cold email machine post"
  ```

---

### Task 4: Compile JSON Payload

**Files:**
- Create: `scripts/buildColdEmailMachineJson.js`
- Create: `draft-cold-email-machine.json`

- [ ] **Step 1: Write JSON compiler script**
  Create `scripts/buildColdEmailMachineJson.js`:
  ```javascript
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
        featuredAssetId = 'image-cbdbd1a6aa21c16c814a7261972e29643e8d8365-1024x1024-webp';
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
          { _type: 'reference', _ref: 'pJmrsKLAWC800vFHegUEU1' } // Automation Tools
        ],
        affiliates: ['n8n', 'apollo', 'brevo'],
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
  ```
- [ ] **Step 2: Run compiler script**
  Run: `node scripts/buildColdEmailMachineJson.js`
  Expected: JSON generated at `draft-cold-email-machine.json`.
- [ ] **Step 3: Commit scripts and generated JSON**
  Run:
  ```bash
  git add scripts/buildColdEmailMachineJson.js draft-cold-email-machine.json
  git commit -m "feat(blog): add JSON builder and compile cold email machine post payload"
  ```

---

### Task 5: Publish Post to Sanity DB

**Files:**
- Create: `scripts/publishColdEmailMachineToSanity.js`

- [ ] **Step 1: Write Sanity database ingestion script**
  Create `scripts/publishColdEmailMachineToSanity.js`:
  ```javascript
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

  async function run() {
    const filePath = path.resolve(__dirname, '../draft-cold-email-machine.json');
    if (!fs.existsSync(filePath)) {
      console.error(`Error: Payload file not found: ${filePath}`);
      process.exit(1);
    }

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const postData = JSON.parse(fileContent);

      console.log(`Ingesting post: ${postData.title} (${postData._id})...`);

      const result = await client.createOrReplace(postData);
      console.log('✅ Successfully published to Sanity DB:', result._id);
    } catch (error) {
      console.error('❌ Ingestion failed:', error);
      process.exit(1);
    }
  }

  run();
  ```
- [ ] **Step 2: Ingest post to database**
  Run: `node scripts/publishColdEmailMachineToSanity.js`
  Expected: `✅ Successfully published to Sanity DB: cold-email-machine-apollo-aisdr-brevo`.
- [ ] **Step 3: Commit the publication script**
  Run:
  ```bash
  git add scripts/publishColdEmailMachineToSanity.js
  git commit -m "feat(blog): add database publisher script and upload post to Sanity"
  ```

---

### Task 6: Verify and Git Deploy

- [ ] **Step 1: Execute Next.js build compilation verification**
  Run: `$env:OFFLINE_BUILD="true"; npm run build`
  Expected: Compile successfully with new routes `/blog/cold-email-machine-apollo-aisdr-brevo` and `/cold-email-machine-apollo-aisdr-brevo` generated cleanly.
- [ ] **Step 2: Commit all remaining status checks and updates**
  Modify the `content_plan.json` Day 11 status to `"published"`.
  Run:
  ```bash
  git add content_plan.json
  git commit -m "chore(content): update content plan status for Day 11"
  ```
- [ ] **Step 3: Push changes to remote origin & deploy branches**
  Run: `npm run push-all`
  Expected: Successful push to both GitHub and deploy remotes.
- [ ] **Step 4: Report syndication paths**
  Provide the user with absolute draft paths for manual publication.
