-- Script Memory System Schema
-- ===========================
-- Supabase schema for storing script metadata and embeddings

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS vector;

-- Create script_memories table
CREATE TABLE IF NOT EXISTS script_memories (
    id TEXT PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    purpose TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT NOT NULL,
    functions TEXT[] DEFAULT '{}',
    variables TEXT[] DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    content_summary TEXT,
    embedding VECTOR(384), -- all-MiniLM-L6-v2 embedding size
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_script_memories_category ON script_memories(category);
CREATE INDEX IF NOT EXISTS idx_script_memories_subcategory ON script_memories(subcategory);
CREATE INDEX IF NOT EXISTS idx_script_memories_tags ON script_memories USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_script_memories_embedding ON script_memories USING ivfflat (embedding vector_cosine_ops);

-- Create function for vector similarity search
CREATE OR REPLACE FUNCTION search_similar_scripts(
    query_embedding VECTOR(384),
    match_threshold FLOAT DEFAULT 0.7,
    match_count INT DEFAULT 5
)
RETURNS TABLE (
    id TEXT,
    file_name TEXT,
    file_path TEXT,
    purpose TEXT,
    category TEXT,
    subcategory TEXT,
    functions TEXT[],
    variables TEXT[],
    tags TEXT[],
    content_summary TEXT,
    similarity_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
AS $$
    SELECT 
        sm.id,
        sm.file_name,
        sm.file_path,
        sm.purpose,
        sm.category,
        sm.subcategory,
        sm.functions,
        sm.variables,
        sm.tags,
        sm.content_summary,
        1 - (sm.embedding <=> query_embedding) AS similarity_score,
        sm.created_at,
        sm.updated_at
    FROM script_memories sm
    WHERE 1 - (sm.embedding <=> query_embedding) > match_threshold
    ORDER BY sm.embedding <=> query_embedding
    LIMIT match_count;
$$;

-- Create function for category-based search
CREATE OR REPLACE FUNCTION search_scripts_by_category(
    search_category TEXT,
    search_subcategory TEXT DEFAULT NULL,
    limit_count INT DEFAULT 10
)
RETURNS TABLE (
    id TEXT,
    file_name TEXT,
    file_path TEXT,
    purpose TEXT,
    category TEXT,
    subcategory TEXT,
    functions TEXT[],
    variables TEXT[],
    tags TEXT[],
    content_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
AS $$
    SELECT 
        sm.id,
        sm.file_name,
        sm.file_path,
        sm.purpose,
        sm.category,
        sm.subcategory,
        sm.functions,
        sm.variables,
        sm.tags,
        sm.content_summary,
        sm.created_at,
        sm.updated_at
    FROM script_memories sm
    WHERE sm.category = search_category
    AND (search_subcategory IS NULL OR sm.subcategory = search_subcategory)
    ORDER BY sm.created_at DESC
    LIMIT limit_count;
$$;

-- Create function for tag-based search
CREATE OR REPLACE FUNCTION search_scripts_by_tags(
    search_tags TEXT[],
    limit_count INT DEFAULT 10
)
RETURNS TABLE (
    id TEXT,
    file_name TEXT,
    file_path TEXT,
    purpose TEXT,
    category TEXT,
    subcategory TEXT,
    functions TEXT[],
    variables TEXT[],
    tags TEXT[],
    content_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
AS $$
    SELECT 
        sm.id,
        sm.file_name,
        sm.file_path,
        sm.purpose,
        sm.category,
        sm.subcategory,
        sm.functions,
        sm.variables,
        sm.tags,
        sm.content_summary,
        sm.created_at,
        sm.updated_at
    FROM script_memories sm
    WHERE sm.tags && search_tags
    ORDER BY array_length(sm.tags & search_tags, 1) DESC, sm.created_at DESC
    LIMIT limit_count;
$$;

-- Create function for full-text search
CREATE OR REPLACE FUNCTION search_scripts_fulltext(
    search_query TEXT,
    limit_count INT DEFAULT 10
)
RETURNS TABLE (
    id TEXT,
    file_name TEXT,
    file_path TEXT,
    purpose TEXT,
    category TEXT,
    subcategory TEXT,
    functions TEXT[],
    variables TEXT[],
    tags TEXT[],
    content_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE SQL
AS $$
    SELECT 
        sm.id,
        sm.file_name,
        sm.file_path,
        sm.purpose,
        sm.category,
        sm.subcategory,
        sm.functions,
        sm.variables,
        sm.tags,
        sm.content_summary,
        sm.created_at,
        sm.updated_at
    FROM script_memories sm
    WHERE 
        sm.file_name ILIKE '%' || search_query || '%'
        OR sm.purpose ILIKE '%' || search_query || '%'
        OR sm.content_summary ILIKE '%' || search_query || '%'
        OR EXISTS (
            SELECT 1 FROM unnest(sm.tags) AS tag 
            WHERE tag ILIKE '%' || search_query || '%'
        )
    ORDER BY sm.created_at DESC
    LIMIT limit_count;
$$;

-- Create function to get script statistics
CREATE OR REPLACE FUNCTION get_script_statistics()
RETURNS TABLE (
    total_scripts BIGINT,
    total_categories BIGINT,
    total_subcategories BIGINT,
    total_functions BIGINT,
    total_tags BIGINT,
    avg_embedding_similarity FLOAT
)
LANGUAGE SQL
AS $$
    SELECT 
        COUNT(*) AS total_scripts,
        COUNT(DISTINCT category) AS total_categories,
        COUNT(DISTINCT subcategory) AS total_subcategories,
        COUNT(DISTINCT unnest(functions)) AS total_functions,
        COUNT(DISTINCT unnest(tags)) AS total_tags,
        AVG(1.0) AS avg_embedding_similarity -- Placeholder
    FROM script_memories;
$$;

-- Create function to find potential duplicates
CREATE OR REPLACE FUNCTION find_potential_duplicates(
    similarity_threshold FLOAT DEFAULT 0.9
)
RETURNS TABLE (
    script1_id TEXT,
    script1_name TEXT,
    script2_id TEXT,
    script2_name TEXT,
    similarity_score FLOAT
)
LANGUAGE SQL
AS $$
    SELECT 
        sm1.id AS script1_id,
        sm1.file_name AS script1_name,
        sm2.id AS script2_id,
        sm2.file_name AS script2_name,
        1 - (sm1.embedding <=> sm2.embedding) AS similarity_score
    FROM script_memories sm1
    CROSS JOIN script_memories sm2
    WHERE sm1.id < sm2.id
    AND 1 - (sm1.embedding <=> sm2.embedding) > similarity_threshold
    ORDER BY similarity_score DESC;
$$;

-- Create function to get category statistics
CREATE OR REPLACE FUNCTION get_category_statistics()
RETURNS TABLE (
    category TEXT,
    subcategory TEXT,
    script_count BIGINT,
    avg_functions FLOAT,
    common_tags TEXT[]
)
LANGUAGE SQL
AS $$
    SELECT 
        sm.category,
        sm.subcategory,
        COUNT(*) AS script_count,
        AVG(array_length(sm.functions, 1)) AS avg_functions,
        ARRAY(
            SELECT DISTINCT unnest(sm.tags)
            FROM script_memories sm2
            WHERE sm2.category = sm.category
            AND sm2.subcategory = sm.subcategory
            ORDER BY unnest(sm.tags)
        ) AS common_tags
    FROM script_memories sm
    GROUP BY sm.category, sm.subcategory
    ORDER BY script_count DESC;
$$;

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_script_memories_updated_at
    BEFORE UPDATE ON script_memories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies (if needed)
ALTER TABLE script_memories ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users (adjust as needed)
CREATE POLICY "Allow all operations for authenticated users" ON script_memories
    FOR ALL USING (true);

-- Insert some sample data for testing
INSERT INTO script_memories (
    id, file_name, file_path, purpose, category, subcategory,
    functions, variables, tags, content_summary, embedding
) VALUES (
    'sample_1',
    'deploy-n8n.sh',
    'scripts/deploy-n8n.sh',
    'Deploy N8N workflows to production',
    'deployment',
    'n8n_deployment',
    ARRAY['deploy_workflows', 'check_status', 'restart_services'],
    ARRAY['N8N_URL', 'API_KEY', 'WORKFLOW_DIR'],
    ARRAY['n8n', 'deployment', 'api', 'workflow'],
    'Script for deploying N8N workflows to production environment',
    ARRAY[0.1, 0.2, 0.3, 0.4, 0.5]::VECTOR(384) -- Placeholder embedding
) ON CONFLICT (id) DO NOTHING;

-- Create view for easy querying
CREATE OR REPLACE VIEW script_memories_view AS
SELECT 
    id,
    file_name,
    file_path,
    purpose,
    category,
    subcategory,
    functions,
    variables,
    tags,
    content_summary,
    created_at,
    updated_at,
    array_length(functions, 1) AS function_count,
    array_length(variables, 1) AS variable_count,
    array_length(tags, 1) AS tag_count
FROM script_memories;

-- Grant permissions
GRANT ALL ON script_memories TO authenticated;
GRANT ALL ON script_memories_view TO authenticated;
GRANT EXECUTE ON FUNCTION search_similar_scripts TO authenticated;
GRANT EXECUTE ON FUNCTION search_scripts_by_category TO authenticated;
GRANT EXECUTE ON FUNCTION search_scripts_by_tags TO authenticated;
GRANT EXECUTE ON FUNCTION search_scripts_fulltext TO authenticated;
GRANT EXECUTE ON FUNCTION get_script_statistics TO authenticated;
GRANT EXECUTE ON FUNCTION find_potential_duplicates TO authenticated;
GRANT EXECUTE ON FUNCTION get_category_statistics TO authenticated;






