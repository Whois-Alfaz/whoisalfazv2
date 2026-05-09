export async function submitToBing(urls: string[]) {
    const apiKey = process.env.BING_API_KEY;
    const siteUrl = 'https://whoisalfaz.me';

    if (!apiKey) {
        console.error('[Bing API] Missing BING_API_KEY environment variable');
        throw new Error('BING_API_KEY is missing. Please set it in Vercel environment variables.');
    }

    // Submit in batches of 100 to avoid rate limits
    const batchSize = 100;
    const results = [];

    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        console.log(`[Bing API] Submitting batch ${Math.floor(i / batchSize) + 1} (${batch.length} URLs)`);

        const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${apiKey}`;

        const payload = {
            siteUrl: siteUrl,
            urlList: batch
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Charset': 'utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[Bing API] Batch ${Math.floor(i / batchSize) + 1} failed:`, errorText);
            throw new Error(`Bing API Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        results.push(data);

        // Small delay between batches
        if (i + batchSize < urls.length) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }
    }

    return { success: true, batches: results.length, totalUrls: urls.length };
}

export async function submitToIndexNow(urls: string[]) {
    const key = process.env.INDEXNOW_KEY || 'ad4ebd88b14a40879951cbab5300d6aa';
    const host = 'whoisalfaz.me';
    const keyLocation = `https://whoisalfaz.me/${key}.txt`;

    const endpoint = 'https://api.indexnow.org/indexnow';
    const payload = {
        host: host,
        key: key,
        keyLocation: keyLocation,
        urlList: urls
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Charset': 'utf-8'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`[IndexNow API] Failed:`, errorText);
            throw new Error(`IndexNow API Error: ${response.status} - ${errorText}`);
        }

        return { success: true, submittedUrls: urls.length };
    } catch (error) {
        console.error('[IndexNow API] Submission failed:', error);
        throw error;
    }
}

export async function pingGoogle() {
    const sitemapUrl = encodeURIComponent('https://whoisalfaz.me/sitemap.xml');
    const endpoint = `https://www.google.com/ping?sitemap=${sitemapUrl}`;

    try {
        const response = await fetch(endpoint, { method: 'GET' });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google Ping Error: ${response.status} - ${errorText}`);
        }
        return { success: true, message: "Google sitemap ping successful" };
    } catch (error) {
        console.error('[Google Ping] Failed:', error);
        throw error;
    }
}
