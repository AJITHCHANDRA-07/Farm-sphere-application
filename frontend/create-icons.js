import fs from 'fs';
import { createCanvas } from 'canvas';

// Create a simple green square icon with text
function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Green gradient background
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#16a34a');
  gradient.addColorStop(1, '#10b981');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // Add text
  ctx.fillStyle = 'white';
  ctx.font = `bold ${size * 0.35}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🌾', size/2, size * 0.4);
  
  ctx.font = `bold ${size * 0.09}px Arial`;
  ctx.fillText('FarmSphere', size/2, size * 0.7);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icons/icon-${size}.png`, buffer);
  console.log(`✅ Created icon-${size}.png`);
}

// Create both sizes
createIcon(192);
createIcon(512);
