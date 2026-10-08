const fs = require('fs');
const crypto = require('crypto');
let content = fs.readFileSync('public/landing-pages/inner-green-3d.html', 'utf8');

console.log('Original bytes:', Buffer.byteLength(content));

const matches = content.match(/https:\/\/ublctyddhtbgaersvxxb\.supabase\.co[^\s"'\)]+/g);
console.log('Supabase URLs count:', matches ? matches.length : 0);
if (matches) console.log('URLs:', matches);

let replaced = content
  .replaceAll('https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46.woff2', 'inner-green-assets/lexend-latin.woff2')
  .replaceAll('https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ethos.jpg', 'inner-green-assets/card-ethos.jpg')
  .replaceAll('https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ecostove.jpg', 'inner-green-assets/card-ecostove.jpg');

console.log('Replaced bytes:', Buffer.byteLength(replaced));
const sha = crypto.createHash('sha256').update(replaced, 'utf8').digest('hex');
console.log('Sha256:', sha);
console.log('Matches expected (69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197):', sha === '69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197');
