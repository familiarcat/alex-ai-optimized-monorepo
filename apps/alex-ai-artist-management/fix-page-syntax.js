const fs = require('fs');
const path = require('path');

// List of page files to fix
const pageFiles = [
  'src/app/bookings/page.tsx',
  'src/app/analytics/page.tsx',
  'src/app/features/page.tsx',
  'src/app/pricing/page.tsx',
  'src/app/about/page.tsx',
  'src/app/contact/page.tsx',
  'src/app/artists/musicians/page.tsx',
  'src/app/artists/performers/page.tsx',
  'src/app/artists/visual/page.tsx',
  'src/app/artists/writers/page.tsx',
  'src/app/community/page.tsx',
  'src/app/careers/page.tsx',
  'src/app/help/page.tsx',
  'src/app/docs/page.tsx',
  'src/app/blog/page.tsx',
  'src/app/press/page.tsx',
  'src/app/integrations/page.tsx',
  'src/app/api/page.tsx',
  'src/app/privacy/page.tsx',
  'src/app/terms/page.tsx',
  'src/app/cookies/page.tsx',
];

function fixPageSyntax(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix the common syntax error pattern
    // Pattern: <Component />; } -> <Component />\n    </div>\n  );\n}
    const syntaxErrorPattern = /(\s+<[A-Za-z]+[^>]*\/>);\s*}/g;
    const fixedContent = content.replace(syntaxErrorPattern, (match, component) => {
      return `${component}\n    </div>\n  );\n}`;
    });
    
    if (fixedContent !== content) {
      fs.writeFileSync(filePath, fixedContent);
      console.log(`Fixed syntax error: ${filePath}`);
    } else {
      console.log(`No syntax errors found: ${filePath}`);
    }
    
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all page files
console.log('Fixing page component syntax errors...');
pageFiles.forEach(fixPageSyntax);
console.log('Syntax fixes complete!');



