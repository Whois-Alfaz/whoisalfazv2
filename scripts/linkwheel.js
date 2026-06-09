const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { exec, execSync } = require('child_process');

// Load env variables
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

// Parse CLI args
function getArgs() {
  const args = {};
  process.argv.slice(2).forEach((arg) => {
    if (arg.startsWith('--')) {
      const parts = arg.split('=');
      const key = parts[0].substring(2);
      const val = parts[1] || true;
      args[key] = val;
    }
  });
  return args;
}

const args = getArgs();
const slug = args.slug;

if (!slug) {
  console.error('❌ Error: Please specify a post slug using --slug=<slug_name>');
  console.log('Usage: node scripts/linkwheel.js --slug=case-study-urban-cafe-foodtech-platform');
  process.exit(1);
}

// Locate matching draft file
function getPostMetadata(slug) {
  const rootDir = path.resolve(__dirname, '..');
  try {
    const files = fs.readdirSync(rootDir);
    const draftFiles = files.filter(f => f.startsWith('draft-') && f.endsWith('.json'));
    
    for (const file of draftFiles) {
      const filePath = path.join(rootDir, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      const fileSlug = data.slug?.current || data._id || '';
      if (fileSlug === slug || file.replace('draft-', '').replace('.json', '') === slug) {
        return {
          title: data.title,
          canonicalUrl: `https://whoisalfaz.me/blog/${slug}`
        };
      }
    }
  } catch (err) {
    console.warn(`⚠️ Error reading local drafts: ${err.message}`);
  }
  
  // Fallback default
  return {
    title: slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    canonicalUrl: `https://whoisalfaz.me/blog/${slug}`
  };
}

function copyToClipboard(text) {
  try {
    if (process.platform === 'win32') {
      execSync(`echo | set /p="${text}" | clip`);
      console.log(`📋 Copied canonical URL to clipboard: ${text}`);
    } else if (process.platform === 'darwin') {
      execSync(`echo "${text}" | pbcopy`);
      console.log(`📋 Copied canonical URL to clipboard: ${text}`);
    } else {
      execSync(`echo "${text}" | xclip -selection clipboard`);
      console.log(`📋 Copied canonical URL to clipboard: ${text}`);
    }
  } catch (err) {
    console.warn('⚠️ Failed to copy to clipboard automatically.');
  }
}

function openBrowser(url) {
  const openCmd = process.platform === 'win32' ? 'start ""' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${openCmd} "${url}"`);
}

function main() {
  console.log(`🎡 Launching Linkwheel for: "${slug}"...\n`);
  
  const post = getPostMetadata(slug);
  
  // 1. Copy original canonical link to clipboard
  copyToClipboard(post.canonicalUrl);
  
  // 2. Open all platforms in browser tabs
  console.log('🚀 Opening browser tabs for syndication:');
  
  const targets = [
    { name: 'Dev.to (Create Post)', url: 'https://dev.to/new' },
    { name: 'Medium (Import Story)', url: 'https://medium.com/p/import' },
    { name: 'Hashnode (Create Post)', url: 'https://hashnode.com/create' },
    { name: 'Substack (New Post)', url: 'https://substack.com/publish' },
    { name: 'Ghost Dashboard', url: process.env.GHOST_ADMIN_URL || 'https://ghost.org/login' },
    { name: 'LinkedIn Feed', url: 'https://www.linkedin.com/feed/' }
  ];
  
  targets.forEach(t => {
    console.log(`  - Opening ${t.name}: ${t.url}`);
    openBrowser(t.url);
  });
  
  console.log('\n🎉 Linkwheel launched! Paste the link and copy the platform content from your chat to publish.');
}

main();
