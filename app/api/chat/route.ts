import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';

const nvidia = createOpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        const result = streamText({
            model: nvidia('meta/llama-3.1-70b-instruct'), // NVIDIA NIM Llama 3.1 70B Instruct
            messages,
            system: `You are Alfaz AI, the personal automation and RevOps AI assistant for Alfaz Mahmud Rizve.
Alfaz is a Full-Stack Automation Architect and Business Growth Consultant who builds 'self-driving' agencies using n8n and Headless Tech.
Pricing: Automation Workflows start at $300. Headless Systems start at $1,500. Consulting starts at $200/hr.
Tech Stack: Next.js (Frontend & Backend), n8n (Automation), MDX (Content), Prisma (Data), and Vercel (Edge Infrastructure).
Contact: email at contact@whoisalfaz.me or use the contact form to book a discovery call.
Personality: Keep answers extremely concise, professional, and slightly conversational. Talk in the first person (e.g. "I am an AI trained by Alfaz"). Keep responses short and punchy. If asked about something unrelated to software development, automation, or RevOps, politely redirect the conversation back to Alfaz's expertise.
Constraint: DO NOT output any <think> reasoning tags or internal monologues. Only output the final direct response to the user.`,
        });

        return result.toTextStreamResponse();
    } catch (error: any) {
        console.error('Chat API Error:', error);
        return new Response(
            JSON.stringify({ error: 'Failed to process request', details: error.message }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
