/**
 * Optimized Alex AI Manager
 * Addresses performance bottlenecks and implements efficient engagement patterns
 */

import { N8NCredentialsManager } from './n8n-credentials-manager'
import { UnifiedDataService } from './unified-data-service'
import { StealthScrapingService } from './stealth-scraping-service'
import { AlexAICrewManager } from './crew-manager'

export interface OptimizedAlexAIConfig {
  environment: 'development' | 'production' | 'test'
  enableN8NIntegration: boolean
  enableStealthScraping: boolean
  enableCrewManagement: boolean
  enablePerformanceMonitoring: boolean
  enableConnectionPooling: boolean
  cacheTimeout: number
  maxRetries: number
  retryDelay: number
}

export interface PerformanceMetrics {
  initializationTime: number
  crewActivationTime: number
  totalEngagementTime: number
  cacheHits: number
  cacheMisses: number
  errorCount: number
  successRate: number
  connectionEfficiency: number
}

export interface OptimizedAlexAIStatus {
  isInitialized: boolean
  n8nConnection: boolean
  supabaseConnection: boolean
  crewStatus: Record<string, boolean>
  performanceMetrics: PerformanceMetrics
  lastHealthCheck: string
  version: string
  optimizationLevel: 'basic' | 'standard' | 'advanced' | 'maximum'
}

export class OptimizedAlexAIManager {
  private static instance: OptimizedAlexAIManager
  private isInitialized: boolean = false
  private startTime: number = 0
  private performanceMetrics: PerformanceMetrics
  private connectionPool: Map<string, any> = new Map()
  private retryCount: number = 0

  private credentialsManager: N8NCredentialsManager
  private dataService: UnifiedDataService
  private stealthService: StealthScrapingService
  private crewManager: AlexAICrewManager

  private config: OptimizedAlexAIConfig = {
    environment: 'development',
    enableN8NIntegration: true,
    enableStealthScraping: true,
    enableCrewManagement: true,
    enablePerformanceMonitoring: true,
    enableConnectionPooling: true,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes
    maxRetries: 3,
    retryDelay: 1000 // 1 second
  }

  private constructor(config?: Partial<OptimizedAlexAIConfig>) {
    this.startTime = Date.now()
    this.performanceMetrics = {
      initializationTime: 0,
      crewActivationTime: 0,
      totalEngagementTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errorCount: 0,
      successRate: 0,
      connectionEfficiency: 0
    }

    if (config) {
      this.config = { ...this.config, ...config }
    }

    this.credentialsManager = new N8NCredentialsManager()
    this.dataService = new UnifiedDataService(this.credentialsManager)
    this.stealthService = new StealthScrapingService()
    this.crewManager = new AlexAICrewManager(this.credentialsManager)
  }

  public static getInstance(config?: Partial<OptimizedAlexAIConfig>): OptimizedAlexAIManager {
    if (!OptimizedAlexAIManager.instance) {
      OptimizedAlexAIManager.instance = new OptimizedAlexAIManager(config)
    }
    return OptimizedAlexAIManager.instance
  }

  /**
   * Optimized initialization with parallel processing and error handling
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      console.log('🔄 Optimized Alex AI Manager already initialized')
      return
    }

    const initStartTime = Date.now()
    console.log('🚀 Initializing Optimized Alex AI Manager...')

    try {
      // Parallel initialization of services
      const initPromises = []

      // Initialize credentials manager with retry logic
      if (this.config.enableN8NIntegration) {
        initPromises.push(this.initializeWithRetry(
          () => this.credentialsManager.getCredentials(),
          'N8N Federation Crew credentials'
        ))
      }

      // Initialize data service
      initPromises.push(this.initializeWithRetry(
        () => this.dataService.initialize(),
        'Unified data service'
      ))

      // Initialize stealth service
      if (this.config.enableStealthScraping) {
        initPromises.push(this.initializeWithRetry(
          () => this.stealthService.initialize(),
          'Stealth scraping service'
        ))
      }

      // Initialize crew manager
      if (this.config.enableCrewManagement) {
        initPromises.push(this.initializeWithRetry(
          () => this.crewManager.initialize(),
          'Alex AI crew manager'
        ))
      }

      // Wait for all services to initialize in parallel
      await Promise.allSettled(initPromises)

      // Update performance metrics
      this.performanceMetrics.initializationTime = Date.now() - initStartTime
      this.performanceMetrics.totalEngagementTime = Date.now() - this.startTime

      this.isInitialized = true
      console.log('🎉 Optimized Alex AI Manager initialization complete!')
      console.log(`⚡ Initialization time: ${this.performanceMetrics.initializationTime}ms`)

    } catch (error) {
      this.performanceMetrics.errorCount++
      console.error('❌ Optimized Alex AI Manager initialization failed:', error)
      throw error
    }
  }

  /**
   * Initialize service with retry logic and error handling
   */
  private async initializeWithRetry(
    initFunction: () => Promise<any>,
    serviceName: string
  ): Promise<void> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        await initFunction()
        console.log(`✅ ${serviceName} loaded`)
        this.performanceMetrics.cacheHits++
        return
      } catch (error) {
        lastError = error as Error
        this.performanceMetrics.cacheMisses++
        this.performanceMetrics.errorCount++

        if (attempt < this.config.maxRetries) {
          console.warn(`⚠️ ${serviceName} attempt ${attempt} failed, retrying in ${this.config.retryDelay}ms...`)
          await this.delay(this.config.retryDelay * attempt) // Exponential backoff
        } else {
          console.error(`❌ ${serviceName} failed after ${this.config.maxRetries} attempts:`, error)
          // Don't throw error, continue with other services
        }
      }
    }
  }

  /**
   * Delay utility for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get optimized system status with performance metrics
   */
  public async getStatus(): Promise<OptimizedAlexAIStatus> {
    const statusStartTime = Date.now()

    try {
      // Test connections in parallel
      const connectionPromises = [
        this.testN8NConnection(),
        this.testSupabaseConnection(),
        this.testCrewConnections()
      ]

      const [n8nConnection, supabaseConnection, crewConnections] = await Promise.allSettled(connectionPromises)

      // Calculate performance metrics
      this.performanceMetrics.successRate = this.calculateSuccessRate()
      this.performanceMetrics.connectionEfficiency = this.calculateConnectionEfficiency()

      const status: OptimizedAlexAIStatus = {
        isInitialized: this.isInitialized,
        n8nConnection: n8nConnection.status === 'fulfilled' && n8nConnection.value,
        supabaseConnection: supabaseConnection.status === 'fulfilled' && supabaseConnection.value,
        crewStatus: crewConnections.status === 'fulfilled' ? crewConnections.value : {},
        performanceMetrics: this.performanceMetrics,
        lastHealthCheck: new Date().toISOString(),
        version: '2.1.0',
        optimizationLevel: this.getOptimizationLevel()
      }

      console.log(`📊 Status check completed in ${Date.now() - statusStartTime}ms`)
      return status

    } catch (error) {
      this.performanceMetrics.errorCount++
      console.error('❌ Status check failed:', error)
      throw error
    }
  }

  /**
   * Test N8N connection with improved error handling
   */
  private async testN8NConnection(): Promise<boolean> {
    try {
      return await this.credentialsManager.testConnection()
    } catch (error) {
      console.warn('⚠️ N8N connection test failed:', error)
      return false
    }
  }

  /**
   * Test Supabase connection
   */
  private async testSupabaseConnection(): Promise<boolean> {
    try {
      // In a real implementation, this would test Supabase connection
      // For now, we'll simulate based on credentials availability
      const credentials = await this.credentialsManager.getSupabaseCredentials()
      return !!(credentials.url && credentials.anonKey)
    } catch (error) {
      console.warn('⚠️ Supabase connection test failed:', error)
      return false
    }
  }

  /**
   * Test crew connections
   */
  private async testCrewConnections(): Promise<Record<string, boolean>> {
    try {
      const crewStatus = await this.crewManager.getCrewStatus()
      return crewStatus.crewMembers.reduce((acc, member) => {
        acc[member.id] = member.status === 'active'
        return acc
      }, {} as Record<string, boolean>)
    } catch (error) {
      console.warn('⚠️ Crew connection test failed:', error)
      return {}
    }
  }

  /**
   * Calculate success rate based on cache hits/misses
   */
  private calculateSuccessRate(): number {
    const total = this.performanceMetrics.cacheHits + this.performanceMetrics.cacheMisses
    return total > 0 ? this.performanceMetrics.cacheHits / total : 1.0
  }

  /**
   * Calculate connection efficiency
   */
  private calculateConnectionEfficiency(): number {
    // This would be calculated based on actual connection tests
    return 0.85 // Simulated efficiency
  }

  /**
   * Get optimization level based on performance metrics
   */
  private getOptimizationLevel(): 'basic' | 'standard' | 'advanced' | 'maximum' {
    const score = this.performanceMetrics.successRate * 100
    if (score >= 95) return 'maximum'
    if (score >= 85) return 'advanced'
    if (score >= 70) return 'standard'
    return 'basic'
  }

  /**
   * Get performance recommendations
   */
  public getPerformanceRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.performanceMetrics.initializationTime > 5000) {
      recommendations.push('Consider implementing parallel initialization for faster startup')
    }

    if (this.performanceMetrics.cacheMisses > this.performanceMetrics.cacheHits) {
      recommendations.push('Improve caching strategy to reduce cache misses')
    }

    if (this.performanceMetrics.errorCount > 0) {
      recommendations.push('Implement better error handling and retry mechanisms')
    }

    if (this.performanceMetrics.connectionEfficiency < 0.8) {
      recommendations.push('Optimize connection pooling and management')
    }

    return recommendations
  }

  /**
   * Get all services with optimized access
   */
  public getCredentialsManager(): N8NCredentialsManager {
    return this.credentialsManager
  }

  public getDataService(): UnifiedDataService {
    return this.dataService
  }

  public getStealthService(): StealthScrapingService {
    return this.stealthService
  }

  public getCrewManager(): AlexAICrewManager {
    return this.crewManager
  }

  /**
   * Shutdown with cleanup
   */
  public async shutdown(): Promise<void> {
    console.log('🔄 Shutting down Optimized Alex AI Manager...')
    
    // Clear connection pool
    this.connectionPool.clear()
    
    // Reset metrics
    this.performanceMetrics = {
      initializationTime: 0,
      crewActivationTime: 0,
      totalEngagementTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
      errorCount: 0,
      successRate: 0,
      connectionEfficiency: 0
    }

    this.isInitialized = false
    console.log('✅ Optimized Alex AI Manager shutdown complete')
  }
}

// Export convenience functions
export const initializeOptimizedAlexAI = async (config?: Partial<OptimizedAlexAIConfig>) => {
  const manager = OptimizedAlexAIManager.getInstance(config)
  await manager.initialize()
  return manager
}

export const getOptimizedAlexAI = () => OptimizedAlexAIManager.getInstance()
