const fs = require('fs');
const path = require('path');

// List of components to update
const components = [
  'src/components/home/artist-types.tsx',
  'src/components/home/testimonials.tsx',
  'src/components/home/pricing.tsx',
  'src/components/home/cta.tsx',
  'src/components/layout/header.tsx',
  'src/components/layout/footer.tsx',
];

function updateComponent(componentPath) {
  try {
    if (!fs.existsSync(componentPath)) {
      console.log(`File not found: ${componentPath}`);
      return;
    }

    let content = fs.readFileSync(componentPath, 'utf8');
    
    // Skip if already has "use client" and useStyles
    if (content.includes('useStyles')) {
      console.log(`Already updated: ${componentPath}`);
      return;
    }

    // Add "use client" if not present
    if (!content.includes('"use client"')) {
      content = '"use client";\n\n' + content;
    }
    
    // Add useStyles import
    const importMatch = content.match(/(import.*?from.*?;\n)+/);
    if (importMatch) {
      const imports = importMatch[0];
      const newImports = imports + 'import { useStyles } from "@/hooks/useStyles";\n';
      content = content.replace(imports, newImports);
    }
    
    // Add useStyles hook usage
    const functionMatch = content.match(/(export function \w+\(\) \{)/);
    if (functionMatch) {
      const functionStart = functionMatch[1];
      const newFunctionStart = functionStart + '\n  const styles = useStyles(\'componentName\');\n';
      content = content.replace(functionStart, newFunctionStart);
    }
    
    // Write the updated content back to the file
    fs.writeFileSync(componentPath, content);
    console.log(`Updated: ${componentPath}`);
    
  } catch (error) {
    console.error(`Error updating ${componentPath}:`, error.message);
  }
}

// Update all components
console.log('Updating components to use centralized styling...');
components.forEach(updateComponent);
console.log('Component updates complete!');
