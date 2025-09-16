/**
 * Alex AI XSS Prevention System
 * Comprehensive protection against Cross-Site Scripting attacks
 */

export interface XSSConfig {
  allowedTags: string[];
  allowedAttributes: Record<string, string[]>;
  allowedSchemes: string[];
  maxLength: number;
  enableCSP: boolean;
}

export interface SanitizedContent {
  content: string;
  isSafe: boolean;
  warnings: string[];
}

export class XSSPrevention {
  private config: XSSConfig;
  private dangerousPatterns: RegExp[];
  private scriptPatterns: RegExp[];

  constructor(config?: Partial<XSSConfig>) {
    this.config = {
      allowedTags: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'img'],
      allowedAttributes: {
        'a': ['href', 'title', 'target'],
        'img': ['src', 'alt', 'title', 'width', 'height'],
        'p': ['class'],
        'div': ['class', 'id']
      },
      allowedSchemes: ['http', 'https', 'mailto', 'tel'],
      maxLength: 10000,
      enableCSP: true,
      ...config
    };

    this.dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
      /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
      /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
      /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
      /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*<\/input>/gi,
      /<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi,
      /<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi,
      /<option\b[^<]*(?:(?!<\/option>)<[^<]*)*<\/option>/gi,
      /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi,
      /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
      /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi,
      /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,
      /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi
    ];

    this.scriptPatterns = [
      /javascript:/gi,
      /vbscript:/gi,
      /data:/gi,
      /on\w+\s*=/gi,
      /<script/gi,
      /<\/script>/gi,
      /eval\s*\(/gi,
      /expression\s*\(/gi,
      /setTimeout\s*\(/gi,
      /setInterval\s*\(/gi,
      /Function\s*\(/gi,
      /alert\s*\(/gi,
      /confirm\s*\(/gi,
      /prompt\s*\(/gi,
      /document\./gi,
      /window\./gi,
      /location\./gi,
      /history\./gi
    ];
  }

  /**
   * Sanitize HTML content to prevent XSS attacks
   */
  sanitizeHTML(content: string): SanitizedContent {
    const warnings: string[] = [];
    let isSafe = true;

    // Check content length
    if (content.length > this.config.maxLength) {
      warnings.push(`Content exceeds maximum length of ${this.config.maxLength} characters`);
      isSafe = false;
    }

    // Remove dangerous patterns
    let sanitized = content;
    for (const pattern of this.dangerousPatterns) {
      if (pattern.test(sanitized)) {
        sanitized = sanitized.replace(pattern, '');
        warnings.push(`Removed dangerous HTML pattern: ${pattern.source}`);
        isSafe = false;
      }
    }

    // Remove script patterns
    for (const pattern of this.scriptPatterns) {
      if (pattern.test(sanitized)) {
        sanitized = sanitized.replace(pattern, '');
        warnings.push(`Removed script pattern: ${pattern.source}`);
        isSafe = false;
      }
    }

    // Sanitize attributes
    sanitized = this.sanitizeAttributes(sanitized, warnings);

    // Remove any remaining dangerous content
    sanitized = this.removeDangerousContent(sanitized, warnings);

    return {
      content: sanitized,
      isSafe: isSafe && warnings.length === 0,
      warnings
    };
  }

  /**
   * Escape HTML special characters
   */
  escapeHTML(content: string): string {
    return content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Unescape HTML (for display purposes only)
   */
  unescapeHTML(content: string): string {
    return content
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, '/');
  }

  /**
   * Sanitize URL to prevent javascript: and data: schemes
   */
  sanitizeURL(url: string): string {
    // Remove dangerous schemes
    const dangerousSchemes = ['javascript:', 'vbscript:', 'data:', 'file:'];
    
    for (const scheme of dangerousSchemes) {
      if (url.toLowerCase().startsWith(scheme)) {
        return '#';
      }
    }

    // Validate allowed schemes
    const urlObj = new URL(url);
    if (!this.config.allowedSchemes.includes(urlObj.protocol.slice(0, -1))) {
      return '#';
    }

    return url;
  }

  /**
   * Generate Content Security Policy header
   */
  generateCSPHeader(): string {
    if (!this.config.enableCSP) {
      return '';
    }

    const directives = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
      "media-src 'self'",
      "worker-src 'self'",
      "manifest-src 'self'"
    ];

    return directives.join('; ');
  }

  /**
   * Validate input for XSS safety
   */
  validateInput(input: string, type: 'text' | 'html' | 'url' | 'email'): { isValid: boolean; warnings: string[] } {
    const warnings: string[] = [];

    // Check for script patterns
    for (const pattern of this.scriptPatterns) {
      if (pattern.test(input)) {
        warnings.push(`Script pattern detected: ${pattern.source}`);
      }
    }

    // Type-specific validation
    switch (type) {
      case 'url':
        try {
          const url = new URL(input);
          if (!this.config.allowedSchemes.includes(url.protocol.slice(0, -1))) {
            warnings.push(`Unsafe URL scheme: ${url.protocol}`);
          }
        } catch {
          warnings.push('Invalid URL format');
        }
        break;

      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)) {
          warnings.push('Invalid email format');
        }
        break;

      case 'html':
        const sanitized = this.sanitizeHTML(input);
        warnings.push(...sanitized.warnings);
        break;
    }

    return {
      isValid: warnings.length === 0,
      warnings
    };
  }

  /**
   * Sanitize attributes in HTML content
   */
  private sanitizeAttributes(content: string, warnings: string[]): string {
    // Match all HTML tags and their attributes
    return content.replace(/<(\w+)([^>]*)>/gi, (match, tagName, attributes) => {
      const lowerTagName = tagName.toLowerCase();
      
      // Check if tag is allowed
      if (!this.config.allowedTags.includes(lowerTagName)) {
        warnings.push(`Removed disallowed tag: ${lowerTagName}`);
        return '';
      }

      // Parse and sanitize attributes
      const attributePattern = /(\w+)\s*=\s*["']([^"']*)["']/g;
      const allowedAttrs = this.config.allowedAttributes[lowerTagName] || [];
      const sanitizedAttrs: string[] = [];

      let attrMatch;
      while ((attrMatch = attributePattern.exec(attributes)) !== null) {
        const [, attrName, attrValue] = attrMatch;
        
        if (allowedAttrs.includes(attrName.toLowerCase())) {
          // Sanitize attribute value
          let sanitizedValue = attrValue;
          
          // Remove javascript: and other dangerous schemes
          if (attrName.toLowerCase() === 'href' || attrName.toLowerCase() === 'src') {
            sanitizedValue = this.sanitizeURL(attrValue);
          }
          
          // Remove event handlers
          if (attrName.toLowerCase().startsWith('on')) {
            warnings.push(`Removed event handler: ${attrName}`);
            continue;
          }
          
          sanitizedAttrs.push(`${attrName}="${sanitizedValue}"`);
        } else {
          warnings.push(`Removed disallowed attribute: ${attrName}`);
        }
      }

      return `<${lowerTagName}${sanitizedAttrs.length > 0 ? ' ' + sanitizedAttrs.join(' ') : ''}>`;
    });
  }

  /**
   * Remove any remaining dangerous content
   */
  private removeDangerousContent(content: string, warnings: string[]): string {
    let sanitized = content;

    // Remove any remaining <script> tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove any remaining event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    
    // Remove any remaining javascript: URLs
    sanitized = sanitized.replace(/javascript:[^"'\s]*/gi, '#');
    
    // Remove any remaining data: URLs (except for images)
    sanitized = sanitized.replace(/data:(?!image\/)[^"'\s]*/gi, '#');

    return sanitized;
  }

  /**
   * Test XSS prevention system
   */
  testXSSPrevention(): { passed: number; failed: number; results: string[] } {
    const tests = [
      {
        name: 'Normal HTML',
        input: '<p>Hello <strong>world</strong>!</p>',
        shouldPass: true
      },
      {
        name: 'Script Tag Attack',
        input: '<script>alert("XSS")</script><p>Hello</p>',
        shouldPass: false
      },
      {
        name: 'Event Handler Attack',
        input: '<img src="x" onerror="alert(\'XSS\')">',
        shouldPass: false
      },
      {
        name: 'JavaScript URL Attack',
        input: '<a href="javascript:alert(\'XSS\')">Click me</a>',
        shouldPass: false
      },
      {
        name: 'Data URL Attack',
        input: '<img src="data:text/html,<script>alert(\'XSS\')</script>">',
        shouldPass: false
      },
      {
        name: 'Iframe Attack',
        input: '<iframe src="javascript:alert(\'XSS\')"></iframe>',
        shouldPass: false
      }
    ];

    let passed = 0;
    let failed = 0;
    const results: string[] = [];

    for (const test of tests) {
      const sanitized = this.sanitizeHTML(test.input);
      const isSafe = sanitized.isSafe && sanitized.warnings.length === 0;
      
      if (isSafe === test.shouldPass) {
        passed++;
        results.push(`✅ ${test.name}: PASSED`);
      } else {
        failed++;
        results.push(`❌ ${test.name}: FAILED (Expected: ${test.shouldPass}, Got: ${isSafe})`);
      }
    }

    return { passed, failed, results };
  }
}

// Export convenience functions
export const createXSSPrevention = (config?: Partial<XSSConfig>) => new XSSPrevention(config);
export const escapeHTML = (content: string) => new XSSPrevention().escapeHTML(content);
export const sanitizeHTML = (content: string) => new XSSPrevention().sanitizeHTML(content);
