const fs = require('fs');
const path = require('path');

// List of page files to convert
const pageFiles = [
  'src/app/opportunities/page.tsx',
  'src/app/portfolio/page.tsx',
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

function convertPageToClient(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    
    // Skip if already has "use client"
    if (content.includes('"use client"')) {
      console.log(`Already client component: ${filePath}`);
      return;
    }

    // Remove metadata export if it exists
    content = content.replace(/export const metadata: Metadata = \{[\s\S]*?\};\n\n/g, '');
    content = content.replace(/import { Metadata } from "next";\n/g, '');
    
    // Add "use client" directive at the top
    content = '"use client";\n\n' + content;
    
    // Add useStyles import and usage
    if (!content.includes('useStyles')) {
      // Find the import section and add useStyles import
      const importMatch = content.match(/(import.*?from.*?;\n)+/);
      if (importMatch) {
        const imports = importMatch[0];
        const newImports = imports + 'import { useStyles } from "@/hooks/useStyles";\n';
        content = content.replace(imports, newImports);
      }
      
      // Find the main component function and add useStyles usage
      const componentMatch = content.match(/(export default function \w+\(\) \{)/);
      if (componentMatch) {
        const functionStart = componentMatch[1];
        const newFunctionStart = functionStart + '\n  const styles = useStyles(\'page\');\n';
        content = content.replace(functionStart, newFunctionStart);
      }
      
      // Wrap the return statement with styles.container
      content = content.replace(
        /return\s+<([^>]+)>/,
        'return (\n    <div className={styles.container}>\n      <$1>'
      );
      
      // Close the wrapper div
      content = content.replace(
        /<\/[^>]+>;?\s*$/,
        '    </div>\n  );'
      );
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(filePath, content);
    console.log(`Converted to client component: ${filePath}`);
    
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
  }
}

// Convert all page files
console.log('Converting page components to client components...');
pageFiles.forEach(convertPageToClient);
console.log('Conversion complete!');




