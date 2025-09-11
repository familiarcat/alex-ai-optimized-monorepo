export interface FrameworkConfig {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
  scripts: Record<string, string>;
}

export class FrameworkTranslator {
  private frameworks: Map<string, FrameworkConfig> = new Map();

  constructor() {
    this.initializeFrameworks();
  }

  private initializeFrameworks(): void {
    this.frameworks.set('react', {
      name: 'react',
      version: '^18.2.0',
      dependencies: {
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.0.0'
      },
      scripts: {
        'dev': 'react-scripts start',
        'build': 'react-scripts build',
        'test': 'react-scripts test'
      }
    });

    this.frameworks.set('nextjs', {
      name: 'nextjs',
      version: '^14.0.0',
      dependencies: {
        'next': '^14.0.0',
        'react': '^18.2.0',
        'react-dom': '^18.2.0'
      },
      devDependencies: {
        '@types/node': '^20.0.0',
        '@types/react': '^18.2.0',
        '@types/react-dom': '^18.2.0',
        'typescript': '^5.0.0'
      },
      scripts: {
        'dev': 'next dev',
        'build': 'next build',
        'start': 'next start'
      }
    });
  }

  translate(from: string, to: string): FrameworkConfig | null {
    const sourceFramework = this.frameworks.get(from);
    const targetFramework = this.frameworks.get(to);

    if (!sourceFramework || !targetFramework) {
      return null;
    }

    return {
      ...targetFramework,
      name: to
    };
  }

  getSupportedFrameworks(): string[] {
    return Array.from(this.frameworks.keys());
  }
}
