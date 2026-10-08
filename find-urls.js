const fs = require('fs');

const content = fs.readFileSync('public/landing-pages/inner-green-3d.html', 'utf8');

// Search for any URLs or asset references
const urlRegex = /(https?:\/\/[^\s"'<>]+|inner-green-assets\/[^\s"'<>]+)/g;
let match;
while ((match = urlRegex.exec(content)) !== null) {
  console.log('Found:', match[0]);
}
