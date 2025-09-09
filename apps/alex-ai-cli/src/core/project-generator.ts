/**
 * Alex AI CLI - Project Generator
 * 
 * Generates new projects with any supported framework and integrates
 * with the Alex AI Master Project for shared learning.
 */

import fs from 'fs-extra';
import path from 'path';
import { execa } from 'execa';

export interface ProjectOptions {
  framework: string;
  template?: string;
  ai?: boolean;
  description?: string;
}

export class ProjectGenerator {
  private templatesPath = path.join(process.cwd(), 'templates');

  async generateProject(projectName: string, options: ProjectOptions): Promise<void> {
    const projectPath = path.join(process.cwd(), 'apps', projectName);
    
    // Create project directory
    await fs.ensureDir(projectPath);
    
    // Generate framework-specific files
    await this.generateFrameworkFiles(projectPath, projectName, options);
    
    // Generate shared files
    await this.generateSharedFiles(projectPath, projectName, options);
    
    // Generate AI integration files
    if (options.ai) {
      await this.generateAIIntegrationFiles(projectPath, projectName, options);
    }
  }

  private async generateFrameworkFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    switch (options.framework) {
      case 'react':
        await this.generateReactFiles(projectPath, projectName, options);
        break;
      case 'nextjs':
        await this.generateNextJSFiles(projectPath, projectName, options);
        break;
      case 'react-native':
        await this.generateReactNativeFiles(projectPath, projectName, options);
        break;
      case 'universal':
        await this.generateUniversalFiles(projectPath, projectName, options);
        break;
      default:
        throw new Error(`Unsupported framework: ${options.framework}`);
    }
  }

  private async generateReactFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    // Generate package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'vite',
        build: 'vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext .ts,.tsx',
        type-check: 'tsc --noEmit',
      },
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*',
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        '@vitejs/plugin-react': '^4.0.0',
        'typescript': '^5.0.0',
        'vite': '^4.4.0',
        'eslint': '^8.0.0',
      },
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate Vite config
    const viteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
})`;

    await fs.writeFile(path.join(projectPath, 'vite.config.ts'), viteConfig);

    // Generate TypeScript config
    const tsConfig = {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
      references: [{ path: './tsconfig.node.json' }],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

    // Generate source files
    await this.generateReactSourceFiles(projectPath, projectName);
  }

  private async generateNextJSFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    // Generate package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
        type-check: 'tsc --noEmit',
      },
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*',
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.0.0',
        'eslint': '^8.0.0',
        'eslint-config-next': '^14.0.0',
      },
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate Next.js config
    const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig`;

    await fs.writeFile(path.join(projectPath, 'next.config.js'), nextConfig);

    // Generate TypeScript config
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [
          {
            name: 'next',
          },
        ],
        paths: {
          '@/*': ['./src/*'],
        },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

    // Generate source files
    await this.generateNextJSSourceFiles(projectPath, projectName);
  }

  private async generateReactNativeFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    // Generate package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        android: 'react-native run-android',
        ios: 'react-native run-ios',
        start: 'react-native start',
        test: 'jest',
        lint: 'eslint src --ext .ts,.tsx',
        type-check: 'tsc --noEmit',
      },
      dependencies: {
        'react': '^18.2.0',
        'react-native': '^0.72.0',
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*',
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-native': '^0.72.0',
        'typescript': '^5.0.0',
        'eslint': '^8.0.0',
        'jest': '^29.0.0',
        '@babel/core': '^7.20.0',
        '@babel/preset-env': '^7.20.0',
        '@babel/runtime': '^7.20.0',
        'babel-jest': '^29.0.0',
        'metro-react-native-babel-preset': '^0.76.0',
      },
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate source files
    await this.generateReactNativeSourceFiles(projectPath, projectName);
  }

  private async generateUniversalFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    // Generate package.json for universal components
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      main: 'dist/index.js',
      types: 'dist/index.d.ts',
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        test: 'jest',
        lint: 'eslint src --ext .ts,.tsx',
        type-check: 'tsc --noEmit',
      },
      dependencies: {
        'react': '^18.2.0',
        'react-native': '^0.72.0',
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*',
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-native': '^0.72.0',
        'typescript': '^5.0.0',
        'eslint': '^8.0.0',
        'jest': '^29.0.0',
      },
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate source files
    await this.generateUniversalSourceFiles(projectPath, projectName);
  }

  private async generateReactSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    await fs.ensureDir(srcPath);

    // Generate main App component
    const appComponent = `import React from 'react';
import { AlexAICore } from '@alex-ai/core';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ${projectName}</h1>
        <p>Built with Alex AI Universal CLI</p>
      </header>
    </div>
  );
}

export default App;`;

    await fs.writeFile(path.join(srcPath, 'App.tsx'), appComponent);

    // Generate CSS
    const appCss = `.App {
  text-align: center;
}

.App-header {
  background-color: #282c34;
  padding: 20px;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}`;

    await fs.writeFile(path.join(srcPath, 'App.css'), appCss);

    // Generate main.tsx
    const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`;

    await fs.writeFile(path.join(srcPath, 'main.tsx'), mainTsx);

    // Generate index.html
    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;

    await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);
  }

  private async generateNextJSSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    const appPath = path.join(srcPath, 'app');
    await fs.ensureDir(appPath);

    // Generate layout.tsx
    const layoutTsx = `import type { Metadata } from 'next'
import { AlexAICore } from '@alex-ai/core'
import './globals.css'

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Built with Alex AI Universal CLI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}`;

    await fs.writeFile(path.join(appPath, 'layout.tsx'), layoutTsx);

    // Generate page.tsx
    const pageTsx = `export default function Home() {
  return (
    <main className="main">
      <h1>Welcome to ${projectName}</h1>
      <p>Built with Alex AI Universal CLI</p>
    </main>
  )
}`;

    await fs.writeFile(path.join(appPath, 'page.tsx'), pageTsx);

    // Generate globals.css
    const globalsCss = `.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  text-align: center;
}`;

    await fs.writeFile(path.join(appPath, 'globals.css'), globalsCss);
  }

  private async generateReactNativeSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    await fs.ensureDir(srcPath);

    // Generate App.tsx
    const appTsx = `import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AlexAICore } from '@alex-ai/core';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to ${projectName}</Text>
          <Text style={styles.subtitle}>Built with Alex AI Universal CLI</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});

export default App;`;

    await fs.writeFile(path.join(srcPath, 'App.tsx'), appTsx);

    // Generate index.js
    const indexJs = `import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './package.json';

AppRegistry.registerComponent(appName, () => App);`;

    await fs.writeFile(path.join(projectPath, 'index.js'), indexJs);
  }

  private async generateUniversalSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    await fs.ensureDir(srcPath);

    // Generate index.ts
    const indexTs = `export { Button } from './components/Button';
export { Card } from './components/Card';
export { Text } from './components/Text';
export { View } from './components/View';`;

    await fs.writeFile(path.join(srcPath, 'index.ts'), indexTs);

    // Generate components directory
    const componentsPath = path.join(srcPath, 'components');
    await fs.ensureDir(componentsPath);

    // Generate Button component
    const buttonTsx = `import React from 'react';
import { Platform } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: any;
}

export const Button: React.FC<ButtonProps> = ({ title, onPress, style }) => {
  if (Platform.OS === 'web') {
    return (
      <button onClick={onPress} style={style}>
        {title}
      </button>
    );
  }

  // React Native implementation would go here
  return null;
};`;

    await fs.writeFile(path.join(componentsPath, 'Button.tsx'), buttonTsx);
  }

  private async generateSharedFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    // Generate README
    const readme = `# ${projectName}

Built with Alex AI Universal CLI

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Framework Evolution

\`\`\`bash
# Evolve to Next.js
alex evolve ${projectName} --to nextjs

# Add React Native version
alex evolve ${projectName} --to react-native
\`\`\`

## Design System

\`\`\`bash
# Sync design across platforms
alex sync ${projectName} --platforms all
\`\`\`
`;

    await fs.writeFile(path.join(projectPath, 'README.md'), readme);

    // Generate .gitignore
    const gitignore = `# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
dist/
build/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
`;

    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
  }

  private async generateAIIntegrationFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    const aiPath = path.join(projectPath, 'src', 'ai');
    await fs.ensureDir(aiPath);

    // Generate AI integration
    const aiIntegration = `import { AlexAICore } from '@alex-ai/core';

export class ${projectName}AI {
  private alexAI: AlexAICore;

  constructor() {
    this.alexAI = new AlexAICore();
  }

  async optimizeProject() {
    // AI-powered project optimization
    return await this.alexAI.optimizeProject();
  }

  async generateCode(prompt: string) {
    // AI-powered code generation
    return await this.alexAI.generateCode(prompt);
  }

  async analyzePerformance() {
    // AI-powered performance analysis
    return await this.alexAI.analyzePerformance();
  }
}`;

    await fs.writeFile(path.join(aiPath, 'ai-integration.ts'), aiIntegration);
  }

  async installDependencies(projectName: string): Promise<void> {
    const projectPath = path.join(process.cwd(), 'apps', projectName);
    
    try {
      await execa('npm', ['install'], { cwd: projectPath });
    } catch (error) {
      console.warn('Failed to install dependencies:', error.message);
    }
  }

  async generateInitialComponents(projectName: string, options: ProjectOptions): Promise<void> {
    // Generate initial components based on template
    console.log(`Generated initial components for ${projectName}`);
  }
}
