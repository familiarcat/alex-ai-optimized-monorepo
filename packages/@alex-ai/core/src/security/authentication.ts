/**
 * Alex AI Advanced Authentication System
 * Comprehensive authentication with bcrypt, MFA, and session management
 */

import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { createHash, randomBytes } from 'crypto';

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  mfaEnabled: boolean;
  mfaSecret?: string;
  lastLogin?: Date;
  failedAttempts: number;
  lockedUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  lastActivity: Date;
  ipAddress: string;
  userAgent: string;
}

export interface MFAChallenge {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  token?: string;
  mfaRequired?: boolean;
  mfaChallenge?: MFAChallenge;
  error?: string;
}

export class AuthenticationSystem {
  private jwtSecret: string;
  private sessionTimeout: number;
  private maxFailedAttempts: number;
  private lockoutDuration: number;
  private mfaIssuer: string;
  private sessions: Map<string, Session> = new Map();
  private users: Map<string, User> = new Map();

  constructor(config: {
    jwtSecret: string;
    sessionTimeout?: number;
    maxFailedAttempts?: number;
    lockoutDuration?: number;
    mfaIssuer?: string;
  }) {
    this.jwtSecret = config.jwtSecret;
    this.sessionTimeout = config.sessionTimeout || 3600000; // 1 hour
    this.maxFailedAttempts = config.maxFailedAttempts || 5;
    this.lockoutDuration = config.lockoutDuration || 900000; // 15 minutes
    this.mfaIssuer = config.mfaIssuer || 'Alex AI';
  }

  /**
   * Register a new user
   */
  async registerUser(
    username: string, 
    email: string, 
    password: string
  ): Promise<AuthResult> {
    try {
      // Validate input
      const validation = this.validateUserInput(username, email, password);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      // Check if user already exists
      if (this.userExists(username, email)) {
        return { success: false, error: 'User already exists' };
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Create user
      const user: User = {
        id: crypto.randomUUID(),
        username,
        email,
        passwordHash,
        mfaEnabled: false,
        failedAttempts: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.users.set(user.id, user);

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Authenticate user with username/email and password
   */
  async authenticateUser(
    identifier: string, 
    password: string,
    ipAddress: string,
    userAgent: string
  ): Promise<AuthResult> {
    try {
      // Find user by username or email
      const user = this.findUserByIdentifier(identifier);
      if (!user) {
        return { success: false, error: 'Invalid credentials' };
      }

      // Check if account is locked
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        return { 
          success: false, 
          error: `Account locked until ${user.lockedUntil.toISOString()}` 
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        await this.recordFailedAttempt(user);
        return { success: false, error: 'Invalid credentials' };
      }

      // Reset failed attempts on successful login
      user.failedAttempts = 0;
      user.lockedUntil = undefined;
      user.lastLogin = new Date();
      user.updatedAt = new Date();

      // Check if MFA is required
      if (user.mfaEnabled) {
        const mfaChallenge = await this.generateMFAChallenge(user);
        return { 
          success: true, 
          mfaRequired: true, 
          mfaChallenge,
          user 
        };
      }

      // Create session
      const session = await this.createSession(user, ipAddress, userAgent);
      const token = this.generateJWT(user, session);

      return { 
        success: true, 
        user, 
        session, 
        token 
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Verify MFA code
   */
  async verifyMFA(
    userId: string, 
    code: string
  ): Promise<AuthResult> {
    try {
      const user = this.users.get(userId);
      if (!user || !user.mfaEnabled || !user.mfaSecret) {
        return { success: false, error: 'MFA not enabled for user' };
      }

      const isValid = this.verifyTOTPCode(user.mfaSecret, code);
      if (!isValid) {
        return { success: false, error: 'Invalid MFA code' };
      }

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Enable MFA for user
   */
  async enableMFA(userId: string): Promise<MFAChallenge> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const secret = this.generateMFASecret();
    const qrCodeUrl = this.generateQRCodeUrl(user.username, secret);
    const backupCodes = this.generateBackupCodes();

    user.mfaSecret = secret;
    user.mfaEnabled = true;
    user.updatedAt = new Date();

    return {
      secret,
      qrCodeUrl,
      backupCodes
    };
  }

  /**
   * Create a new session
   */
  async createSession(
    user: User, 
    ipAddress: string, 
    userAgent: string
  ): Promise<Session> {
    const sessionId = crypto.randomUUID();
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + this.sessionTimeout);

    const session: Session = {
      id: sessionId,
      userId: user.id,
      token,
      expiresAt,
      createdAt: new Date(),
      lastActivity: new Date(),
      ipAddress,
      userAgent
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Validate JWT token
   */
  async validateToken(token: string): Promise<{ valid: boolean; user?: User; session?: Session }> {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      const session = this.sessions.get(decoded.sessionId);
      
      if (!session || session.expiresAt < new Date()) {
        return { valid: false };
      }

      const user = this.users.get(session.userId);
      if (!user) {
        return { valid: false };
      }

      // Update last activity
      session.lastActivity = new Date();

      return { valid: true, user, session };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Logout user
   */
  async logout(sessionId: string): Promise<boolean> {
    return this.sessions.delete(sessionId);
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const now = new Date();
    let cleaned = 0;

    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.expiresAt < now) {
        this.sessions.delete(sessionId);
        cleaned++;
      }
    }

    return cleaned;
  }

  /**
   * Validate user input
   */
  private validateUserInput(
    username: string, 
    email: string, 
    password: string
  ): { isValid: boolean; error?: string } {
    // Username validation
    if (!username || username.length < 3 || username.length > 30) {
      return { isValid: false, error: 'Username must be 3-30 characters' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
    }

    // Email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, error: 'Invalid email format' };
    }

    // Password validation
    if (!password || password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' };
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(password)) {
      return { isValid: false, error: 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character' };
    }

    return { isValid: true };
  }

  /**
   * Check if user exists
   */
  private userExists(username: string, email: string): boolean {
    for (const user of this.users.values()) {
      if (user.username === username || user.email === email) {
        return true;
      }
    }
    return false;
  }

  /**
   * Find user by username or email
   */
  private findUserByIdentifier(identifier: string): User | undefined {
    for (const user of this.users.values()) {
      if (user.username === identifier || user.email === identifier) {
        return user;
      }
    }
    return undefined;
  }

  /**
   * Record failed login attempt
   */
  private async recordFailedAttempt(user: User): Promise<void> {
    user.failedAttempts++;
    user.updatedAt = new Date();

    if (user.failedAttempts >= this.maxFailedAttempts) {
      user.lockedUntil = new Date(Date.now() + this.lockoutDuration);
    }
  }

  /**
   * Generate JWT token
   */
  private generateJWT(user: User, session: Session): string {
    const payload = {
      userId: user.id,
      sessionId: session.id,
      username: user.username,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(session.expiresAt.getTime() / 1000)
    };

    return jwt.sign(payload, this.jwtSecret, { algorithm: 'HS256' });
  }

  /**
   * Generate MFA secret
   */
  private generateMFASecret(): string {
    return randomBytes(20).toString('base32');
  }

  /**
   * Generate QR code URL for MFA setup
   */
  private generateQRCodeUrl(username: string, secret: string): string {
    const encodedSecret = encodeURIComponent(secret);
    const encodedIssuer = encodeURIComponent(this.mfaIssuer);
    const encodedAccount = encodeURIComponent(username);
    
    return `otpauth://totp/${encodedIssuer}:${encodedAccount}?secret=${encodedSecret}&issuer=${encodedIssuer}`;
  }

  /**
   * Generate backup codes
   */
  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  /**
   * Generate MFA challenge
   */
  private async generateMFAChallenge(user: User): Promise<MFAChallenge> {
    if (!user.mfaSecret) {
      throw new Error('MFA not properly configured');
    }

    return {
      secret: user.mfaSecret,
      qrCodeUrl: this.generateQRCodeUrl(user.username, user.mfaSecret),
      backupCodes: this.generateBackupCodes()
    };
  }

  /**
   * Verify TOTP code
   */
  private verifyTOTPCode(secret: string, code: string): boolean {
    const timeStep = 30;
    const window = 1;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeCounter = Math.floor(currentTime / timeStep);

    for (let i = -window; i <= window; i++) {
      const counter = timeCounter + i;
      const expectedCode = this.generateTOTPCode(secret, counter);
      if (expectedCode === code) {
        return true;
      }
    }

    return false;
  }

  /**
   * Generate TOTP code
   */
  private generateTOTPCode(secret: string, counter: number): string {
    const key = Buffer.from(secret, 'base32');
    const counterBuffer = Buffer.alloc(8);
    counterBuffer.writeUInt32BE(counter, 4);

    const hmac = crypto.createHmac('sha1', key);
    hmac.update(counterBuffer);
    const digest = hmac.digest();

    const offset = digest[digest.length - 1] & 0xf;
    const code = ((digest[offset] & 0x7f) << 24) |
                 ((digest[offset + 1] & 0xff) << 16) |
                 ((digest[offset + 2] & 0xff) << 8) |
                 (digest[offset + 3] & 0xff);

    return (code % 1000000).toString().padStart(6, '0');
  }

  /**
   * Test authentication system
   */
  async testAuthentication(): Promise<{ passed: number; failed: number; results: string[] }> {
    const results: string[] = [];
    let passed = 0;
    let failed = 0;

    try {
      // Test user registration
      const regResult = await this.registerUser('testuser', 'test@example.com', 'TestPass123!');
      if (regResult.success) {
        passed++;
        results.push('✅ User registration: PASSED');
      } else {
        failed++;
        results.push(`❌ User registration: FAILED (${regResult.error})`);
      }

      // Test authentication
      const authResult = await this.authenticateUser('testuser', 'TestPass123!', '127.0.0.1', 'test-agent');
      if (authResult.success) {
        passed++;
        results.push('✅ User authentication: PASSED');
      } else {
        failed++;
        results.push(`❌ User authentication: FAILED (${authResult.error})`);
      }

      // Test MFA setup
      if (authResult.user) {
        const mfaChallenge = await this.enableMFA(authResult.user.id);
        if (mfaChallenge.secret && mfaChallenge.qrCodeUrl) {
          passed++;
          results.push('✅ MFA setup: PASSED');
        } else {
          failed++;
          results.push('❌ MFA setup: FAILED');
        }
      }

    } catch (error) {
      failed++;
      results.push(`❌ Authentication test: FAILED (${error.message})`);
    }

    return { passed, failed, results };
  }
}

// Export convenience functions
export const createAuthSystem = (config: {
  jwtSecret: string;
  sessionTimeout?: number;
  maxFailedAttempts?: number;
  lockoutDuration?: number;
  mfaIssuer?: string;
}) => new AuthenticationSystem(config);
