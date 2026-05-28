# Pinecone n8n Corrective RAG (CRAG) Blueprint Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Compile, interlink, and publish the Day 3 blog post "Building a RAG Knowledge Base with Pinecone and n8n: A Production-Ready Blueprint" directly to Sanity CMS, verify it locally under the dev server, and prepare the repository for production deployment.

**Architecture:** Programmatically generate high-resolution WebP images for visual assets, compile raw Markdown text detailing the CRAG grading loop and multitenancy namespaces, map bidirectional internal anchors to your existing 30 Days of n8n posts (Days 18, 25, 26, 27) and core GTM service pages, compile the final JSON payload, and run idempotent publisher scripts.

**Tech Stack:** Next.js (app router), Sanity.io CMS Client, node-fetch, Git.

---

### Task 1: Generate & Upload Highly Optimized WebP Assets

**Files:**
- Create: `scripts/uploadImageToSanity.js` (Verify existing, or utilize)
- Modify: `uploaded_images.json`
- Test: Check if assets are verified on Sanity CDN URL paths.

- [ ] **Step 1: Generate the Featured/Cover Art Image**
  Run tool: `generate_image`
  Prompt: `"Premium tech-minimalist UI/UX, glassmorphic knowledge graph visualization showing vector embedding clusters with glowing cyan similarity links, Pinecone vector store rendered as a 3D crystalline data structure, digital grid-mesh dark background, neon-purple RAG pipeline flow arrows, deep depth-of-field 3D render style with ambient glow effects."`
  ImageName: `pinecone_rag_featured`

- [ ] **Step 2: Generate Body Image 1 (System Flow Diagram)**
  Run tool: `generate_image`
  Prompt: `"High-resolution tech schematic, glassmorphic flowchart illustrating the Corrective RAG (CRAG) pipeline, highlighting the decision branch between Pinecone Vector Retrieve and external Tavily Web Search, neon cyan and purple data lanes, digital mesh dark navy base."`
  ImageName: `pinecone_rag_body1`

- [ ] **Step 3: Generate Body Image 2 (Metadata Schema Table Layout)**
  Run tool: `generate_image`
  Prompt: `"Sleek minimal vector graphic showing multi-tenant database namespaces schema architecture, parent-child document chunks mapping, cyber-cyan nodes with detailed structural labels on a dark navy grid background."`
  ImageName: `pinecone_rag_body2`

- [ ] **Step 4: Compress pngs to WebP formats**
  Run: `cwebp -q 80 public/images/pinecone_rag_featured.png -o public/images/pinecone_rag_featured.webp`
  Expected: WebP assets are generated under `80KB` weight.

- [ ] **Step 5: Run Image Uploader Script to push WebP assets to Sanity CDN**
  Run: `node scripts/uploadImageToSanity.js public/images/pinecone_rag_featured.webp public/images/pinecone_rag_body1.webp public/images/pinecone_rag_body2.webp`
  Expected: Prints uploaded Sanity Asset IDs and URLs. Saves references inside `uploaded_images.json`.

- [ ] **Step 6: Commit image metadata changes**
  Run: `git add uploaded_images.json && git commit -m "feat(assets): upload Day 3 Pinecone RAG WebP assets to Sanity CDN"`

---

### Task 2: Create Technical Markdown Draft with Strategic Internal Links

**Files:**
- Create: `scripts/draft-pinecone-n8n-rag-body.md`
- Test: Confirm markdown is structured with clean single-hash headings (`###`), HTML databases metadata tables, and no placeholder tags.

- [ ] **Step 1: Write the draft body content**
  Create the 1700+ word technical guide detailing the CRAG pipeline structure, grading logic, dynamic namespacing, and database schemas. Make sure to embed:
  - Links to 30 Days of n8n posts: `/blog/n8n-rag-tutorial/` (Day 26), `/blog/n8n-ai-agent-tools/` (Day 25), `/blog/n8n-ai-receptionist/` (Day 27), and `/blog/n8n-data-privacy-security-guide/` (Day 18).
  - Links to Macro posts: `/blog/n8n-apollo-lead-enrichment-pipeline/` (Day 1) and `/blog/revops-automation-stack-saas-2026/` (Day 2).
  - Links to Core pages: `/services/n8n-automation/`, `/audit/`, and `/contact/`.
  - Embed dynamic WebP URLs retrieved from Task 1.

- [ ] **Step 2: Commit draft body file**
  Run: `git add scripts/draft-pinecone-n8n-rag-body.md`
  Run: `git commit -m "docs(content): draft Day 3 Pinecone RAG blog post copy with rich interlinks"`

---

### Task 3: Build the Day 3 JSON Compiler Script

**Files:**
- Create: `scripts/buildDay3Json.js`
- Test: Confirm `draft-pinecone-n8n-rag.json` compiles successfully without parsing issues.

- [ ] **Step 1: Write buildDay3Json.js script**
  Write Node script to read `scripts/draft-pinecone-n8n-rag-body.md` and pack it with categories (`Al3E26R37amzsHAqPF1yCU` and `pJmrsKLAWC800vFHegUEU1`), affiliates (`["n8n", "pinecone"]`), and cover image reference retrieved from `uploaded_images.json`.
  Code:
  ```javascript
  const fs = require('fs');
  const path = require('path');
  const bodyPath = path.resolve(__dirname, './draft-pinecone-n8n-rag-body.md');
  const imagesPath = path.resolve(__dirname, '../uploaded_images.json');
  const outputPath = path.resolve(__dirname, '../draft-pinecone-n8n-rag.json');

  function buildJson() {
    const bodyContent = fs.readFileSync(bodyPath, 'utf-8');
    const imagesData = JSON.parse(fs.readFileSync(imagesPath, 'utf-8'));
    const featuredAssetId = imagesData.pinecone_rag_featured?._id || "image-placeholder-id";

    const postJson = {
      _id: 'pinecone-n8n-rag-knowledge-base-blueprint',
      _type: 'post',
      title: 'Building a RAG Knowledge Base with Pinecone and n8n: A Production-Ready Blueprint',
      slug: { _type: 'slug', current: 'pinecone-n8n-rag-knowledge-base-blueprint' },
      description: 'Build an enterprise-grade Corrective RAG (CRAG) knowledge base with n8n and Pinecone. Step-by-step blueprint covering document grading, hybrid search, and self-healing web search fallbacks.',
      date: new Date().toISOString(),
      seoTitle: 'Corrective RAG in n8n: Zero-Hallucination Pinecone Blueprint (2026)',
      seoDescription: 'Build an enterprise-grade Corrective RAG (CRAG) knowledge base with n8n and Pinecone. Step-by-step blueprint covering document grading, hybrid search, and self-healing web search fallbacks.',
      image: { _type: 'image', asset: { _type: 'reference', _ref: featuredAssetId } },
      categories: [
        { _type: 'reference', _ref: 'Al3E26R37amzsHAqPF1yCU' },
        { _type: 'reference', _ref: 'pJmrsKLAWC800vFHegUEU1' }
      ],
      affiliates: ['n8n', 'pinecone'],
      body: bodyContent
    };
    fs.writeFileSync(outputPath, JSON.stringify(postJson, null, 2), 'utf-8');
    console.log('✅ Successfully generated Day 3 Sanity JSON');
  }
  buildJson();
  ```

- [ ] **Step 2: Run the compiler script**
  Run: `node scripts/buildDay3Json.js`
  Expected: Generates `draft-pinecone-n8n-rag.json` inside workspace root.

- [ ] **Step 3: Commit compiled JSON and builder script**
  Run: `git add scripts/buildDay3Json.js draft-pinecone-n8n-rag.json`
  Run: `git commit -m "feat(compiler): create Day 3 JSON compiler and generate payload"`

---

### Task 4: Programmatically Publish/Update Sanity Database

**Files:**
- Create: `scripts/publishDay3ToSanity.js`
- Test: Verify the post resolves dynamically on the client by querying client routes.

- [ ] **Step 1: Write publishDay3ToSanity.js script**
  Write an idempotent script utilizing `@sanity/client` to call `client.createOrReplace(postData)`.
  Code:
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

  async function publishDay3() {
    const filePath = path.resolve(__dirname, '../draft-pinecone-n8n-rag.json');
    const postData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const result = await client.createOrReplace(postData);
    console.log('✅ Successfully published live Day 3 post in Sanity:', result._id);
  }
  publishDay3();
  ```

- [ ] **Step 2: Run publisher script**
  Run: `node scripts/publishDay3ToSanity.js`
  Expected: Output `✅ Successfully published live Day 3 post in Sanity: pinecone-n8n-rag-knowledge-base-blueprint`.

- [ ] **Step 3: Commit publisher script**
  Run: `git add scripts/publishDay3ToSanity.js`
  Run: `git commit -m "feat(publisher): create Day 3 direct publisher and update Sanity CDN database"`

---

### Task 5: Dev Server Verification & Production Push

**Files:**
- Modify: `content_plan.json` (Update day 3 status to "published")
- Test: Run dev server local inspection.

- [ ] **Step 1: Update day 3 status in content plan**
  Change day 3 status to `"published"` and populate `publishedAt` timestamp.

- [ ] **Step 2: Start dev server**
  Run: `npm run dev`
  Expected: Ready in 5-10s.

- [ ] **Step 3: Perform local verification check**
  Verify route renders perfectly without errors or pagination exceptions at:
  `http://localhost:3000/blog/pinecone-n8n-rag-knowledge-base-blueprint/`

- [ ] **Step 4: Commit plan ledger updates**
  Run: `git add content_plan.json`
  Run: `git commit -m "chore(content): update Day 3 content plan ledger status to published"`

- [ ] **Step 5: Push all changes live to production**
  Run: `npm run push-all`
  Expected: Successfully pushed to GitHub origin and DigitalOcean deployment remotes.
