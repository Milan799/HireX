const fs = require('fs');
const path = require('path');

const walkSync = function(dir, filelist) {
  const files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        filelist = walkSync(fullPath, filelist);
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.js')) {
        filelist.push(fullPath);
      }
    }
  });
  return filelist;
};

const replaceInFiles = (rootDir) => {
  const files = walkSync(rootDir);
  let changedFilesCount = 0;
  
  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    // Replace hardcoded localhost:5000/api strings
    content = content.replace(/"http:\/\/localhost:5000\/api/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}');
    content = content.replace(/'http:\/\/localhost:5000\/api/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}');
    
    // Fix string interpolation that we just broke
    // e.g. `${process.env.../api}/some/path`
    content = content.replace(/}`(\/.*?)`/g, '}$1`'); // If they use template literals
    
    // Handle things that were already template literals
    // e.g. `http://localhost:5000/api/auth/.../${var}` -> `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/auth/.../${var}`
    content = content.replace(/`http:\/\/localhost:5000\/api/g, '`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}');

    // Also fix generic http://localhost:5000 without /api just in case
    // content = content.replace(/"http:\/\/localhost:5000"/g, 'process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || "http://localhost:5000"');

    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log(`Updated: ${file}`);
      changedFilesCount++;
    }
  }
  
  console.log(`Replaced in ${changedFilesCount} files for ${rootDir}`);
};

replaceInFiles('d:/HireX/HireX_Admin/src');
replaceInFiles('d:/HireX/HireX_Frontend/src');
