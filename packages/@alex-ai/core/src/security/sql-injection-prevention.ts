/**
 * Alex AI SQL Injection Prevention System
 * Comprehensive protection against SQL injection attacks
 */

import { Pool, PoolClient } from 'pg';
import { createHash } from 'crypto';

export interface QueryParams {
  [key: string]: string | number | boolean | null;
}

export interface SecureQueryResult {
  rows: any[];
  rowCount: number;
  command: string;
}

export class SQLInjectionPrevention {
  private pool: Pool;
  private queryCache: Map<string, string> = new Map();
  private maxQueryLength: number = 10000;
  private allowedOperations: Set<string> = new Set(['SELECT', 'INSERT', 'UPDATE', 'DELETE']);

  constructor(pool: Pool) {
    this.pool = pool;
  }

  /**
   * Execute a secure parameterized query
   */
  async executeSecureQuery(
    query: string, 
    params: QueryParams = {}
  ): Promise<SecureQueryResult> {
    // Validate query before execution
    this.validateQuery(query);
    
    // Sanitize and parameterize the query
    const sanitizedQuery = this.sanitizeQuery(query);
    const parameterizedQuery = this.parameterizeQuery(sanitizedQuery, params);
    
    // Execute with parameter binding
    const client: PoolClient = await this.pool.connect();
    
    try {
      const result = await client.query(parameterizedQuery.query, parameterizedQuery.values);
      
      // Log the secure query execution
      await this.logSecureQuery(query, params, result.rowCount);
      
      return {
        rows: result.rows,
        rowCount: result.rowCount || 0,
        command: result.command
      };
    } finally {
      client.release();
    }
  }

  /**
   * Validate query for security issues
   */
  private validateQuery(query: string): void {
    // Check query length
    if (query.length > this.maxQueryLength) {
      throw new Error('Query exceeds maximum length limit');
    }

    // Check for suspicious patterns
    const suspiciousPatterns = [
      /(\bUNION\b.*\bSELECT\b)/i,
      /(\bDROP\b.*\bTABLE\b)/i,
      /(\bDELETE\b.*\bFROM\b.*\bWHERE\b.*\b1\s*=\s*1)/i,
      /(\bINSERT\b.*\bINTO\b.*\bVALUES\b.*\bSELECT\b)/i,
      /(\bUPDATE\b.*\bSET\b.*\bWHERE\b.*\b1\s*=\s*1)/i,
      /(\bEXEC\b|\bEXECUTE\b)/i,
      /(\bSCRIPT\b|\bJAVASCRIPT\b)/i,
      /(\b--\b|\b\/\*|\b\*\/)/i,
      /(\bOR\b.*\b1\s*=\s*1)/i,
      /(\bAND\b.*\b1\s*=\s*1)/i
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(query)) {
        throw new Error(`Suspicious SQL pattern detected: ${pattern.source}`);
      }
    }

    // Check for allowed operations only
    const firstWord = query.trim().split(/\s+/)[0].toUpperCase();
    if (!this.allowedOperations.has(firstWord)) {
      throw new Error(`Operation not allowed: ${firstWord}`);
    }
  }

  /**
   * Sanitize query by removing dangerous characters
   */
  private sanitizeQuery(query: string): string {
    // Remove null bytes
    let sanitized = query.replace(/\0/g, '');
    
    // Remove control characters except newlines and tabs
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
    
    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();
    
    return sanitized;
  }

  /**
   * Convert query to parameterized format
   */
  private parameterizeQuery(query: string, params: QueryParams): { query: string; values: any[] } {
    const values: any[] = [];
    let paramIndex = 1;
    
    // Replace named parameters with positional parameters
    let parameterizedQuery = query.replace(/:(\w+)/g, (match, paramName) => {
      if (params.hasOwnProperty(paramName)) {
        values.push(params[paramName]);
        return `$${paramIndex++}`;
      }
      throw new Error(`Parameter not found: ${paramName}`);
    });

    // Replace ? placeholders with positional parameters
    parameterizedQuery = parameterizedQuery.replace(/\?/g, () => {
      if (values.length < paramIndex) {
        throw new Error('Not enough parameters provided');
      }
      return `$${paramIndex++}`;
    });

    return { query: parameterizedQuery, values };
  }

  /**
   * Log secure query execution for audit
   */
  private async logSecureQuery(
    originalQuery: string, 
    params: QueryParams, 
    rowCount: number
  ): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      query: originalQuery.substring(0, 200), // Truncate for logging
      paramCount: Object.keys(params).length,
      rowCount,
      queryHash: createHash('sha256').update(originalQuery).digest('hex').substring(0, 16)
    };

    // In production, this would go to a secure audit log
    console.log('🔐 Secure Query Executed:', JSON.stringify(logEntry, null, 2));
  }

  /**
   * Validate user input for SQL safety
   */
  validateInput(input: string, type: 'string' | 'number' | 'email' | 'id'): boolean {
    if (typeof input !== 'string') {
      return false;
    }

    switch (type) {
      case 'string':
        // Allow alphanumeric, spaces, and common punctuation
        return /^[a-zA-Z0-9\s.,!?\-_()]+$/.test(input);
      
      case 'number':
        // Allow only digits and decimal point
        return /^\d+(\.\d+)?$/.test(input);
      
      case 'email':
        // Basic email validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
      
      case 'id':
        // Allow only alphanumeric and hyphens for IDs
        return /^[a-zA-Z0-9\-_]+$/.test(input);
      
      default:
        return false;
    }
  }

  /**
   * Escape special characters for safe string interpolation
   */
  escapeString(input: string): string {
    return input
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/\t/g, '\\t');
  }

  /**
   * Create a safe WHERE clause
   */
  createSafeWhereClause(conditions: Record<string, any>): { clause: string; values: any[] } {
    const clauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    for (const [column, value] of Object.entries(conditions)) {
      // Validate column name (prevent injection through column names)
      if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(column)) {
        throw new Error(`Invalid column name: ${column}`);
      }

      if (value !== null && value !== undefined) {
        clauses.push(`${column} = $${paramIndex++}`);
        values.push(value);
      } else {
        clauses.push(`${column} IS NULL`);
      }
    }

    return {
      clause: clauses.length > 0 ? `WHERE ${clauses.join(' AND ')}` : '',
      values
    };
  }

  /**
   * Test the SQL injection prevention system
   */
  async testSecurity(): Promise<{ passed: number; failed: number; results: string[] }> {
    const tests = [
      {
        name: 'Normal Query',
        query: 'SELECT * FROM users WHERE id = :id',
        params: { id: 1 },
        shouldPass: true
      },
      {
        name: 'SQL Injection Attempt',
        query: "SELECT * FROM users WHERE id = 1 OR 1=1",
        params: {},
        shouldPass: false
      },
      {
        name: 'UNION Attack',
        query: "SELECT * FROM users UNION SELECT * FROM passwords",
        params: {},
        shouldPass: false
      },
      {
        name: 'DROP Table Attack',
        query: "SELECT * FROM users; DROP TABLE users;",
        params: {},
        shouldPass: false
      }
    ];

    let passed = 0;
    let failed = 0;
    const results: string[] = [];

    for (const test of tests) {
      try {
        await this.executeSecureQuery(test.query, test.params);
        if (test.shouldPass) {
          passed++;
          results.push(`✅ ${test.name}: PASSED`);
        } else {
          failed++;
          results.push(`❌ ${test.name}: FAILED (should have been blocked)`);
        }
      } catch (error) {
        if (!test.shouldPass) {
          passed++;
          results.push(`✅ ${test.name}: PASSED (correctly blocked)`);
        } else {
          failed++;
          results.push(`❌ ${test.name}: FAILED (${error.message})`);
        }
      }
    }

    return { passed, failed, results };
  }
}

// Export convenience functions
export const createSecureQuery = (pool: Pool) => new SQLInjectionPrevention(pool);
export const validateSQLInput = (input: string, type: 'string' | 'number' | 'email' | 'id') => {
  const prevention = new SQLInjectionPrevention(pool);
  return prevention.validateInput(input, type);
};
