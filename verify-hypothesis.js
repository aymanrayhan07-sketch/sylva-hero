const fs = require('fs');
const crypto = require('crypto');

let content = fs.readFileSync('public/landing-pages/inner-green-3d.html', 'utf8');

// Test removing crossorigin="anonymous" from the two images AND replacing the supabase URLs
let modified = content
  .replaceAll('https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46.woff2', 'inner-green-assets/lexend-latin.woff2')
  .replaceAll('<img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ethos.jpg"', '<img src="inner-green-assets/card-ethos.jpg"')
  .replaceAll('<img crossorigin="anonymous" src="https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ecostove.jpg"', '<img src="inner-green-assets/card-ecostove.jpg"');

console.log('Modified bytes:', Buffer.byteLength(modified));
const sha = crypto.createHash('sha256').update(modified, 'utf8').digest('hex');
console.log('Sha256:', sha);
console.log('Expected: 69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197');
console.log('Match?:', sha === '69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197');
