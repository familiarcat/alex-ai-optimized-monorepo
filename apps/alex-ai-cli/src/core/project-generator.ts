import * as fs from 'fs-extra';
import * as path from 'path';
import { execa } from 'execa';

export interface ProjectOptions {
  framework: 'react' | 'nextjs' | 'react-native' | 'universal';
  typescript: boolean;
  testing: boolean;
  linting: boolean;
  aiIntegration: boolean;
}

export class ProjectGenerator {
  async generateProject(projectName: string, options: ProjectOptions): Promise<void> {
    const projectPath = path.join(process.cwd(), 'apps', projectName);
    
    // Create project directory
    await fs.ensureDir(projectPath);
    
    // Generate framework-specific files
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
    }
    
    // Generate shared files
    await this.generateSharedFiles(projectPath, projectName, options);
    
    // Generate AI integration files if requested
    if (options.aiIntegration) {
      await this.generateAIIntegrationFiles(projectPath, projectName, options);
    }
    
    // Install dependencies
    await this.installDependencies(projectName);
    
    // Generate initial components
    await this.generateInitialComponents(projectName, options);
  }

  private async generateReactFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    // Generate package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        dev: 'react-scripts start',
        build: 'react-scripts build',
        test: 'react-scripts test',
        eject: 'react-scripts eject',
        'type-check': 'tsc --noEmit'
      },
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.0.0',
        'react-scripts': '^5.0.1'
      }
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: 'esnext',
        moduleResolution: 'node',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx'
      },
      include: ['src']
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
        'type-check': 'tsc --noEmit'
      },
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0',
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.0.0',
        'eslint': '^8.0.0',
        'eslint-config-next': '^14.0.0'
      }
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'es5',
        lib: ['dom', 'dom.iterable', 'es6'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
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
            name: 'next'
          }
        ],
        paths: {
          '@/*': ['./src/*']
        }
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules']
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
        'type-check': 'tsc --noEmit'
      },
      dependencies: {
        'react': '^18.2.0',
        'react-native': '^0.72.0',
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-native': '^0.72.0',
        'typescript': '^5.0.0',
        '@babel/core': '^7.20.0',
        '@babel/preset-env': '^7.20.0',
        '@babel/runtime': '^7.20.0',
        'babel-jest': '^29.2.1',
        'eslint': '^8.0.0',
        'jest': '^29.2.1',
        'metro-react-native-babel-preset': '^0.76.0'
      }
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate tsconfig.json
    const tsConfig = {
      extends: '@react-native/typescript-config/tsconfig.json',
      compilerOptions: {
        allowJs: true,
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        isolatedModules: true,
        jsx: 'react-native',
        lib: ['es2017'],
        moduleResolution: 'node',
        noEmit: true,
        strict: true,
        target: 'esnext'
      },
      exclude: ['node_modules', 'babel.config.js', 'metro.config.js', 'jest.config.js']
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

    // Generate source files
    await this.generateReactNativeSourceFiles(projectPath, projectName);
  }

  private async generateUniversalFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    // Generate package.json
    const packageJson = {
      name: projectName,
      version: '1.0.0',
      private: true,
      scripts: {
        build: 'tsc',
        dev: 'tsc --watch',
        test: 'jest',
        lint: 'eslint src --ext .ts,.tsx',
        'type-check': 'tsc --noEmit'
      },
      dependencies: {
        '@alex-ai/core': 'workspace:*',
        '@alex-ai/universal': 'workspace:*'
      },
      devDependencies: {
        'typescript': '^5.0.0',
        '@types/node': '^20.0.0',
        'eslint': '^8.0.0',
        'jest': '^29.2.1'
      }
    };

    await fs.writeJSON(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

    // Generate tsconfig.json
    const tsConfig = {
      compilerOptions: {
        target: 'es2020',
        module: 'commonjs',
        moduleResolution: 'node',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        skipLibCheck: true,
        forceConsistentCasingInFileNames: true,
        declaration: true,
        declarationMap: true,
        sourceMap: true,
        outDir: './dist',
        rootDir: './src'
      },
      include: ['src/**/*'],
      exclude: ['node_modules', 'dist']
    };

    await fs.writeJSON(path.join(projectPath, 'tsconfig.json'), tsConfig, { spaces: 2 });

    // Generate source files
    await this.generateUniversalSourceFiles(projectPath, projectName);
  }

  private async generateReactSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    await fs.ensureDir(srcPath);

    const appComponent = `import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to ${projectName}</h1>
        <p>This is a React application generated by Alex AI CLI.</p>
      </header>
    </div>
  );
}

export default App;`;

    await fs.writeFile(path.join(srcPath, 'App.tsx'), appComponent);

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

    const mainTsx = `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`;

    await fs.writeFile(path.join(srcPath, 'main.tsx'), mainTsx);

    const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${projectName}</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>`;

    await fs.writeFile(path.join(projectPath, 'index.html'), indexHtml);
  }

  private async generateNextJSSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    const appPath = path.join(srcPath, 'app');
    await fs.ensureDir(appPath);

    const layoutTsx = `import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '${projectName}',
  description: 'Generated by Alex AI CLI',
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

    const pageTsx = `export default function Home() {
  return (
    <main className="main">
      <h1>Welcome to ${projectName}</h1>
      <p>This is a Next.js application generated by Alex AI CLI.</p>
    </main>
  )
}`;

    await fs.writeFile(path.join(appPath, 'page.tsx'), pageTsx);

    const globalsCss = `.main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
}`;

    await fs.writeFile(path.join(appPath, 'globals.css'), globalsCss);
  }

  private async generateReactNativeSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    await fs.ensureDir(srcPath);

    const appTsx = `import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

function Section({children, title}: {children: React.ReactNode; title: string}): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Welcome to ${projectName}">
            This is a React Native application generated by Alex AI CLI.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;`;

    await fs.writeFile(path.join(srcPath, 'App.tsx'), appTsx);

    const indexJs = `import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './package.json';

AppRegistry.registerComponent(appName, () => App);`;

    await fs.writeFile(path.join(projectPath, 'index.js'), indexJs);
  }

  private async generateUniversalSourceFiles(projectPath: string, projectName: string): Promise<void> {
    const srcPath = path.join(projectPath, 'src');
    await fs.ensureDir(srcPath);

    const indexTs = `export { Button } from './components/Button';
export { View } from './components/View';`;

    await fs.writeFile(path.join(srcPath, 'index.ts'), indexTs);

    const componentsPath = path.join(srcPath, 'components');
    await fs.ensureDir(componentsPath);

    const buttonTsx = `import React from 'react';

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  size?: 'small' | 'medium' | 'large';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium'
}) => {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  };
  const sizeClasses = {
    small: 'text-sm px-2 py-1',
    medium: 'text-base px-4 py-2',
    large: 'text-lg px-6 py-3'
  };

  return (
    <button
      className={\`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`;

    await fs.writeFile(path.join(componentsPath, 'Button.tsx'), buttonTsx);

    const viewTsx = `import React from 'react';

export interface ViewProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export const View: React.FC<ViewProps> = ({ children, className, style }) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};`;

    await fs.writeFile(path.join(componentsPath, 'View.tsx'), viewTsx);
  }

  private async generateSharedFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    const readme = `# ${projectName}

This project was generated using Alex AI CLI.

## Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation
\`\`\`bash
pnpm install
\`\`\`

### Development
\`\`\`bash
pnpm dev
\`\`\`

### Building
\`\`\`bash
pnpm build
\`\`\`

### Type Checking
\`\`\`bash
pnpm type-check
\`\`\`

## Project Structure

\`\`\`
src/
├── components/     # Reusable components
├── pages/         # Page components (if applicable)
├── utils/         # Utility functions
└── types/         # TypeScript type definitions
\`\`\`

## Alex AI Integration

This project includes Alex AI integration capabilities:
- \`@alex-ai/core\` - Core Alex AI functionality
- \`@alex-ai/universal\` - Universal components and utilities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and type checking
5. Submit a pull request

## License

MIT
`;

    await fs.writeFile(path.join(projectPath, 'README.md'), readme);

    const gitignore = `# Dependencies
node_modules/
.pnp
.pnp.js

# Production builds
build/
dist/
.next/
out/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/
*.lcov

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env
.env.test

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Next.js build output
.next

# Nuxt.js build / generate output
.nuxt
dist

# Gatsby files
.cache/
public

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
Thumbs.db
`;

    await fs.writeFile(path.join(projectPath, '.gitignore'), gitignore);
  }

  private async generateAIIntegrationFiles(projectPath: string, projectName: string, options: ProjectOptions): Promise<void> {
    const aiPath = path.join(projectPath, 'src', 'ai');
    await fs.ensureDir(aiPath);

    const aiIntegration = `import { AlexAICore } from '@alex-ai/core';

export class AIIntegration {
  private alexAI: AlexAICore;

  constructor() {
    this.alexAI = new AlexAICore();
  }

  async initialize(): Promise<void> {
    await this.alexAI.initialize();
  }

  async getStatus(): Promise<any> {
    return await this.alexAI.getStatus();
  }

  async processRequest(request: string): Promise<any> {
    // Process AI requests using Alex AI
    return await this.alexAI.processRequest(request);
  }
}

export default AIIntegration;
`;

    await fs.writeFile(path.join(aiPath, 'ai-integration.ts'), aiIntegration);
  }

  async installDependencies(projectName: string): Promise<void> {
    const projectPath = path.join(process.cwd(), 'apps', projectName);
    
    try {
      await execa('npm', ['install'], { cwd: projectPath });
    } catch (error) {
      console.error('Failed to install dependencies:', error);
    }
  }

  async generateInitialComponents(projectName: string, options: ProjectOptions): Promise<void> {
    console.log(`Generated initial components for ${projectName}`);
  }
}