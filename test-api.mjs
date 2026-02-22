const API_URL = 'https://v1.whoisalfaz.me/graphql';

async function testFetch() {
    const query = `
    query PostBySlug($slug: ID!) {
      post(id: $slug, idType: SLUG) {
        title
        seo {
          title
        }
      }
    }
  `;
    const variables = { slug: 'build-an-automated-rank-tracker-tool-with-n8n' };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables }),
        });
        const json = await res.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (err) {
        console.error('Fetch failed:', err);
    }
}

testFetch();
