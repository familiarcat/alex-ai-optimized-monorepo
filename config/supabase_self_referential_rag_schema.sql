-- Alex AI Crew Self-Referential RAG System Schema
-- ===============================================
-- Comprehensive schema for storing crew decisions, knowledge retrieval,
-- and learning progression with vector embeddings for similarity search

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS alex_ai_knowledge_retrievals CASCADE;
DROP TABLE IF EXISTS alex_ai_learning_cycles CASCADE;
DROP TABLE IF EXISTS alex_ai_crew_decisions CASCADE;

-- Create crew decisions table with vector embeddings
CREATE TABLE alex_ai_crew_decisions (
    id TEXT PRIMARY KEY,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    problem_statement TEXT NOT NULL,
    crew_deliberations JSONB NOT NULL,
    final_decision TEXT NOT NULL,
    implementation_details JSONB NOT NULL,
    success_metrics JSONB,
    lessons_learned TEXT[] DEFAULT '{}',
    related_decisions TEXT[] DEFAULT '{}',
    embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension
    decision_type TEXT DEFAULT 'general',
    priority_level INTEGER DEFAULT 5 CHECK (priority_level >= 1 AND priority_level <= 10),
    confidence_score DECIMAL(3,2) DEFAULT 0.5 CHECK (confidence_score >= 0 AND confidence_score <= 1),
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knowledge retrievals table
CREATE TABLE alex_ai_knowledge_retrievals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    decision_id TEXT NOT NULL,
    retrieved_decision_id TEXT NOT NULL,
    similarity_score DECIMAL(4,3) NOT NULL CHECK (similarity_score >= 0 AND similarity_score <= 1),
    relevance_context TEXT NOT NULL,
    applicable_lessons JSONB NOT NULL,
    retrieval_strategy TEXT DEFAULT 'vector_similarity',
    retrieved_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key relationship
    FOREIGN KEY (decision_id) REFERENCES alex_ai_crew_decisions(id) ON DELETE CASCADE,
    FOREIGN KEY (retrieved_decision_id) REFERENCES alex_ai_crew_decisions(id) ON DELETE CASCADE
);

-- Create learning cycles table
CREATE TABLE alex_ai_learning_cycles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cycle_name TEXT NOT NULL,
    start_decision_id TEXT NOT NULL,
    end_decision_id TEXT,
    cycle_type TEXT DEFAULT 'iterative_improvement',
    learning_objectives TEXT[] DEFAULT '{}',
    knowledge_gaps_identified TEXT[] DEFAULT '{}',
    insights_generated TEXT[] DEFAULT '{}',
    cycle_status TEXT DEFAULT 'active' CHECK (cycle_status IN ('active', 'completed', 'paused')),
    performance_metrics JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    -- Foreign key relationships
    FOREIGN KEY (start_decision_id) REFERENCES alex_ai_crew_decisions(id) ON DELETE CASCADE,
    FOREIGN KEY (end_decision_id) REFERENCES alex_ai_crew_decisions(id) ON DELETE SET NULL
);

-- Create crew knowledge evolution table
CREATE TABLE alex_ai_crew_knowledge_evolution (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    crew_member TEXT NOT NULL,
    knowledge_domain TEXT NOT NULL,
    evolution_type TEXT NOT NULL, -- 'new_insight', 'refinement', 'contradiction', 'validation'
    previous_understanding TEXT,
    evolved_understanding TEXT,
    supporting_evidence TEXT[] DEFAULT '{}',
    confidence_level DECIMAL(3,2) DEFAULT 0.5,
    related_decision_ids TEXT[] DEFAULT '{}',
    evolution_timestamp TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key relationship
    FOREIGN KEY (crew_member) REFERENCES alex_ai_crew_profiles(crew_member) ON DELETE CASCADE
);

-- Create solution pattern recognition table
CREATE TABLE alex_ai_solution_patterns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pattern_name TEXT NOT NULL,
    pattern_description TEXT NOT NULL,
    problem_domain TEXT NOT NULL,
    solution_components JSONB NOT NULL,
    success_rate DECIMAL(3,2) DEFAULT 0.0,
    usage_count INTEGER DEFAULT 0,
    first_identified_decision_id TEXT NOT NULL,
    last_used_decision_id TEXT,
    pattern_confidence DECIMAL(3,2) DEFAULT 0.5,
    related_decisions TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Foreign key relationships
    FOREIGN KEY (first_identified_decision_id) REFERENCES alex_ai_crew_decisions(id) ON DELETE CASCADE,
    FOREIGN KEY (last_used_decision_id) REFERENCES alex_ai_crew_decisions(id) ON DELETE SET NULL
);

-- Create indexes for performance optimization
CREATE INDEX idx_crew_decisions_timestamp ON alex_ai_crew_decisions(timestamp);
CREATE INDEX idx_crew_decisions_problem_statement ON alex_ai_crew_decisions USING GIN(to_tsvector('english', problem_statement));
CREATE INDEX idx_crew_decisions_final_decision ON alex_ai_crew_decisions USING GIN(to_tsvector('english', final_decision));
CREATE INDEX idx_crew_decisions_lessons_learned ON alex_ai_crew_decisions USING GIN(lessons_learned);
CREATE INDEX idx_crew_decisions_tags ON alex_ai_crew_decisions USING GIN(tags);
CREATE INDEX idx_crew_decisions_decision_type ON alex_ai_crew_decisions(decision_type);
CREATE INDEX idx_crew_decisions_priority_level ON alex_ai_crew_decisions(priority_level);
CREATE INDEX idx_crew_decisions_confidence_score ON alex_ai_crew_decisions(confidence_score);

-- Vector similarity search index for crew decisions
CREATE INDEX idx_crew_decisions_embedding_cosine ON alex_ai_crew_decisions 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Knowledge retrieval indexes
CREATE INDEX idx_knowledge_retrievals_decision_id ON alex_ai_knowledge_retrievals(decision_id);
CREATE INDEX idx_knowledge_retrievals_retrieved_decision_id ON alex_ai_knowledge_retrievals(retrieved_decision_id);
CREATE INDEX idx_knowledge_retrievals_similarity_score ON alex_ai_knowledge_retrievals(similarity_score DESC);
CREATE INDEX idx_knowledge_retrievals_retrieved_at ON alex_ai_knowledge_retrievals(retrieved_at);

-- Learning cycles indexes
CREATE INDEX idx_learning_cycles_cycle_name ON alex_ai_learning_cycles(cycle_name);
CREATE INDEX idx_learning_cycles_cycle_status ON alex_ai_learning_cycles(cycle_status);
CREATE INDEX idx_learning_cycles_start_decision_id ON alex_ai_learning_cycles(start_decision_id);
CREATE INDEX idx_learning_cycles_created_at ON alex_ai_learning_cycles(created_at);

-- Crew knowledge evolution indexes
CREATE INDEX idx_crew_knowledge_evolution_crew_member ON alex_ai_crew_knowledge_evolution(crew_member);
CREATE INDEX idx_crew_knowledge_evolution_knowledge_domain ON alex_ai_crew_knowledge_evolution(knowledge_domain);
CREATE INDEX idx_crew_knowledge_evolution_evolution_type ON alex_ai_crew_knowledge_evolution(evolution_type);
CREATE INDEX idx_crew_knowledge_evolution_timestamp ON alex_ai_crew_knowledge_evolution(evolution_timestamp);

-- Solution patterns indexes
CREATE INDEX idx_solution_patterns_pattern_name ON alex_ai_solution_patterns(pattern_name);
CREATE INDEX idx_solution_patterns_problem_domain ON alex_ai_solution_patterns(problem_domain);
CREATE INDEX idx_solution_patterns_success_rate ON alex_ai_solution_patterns(success_rate DESC);
CREATE INDEX idx_solution_patterns_usage_count ON alex_ai_solution_patterns(usage_count DESC);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION match_crew_decisions(
    query_embedding VECTOR(1536),
    match_threshold DECIMAL DEFAULT 0.7,
    match_count INTEGER DEFAULT 5
)
RETURNS TABLE (
    id TEXT,
    problem_statement TEXT,
    final_decision TEXT,
    lessons_learned TEXT[],
    similarity DECIMAL
)
LANGUAGE SQL
AS $$
    SELECT 
        alex_ai_crew_decisions.id,
        alex_ai_crew_decisions.problem_statement,
        alex_ai_crew_decisions.final_decision,
        alex_ai_crew_decisions.lessons_learned,
        1 - (alex_ai_crew_decisions.embedding <=> query_embedding) AS similarity
    FROM alex_ai_crew_decisions
    WHERE alex_ai_crew_decisions.embedding IS NOT NULL
    AND 1 - (alex_ai_crew_decisions.embedding <=> query_embedding) > match_threshold
    ORDER BY alex_ai_crew_decisions.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create function to update related decisions
CREATE OR REPLACE FUNCTION update_related_decisions()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the updated_at timestamp
    NEW.updated_at = NOW();
    
    -- If this is a new decision, find and update related decisions
    IF TG_OP = 'INSERT' THEN
        -- Find similar decisions and update their related_decisions array
        UPDATE alex_ai_crew_decisions 
        SET related_decisions = related_decisions || NEW.id
        WHERE id != NEW.id 
        AND embedding IS NOT NULL 
        AND NEW.embedding IS NOT NULL
        AND 1 - (embedding <=> NEW.embedding) > 0.8;
        
        -- Update this decision's related_decisions with similar decisions
        UPDATE alex_ai_crew_decisions 
        SET related_decisions = (
            SELECT ARRAY_AGG(id) 
            FROM alex_ai_crew_decisions 
            WHERE id != NEW.id 
            AND embedding IS NOT NULL 
            AND NEW.embedding IS NOT NULL
            AND 1 - (embedding <=> NEW.embedding) > 0.8
        )
        WHERE id = NEW.id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update related decisions
CREATE TRIGGER trigger_update_related_decisions
    AFTER INSERT OR UPDATE ON alex_ai_crew_decisions
    FOR EACH ROW
    EXECUTE FUNCTION update_related_decisions();

-- Create function to track solution pattern usage
CREATE OR REPLACE FUNCTION track_pattern_usage(pattern_id UUID, decision_id TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE alex_ai_solution_patterns 
    SET 
        usage_count = usage_count + 1,
        last_used_decision_id = decision_id,
        updated_at = NOW()
    WHERE id = pattern_id;
    
    -- Update related_decisions array
    UPDATE alex_ai_solution_patterns 
    SET related_decisions = related_decisions || decision_id
    WHERE id = pattern_id 
    AND NOT (decision_id = ANY(related_decisions));
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate learning progression
CREATE OR REPLACE FUNCTION calculate_learning_progression(crew_member TEXT, knowledge_domain TEXT)
RETURNS TABLE (
    total_decisions INTEGER,
    knowledge_evolution_count INTEGER,
    confidence_trend DECIMAL,
    recent_insights TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(DISTINCT d.id)::INTEGER as total_decisions,
        COUNT(DISTINCT e.id)::INTEGER as knowledge_evolution_count,
        AVG(d.confidence_score) as confidence_trend,
        ARRAY_AGG(DISTINCT d.lessons_learned) as recent_insights
    FROM alex_ai_crew_decisions d
    LEFT JOIN alex_ai_crew_knowledge_evolution e 
        ON e.crew_member = crew_member 
        AND e.knowledge_domain = knowledge_domain
    WHERE d.crew_deliberations ? crew_member
    AND d.timestamp >= NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create view for decision insights
CREATE VIEW decision_insights AS
SELECT 
    d.id,
    d.timestamp,
    d.problem_statement,
    d.final_decision,
    d.confidence_score,
    d.priority_level,
    d.lessons_learned,
    COUNT(kr.id) as knowledge_references,
    AVG(kr.similarity_score) as avg_similarity,
    ARRAY_LENGTH(d.related_decisions, 1) as related_decisions_count
FROM alex_ai_crew_decisions d
LEFT JOIN alex_ai_knowledge_retrievals kr ON kr.decision_id = d.id
GROUP BY d.id, d.timestamp, d.problem_statement, d.final_decision, 
         d.confidence_score, d.priority_level, d.lessons_learned, d.related_decisions;

-- Create view for crew learning progression
CREATE VIEW crew_learning_progression AS
SELECT 
    crew_member,
    knowledge_domain,
    COUNT(*) as total_evolutions,
    AVG(confidence_level) as avg_confidence,
    MAX(evolution_timestamp) as last_evolution,
    ARRAY_AGG(DISTINCT evolution_type) as evolution_types
FROM alex_ai_crew_knowledge_evolution
GROUP BY crew_member, knowledge_domain;

-- Insert initial system metadata
INSERT INTO alex_ai_crew_decisions (
    id, 
    problem_statement, 
    crew_deliberations, 
    final_decision, 
    implementation_details,
    decision_type,
    priority_level,
    confidence_score,
    tags
) VALUES (
    'system_init_001',
    'Initialize Alex AI Self-Referential RAG System',
    '{"system": {"role": "System Initialization", "contribution": "Setting up comprehensive RAG system for crew knowledge accumulation"}}',
    'Deploy self-referential RAG system with vector embeddings, knowledge retrieval, and learning progression tracking',
    '{"system_type": "initialization", "version": "1.0.0", "features": ["vector_search", "knowledge_retrieval", "learning_progression"]}',
    'system_initialization',
    10,
    1.0,
    ARRAY['system', 'initialization', 'rag', 'vector_embeddings']
);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create RLS policies for security
ALTER TABLE alex_ai_crew_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE alex_ai_knowledge_retrievals ENABLE ROW LEVEL SECURITY;
ALTER TABLE alex_ai_learning_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE alex_ai_crew_knowledge_evolution ENABLE ROW LEVEL SECURITY;
ALTER TABLE alex_ai_solution_patterns ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Authenticated users can manage crew decisions" ON alex_ai_crew_decisions
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage knowledge retrievals" ON alex_ai_knowledge_retrievals
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage learning cycles" ON alex_ai_learning_cycles
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage crew knowledge evolution" ON alex_ai_crew_knowledge_evolution
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Authenticated users can manage solution patterns" ON alex_ai_solution_patterns
    FOR ALL TO authenticated USING (true);

COMMENT ON TABLE alex_ai_crew_decisions IS 'Stores all crew decisions with vector embeddings for similarity search and knowledge retrieval';
COMMENT ON TABLE alex_ai_knowledge_retrievals IS 'Tracks knowledge retrieval events and similarity scores for decision context';
COMMENT ON TABLE alex_ai_learning_cycles IS 'Manages learning cycles and iterative improvement processes';
COMMENT ON TABLE alex_ai_crew_knowledge_evolution IS 'Tracks how crew member understanding evolves over time';
COMMENT ON TABLE alex_ai_solution_patterns IS 'Identifies and tracks recurring solution patterns across decisions';

COMMENT ON FUNCTION match_crew_decisions IS 'Performs vector similarity search to find relevant historical decisions';
COMMENT ON FUNCTION update_related_decisions IS 'Automatically updates related decisions when new decisions are added';
COMMENT ON FUNCTION track_pattern_usage IS 'Tracks usage of solution patterns for pattern recognition';
COMMENT ON FUNCTION calculate_learning_progression IS 'Calculates learning progression metrics for crew members';
