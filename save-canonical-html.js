const fs = require('fs');
const crypto = require('crypto');

let content = fs.readFileSync('public/landing-pages/inner-green-3d.html', 'utf8');

let canonical = content
  .replaceAll('https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46.woff2', 'inner-green-assets/lexend-latin.woff2')
  .replaceAll('<img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ethos.jpg"', '<img src="inner-green-assets/card-ethos.jpg"')
  .replaceAll('<img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ecostove.jpg"', '<img src="inner-green-assets/card-ecostove.jpg"');

fs.writeFileSync('public/landing-pages/inner-green-3d.html', canonical, 'utf8');

const sha = crypto.createHash('sha256').update(fs.readFileSync('public/landing-pages/inner-green-3d.html')).digest('hex');
console.log('Saved public/landing-pages/inner-green-3d.html, sha256:', sha);
