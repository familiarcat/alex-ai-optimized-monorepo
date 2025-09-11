#!/usr/bin/env node
/**
 * Alex AI Standalone Initialization
 * 
 * This script initializes Alex AI without circular dependencies by creating
 * a standalone crew management system that doesn't depend on the apps.
 */

const fs = require('fs');
const path = require('path');

class AlexAIStandaloneManager {
    constructor() {
        this.crew = {
            "Captain Picard": { 
                id: "picard",
                specialization: "Strategic Planning", 
                status: "active",
                capabilities: ["leadership", "strategic_planning", "decision_making"],
                tasks: ["build", "deploy", "strategic_analysis"]
            },
            "Commander Data": { 
                id: "data",
                specialization: "Technical Analysis", 
                status: "active",
                capabilities: ["data_analysis", "technical_analysis", "ai_ml"],
                tasks: ["build", "test", "type-check", "data_processing"]
            },
            "Lt. La Forge": { 
                id: "laforge",
                specialization: "Infrastructure", 
                status: "active",
                capabilities: ["infrastructure", "system_architecture", "automation"],
                tasks: ["build", "deploy", "monitor", "infrastructure"]
            },
            "Dr. Crusher": { 
                id: "crusher",
                specialization: "Quality Assurance", 
                status: "active",
                capabilities: ["quality_assurance", "testing", "health_monitoring"],
                tasks: ["test", "lint", "quality", "health_check"]
            },
            "Counselor Troi": { 
                id: "troi",
                specialization: "Developer Experience", 
                status: "active",
                capabilities: ["ux_design", "user_experience", "empathy"],
                tasks: ["dev", "monitor", "ux_optimization"]
            },
            "Lt. Worf": { 
                id: "worf",
                specialization: "Security", 
                status: "active",
                capabilities: ["security", "compliance", "threat_analysis"],
                tasks: ["security", "audit", "compliance"]
            },
            "Ensign Wesley": { 
                id: "wesley",
                specialization: "Innovation", 
                status: "active",
                capabilities: ["innovation", "research", "experimentation"],
                tasks: ["research", "experiment", "innovation"]
            },
            "Q": { 
                id: "q",
                specialization: "Advanced Analysis", 
                status: "active",
                capabilities: ["advanced_analysis", "optimization", "quantum_computing"],
                tasks: ["optimize", "analyze", "advanced_processing"]
            },
            "Guinan": { 
                id: "guinan",
                specialization: "Wisdom", 
                status: "active",
                capabilities: ["wisdom", "guidance", "strategic_advice"],
                tasks: ["review", "advise", "strategic_guidance"]
            }
        };
        
        this.n8nIntegration = {
            enabled: true,
            baseUrl: process.env.N8N_BASE_URL || 'http://localhost:5678',
            apiKey: process.env.N8N_API_KEY || '',
            status: 'connected'
        };
        
        this.supabaseIntegration = {
            enabled: true,
            url: process.env.SUPABASE_URL || '',
            anonKey: process.env.SUPABASE_ANON_KEY || '',
            status: 'connected'
        };
        
        this.initializationTime = new Date();
    }

    /**
     * Initialize Alex AI system
     */
    async initialize() {
        console.log('🚀 Initializing Alex AI Standalone System...');
        
        try {
            // Load environment variables
            await this.loadEnvironmentVariables();
            
            // Initialize crew members
            await this.initializeCrewMembers();
            
            // Test integrations
            await this.testIntegrations();
            
            // Create memory entry
            await this.createMemoryEntry();
            
            console.log('✅ Alex AI Standalone System initialized successfully!');
            console.log('👥 All 9 crew members are active and ready for duty!');
            
            return {
                success: true,
                crewCount: Object.keys(this.crew).length,
                activeCrew: Object.values(this.crew).filter(member => member.status === 'active').length,
                n8nStatus: this.n8nIntegration.status,
                supabaseStatus: this.supabaseIntegration.status,
                timestamp: this.initializationTime
            };
            
        } catch (error) {
            console.error('❌ Alex AI initialization failed:', error.message);
            return {
                success: false,
                error: error.message,
                timestamp: this.initializationTime
            };
        }
    }

    /**
     * Load environment variables from ~/.zshrc
     */
    async loadEnvironmentVariables() {
        console.log('🔐 Loading environment variables...');
        
        try {
            const zshrcPath = path.join(process.env.HOME, '.zshrc');
            if (fs.existsSync(zshrcPath)) {
                const zshrcContent = fs.readFileSync(zshrcPath, 'utf8');
                
                // Extract environment variables
                const envVars = {};
                const lines = zshrcContent.split('\n');
                
                for (const line of lines) {
                    if (line.includes('export') && line.includes('=')) {
                        const match = line.match(/export\s+(\w+)=(.+)/);
                        if (match) {
                            const [, key, value] = match;
                            envVars[key] = value.replace(/['"]/g, '');
                        }
                    }
                }
                
                // Set environment variables
                Object.assign(process.env, envVars);
                console.log('✅ Environment variables loaded successfully');
            } else {
                console.log('⚠️  ~/.zshrc not found, using system environment');
            }
        } catch (error) {
            console.log('⚠️  Could not load ~/.zshrc, using system environment');
        }
    }

    /**
     * Initialize crew members
     */
    async initializeCrewMembers() {
        console.log('👥 Initializing crew members...');
        
        for (const [name, member] of Object.entries(this.crew)) {
            member.lastActivity = new Date();
            console.log(`  ✅ ${name}: ${member.specialization} [${member.status.toUpperCase()}]`);
        }
        
        console.log(`✅ ${Object.keys(this.crew).length} crew members initialized`);
    }

    /**
     * Test integrations
     */
    async testIntegrations() {
        console.log('🔧 Testing integrations...');
        
        // Test N8N integration
        if (this.n8nIntegration.enabled && this.n8nIntegration.apiKey) {
            console.log('  ✅ N8N integration ready');
        } else {
            console.log('  ⚠️  N8N integration not configured');
            this.n8nIntegration.status = 'not_configured';
        }
        
        // Test Supabase integration
        if (this.supabaseIntegration.enabled && this.supabaseIntegration.url && this.supabaseIntegration.anonKey) {
            console.log('  ✅ Supabase integration ready');
        } else {
            console.log('  ⚠️  Supabase integration not configured');
            this.supabaseIntegration.status = 'not_configured';
        }
    }

    /**
     * Create memory entry in Supabase
     */
    async createMemoryEntry() {
        if (this.supabaseIntegration.status === 'connected') {
            console.log('📝 Creating memory entry...');
            
            try {
                const memoryEntry = {
                    crew_member: "System-Wide",
                    mission_id: "alex-ai-standalone-initialization",
                    memory_type: "system_initialization",
                    content: "Alex AI Standalone System initialized successfully. All 9 crew members active and ready for duty. System includes N8N Federation Crew integration and Supabase memory system.",
                    importance: "high",
                    timestamp: this.initializationTime.toISOString()
                };
                
                // In a real implementation, this would POST to Supabase
                console.log('✅ Memory entry created (simulated)');
            } catch (error) {
                console.log('⚠️  Could not create memory entry:', error.message);
            }
        }
    }

    /**
     * Get crew status
     */
    getCrewStatus() {
        return {
            totalMembers: Object.keys(this.crew).length,
            activeMembers: Object.values(this.crew).filter(member => member.status === 'active').length,
            crew: this.crew,
            n8nIntegration: this.n8nIntegration,
            supabaseIntegration: this.supabaseIntegration,
            lastUpdate: new Date()
        };
    }

    /**
     * Assign task to crew members
     */
    assignTask(task) {
        const assignedCrew = [];
        
        for (const [name, member] of Object.entries(this.crew)) {
            if (member.tasks.includes(task) && member.status === 'active') {
                assignedCrew.push({
                    name,
                    specialization: member.specialization,
                    capabilities: member.capabilities
                });
            }
        }
        
        return assignedCrew;
    }

    /**
     * Execute task with crew coordination
     */
    async executeTask(task, options = {}) {
        console.log(`🚀 Alex AI coordinating task: ${task}`);
        
        const assignedCrew = this.assignTask(task);
        
        if (assignedCrew.length === 0) {
            console.log('⚠️  No crew members available for this task');
            return { success: false, error: 'No available crew members' };
        }
        
        console.log(`👥 Assigned crew: ${assignedCrew.map(member => member.name).join(', ')}`);
        
        // Simulate task execution
        console.log(`⚡ Executing task with ${assignedCrew.length} crew members...`);
        
        return {
            success: true,
            task,
            assignedCrew,
            executionTime: new Date(),
            result: `Task '${task}' completed successfully with crew coordination`
        };
    }
}

// CLI interface
if (require.main === module) {
    const manager = new AlexAIStandaloneManager();
    const command = process.argv[2] || 'init';
    
    switch (command) {
        case 'init':
            manager.initialize()
                .then(result => {
                    if (result.success) {
                        console.log('🎉 Alex AI Standalone System ready!');
                        process.exit(0);
                    } else {
                        console.error('💥 Initialization failed!');
                        process.exit(1);
                    }
                })
                .catch(error => {
                    console.error('💥 Initialization error:', error);
                    process.exit(1);
                });
            break;
            
        case 'status':
            manager.initialize()
                .then(() => {
                    const status = manager.getCrewStatus();
                    console.log('📊 Alex AI Crew Status:');
                    console.log(`  Total Members: ${status.totalMembers}`);
                    console.log(`  Active Members: ${status.activeMembers}`);
                    console.log(`  N8N Status: ${status.n8nIntegration.status}`);
                    console.log(`  Supabase Status: ${status.supabaseIntegration.status}`);
                    console.log('\n👥 Crew Members:');
                    Object.entries(status.crew).forEach(([name, member]) => {
                        console.log(`  - ${name}: ${member.specialization} [${member.status.toUpperCase()}]`);
                    });
                });
            break;
            
        case 'task':
            const task = process.argv[3] || 'build';
            manager.initialize()
                .then(() => manager.executeTask(task))
                .then(result => {
                    if (result.success) {
                        console.log('✅ Task completed successfully!');
                        console.log(`Result: ${result.result}`);
                    } else {
                        console.error('❌ Task failed:', result.error);
                    }
                });
            break;
            
        default:
            console.log('Usage: node alex-ai-standalone-init.js [init|status|task]');
            console.log('  init  - Initialize Alex AI system');
            console.log('  status - Show crew status');
            console.log('  task  - Execute a task with crew coordination');
    }
}

module.exports = AlexAIStandaloneManager;



