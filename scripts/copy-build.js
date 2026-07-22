const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const rootDir = path.resolve(__dirname, '..');
const frontendDist = path.join(rootDir, 'frontend', 'dist');

if (fs.existsSync(frontendDist)) {
  copyDir(frontendDist, path.join(rootDir, 'public'));
  copyDir(frontendDist, path.join(rootDir, 'dist'));
  console.log('Successfully copied frontend/dist to root public and dist directories.');
} else {
  console.error('frontend/dist directory does not exist.');
}
