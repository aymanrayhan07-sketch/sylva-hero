const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

const bundle = JSON.parse(fs.readFileSync('sylva-hero.json', 'utf8'));

// 1. Extract text files with 'code' in the bundle
for (const file of bundle.files) {
  if (file.code) {
    const filePath = file.path;
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, file.code, 'utf8');
    const actualSha = crypto.createHash('sha256').update(file.code, 'utf8').digest('hex');
    console.log(`Wrote ${filePath} - sha256 match: ${actualSha === file.sha256} (${actualSha})`);
  }
}

// 2. Download files with sourceUrl or from supabase
const downloads = [
  { out: 'public/landing-pages/inner-green-3d.html', url: 'https://threeui.com/landing-pages/inner-green-3d.html', expectedSha: '69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197' },
  { out: 'public/landing-pages/inner-green-assets/three.min.js', url: 'https://threeui.com/landing-pages/inner-green-assets/three.min.js', expectedSha: '8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271' },
  { out: 'public/landing-pages/inner-green-assets/card-ecostove.jpg', url: 'https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ecostove.jpg', expectedSha: '70ce084084902bc502f00c366405b661ecdff90dee95d363b36a6e146829e433' },
  { out: 'public/landing-pages/inner-green-assets/card-ethos.jpg', url: 'https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/c74a626e396794aa239bca6f/card-ethos.jpg', expectedSha: '337627390f499b3ae272cec9e2f83c817694a82f42e1aa10a7b26a2c7d679dff' },
  { out: 'public/landing-pages/inner-green-assets/lexend-latin.woff2', url: 'https://ublctyddhtbgaersvxxb.supabase.co/storage/v1/object/public/threeui-media/scene-images/embedded/1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46.woff2', expectedSha: '1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46' }
];

for (const item of downloads) {
  const dir = path.dirname(item.out);
  fs.mkdirSync(dir, { recursive: true });
  console.log(`Downloading ${item.out} from ${item.url}...`);
  execSync(`curl.exe -s -L -o "${item.out}" "${item.url}"`);
  const buf = fs.readFileSync(item.out);
  const actualSha = crypto.createHash('sha256').update(buf).digest('hex');
  console.log(`Downloaded ${item.out} (${buf.length} bytes) - sha256 match: ${actualSha === item.expectedSha} (${actualSha})`);
}
