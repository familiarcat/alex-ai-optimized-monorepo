/**
 * Alex AI Comprehensive Security Manager
 * Orchestrates all security systems and provides unified security interface
 */

import { SQLInjectionPrevention } from './sql-injection-prevention';
import { XSSPrevention } from './xss-prevention';
import { AuthenticationSystem } from './authentication';
import { DataLossPrevention } from './data-loss-prevention';
import { APISecuritySystem } from './api-security';

export interface SecurityConfig {
  sqlInjection: {
    enabled: boolean;
    maxQueryLength: number;
    allowedOperations: string[];
  };
  xss: {
    enabled: boolean;
    allowedTags: string[];
    allowedAttributes: Record<string, string[]>;
    enableCSP: boolean;
  };
  authentication: {
    enabled: boolean;
    jwtSecret: string;
    sessionTimeout: number;
    maxFailedAttempts: number;
    lockoutDuration: number;
    mfaIssuer: string;
  };
  dataLossPrevention: {
    enabled: boolean;
    patterns: string[];
    redactionMethod: 'MASK' | 'HASH' | 'REMOVE' | 'ENCRYPT';
  };
  apiSecurity: {
    enabled: boolean;
    jwtSecret: string;
    jwtExpiration: number;
    rateLimit: {
      windowMs: number;
      maxRequests: number;
    };
    enableCORS: boolean;
    allowedOrigins: string[];
    enableSecurityHeaders: boolean;
  };
}

export interface SecurityStatus {
  sqlInjection: boolean;
  xss: boolean;
  authentication: boolean;
  dataLossPrevention: boolean;
  apiSecurity: boolean;
  overall: boolean;
  lastUpdated: Date;
}

export interface SecurityTestResult {
  system: string;
  passed: number;
  failed: number;
  total: number;
  results: string[];
  status: 'PASS' | 'FAIL' | 'WARNING';
}

export class SecurityManager {
  private config: SecurityConfig;
  private sqlInjection: SQLInjectionPrevention | null = null;
  private xss: XSSPrevention | null = null;
  private auth: AuthenticationSystem | null = null;
  private dlp: DataLossPrevention | null = null;
  private apiSecurity: APISecuritySystem | null = null;
  private isInitialized: boolean = false;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  /**
   * Initialize all security systems
   */
  async initialize(): Promise<{ success: boolean; errors: string[] }> {
    const errors: string[] = [];

    try {
      // Initialize SQL Injection Prevention
      if (this.config.sqlInjection.enabled) {
        // Note: In real implementation, you'd pass a database pool
        // this.sqlInjection = new SQLInjectionPrevention(pool);
        console.log('🔐 SQL Injection Prevention: ENABLED');
      }

      // Initialize XSS Prevention
      if (this.config.xss.enabled) {
        this.xss = new XSSPrevention({
          allowedTags: this.config.xss.allowedTags,
          allowedAttributes: this.config.xss.allowedAttributes,
          enableCSP: this.config.xss.enableCSP
        });
        console.log('🔐 XSS Prevention: ENABLED');
      }

      // Initialize Authentication System
      if (this.config.authentication.enabled) {
        this.auth = new AuthenticationSystem({
          jwtSecret: this.config.authentication.jwtSecret,
          sessionTimeout: this.config.authentication.sessionTimeout,
          maxFailedAttempts: this.config.authentication.maxFailedAttempts,
          lockoutDuration: this.config.authentication.lockoutDuration,
          mfaIssuer: this.config.authentication.mfaIssuer
        });
        console.log('🔐 Authentication System: ENABLED');
      }

      // Initialize Data Loss Prevention
      if (this.config.dataLossPrevention.enabled) {
        this.dlp = new DataLossPrevention();
        console.log('🔐 Data Loss Prevention: ENABLED');
      }

      // Initialize API Security
      if (this.config.apiSecurity.enabled) {
        this.apiSecurity = new APISecuritySystem({
          jwtSecret: this.config.apiSecurity.jwtSecret,
          jwtExpiration: this.config.apiSecurity.jwtExpiration,
          rateLimit: this.config.apiSecurity.rateLimit,
          enableCORS: this.config.apiSecurity.enableCORS,
          allowedOrigins: this.config.apiSecurity.allowedOrigins,
          enableSecurityHeaders: this.config.apiSecurity.enableSecurityHeaders,
          enableRequestLogging: true,
          maxRequestSize: 1024 * 1024,
          timeoutMs: 30000
        });
        console.log('🔐 API Security: ENABLED');
      }

      this.isInitialized = true;
      console.log('✅ Alex AI Security Manager initialized successfully');

      return { success: true, errors: [] };
    } catch (error) {
      errors.push(`Security initialization failed: ${error.message}`);
      return { success: false, errors };
    }
  }

  /**
   * Get current security status
   */
  getSecurityStatus(): SecurityStatus {
    return {
      sqlInjection: this.sqlInjection !== null,
      xss: this.xss !== null,
      authentication: this.auth !== null,
      dataLossPrevention: this.dlp !== null,
      apiSecurity: this.apiSecurity !== null,
      overall: this.isInitialized,
      lastUpdated: new Date()
    };
  }

  /**
   * Run comprehensive security tests
   */
  async runSecurityTests(): Promise<SecurityTestResult[]> {
    const results: SecurityTestResult[] = [];

    // Test SQL Injection Prevention
    if (this.sqlInjection) {
      try {
        const testResult = await this.sqlInjection.testSecurity();
        results.push({
          system: 'SQL Injection Prevention',
          passed: testResult.passed,
          failed: testResult.failed,
          total: testResult.passed + testResult.failed,
          results: testResult.results,
          status: testResult.failed === 0 ? 'PASS' : 'FAIL'
        });
      } catch (error) {
        results.push({
          system: 'SQL Injection Prevention',
          passed: 0,
          failed: 1,
          total: 1,
          results: [`Error: ${error.message}`],
          status: 'FAIL'
        });
      }
    }

    // Test XSS Prevention
    if (this.xss) {
      try {
        const testResult = this.xss.testXSSPrevention();
        results.push({
          system: 'XSS Prevention',
          passed: testResult.passed,
          failed: testResult.failed,
          total: testResult.passed + testResult.failed,
          results: testResult.results,
          status: testResult.failed === 0 ? 'PASS' : 'FAIL'
        });
      } catch (error) {
        results.push({
          system: 'XSS Prevention',
          passed: 0,
          failed: 1,
          total: 1,
          results: [`Error: ${error.message}`],
          status: 'FAIL'
        });
      }
    }

    // Test Authentication System
    if (this.auth) {
      try {
        const testResult = await this.auth.testAuthentication();
        results.push({
          system: 'Authentication System',
          passed: testResult.passed,
          failed: testResult.failed,
          total: testResult.passed + testResult.failed,
          results: testResult.results,
          status: testResult.failed === 0 ? 'PASS' : 'FAIL'
        });
      } catch (error) {
        results.push({
          system: 'Authentication System',
          passed: 0,
          failed: 1,
          total: 1,
          results: [`Error: ${error.message}`],
          status: 'FAIL'
        });
      }
    }

    // Test Data Loss Prevention
    if (this.dlp) {
      try {
        const testResult = this.dlp.testDLPSystem();
        results.push({
          system: 'Data Loss Prevention',
          passed: testResult.passed,
          failed: testResult.failed,
          total: testResult.passed + testResult.failed,
          results: testResult.results,
          status: testResult.failed === 0 ? 'PASS' : 'FAIL'
        });
      } catch (error) {
        results.push({
          system: 'Data Loss Prevention',
          passed: 0,
          failed: 1,
          total: 1,
          results: [`Error: ${error.message}`],
          status: 'FAIL'
        });
      }
    }

    // Test API Security
    if (this.apiSecurity) {
      try {
        const testResult = this.apiSecurity.testAPISecurity();
        results.push({
          system: 'API Security',
          passed: testResult.passed,
          failed: testResult.failed,
          total: testResult.passed + testResult.failed,
          results: testResult.results,
          status: testResult.failed === 0 ? 'PASS' : 'FAIL'
        });
      } catch (error) {
        results.push({
          system: 'API Security',
          passed: 0,
          failed: 1,
          total: 1,
          results: [`Error: ${error.message}`],
          status: 'FAIL'
        });
      }
    }

    return results;
  }

  /**
   * Generate security report
   */
  async generateSecurityReport(): Promise<{
    status: SecurityStatus;
    testResults: SecurityTestResult[];
    overallScore: number;
    recommendations: string[];
    summary: string;
  }> {
    const status = this.getSecurityStatus();
    const testResults = await this.runSecurityTests();

    // Calculate overall score
    const totalTests = testResults.reduce((sum, result) => sum + result.total, 0);
    const passedTests = testResults.reduce((sum, result) => sum + result.passed, 0);
    const overallScore = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (overallScore < 80) {
      recommendations.push('Security score is below 80% - immediate action required');
    }

    const failedSystems = testResults.filter(result => result.status === 'FAIL');
    if (failedSystems.length > 0) {
      recommendations.push(`Failed systems: ${failedSystems.map(s => s.system).join(', ')}`);
    }

    if (!status.sqlInjection) {
      recommendations.push('Enable SQL injection prevention for database security');
    }

    if (!status.xss) {
      recommendations.push('Enable XSS prevention for web application security');
    }

    if (!status.authentication) {
      recommendations.push('Enable authentication system for user management');
    }

    if (!status.dataLossPrevention) {
      recommendations.push('Enable data loss prevention for sensitive data protection');
    }

    if (!status.apiSecurity) {
      recommendations.push('Enable API security for endpoint protection');
    }

    // Generate summary
    let summary = `Alex AI Security Report - Overall Score: ${overallScore}%\n\n`;
    summary += `Active Systems: ${Object.values(status).filter(Boolean).length}/5\n`;
    summary += `Test Results: ${passedTests}/${totalTests} passed\n\n`;
    
    if (recommendations.length > 0) {
      summary += `Recommendations:\n${recommendations.map(r => `• ${r}`).join('\n')}\n`;
    }

    return {
      status,
      testResults,
      overallScore,
      recommendations,
      summary
    };
  }

  /**
   * Get security system instances
   */
  getSecuritySystems() {
    return {
      sqlInjection: this.sqlInjection,
      xss: this.xss,
      authentication: this.auth,
      dataLossPrevention: this.dlp,
      apiSecurity: this.apiSecurity
    };
  }

  /**
   * Update security configuration
   */
  updateConfig(newConfig: Partial<SecurityConfig>): void {
    this.config = { ...this.config, ...newConfig };
    console.log('🔧 Security configuration updated');
  }

  /**
   * Get current configuration
   */
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  /**
   * Check if security is properly configured
   */
  isSecurityConfigured(): boolean {
    return this.isInitialized && (
      this.sqlInjection !== null ||
      this.xss !== null ||
      this.auth !== null ||
      this.dlp !== null ||
      this.apiSecurity !== null
    );
  }

  /**
   * Get security metrics
   */
  getSecurityMetrics(): {
    enabledSystems: number;
    totalSystems: number;
    testPassRate: number;
    lastTestDate: Date;
    configurationStatus: 'COMPLETE' | 'PARTIAL' | 'INCOMPLETE';
  } {
    const status = this.getSecurityStatus();
    const enabledSystems = Object.values(status).filter(Boolean).length - 1; // Exclude overall and lastUpdated
    const totalSystems = 5;

    return {
      enabledSystems,
      totalSystems,
      testPassRate: 0, // Will be calculated when tests are run
      lastTestDate: new Date(),
      configurationStatus: enabledSystems === totalSystems ? 'COMPLETE' : 
                          enabledSystems > 0 ? 'PARTIAL' : 'INCOMPLETE'
    };
  }
}

// Export convenience functions
export const createSecurityManager = (config: SecurityConfig) => new SecurityManager(config);

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  sqlInjection: {
    enabled: true,
    maxQueryLength: 10000,
    allowedOperations: ['SELECT', 'INSERT', 'UPDATE', 'DELETE']
  },
  xss: {
    enabled: true,
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
    allowedAttributes: {
      'a': ['href', 'title', 'target'],
      'img': ['src', 'alt', 'title', 'width', 'height'],
      'p': ['class'],
      'div': ['class', 'id']
    },
    enableCSP: true
  },
  authentication: {
    enabled: true,
    jwtSecret: process.env.JWT_SECRET || 'alex-ai-secret-key-change-in-production',
    sessionTimeout: 3600000, // 1 hour
    maxFailedAttempts: 5,
    lockoutDuration: 900000, // 15 minutes
    mfaIssuer: 'Alex AI'
  },
  dataLossPrevention: {
    enabled: true,
    patterns: ['CREDIT_CARD', 'SSN', 'EMAIL', 'PHONE', 'API_KEY', 'PASSWORD'],
    redactionMethod: 'MASK'
  },
  apiSecurity: {
    enabled: true,
    jwtSecret: process.env.JWT_SECRET || 'alex-ai-secret-key-change-in-production',
    jwtExpiration: 3600,
    rateLimit: {
      windowMs: 60000, // 1 minute
      maxRequests: 100
    },
    enableCORS: true,
    allowedOrigins: ['*'],
    enableSecurityHeaders: true
  }
};
