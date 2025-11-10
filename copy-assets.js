// Script to copy public assets to dist folder after build
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
const distDir = path.join(__dirname, 'dist');

// Files to copy
const filesToCopy = [
  'app-prayer.png',
  'manifest.json'
];

console.log('📦 Copying public assets to dist...\n');

filesToCopy.forEach(file => {
  const src = path.join(publicDir, file);
  const dest = path.join(distDir, file);
  
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    const stats = fs.statSync(dest);
    const size = (stats.size / 1024).toFixed(1);
    console.log(`✅ Copied ${file} (${size}KB)`);
  } else {
    console.log(`⚠️  ${file} not found in public/`);
  }
});

console.log('\n✨ Assets copied successfully!');
