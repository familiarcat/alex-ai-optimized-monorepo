"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
async function POST() {
    try {
        console.log('🧠 Setting up Alex AI crew memory system...');
        // Create Alex AI crew memories table
        const createCrewMemoriesTable = `
      CREATE TABLE IF NOT EXISTS alex_ai_crew_memories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        crew_member VARCHAR(100) NOT NULL,
        memory_type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        source VARCHAR(255),
        source_url TEXT,
        relevance_score INTEGER DEFAULT 0,
        tags TEXT[],
        metadata JSONB,
        
        -- Alex AI analysis
        alex_ai_analysis JSONB,
        crew_relevance JSONB,
        
        -- Memory management
        importance_level INTEGER DEFAULT 5,
        access_count INTEGER DEFAULT 0,
        last_accessed TIMESTAMP WITH TIME ZONE,
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        expires_at TIMESTAMP WITH TIME ZONE
      );
    `;
        // Create MCP knowledge base table
        const createMCPKnowledgeTable = `
      CREATE TABLE IF NOT EXISTS mcp_knowledge_base (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        external_id VARCHAR(255) UNIQUE,
        source VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        url TEXT,
        type VARCHAR(50),
        language VARCHAR(50),
        tags TEXT[],
        
        -- GitHub specific fields
        stars INTEGER DEFAULT 0,
        forks INTEGER DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE,
        
        -- Documentation specific fields
        version VARCHAR(50),
        category VARCHAR(100),
        
        -- Alex AI crew analysis
        crew_relevance JSONB,
        alex_ai_analysis JSONB,
        
        -- Scraping metadata
        scraped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        scraping_job_id VARCHAR(255),
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create crew member profiles table
        const createCrewProfilesTable = `
      CREATE TABLE IF NOT EXISTS alex_ai_crew_profiles (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        crew_member VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        specialization TEXT,
        expertise_areas TEXT[],
        current_focus TEXT,
        
        -- Performance metrics
        tasks_completed INTEGER DEFAULT 0,
        success_rate DECIMAL(5,2) DEFAULT 0.0,
        average_response_time INTEGER DEFAULT 0,
        
        -- Memory and knowledge
        total_memories INTEGER DEFAULT 0,
        knowledge_base_size INTEGER DEFAULT 0,
        last_activity TIMESTAMP WITH TIME ZONE,
        
        -- Configuration
        is_active BOOLEAN DEFAULT TRUE,
        preferences JSONB,
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create crew interactions table
        const createCrewInteractionsTable = `
      CREATE TABLE IF NOT EXISTS alex_ai_crew_interactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        interaction_type VARCHAR(50) NOT NULL,
        crew_members TEXT[] NOT NULL,
        context TEXT,
        input_data JSONB,
        output_data JSONB,
        
        -- Analysis
        success BOOLEAN DEFAULT TRUE,
        performance_score INTEGER DEFAULT 0,
        insights TEXT[],
        
        -- Memory references
        memory_ids UUID[],
        knowledge_references TEXT[],
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        duration_ms INTEGER DEFAULT 0
      );
    `;
        // Create indexes for performance
        const createIndexes = `
      -- Crew memories indexes
      CREATE INDEX IF NOT EXISTS idx_crew_memories_crew_member ON alex_ai_crew_memories(crew_member);
      CREATE INDEX IF NOT EXISTS idx_crew_memories_memory_type ON alex_ai_crew_memories(memory_type);
      CREATE INDEX IF NOT EXISTS idx_crew_memories_relevance_score ON alex_ai_crew_memories(relevance_score);
      CREATE INDEX IF NOT EXISTS idx_crew_memories_tags ON alex_ai_crew_memories USING GIN(tags);
      CREATE INDEX IF NOT EXISTS idx_crew_memories_created_at ON alex_ai_crew_memories(created_at);
      
      -- MCP knowledge base indexes
      CREATE INDEX IF NOT EXISTS idx_mcp_knowledge_source ON mcp_knowledge_base(source);
      CREATE INDEX IF NOT EXISTS idx_mcp_knowledge_type ON mcp_knowledge_base(type);
      CREATE INDEX IF NOT EXISTS idx_mcp_knowledge_tags ON mcp_knowledge_base USING GIN(tags);
      CREATE INDEX IF NOT EXISTS idx_mcp_knowledge_external_id ON mcp_knowledge_base(external_id);
      CREATE INDEX IF NOT EXISTS idx_mcp_knowledge_scraped_at ON mcp_knowledge_base(scraped_at);
      
      -- Crew profiles indexes
      CREATE INDEX IF NOT EXISTS idx_crew_profiles_crew_member ON alex_ai_crew_profiles(crew_member);
      CREATE INDEX IF NOT EXISTS idx_crew_profiles_is_active ON alex_ai_crew_profiles(is_active);
      CREATE INDEX IF NOT EXISTS idx_crew_profiles_expertise ON alex_ai_crew_profiles USING GIN(expertise_areas);
      
      -- Crew interactions indexes
      CREATE INDEX IF NOT EXISTS idx_crew_interactions_type ON alex_ai_crew_interactions(interaction_type);
      CREATE INDEX IF NOT EXISTS idx_crew_interactions_crew_members ON alex_ai_crew_interactions USING GIN(crew_members);
      CREATE INDEX IF NOT EXISTS idx_crew_interactions_created_at ON alex_ai_crew_interactions(created_at);
      CREATE INDEX IF NOT EXISTS idx_crew_interactions_success ON alex_ai_crew_interactions(success);
    `;
        // Test database connection first
        console.log('Testing database connection...');
        const { data: testData, error: testError } = await supabase_1.supabase
            .from('alex_ai_crew_memories')
            .select('count')
            .limit(1);
        if (testError && testError.code === '42P01') {
            console.log('Tables do not exist, need to create them manually in Supabase');
            return server_1.NextResponse.json({
                success: false,
                message: 'Alex AI crew memory tables need to be created manually in Supabase dashboard',
                instructions: [
                    '1. Go to Supabase Dashboard → SQL Editor',
                    '2. Run the following SQL commands:',
                    '3. Then test the Alex AI crew memory system'
                ],
                sql_commands: [
                    createCrewMemoriesTable,
                    createMCPKnowledgeTable,
                    createCrewProfilesTable,
                    createCrewInteractionsTable,
                    createIndexes
                ]
            });
        }
        return server_1.NextResponse.json({
            success: true,
            message: 'Alex AI crew memory system setup completed successfully',
            tables: ['alex_ai_crew_memories', 'mcp_knowledge_base', 'alex_ai_crew_profiles', 'alex_ai_crew_interactions'],
            indexes: 'Performance indexes created'
        });
    }
    catch (error) {
        console.error('❌ Alex AI crew memory system setup failed:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map