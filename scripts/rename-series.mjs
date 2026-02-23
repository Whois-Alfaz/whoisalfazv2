import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const dir = 'content/blog/30-days-of-n8n-automation';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);

    // Extract Day number from title
    // Pattern: "Day X" or "Day-X"
    const dayMatch = data.title.match(/Day\s*(\d+)/i);
    if (!dayMatch) {
        console.log(`Skipping ${file}: No Day found in title "${data.title}"`);
        return;
    }

    const dayNumber = dayMatch[1];
    const newFileName = `day-${dayNumber}.mdx`;
    const newFilePath = path.join(dir, newFileName);

    // Ensure slug is preserved
    // If no slug in data, use the original filename (without extension)
    const currentSlug = data.slug || file.replace(/\.mdx$/, '');
    data.slug = currentSlug;

    // Write back with explicit slug and frontmatter
    const updatedContent = matter.stringify(body, data);
    fs.writeFileSync(filePath, updatedContent);

    // Rename the file
    if (filePath !== newFilePath) {
        if (fs.existsSync(newFilePath)) {
            console.log(`Error: ${newFileName} already exists. Collision with ${file}`);
        } else {
            fs.renameSync(filePath, newFilePath);
            console.log(`Renamed ${file} -> ${newFileName} (Slug: ${currentSlug})`);
        }
    } else {
        console.log(`File ${file} is already correctly named.`);
    }
});
