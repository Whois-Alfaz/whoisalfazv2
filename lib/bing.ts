
export async function submitToBing(urls: string[]) {
    const apiKey = process.env.BING_API_KEY;
    const siteUrl = 'https://whoisalfaz.me';

    if (!apiKey) {
        throw new Error('BING_API_KEY is missing in environment variables.');
    }

    const endpoint = `https://ssl.bing.com/webmaster/api.svc/json/SubmitUrlbatch?apikey=${apiKey}`;

    const payload = {
        siteUrl: siteUrl,
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
            throw new Error(`Bing API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Failed to submit URLs to Bing:', error);
        throw error;
    }
}

export async function submitToIndexNow(urls: string[]) {
    const endpoint = 'https://api.indexnow.org/indexnow';
    const payload = {
        host: 'whoisalfaz.me',
        key: 'ad4ebd88b14a40879951cbab5300d6aa',
        keyLocation: 'https://whoisalfaz.me/ad4ebd88b14a40879951cbab5300d6aa.txt',
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
            throw new Error(`IndexNow API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        return { success: true, message: "IndexNow submission queued successfully" };
    } catch (error) {
        console.error('Failed to submit URLs to IndexNow:', error);
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
            throw new Error(`Google Ping Error: ${response.status} ${response.statusText} - ${errorText}`);
        }
        return { success: true, message: "Google sitemap ping successful" };
    } catch (error) {
        console.error('Failed to ping Google:', error);
        throw error;
    }
}
