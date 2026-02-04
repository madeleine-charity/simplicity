const fs = require('fs');
const path = require('path');
const htmlToMd = require('html-to-md');

const POSTS_DIR = '/Users/madeleinecharity/Downloads/N2AkLw5zTYSnmIfWc_vx1w/posts';
const OUTPUT_DIR = '/Users/madeleinecharity/Downloads/website/content/non-fiction-long';

// Read the posts.csv to get titles
const postsCSV = fs.readFileSync('/Users/madeleinecharity/Downloads/N2AkLw5zTYSnmIfWc_vx1w/posts.csv', 'utf-8');
const lines = postsCSV.trim().split('\n').slice(1); // Skip header

// Create a map of post_id to title
const postTitles = {};
for (const line of lines) {
  const parts = line.split(',');
  const postId = parts[0];
  const isPublished = parts[2];
  const title = parts[5];
  if (isPublished === 'true' && title) {
    postTitles[postId.split('.')[0]] = title;
  }
}

// Skip these files
const SKIP = ['how-to-use-the-substack-editor', '974'];

// Get all HTML files
const htmlFiles = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.html'));

for (const file of htmlFiles) {
  const baseName = file.replace('.html', '');
  const slug = baseName.split('.').slice(1).join('.');

  // Skip certain files
  if (SKIP.some(s => slug.includes(s))) {
    console.log(`Skipping: ${file}`);
    continue;
  }

  const htmlPath = path.join(POSTS_DIR, file);
  const html = fs.readFileSync(htmlPath, 'utf-8');

  // Convert to markdown
  let md = htmlToMd(html);

  // Clean up the output filename
  const outputName = slug.replace(/-+/g, '-') + '.md';
  const outputPath = path.join(OUTPUT_DIR, outputName);

  fs.writeFileSync(outputPath, md);
  console.log(`Converted: ${file} -> ${outputName}`);
}

console.log('\nDone!');
