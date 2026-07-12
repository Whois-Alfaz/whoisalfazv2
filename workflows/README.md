# n8n Workflow Automation Blueprints: Client Delivery Guide

Welcome to your B2B Revenue Operations & Automation Package. This guide contains instructions for deploying, testing, and scaling your **18 production-ready n8n workflow blueprints**.

---

## 📋 Global Setup Prerequisites

Before importing the templates, ensure you have active credentials and API access for the corresponding platforms:
* **Workflow Orchestration**: n8n (Self-Hosted or Cloud, Version `1.0+` recommended)
* **Data Sources & Outreach**: Apollo.io, Smartlead, Instantly
* **AI & Voice Synthesizers**: OpenAI (GPT-4o/GPT-4o-mini), ElevenLabs API
* **Marketing & CRM**: Brevo (SMTP & API), ManyChat (Pro Account)
* **Operations & Reporting**: monday.com, Databox, Trainual
* **Notification Channels**: Slack (Incoming Webhooks) or Discord (Webhooks)

---

## 📂 n8n Workflow Blueprint Catalog

Below is the complete mapping of your 18 workflows located in the [`workflows/`](file:///e:/Ai%20Agents/whoisalfaz.me/Web%20Projects/antigravity/whoisalfaz-v2/workflows) folder:

| # | Workflow Name | Target File | Core Integrations | Key Logic / Features |
|---|---|---|---|---|
| **1** | **AI Lead Enrichment Pipeline** | `ai-lead-enrichment-pipeline.json` | Apollo.io, OpenAI, HubSpot/Brevo | Asynchronous lead scoring, tech stack lookup, and Slack alerts. |
| **2** | **RAG Knowledge Base Blueprint** | `rag-knowledge-base-blueprint.json` | Pinecone, OpenAI, n8n Vector Store | Semantic search, chunking, embeddings, and context retrieval. |
| **3** | **Voice AI Sales Agent** | `voice-ai-sales-agent.json` | Twilio, ElevenLabs, Google Calendar | Real-time voice reception, calendar checking, and CRM logging. |
| **4** | **n8n AI Agent Nodes & Memory** | `n8n-ai-agent-nodes-memory-buffer.json` | OpenAI, Pinecone, Tavily Search | Stateful multi-agent planning with memory window buffer. |
| **5** | **AdCreative.ai Automated Graphic** | `adcreative-ai-automated-graphic-pipeline.json` | AdCreative.ai, Airtable, Google Drive | Automatic ad graphic design generation, score filtering, and sync. |
| **6** | **Autonomous Cold Email Machine** | `autonomous-cold-email-machine.json` | Apollo.io, AiSDR, Brevo CRM | Multi-channel prospecting, AI copy personalization, SMTP delivery. |
| **7** | **ManyChat Async Webhook Queue** | `manychat-async-webhook-queue.json` | ManyChat, n8n Webhook, Brevo | Timeout bypass (immediate 200 OK) with downstream async processing. |
| **8** | **Apollo-to-Brevo CRM Sync** | `apollo-to-brevo-crm-sync.json` | Apollo.io, Brevo CRM | Automated contact list mirroring, deduplication, sequence trigger. |
| **9** | **ManyChat WhatsApp Lead Capture** | `manychat-whatsapp-lead-capture.json` | ManyChat WhatsApp, Slack, Brevo | Dynamic WhatsApp chat qualification, lead scoring, live handoff. |
| **10** | **Outbound LinkedIn Prospecting** | `outbound-linkedin-prospecting.json` | Apollo.io, n8n, LinkedIn API | Safe warming scheduler, message sequence rotation, rate limits. |
| **11** | **Multi-Step AI Outreach Agent** | `multi-step-ai-outreach-agent.json` | AiSDR, Apollo.io, Brevo CRM | Fully autonomous SDR loop, sentiment analysis, reply detection. |
| **12** | **ManyChat Instagram DM Funnel** | `manychat-instagram-dm-funnel.json` | ManyChat IG, Brevo CRM | Comment-to-DM triggers, lead magnet delivery, CRM logging. |
| **13** | **monday.com RevOps Recipes** | `monday-com-revops-recipes.json` | monday.com API, n8n | 12 automation recipes (onboarding, CRM sync, stage alerts). |
| **14** | **Databox RevOps Dashboard** | `databox-revops-dashboard-pipeline.json` | Databox, monday.com, CRM | Pipeline velocity, ARR trends, win-rate metrics calculations. |
| **15** | **Self-Healing Error Handler** | `self-healing-error-handler.json` | n8n Error Trigger, Slack/Discord | Global error catcher, retry loops, DLQ logging, alert templates. |
| **16** | **Trainual SOP Documenting** | `trainual-sop-documenting-engine.json` | Trainual, monday.com, n8n | Auto-documenting process flows into training manuals on sync. |
| **17** | **Brevo CRM Automation Playbook** | `brevo-crm-automation-playbook.json` | Brevo CRM, Webhooks, n8n | Segment updates, transaction emails, custom contact fields. |
| **18** | **Living Operations Manual Sync** | `living-operations-manual-sync.json` | Trainual, monday.com | Real-time operations manual synchronization across workspaces. |

---

## 📥 Import Instructions

For each workflow you want to set up:
1. Open your **n8n Editor** workspace.
2. Click the **three dots** in the top-right corner ➔ Select **Import from File**.
3. Select the corresponding `.json` blueprint from the `workflows/` directory.
4. **Configure Credentials**:
   * Any node displaying a red warning triangle requires authentication credentials.
   * Click the node and select/create the appropriate credentials (e.g., Apollo API Key, Brevo Connection, OpenAI OAuth).
5. **Configure Variables**:
   * Check the **Sticky Note** on the canvas for environment variables or parameter overrides needed for that specific workflow.
6. Click **Active** (toggle in top-right) to turn the pipeline live.

---

## 🛠️ Verification & Testing Protocol

To ensure your pipelines are working correctly before pushing to production:
1. **Mock Webhooks**: Use the `Test step` inside n8n to send a mock JSON payload (e.g., `{ "email": "test@example.com" }`) to the webhook trigger.
2. **Examine Execution History**: Click **Executions** in the left sidebar to trace data flowing through each node and confirm the green checkmarks.
3. **Verify Error Interceptor**: Turn off internet access temporarily on an API node and trigger the workflow. Ensure that the **Self-Healing Error Handler** catches the failure and logs/alerts successfully.

---

## 🤝 Need Done-For-You Implementation?
Templates get you 80% of the way. For custom logic, database integrations, production hardening, or server setup, you can work directly with our engineering team:
* **Custom n8n Builds**: [Custom Workflow Automation Service](https://whoisalfaz.me/services/n8n-automation/)
* **Consulting**: [Strategy & Growth Consulting](https://whoisalfaz.me/services/growth-consulting/)
