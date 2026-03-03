import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
fetch('https://integrate.api.nvidia.com/v1/models', {
    headers: { 'Authorization': `Bearer ${process.env.NVIDIA_API_KEY}` }
}).then(r => r.json()).then(data => {
    if (!data.data) console.log(data);
    else console.log(data.data.map(m => m.id).filter(id => id.includes('deepseek') || id.includes('llama')).slice(0, 15));
}).catch(console.error);
