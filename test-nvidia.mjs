import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const nvidia = createOpenAI({
    baseURL: 'https://integrate.api.nvidia.com/v1',
    apiKey: process.env.NVIDIA_API_KEY,
});

async function main() {
    try {
        const { text } = await generateText({
            model: nvidia.chat('meta/llama-3.1-70b-instruct'),
            messages: [{ role: 'user', content: 'Hello' }],
        });
        console.log('Response:', text);
    } catch (error) {
        console.log('URL Attempted:', error.url);
        console.error('API Error:', error.message);
    }
}
main();
