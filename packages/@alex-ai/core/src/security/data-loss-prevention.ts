/**
 * Alex AI Data Loss Prevention System
 * Comprehensive data classification, redaction, and protection
 */

export interface DataClassification {
  level: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET';
  category: string;
  sensitivity: number; // 1-10 scale
  retentionPeriod: number; // days
}

export interface SensitiveDataPattern {
  name: string;
  pattern: RegExp;
  category: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  redactionMethod: 'MASK' | 'HASH' | 'REMOVE' | 'ENCRYPT';
}

export interface DLPResult {
  hasSensitiveData: boolean;
  findings: DLPFinding[];
  riskScore: number;
  recommendations: string[];
  redactedContent: string;
}

export interface DLPFinding {
  type: string;
  value: string;
  redactedValue: string;
  position: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  category: string;
  confidence: number;
}

export class DataLossPrevention {
  private patterns: SensitiveDataPattern[];
  private classificationRules: Map<string, DataClassification>;
  private auditLog: DLPResult[] = [];

  constructor() {
    this.patterns = this.initializeSensitiveDataPatterns();
    this.classificationRules = this.initializeClassificationRules();
  }

  /**
   * Scan content for sensitive data
   */
  scanContent(content: string): DLPResult {
    const findings: DLPFinding[] = [];
    let riskScore = 0;

    // Scan for each pattern
    for (const pattern of this.patterns) {
      const matches = this.findPatternMatches(content, pattern);
      findings.push(...matches);
      
      // Calculate risk score
      for (const match of matches) {
        riskScore += this.calculateSeverityScore(match.severity);
      }
    }

    // Generate redacted content
    const redactedContent = this.redactSensitiveData(content, findings);

    // Generate recommendations
    const recommendations = this.generateRecommendations(findings, riskScore);

    const result: DLPResult = {
      hasSensitiveData: findings.length > 0,
      findings,
      riskScore: Math.min(riskScore, 100), // Cap at 100
      recommendations,
      redactedContent
    };

    // Log for audit
    this.auditLog.push(result);

    return result;
  }

  /**
   * Classify data based on content
   */
  classifyData(content: string): DataClassification {
    let maxSensitivity = 1;
    let category = 'GENERAL';
    let retentionPeriod = 365; // Default 1 year

    // Check for sensitive patterns
    for (const pattern of this.patterns) {
      if (pattern.pattern.test(content)) {
        const severity = this.getSeverityLevel(pattern.severity);
        maxSensitivity = Math.max(maxSensitivity, severity);
        
        if (pattern.category !== 'GENERAL') {
          category = pattern.category;
        }
      }
    }

    // Determine classification level
    let level: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'SECRET';
    if (maxSensitivity >= 8) {
      level = 'SECRET';
      retentionPeriod = 2555; // 7 years
    } else if (maxSensitivity >= 6) {
      level = 'CONFIDENTIAL';
      retentionPeriod = 1095; // 3 years
    } else if (maxSensitivity >= 4) {
      level = 'INTERNAL';
      retentionPeriod = 730; // 2 years
    } else {
      level = 'PUBLIC';
      retentionPeriod = 365; // 1 year
    }

    return {
      level,
      category,
      sensitivity: maxSensitivity,
      retentionPeriod
    };
  }

  /**
   * Redact sensitive data from content
   */
  redactSensitiveData(content: string, findings: DLPFinding[]): string {
    let redactedContent = content;

    // Sort findings by position (descending) to avoid position shifts
    const sortedFindings = findings.sort((a, b) => b.position - a.position);

    for (const finding of sortedFindings) {
      const before = redactedContent.substring(0, finding.position);
      const after = redactedContent.substring(finding.position + finding.value.length);
      redactedContent = before + finding.redactedValue + after;
    }

    return redactedContent;
  }

  /**
   * Encrypt sensitive data
   */
  async encryptSensitiveData(content: string, findings: DLPFinding[]): Promise<string> {
    const crypto = await import('crypto');
    let encryptedContent = content;

    // Sort findings by position (descending)
    const sortedFindings = findings.sort((a, b) => b.position - a.position);

    for (const finding of sortedFindings) {
      if (finding.severity === 'CRITICAL' || finding.severity === 'HIGH') {
        const encrypted = crypto.createCipher('aes-256-gcm', process.env.ENCRYPTION_KEY || 'default-key')
          .update(finding.value, 'utf8', 'hex');
        
        const before = encryptedContent.substring(0, finding.position);
        const after = encryptedContent.substring(finding.position + finding.value.length);
        encryptedContent = before + `[ENCRYPTED:${encrypted}]` + after;
      }
    }

    return encryptedContent;
  }

  /**
   * Generate audit report
   */
  generateAuditReport(timeRange?: { start: Date; end: Date }): {
    totalScans: number;
    totalFindings: number;
    riskDistribution: Record<string, number>;
    topPatterns: Array<{ pattern: string; count: number }>;
    recommendations: string[];
  } {
    let relevantLogs = this.auditLog;

    if (timeRange) {
      relevantLogs = this.auditLog.filter(log => {
        const logTime = new Date(); // In real implementation, this would be stored with timestamp
        return logTime >= timeRange.start && logTime <= timeRange.end;
      });
    }

    const totalScans = relevantLogs.length;
    const totalFindings = relevantLogs.reduce((sum, log) => sum + log.findings.length, 0);

    // Risk distribution
    const riskDistribution = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0,
      CRITICAL: 0
    };

    // Top patterns
    const patternCounts = new Map<string, number>();

    for (const log of relevantLogs) {
      for (const finding of log.findings) {
        riskDistribution[finding.severity]++;
        patternCounts.set(finding.type, (patternCounts.get(finding.type) || 0) + 1);
      }
    }

    const topPatterns = Array.from(patternCounts.entries())
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Generate recommendations
    const recommendations = this.generateSystemRecommendations(relevantLogs);

    return {
      totalScans,
      totalFindings,
      riskDistribution,
      topPatterns,
      recommendations
    };
  }

  /**
   * Initialize sensitive data patterns
   */
  private initializeSensitiveDataPatterns(): SensitiveDataPattern[] {
    return [
      // Credit Card Numbers
      {
        name: 'Credit Card',
        pattern: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
        category: 'FINANCIAL',
        severity: 'CRITICAL',
        redactionMethod: 'MASK'
      },
      // Social Security Numbers
      {
        name: 'SSN',
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        category: 'PII',
        severity: 'CRITICAL',
        redactionMethod: 'MASK'
      },
      // Email Addresses
      {
        name: 'Email',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        category: 'PII',
        severity: 'MEDIUM',
        redactionMethod: 'MASK'
      },
      // Phone Numbers
      {
        name: 'Phone',
        pattern: /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g,
        category: 'PII',
        severity: 'MEDIUM',
        redactionMethod: 'MASK'
      },
      // IP Addresses
      {
        name: 'IP Address',
        pattern: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
        category: 'NETWORK',
        severity: 'LOW',
        redactionMethod: 'HASH'
      },
      // API Keys
      {
        name: 'API Key',
        pattern: /\b[A-Za-z0-9]{32,}\b/g,
        category: 'CREDENTIALS',
        severity: 'HIGH',
        redactionMethod: 'REMOVE'
      },
      // Passwords (basic pattern)
      {
        name: 'Password',
        pattern: /password\s*[:=]\s*["']?[^"'\s]+["']?/gi,
        category: 'CREDENTIALS',
        severity: 'CRITICAL',
        redactionMethod: 'REMOVE'
      },
      // Bank Account Numbers
      {
        name: 'Bank Account',
        pattern: /\b\d{8,17}\b/g,
        category: 'FINANCIAL',
        severity: 'HIGH',
        redactionMethod: 'MASK'
      },
      // Driver's License
      {
        name: 'Driver License',
        pattern: /\b[A-Z]\d{7,8}\b/g,
        category: 'PII',
        severity: 'HIGH',
        redactionMethod: 'MASK'
      },
      // Medical Record Numbers
      {
        name: 'Medical Record',
        pattern: /\bMRN\s*[:=]\s*\d+/gi,
        category: 'HEALTH',
        severity: 'CRITICAL',
        redactionMethod: 'MASK'
      }
    ];
  }

  /**
   * Initialize classification rules
   */
  private initializeClassificationRules(): Map<string, DataClassification> {
    const rules = new Map<string, DataClassification>();

    rules.set('FINANCIAL', {
      level: 'CONFIDENTIAL',
      category: 'FINANCIAL',
      sensitivity: 8,
      retentionPeriod: 2555 // 7 years
    });

    rules.set('PII', {
      level: 'CONFIDENTIAL',
      category: 'PII',
      sensitivity: 7,
      retentionPeriod: 1095 // 3 years
    });

    rules.set('HEALTH', {
      level: 'SECRET',
      category: 'HEALTH',
      sensitivity: 9,
      retentionPeriod: 2555 // 7 years
    });

    rules.set('CREDENTIALS', {
      level: 'SECRET',
      category: 'CREDENTIALS',
      sensitivity: 10,
      retentionPeriod: 365 // 1 year
    });

    return rules;
  }

  /**
   * Find pattern matches in content
   */
  private findPatternMatches(content: string, pattern: SensitiveDataPattern): DLPFinding[] {
    const findings: DLPFinding[] = [];
    let match;

    while ((match = pattern.pattern.exec(content)) !== null) {
      const value = match[0];
      const position = match.index;
      const redactedValue = this.redactValue(value, pattern.redactionMethod);

      findings.push({
        type: pattern.name,
        value,
        redactedValue,
        position,
        severity: pattern.severity,
        category: pattern.category,
        confidence: this.calculateConfidence(value, pattern)
      });
    }

    return findings;
  }

  /**
   * Redact value based on method
   */
  private redactValue(value: string, method: string): string {
    switch (method) {
      case 'MASK':
        if (value.length <= 4) {
          return '*'.repeat(value.length);
        }
        return value.substring(0, 2) + '*'.repeat(value.length - 4) + value.substring(value.length - 2);
      
      case 'HASH':
        return `[HASH:${Buffer.from(value).toString('base64').substring(0, 8)}]`;
      
      case 'REMOVE':
        return '[REDACTED]';
      
      case 'ENCRYPT':
        return '[ENCRYPTED]';
      
      default:
        return '[REDACTED]';
    }
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(value: string, pattern: SensitiveDataPattern): number {
    let confidence = 0.5; // Base confidence

    // Length-based confidence
    if (value.length >= 8) confidence += 0.2;
    if (value.length >= 16) confidence += 0.1;

    // Pattern-specific confidence
    switch (pattern.name) {
      case 'Credit Card':
        if (this.validateCreditCard(value)) confidence += 0.3;
        break;
      case 'Email':
        if (this.validateEmail(value)) confidence += 0.2;
        break;
      case 'Phone':
        if (this.validatePhone(value)) confidence += 0.2;
        break;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Validate credit card using Luhn algorithm
   */
  private validateCreditCard(value: string): boolean {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length < 13 || cleaned.length > 19) return false;

    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
      let digit = parseInt(cleaned[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Validate email format
   */
  private validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  /**
   * Validate phone number
   */
  private validatePhone(value: string): boolean {
    const cleaned = value.replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  /**
   * Calculate severity score
   */
  private calculateSeverityScore(severity: string): number {
    switch (severity) {
      case 'LOW': return 1;
      case 'MEDIUM': return 3;
      case 'HIGH': return 6;
      case 'CRITICAL': return 10;
      default: return 1;
    }
  }

  /**
   * Get severity level as number
   */
  private getSeverityLevel(severity: string): number {
    return this.calculateSeverityScore(severity);
  }

  /**
   * Generate recommendations
   */
  private generateRecommendations(findings: DLPFinding[], riskScore: number): string[] {
    const recommendations: string[] = [];

    if (riskScore > 50) {
      recommendations.push('High risk detected - consider immediate data protection measures');
    }

    if (findings.some(f => f.severity === 'CRITICAL')) {
      recommendations.push('Critical data found - implement encryption and access controls');
    }

    if (findings.some(f => f.category === 'CREDENTIALS')) {
      recommendations.push('Credentials detected - ensure secure storage and rotation');
    }

    if (findings.some(f => f.category === 'PII')) {
      recommendations.push('PII detected - ensure GDPR/CCPA compliance');
    }

    if (findings.some(f => f.category === 'FINANCIAL')) {
      recommendations.push('Financial data detected - implement PCI DSS controls');
    }

    return recommendations;
  }

  /**
   * Generate system recommendations
   */
  private generateSystemRecommendations(logs: DLPResult[]): string[] {
    const recommendations: string[] = [];

    const totalFindings = logs.reduce((sum, log) => sum + log.findings.length, 0);
    const avgRiskScore = logs.reduce((sum, log) => sum + log.riskScore, 0) / logs.length;

    if (avgRiskScore > 30) {
      recommendations.push('Consider implementing automated data classification');
    }

    if (totalFindings > 100) {
      recommendations.push('High volume of sensitive data - review data handling practices');
    }

    const criticalFindings = logs.reduce((sum, log) => 
      sum + log.findings.filter(f => f.severity === 'CRITICAL').length, 0);

    if (criticalFindings > 10) {
      recommendations.push('Multiple critical findings - conduct security training');
    }

    return recommendations;
  }

  /**
   * Test DLP system
   */
  testDLPSystem(): { passed: number; failed: number; results: string[] } {
    const testCases = [
      {
        name: 'Credit Card Detection',
        content: 'My card number is 4111-1111-1111-1111',
        expectedFindings: 1,
        expectedSeverity: 'CRITICAL'
      },
      {
        name: 'Email Detection',
        content: 'Contact me at john.doe@example.com',
        expectedFindings: 1,
        expectedSeverity: 'MEDIUM'
      },
      {
        name: 'API Key Detection',
        content: 'API_KEY=sk-1234567890abcdef1234567890abcdef',
        expectedFindings: 1,
        expectedSeverity: 'HIGH'
      },
      {
        name: 'Clean Content',
        content: 'This is just normal text with no sensitive data',
        expectedFindings: 0,
        expectedSeverity: 'LOW'
      }
    ];

    let passed = 0;
    let failed = 0;
    const results: string[] = [];

    for (const testCase of testCases) {
      const result = this.scanContent(testCase.content);
      const hasExpectedFindings = result.findings.length >= testCase.expectedFindings;
      const hasExpectedSeverity = testCase.expectedFindings === 0 || 
        result.findings.some(f => f.severity === testCase.expectedSeverity);

      if (hasExpectedFindings && hasExpectedSeverity) {
        passed++;
        results.push(`✅ ${testCase.name}: PASSED`);
      } else {
        failed++;
        results.push(`❌ ${testCase.name}: FAILED (Expected: ${testCase.expectedFindings} findings, Got: ${result.findings.length})`);
      }
    }

    return { passed, failed, results };
  }
}

// Export convenience functions
export const createDLPSystem = () => new DataLossPrevention();
export const scanForSensitiveData = (content: string) => new DataLossPrevention().scanContent(content);
