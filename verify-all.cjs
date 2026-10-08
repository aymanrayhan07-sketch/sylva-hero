const fs = require('fs');
const crypto = require('crypto');

const filesToCheck = [
  { path: 'src/shaders/landing-pages/LandingPages.tsx', expectedSha: '4d379461ad00eb4de7900df312878035383de7e1ed4e13283b8143a2eea9d30a', expectedBytes: 40525 },
  { path: 'src/shaders/landing-pages/pageTypography.ts', expectedSha: '809cc65797d531cd3b3ca5a56815d55d24b3ee8d293e4e4bad6fdfe6c83244cc', expectedBytes: 15028 },
  { path: 'src/shaders/landing-pages/pageRecipes.ts', expectedSha: 'c9d9849cc255bac2d1d938d088c50917f84916f1c516d2bbb27fcfd803523233', expectedBytes: 74927 },
  { path: 'src/shaders/landing-pages/LandingPageFrame.tsx', expectedSha: '61de2cc50888aac4ac5557420b07fa47ed3543bb57c1e0055fafdefa53dbaa78', expectedBytes: 6756 },
  { path: 'public/landing-pages/inner-green-3d.html', expectedSha: '69c3694bd63f44ef9f007ebe4dac57a83e4402e0cdf6b54dd10b96dd4f05e197', expectedBytes: 197914 },
  { path: 'public/landing-pages/inner-green-assets/three.min.js', expectedSha: '8a5f7249903b54d30f79f708699d2fed2d6a1d0741a4cd41377d1f01bb5a2271', expectedBytes: 608081 },
  { path: 'src/shaders/threeui.css', expectedSha: 'efe4447139f1358dd8e9be68edf6fa46cbefbd1de423a4d6c439ca61d2c8eccf', expectedBytes: 40715 },
  { path: 'public/landing-pages/inner-green-assets/card-ecostove.jpg', expectedSha: '70ce084084902bc502f00c366405b661ecdff90dee95d363b36a6e146829e433', expectedBytes: 290988 },
  { path: 'public/landing-pages/inner-green-assets/card-ethos.jpg', expectedSha: '337627390f499b3ae272cec9e2f83c817694a82f42e1aa10a7b26a2c7d679dff', expectedBytes: 316720 },
  { path: 'public/landing-pages/inner-green-assets/lexend-latin.woff2', expectedSha: '1ec8f6ee2750554b4bc59ff0b507d316a82a7ba37e0e5bebc41d3bd9b9faad46', expectedBytes: 39692 }
];

let allPassed = true;
for (const f of filesToCheck) {
  if (!fs.existsSync(f.path)) {
    console.error(`MISSING: ${f.path}`);
    allPassed = false;
    continue;
  }
  const buf = fs.readFileSync(f.path);
  const sha = crypto.createHash('sha256').update(buf).digest('hex');
  const shaMatch = sha === f.expectedSha;
  const byteMatch = buf.length === f.expectedBytes;
  if (!shaMatch || !byteMatch) allPassed = false;
  console.log(`${f.path}: bytes=${buf.length} (expected ${f.expectedBytes}, match: ${byteMatch}) | sha=${sha} (match: ${shaMatch})`);
}

console.log('\nOVERALL STATUS:', allPassed ? 'ALL 10 FILES MATCH EXACT SHA-256 AND BYTES!' : 'SOME FILES FAILED!');
if (!allPassed) process.exit(1);
