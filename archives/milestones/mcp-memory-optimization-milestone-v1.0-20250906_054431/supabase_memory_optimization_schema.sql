-- Supabase Memory Optimization Schema
-- ====================================
-- Enhanced schema for MCP memory optimization with vector support

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Drop existing table if it exists (for clean migration)
DROP TABLE IF EXISTS crew_memories CASCADE;

-- Create optimized crew_memories table with vector support
CREATE TABLE crew_memories (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    embedding VECTOR(1536), -- OpenAI text-embedding-3-small dimension
    project_id TEXT NOT NULL DEFAULT 'unknown',
    crew_member TEXT NOT NULL,
    memory_type TEXT NOT NULL DEFAULT 'general',
    importance_score FLOAT DEFAULT 0.5 CHECK (importance_score >= 0 AND importance_score <= 1),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_accessed TIMESTAMPTZ DEFAULT NOW(),
    access_count INTEGER DEFAULT 1,
    tags TEXT[] DEFAULT '{}',
    related_memories TEXT[] DEFAULT '{}',
    is_consolidated BOOLEAN DEFAULT FALSE,
    original_count INTEGER DEFAULT 1,
    consolidation_date TIMESTAMPTZ,
    created_by TEXT DEFAULT 'system'
);

-- Create indexes for performance
CREATE INDEX idx_crew_memories_project_id ON crew_memories(project_id);
CREATE INDEX idx_crew_memories_crew_member ON crew_memories(crew_member);
CREATE INDEX idx_crew_memories_memory_type ON crew_memories(memory_type);
CREATE INDEX idx_crew_memories_importance_score ON crew_memories(importance_score DESC);
CREATE INDEX idx_crew_memories_created_at ON crew_memories(created_at);
CREATE INDEX idx_crew_memories_last_accessed ON crew_memories(last_accessed);
CREATE INDEX idx_crew_memories_is_consolidated ON crew_memories(is_consolidated);

-- Vector similarity search index
CREATE INDEX idx_crew_memories_embedding_cosine ON crew_memories 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Full-text search index
CREATE INDEX idx_crew_memories_content_gin ON crew_memories 
USING gin (to_tsvector('english', content));

-- Tag search index
CREATE INDEX idx_crew_memories_tags_gin ON crew_memories 
USING gin (tags);

-- Create memory clusters table for tracking consolidation
CREATE TABLE memory_clusters (
    cluster_id TEXT PRIMARY KEY,
    representative_memory_id TEXT REFERENCES crew_memories(id),
    memory_count INTEGER NOT NULL DEFAULT 1,
    similarity_threshold FLOAT DEFAULT 0.85,
    project_coverage TEXT[] DEFAULT '{}',
    crew_coverage TEXT[] DEFAULT '{}',
    avg_importance_score FLOAT DEFAULT 0.5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    consolidation_metadata JSONB DEFAULT '{}'
);

-- Create optimization history table
CREATE TABLE memory_optimization_history (
    id SERIAL PRIMARY KEY,
    optimization_timestamp TIMESTAMPTZ DEFAULT NOW(),
    original_memory_count INTEGER NOT NULL,
    final_memory_count INTEGER NOT NULL,
    memories_consolidated INTEGER NOT NULL,
    memories_archived INTEGER NOT NULL,
    memories_deleted INTEGER NOT NULL,
    space_saved_percent FLOAT NOT NULL,
    clusters_created INTEGER DEFAULT 0,
    optimization_config JSONB DEFAULT '{}',
    optimization_report JSONB DEFAULT '{}'
);

-- Create memory access patterns table for analytics
CREATE TABLE memory_access_patterns (
    id SERIAL PRIMARY KEY,
    memory_id TEXT REFERENCES crew_memories(id),
    access_timestamp TIMESTAMPTZ DEFAULT NOW(),
    access_type TEXT NOT NULL, -- 'read', 'search', 'consolidation', 'update'
    access_context JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_address INET
);

-- Create functions for memory optimization

-- Function to calculate memory importance score
CREATE OR REPLACE FUNCTION calculate_memory_importance(
    p_memory_id TEXT
) RETURNS FLOAT AS $$
DECLARE
    memory_record crew_memories%ROWTYPE;
    recency_days INTEGER;
    recency_factor FLOAT;
    access_factor FLOAT;
    length_factor FLOAT;
    tag_factor FLOAT;
    type_factor FLOAT;
    importance_score FLOAT;
BEGIN
    SELECT * INTO memory_record FROM crew_memories WHERE id = p_memory_id;
    
    IF NOT FOUND THEN
        RETURN 0.0;
    END IF;
    
    -- Calculate recency factor (decay over 365 days)
    recency_days := EXTRACT(DAYS FROM NOW() - memory_record.last_accessed);
    recency_factor := GREATEST(0, 1 - (recency_days::FLOAT / 365));
    
    -- Calculate access factor (cap at 10 accesses)
    access_factor := LEAST(1.0, memory_record.access_count::FLOAT / 10);
    
    -- Calculate content length factor (optimal around 500 chars)
    length_factor := LEAST(1.0, LENGTH(memory_record.content)::FLOAT / 500);
    
    -- Calculate tag diversity factor (optimal around 5 tags)
    tag_factor := LEAST(1.0, array_length(memory_record.tags, 1)::FLOAT / 5);
    
    -- Calculate memory type importance
    CASE memory_record.memory_type
        WHEN 'insight' THEN type_factor := 1.0;
        WHEN 'learning' THEN type_factor := 0.9;
        WHEN 'solution' THEN type_factor := 0.8;
        WHEN 'observation' THEN type_factor := 0.7;
        WHEN 'process' THEN type_factor := 0.6;
        WHEN 'technical' THEN type_factor := 0.8;
        WHEN 'strategic' THEN type_factor := 0.9;
        WHEN 'collaborative' THEN type_factor := 0.7;
        ELSE type_factor := 0.5;
    END CASE;
    
    -- Calculate final importance score
    importance_score := (recency_factor * 0.4) + 
                       (access_factor * 0.3) + 
                       (length_factor * 0.1) + 
                       (tag_factor * 0.1) + 
                       (type_factor * 0.1);
    
    RETURN LEAST(1.0, importance_score);
END;
$$ LANGUAGE plpgsql;

-- Function to find similar memories using vector similarity
CREATE OR REPLACE FUNCTION find_similar_memories(
    p_memory_id TEXT,
    p_similarity_threshold FLOAT DEFAULT 0.85,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    similar_memory_id TEXT,
    similarity_score FLOAT,
    content_preview TEXT
) AS $$
DECLARE
    target_embedding VECTOR(1536);
BEGIN
    -- Get the embedding of the target memory
    SELECT embedding INTO target_embedding 
    FROM crew_memories 
    WHERE id = p_memory_id;
    
    IF target_embedding IS NULL THEN
        RETURN;
    END IF;
    
    -- Find similar memories using cosine similarity
    RETURN QUERY
    SELECT 
        cm.id,
        1 - (cm.embedding <=> target_embedding) as similarity_score,
        LEFT(cm.content, 100) as content_preview
    FROM crew_memories cm
    WHERE cm.id != p_memory_id
      AND cm.embedding IS NOT NULL
      AND 1 - (cm.embedding <=> target_embedding) >= p_similarity_threshold
    ORDER BY cm.embedding <=> target_embedding
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- Function to consolidate similar memories
CREATE OR REPLACE FUNCTION consolidate_memories(
    p_memory_ids TEXT[],
    p_consolidated_content TEXT,
    p_consolidated_embedding VECTOR(1536)
) RETURNS TEXT AS $$
DECLARE
    consolidated_id TEXT;
    memory_record crew_memories%ROWTYPE;
    project_ids TEXT[];
    crew_members TEXT[];
    all_tags TEXT[];
    total_importance FLOAT := 0;
    total_access_count INTEGER := 0;
    earliest_created TIMESTAMPTZ;
    latest_accessed TIMESTAMPTZ;
BEGIN
    -- Generate consolidated memory ID
    consolidated_id := 'consolidated_' || array_to_string(p_memory_ids, '_') || '_' || EXTRACT(EPOCH FROM NOW())::TEXT;
    
    -- Get the first memory as base
    SELECT * INTO memory_record FROM crew_memories WHERE id = p_memory_ids[1];
    
    -- Collect data from all memories
    SELECT 
        array_agg(DISTINCT project_id),
        array_agg(DISTINCT crew_member),
        array_agg(DISTINCT unnest(tags)),
        SUM(importance_score),
        SUM(access_count),
        MIN(created_at),
        MAX(last_accessed)
    INTO 
        project_ids,
        crew_members,
        all_tags,
        total_importance,
        total_access_count,
        earliest_created,
        latest_accessed
    FROM crew_memories 
    WHERE id = ANY(p_memory_ids);
    
    -- Create consolidated memory
    INSERT INTO crew_memories (
        id,
        content,
        embedding,
        project_id,
        crew_member,
        memory_type,
        importance_score,
        created_at,
        last_accessed,
        access_count,
        tags,
        related_memories,
        is_consolidated,
        original_count,
        consolidation_date
    ) VALUES (
        consolidated_id,
        p_consolidated_content,
        p_consolidated_embedding,
        project_ids[1], -- Use first project as primary
        'system_consolidated',
        memory_record.memory_type,
        total_importance / array_length(p_memory_ids, 1),
        earliest_created,
        latest_accessed,
        total_access_count,
        all_tags,
        p_memory_ids,
        TRUE,
        array_length(p_memory_ids, 1),
        NOW()
    );
    
    -- Delete original memories
    DELETE FROM crew_memories WHERE id = ANY(p_memory_ids);
    
    RETURN consolidated_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get memory statistics
CREATE OR REPLACE FUNCTION get_memory_statistics()
RETURNS TABLE (
    total_memories BIGINT,
    memories_by_project JSONB,
    memories_by_crew JSONB,
    memories_by_type JSONB,
    avg_importance_score FLOAT,
    oldest_memory TIMESTAMPTZ,
    newest_memory TIMESTAMPTZ,
    consolidated_memories BIGINT,
    standalone_memories BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*) as total_memories,
        jsonb_object_agg(project_id, project_count) as memories_by_project,
        jsonb_object_agg(crew_member, crew_count) as memories_by_crew,
        jsonb_object_agg(memory_type, type_count) as memories_by_type,
        AVG(importance_score) as avg_importance_score,
        MIN(created_at) as oldest_memory,
        MAX(created_at) as newest_memory,
        COUNT(*) FILTER (WHERE is_consolidated = TRUE) as consolidated_memories,
        COUNT(*) FILTER (WHERE is_consolidated = FALSE) as standalone_memories
    FROM (
        SELECT 
            project_id,
            COUNT(*) as project_count
        FROM crew_memories 
        GROUP BY project_id
    ) project_stats
    CROSS JOIN (
        SELECT 
            crew_member,
            COUNT(*) as crew_count
        FROM crew_memories 
        GROUP BY crew_member
    ) crew_stats
    CROSS JOIN (
        SELECT 
            memory_type,
            COUNT(*) as type_count
        FROM crew_memories 
        GROUP BY memory_type
    ) type_stats
    CROSS JOIN crew_memories;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic updates

-- Trigger to update last_accessed when memory is read
CREATE OR REPLACE FUNCTION update_last_accessed()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_accessed = NOW();
    NEW.access_count = OLD.access_count + 1;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_last_accessed
    BEFORE UPDATE ON crew_memories
    FOR EACH ROW
    EXECUTE FUNCTION update_last_accessed();

-- Trigger to log memory access patterns
CREATE OR REPLACE FUNCTION log_memory_access()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO memory_access_patterns (memory_id, access_type, access_context)
    VALUES (NEW.id, 'update', jsonb_build_object('importance_score', NEW.importance_score));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_log_memory_access
    AFTER UPDATE ON crew_memories
    FOR EACH ROW
    EXECUTE FUNCTION log_memory_access();

-- Create views for common queries

-- View for high-importance memories
CREATE VIEW high_importance_memories AS
SELECT 
    id,
    content,
    project_id,
    crew_member,
    memory_type,
    importance_score,
    created_at,
    last_accessed,
    tags
FROM crew_memories
WHERE importance_score >= 0.7
ORDER BY importance_score DESC, last_accessed DESC;

-- View for recent memories
CREATE VIEW recent_memories AS
SELECT 
    id,
    content,
    project_id,
    crew_member,
    memory_type,
    importance_score,
    created_at,
    last_accessed
FROM crew_memories
WHERE created_at >= NOW() - INTERVAL '30 days'
ORDER BY created_at DESC;

-- View for memory consolidation candidates
CREATE VIEW consolidation_candidates AS
SELECT 
    cm1.id as memory1_id,
    cm2.id as memory2_id,
    1 - (cm1.embedding <=> cm2.embedding) as similarity_score,
    cm1.content as memory1_content,
    cm2.content as memory2_content,
    cm1.project_id,
    cm1.crew_member
FROM crew_memories cm1
JOIN crew_memories cm2 ON cm1.id < cm2.id
WHERE cm1.embedding IS NOT NULL 
  AND cm2.embedding IS NOT NULL
  AND 1 - (cm1.embedding <=> cm2.embedding) >= 0.85
  AND cm1.is_consolidated = FALSE
  AND cm2.is_consolidated = FALSE
ORDER BY similarity_score DESC;

-- Insert sample data for testing
INSERT INTO crew_memories (id, content, project_id, crew_member, memory_type, importance_score, tags) VALUES
('sample_001', 'Key insight: Docker containerization improves deployment consistency', 'alex-ai-phase1', 'Captain Picard', 'insight', 0.9, ARRAY['docker', 'deployment', 'infrastructure']),
('sample_002', 'Learning: Docker containers ensure consistent environments across development and production', 'alex-ai-phase1', 'Commander Data', 'learning', 0.8, ARRAY['docker', 'deployment', 'consistency']),
('sample_003', 'Solution: Implemented CI/CD pipeline with automated testing and deployment', 'alex-ai-phase1', 'Lt. La Forge', 'solution', 0.85, ARRAY['cicd', 'automation', 'testing']);

-- Grant necessary permissions
GRANT ALL ON crew_memories TO authenticated;
GRANT ALL ON memory_clusters TO authenticated;
GRANT ALL ON memory_optimization_history TO authenticated;
GRANT ALL ON memory_access_patterns TO authenticated;
GRANT SELECT ON high_importance_memories TO authenticated;
GRANT SELECT ON recent_memories TO authenticated;
GRANT SELECT ON consolidation_candidates TO authenticated;

-- Create RLS policies
ALTER TABLE crew_memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_clusters ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_optimization_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory_access_patterns ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all memories
CREATE POLICY "Allow authenticated users to read memories" ON crew_memories
    FOR SELECT TO authenticated USING (true);

-- Allow authenticated users to insert memories
CREATE POLICY "Allow authenticated users to insert memories" ON crew_memories
    FOR INSERT TO authenticated WITH CHECK (true);

-- Allow authenticated users to update memories
CREATE POLICY "Allow authenticated users to update memories" ON crew_memories
    FOR UPDATE TO authenticated USING (true);

-- Allow authenticated users to delete memories
CREATE POLICY "Allow authenticated users to delete memories" ON crew_memories
    FOR DELETE TO authenticated USING (true);

-- Similar policies for other tables
CREATE POLICY "Allow authenticated users to read clusters" ON memory_clusters
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read optimization history" ON memory_optimization_history
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated users to read access patterns" ON memory_access_patterns
    FOR SELECT TO authenticated USING (true);
