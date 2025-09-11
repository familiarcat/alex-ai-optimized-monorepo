"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FrameworkTranslator = void 0;
class FrameworkTranslator {
    constructor() {
        this.frameworks = new Map();
        this.initializeFrameworks();
    }
    initializeFrameworks() {
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
    translate(from, to) {
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
    getSupportedFrameworks() {
        return Array.from(this.frameworks.keys());
    }
}
exports.FrameworkTranslator = FrameworkTranslator;
//# sourceMappingURL=framework-translator.js.map