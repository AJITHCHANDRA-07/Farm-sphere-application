import sharp from 'sharp';

sharp('public/icons/icon-template.svg')
  .resize(192, 192)
  .png()
  .toFile('public/icons/icon-192.png');

sharp('public/icons/icon-template.svg')
  .resize(512, 512)
  .png()
  .toFile('public/icons/icon-512.png');
