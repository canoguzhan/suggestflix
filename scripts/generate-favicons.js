const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');

const sizes = {
  'favicon-16x16.png': 16,
  'favicon-32x32.png': 32,
  'apple-touch-icon.png': 180,
  'android-chrome-192x192.png': 192,
  'android-chrome-512x512.png': 512,
  'mstile-150x150.png': 150
};

async function generateFavicons() {
  const inputSvg = path.join(__dirname, '../client/public/favicon.svg');
  const svgBuffer = await fs.readFile(inputSvg);

  for (const [filename, size] of Object.entries(sizes)) {
    const outputPath = path.join(__dirname, '../client/public', filename);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`Generated ${filename}`);
  }
}

generateFavicons().catch(console.error); 