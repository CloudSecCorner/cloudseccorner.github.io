import fs from 'fs';
import { createCanvas, loadImage, registerFont } from 'canvas';

async function generateOgImage() {
  // Create a canvas with 1200x630 dimensions (standard OG image size)
  const width = 1200;
  const height = 630;
  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  // Create gradient background
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#0f172a'); // Dark blue
  gradient.addColorStop(1, '#1e293b'); // Slightly lighter blue
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  // Add a subtle grid pattern
  context.strokeStyle = 'rgba(255, 255, 255, 0.05)';
  context.lineWidth = 1;
  
  // Draw vertical lines
  for (let x = 0; x < width; x += 30) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }
  
  // Draw horizontal lines
  for (let y = 0; y < height; y += 30) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  // Add title
  context.font = 'bold 64px Arial';
  context.textAlign = 'center';
  context.fillStyle = '#ffffff';
  context.fillText('Cloud Security Corner', width / 2, height / 2 - 40);

  // Add tagline
  context.font = '32px Arial';
  context.fillStyle = '#94a3b8';
  context.fillText('Resources & Best Practices for Cloud Security', width / 2, height / 2 + 40);

  // Add a border
  context.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  context.lineWidth = 12;
  context.strokeRect(20, 20, width - 40, height - 40);

  // Draw "cloudseccorner.github.io" at the bottom
  context.font = '24px Arial';
  context.fillStyle = '#64748b';
  context.textAlign = 'center';
  context.fillText('cloudseccorner.github.io', width / 2, height - 40);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/og-image.png', buffer);
  
  console.log('✅ Generated OG Image: ./public/og-image.png');
}

generateOgImage().catch(console.error); 