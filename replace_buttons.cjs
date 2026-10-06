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

const files = walk('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const buttonRegex = /<button([\s\S]*?)>([\s\S]*?)<\/button>/g;
  
  content = content.replace(buttonRegex, (match, attrs, inner) => {
    const textContext = inner.toLowerCase();
    const isAction = /submit|save|approve|reject|add|edit|delete|cancel|login|logout|search|filter|pass|clear|confirm|review|receipt|sign in|create account/i.test(textContext);
    
    if (!isAction) return match;

    changed = true;
    
    let newAttrs = attrs.replace(/className=(['"{`])([\s\S]*?)(['"}`])/g, (clsMatch, q1, clsInner, q2) => {
       let layoutClasses = [];
       // handle dynamic classnames loosely by just taking strings
       const clean = clsInner.replace(/[\$\{\}\`\n\r]/g, ' ');
       const parts = clean.split(/\s+/);
       parts.forEach(p => {
         if (p.startsWith('w-') || p.startsWith('m') || p.startsWith('flex-1') || p.startsWith('self-') || p === 'mt-6') {
           layoutClasses.push(p);
         }
       });
       if (layoutClasses.length > 0) {
         return 'className="' + layoutClasses.join(' ') + '"';
       }
       return '';
    });
    
    // Also remove type="button" if it's there? It's fine to leave it.
    
    return '<Button' + newAttrs + '>' + inner + '</Button>';
  });

  if (changed) {
    if (!content.includes('import Button from')) {
      const dirPath = path.dirname(file);
      const targetPath = path.join(process.cwd(), 'src/components/UI/Button');
      let relative = path.relative(dirPath, targetPath).replace(/\\/g, '/');
      if (!relative.startsWith('.')) relative = './' + relative;
      const importStmt = 'import Button from \'' + relative + '\';\n';
      
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, nextLineIndex + 1) + importStmt + content.slice(nextLineIndex + 1);
      } else {
        content = importStmt + content;
      }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated', file);
  }
});
