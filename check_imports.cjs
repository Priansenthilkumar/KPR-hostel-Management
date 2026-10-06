const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) { 
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) { 
      results.push(file);
    }
  });
  return results;
}

let allOk = true;
const files = walk('./src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const match = content.match(/import Button from ['"]([^'"]+)['"]/);
  if (match) {
    const importPath = match[1];
    let resolvedPath = path.resolve(path.dirname(f), importPath);
    if (!resolvedPath.endsWith('.jsx') && !resolvedPath.endsWith('.js')) {
      resolvedPath += '.jsx';
    }
    if (!fs.existsSync(resolvedPath)) {
      console.error('BROKEN IMPORT IN', f, '->', importPath, 'Resolved to:', resolvedPath);
      allOk = false;
    }
  }
});
if (allOk) console.log('All Button imports are OK.');
