import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const nvidia = createOpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
});

async function main() {
    console.log('Key exists:', !!process.env.NVIDIA_API_KEY);
    try {
        const { text } = await generateText({
            model: nvidia('deepseek-ai/deepseek-r1'),
            messages: [{ role: 'user', content: 'Hello' }],
        });
        console.log('Response:', text);
    } catch (error) {
        console.error('API Error:', error);
    }
}
main();
