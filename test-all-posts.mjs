const API_URL = 'https://v1.whoisalfaz.me/graphql';

async function testFetch() {
    const query = `
    query AllPosts {
      posts(first: 5) {
        nodes {
          title
          slug
        }
      }
    }
  `;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query }),
        });
        const json = await res.json();
        console.log(JSON.stringify(json, null, 2));
    } catch (err) {
        console.error('Fetch failed:', err);
    }
}

testFetch();
