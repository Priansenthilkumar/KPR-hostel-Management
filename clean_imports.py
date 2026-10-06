import re
import collections

with open('lint_results.txt', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to extract: Identifier 'X' is imported but never used. ,-[src/file.jsx:line:col]
pattern = r"Identifier '([^']+)' is imported but never used\.\s*,\-\[([^:]+):"

file_removals = collections.defaultdict(set)
for match in re.finditer(pattern, text):
    var_name = match.group(1)
    file_path = match.group(2)
    file_removals[file_path].add(var_name)

print("Removals found:", file_removals)

for file_path, vars_to_remove in file_removals.items():
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # For each variable, remove it from import statements
        for var in vars_to_remove:
            # Matches: import { ..., VarName, ... }
            # Or import VarName from
            # We'll handle standard destructuring imports
            content = re.sub(r'\b' + var + r'\s*,\s*', '', content)
            content = re.sub(r',\s*\b' + var + r'\b', '', content)
            content = re.sub(r'{\s*\b' + var + r'\b\s*}', '{}', content)
            
        # Clean up empty imports: import {} from 'lucide-react';
        content = re.sub(r'import\s*{\s*}\s*from\s*[\'"][^\'"]+[\'"];?\n?', '', content)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        print(f"Cleaned {file_path}")
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
