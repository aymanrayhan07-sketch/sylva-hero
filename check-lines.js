const fs = require('fs');

const content = fs.readFileSync('public/landing-pages/inner-green-3d.html', 'utf8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Let's check line 4304 and 4305
console.log('Last 5 lines:');
for (let i = Math.max(0, lines.length - 5); i < lines.length; i++) {
  console.log(i + 1, JSON.stringify(lines[i]));
}
