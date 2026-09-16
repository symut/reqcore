const fs = require('fs');
const glob = require('glob'); // Note: reqcore is a node project, but wait I can just use fs with recursive readdir

const path = require('path');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk('app', (filePath) => {
  if (filePath.endsWith('.vue') || filePath.endsWith('.ts')) {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('navigator.clipboard.writeText')) {
      const newContent = content.replace(/navigator\.clipboard\.writeText/g, 'copyToClipboard');
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated', filePath);
    }
  }
});
