-- YouTube Channel Intelligence System Schema for Supabase
-- Optimized for vector storage and crew-specialized insights

-- Channel Analysis Table
CREATE TABLE IF NOT EXISTS channel_analysis (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(100) NOT NULL UNIQUE,
    channel_name VARCHAR(255) NOT NULL,
    total_videos INTEGER NOT NULL,
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    channel_summary TEXT,
    key_themes JSONB,
    content_vectors JSONB,
    analysis_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crew Insights Table (optimized for vector similarity search)
CREATE TABLE IF NOT EXISTS crew_insights (
    id SERIAL PRIMARY KEY,
    channel_id VARCHAR(100) NOT NULL,
    crew_member VARCHAR(100) NOT NULL,
    insight_type VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    relevance_score DECIMAL(3,2) NOT NULL,
    vector_embedding JSONB NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key relationship
    FOREIGN KEY (channel_id) REFERENCES channel_analysis(channel_id) ON DELETE CASCADE
);

-- Crew Member Cost Optimization Table
CREATE TABLE IF NOT EXISTS crew_cost_optimization (
    id SERIAL PRIMARY KEY,
    crew_member VARCHAR(100) NOT NULL UNIQUE,
    cost_tier VARCHAR(50) NOT NULL,
    max_cost_per_analysis DECIMAL(5,2) NOT NULL,
    priority_level INTEGER NOT NULL,
    analysis_limits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vector Similarity Search Table (for rapid crew collaboration)
CREATE TABLE IF NOT EXISTS insight_vectors (
    id SERIAL PRIMARY KEY,
    insight_id INTEGER NOT NULL,
    crew_member VARCHAR(100) NOT NULL,
    vector_data JSONB NOT NULL,
    vector_dimensions INTEGER NOT NULL,
    similarity_threshold DECIMAL(3,2) DEFAULT 0.7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    FOREIGN KEY (insight_id) REFERENCES crew_insights(id) ON DELETE CASCADE
);

-- Channel Analysis Summary View
CREATE OR REPLACE VIEW channel_analysis_summary AS
SELECT 
    ca.channel_id,
    ca.channel_name,
    ca.total_videos,
    ca.analysis_timestamp,
    ca.key_themes,
    COUNT(ci.id) as total_insights,
    COUNT(DISTINCT ci.crew_member) as crew_members_involved,
    AVG(ci.relevance_score) as avg_relevance_score,
    ca.channel_summary
FROM channel_analysis ca
LEFT JOIN crew_insights ci ON ca.channel_id = ci.channel_id
GROUP BY ca.id, ca.channel_id, ca.channel_name, ca.total_videos, 
         ca.analysis_timestamp, ca.key_themes, ca.channel_summary
ORDER BY ca.analysis_timestamp DESC;

-- Crew Performance Analytics View
CREATE OR REPLACE VIEW crew_performance_analytics AS
SELECT 
    ci.crew_member,
    COUNT(ci.id) as total_insights,
    AVG(ci.relevance_score) as avg_relevance_score,
    COUNT(DISTINCT ci.channel_id) as channels_analyzed,
    COUNT(DISTINCT ci.insight_type) as insight_types_used,
    MAX(ci.created_at) as last_analysis,
    cco.cost_tier,
    cco.max_cost_per_analysis
FROM crew_insights ci
LEFT JOIN crew_cost_optimization cco ON ci.crew_member = cco.crew_member
GROUP BY ci.crew_member, cco.cost_tier, cco.max_cost_per_analysis
ORDER BY total_insights DESC;

-- Vector Similarity Search Function
CREATE OR REPLACE FUNCTION search_similar_insights(
    query_vector JSONB,
    target_crew_member VARCHAR DEFAULT NULL,
    similarity_threshold DECIMAL DEFAULT 0.7,
    result_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    insight_id INTEGER,
    crew_member VARCHAR,
    insight_type VARCHAR,
    content TEXT,
    relevance_score DECIMAL,
    similarity_score DECIMAL,
    metadata JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.id,
        ci.crew_member,
        ci.insight_type,
        ci.content,
        ci.relevance_score,
        -- Simplified cosine similarity calculation
        (1.0 - (
            SELECT AVG(ABS((query_vector->>i)::DECIMAL - (ci.vector_embedding->>i)::DECIMAL))
            FROM generate_series(0, jsonb_array_length(query_vector) - 1) as i
        )) as similarity_score,
        ci.metadata
    FROM crew_insights ci
    WHERE (target_crew_member IS NULL OR ci.crew_member = target_crew_member)
    HAVING (1.0 - (
        SELECT AVG(ABS((query_vector->>i)::DECIMAL - (ci.vector_embedding->>i)::DECIMAL))
        FROM generate_series(0, jsonb_array_length(query_vector) - 1) as i
    )) >= similarity_threshold
    ORDER BY similarity_score DESC
    LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;

-- Crew Collaboration Insights Function
CREATE OR REPLACE FUNCTION get_crew_collaboration_insights(
    channel_id_param VARCHAR,
    min_relevance_score DECIMAL DEFAULT 0.6
)
RETURNS TABLE (
    crew_member VARCHAR,
    insight_type VARCHAR,
    content TEXT,
    relevance_score DECIMAL,
    collaboration_potential DECIMAL,
    related_crew_members TEXT[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.crew_member,
        ci.insight_type,
        ci.content,
        ci.relevance_score,
        -- Calculate collaboration potential based on vector similarity with other crew insights
        (
            SELECT AVG(
                1.0 - (
                    SELECT AVG(ABS((ci.vector_embedding->>i)::DECIMAL - (ci2.vector_embedding->>i)::DECIMAL))
                    FROM generate_series(0, jsonb_array_length(ci.vector_embedding) - 1) as i
                )
            )
            FROM crew_insights ci2 
            WHERE ci2.channel_id = ci.channel_id 
            AND ci2.crew_member != ci.crew_member
            AND ci2.insight_type = ci.insight_type
        ) as collaboration_potential,
        -- Get related crew members with similar insights
        ARRAY(
            SELECT DISTINCT ci2.crew_member
            FROM crew_insights ci2 
            WHERE ci2.channel_id = ci.channel_id 
            AND ci2.crew_member != ci.crew_member
            AND ci2.insight_type = ci.insight_type
            AND (
                1.0 - (
                    SELECT AVG(ABS((ci.vector_embedding->>i)::DECIMAL - (ci2.vector_embedding->>i)::DECIMAL))
                    FROM generate_series(0, jsonb_array_length(ci.vector_embedding) - 1) as i
                )
            ) >= 0.6
        ) as related_crew_members
    FROM crew_insights ci
    WHERE ci.channel_id = channel_id_param
    AND ci.relevance_score >= min_relevance_score
    ORDER BY collaboration_potential DESC, ci.relevance_score DESC;
END;
$$ LANGUAGE plpgsql;

-- Cost Optimization Analysis Function
CREATE OR REPLACE FUNCTION analyze_cost_efficiency(
    analysis_period_days INTEGER DEFAULT 30
)
RETURNS TABLE (
    crew_member VARCHAR,
    cost_tier VARCHAR,
    total_insights INTEGER,
    avg_relevance_score DECIMAL,
    cost_per_insight DECIMAL,
    efficiency_rating VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ci.crew_member,
        cco.cost_tier,
        COUNT(ci.id) as total_insights,
        AVG(ci.relevance_score) as avg_relevance_score,
        (cco.max_cost_per_analysis / COUNT(ci.id)) as cost_per_insight,
        CASE 
            WHEN AVG(ci.relevance_score) >= 0.8 AND (cco.max_cost_per_analysis / COUNT(ci.id)) <= 0.01 
            THEN 'Excellent'
            WHEN AVG(ci.relevance_score) >= 0.6 AND (cco.max_cost_per_analysis / COUNT(ci.id)) <= 0.02 
            THEN 'Good'
            WHEN AVG(ci.relevance_score) >= 0.4 AND (cco.max_cost_per_analysis / COUNT(ci.id)) <= 0.05 
            THEN 'Fair'
            ELSE 'Needs Optimization'
        END as efficiency_rating
    FROM crew_insights ci
    JOIN crew_cost_optimization cco ON ci.crew_member = cco.crew_member
    WHERE ci.created_at >= NOW() - INTERVAL '1 day' * analysis_period_days
    GROUP BY ci.crew_member, cco.cost_tier, cco.max_cost_per_analysis
    ORDER BY efficiency_rating, cost_per_insight;
END;
$$ LANGUAGE plpgsql;

-- Create indexes for optimal performance
CREATE INDEX IF NOT EXISTS idx_channel_analysis_channel_id ON channel_analysis(channel_id);
CREATE INDEX IF NOT EXISTS idx_channel_analysis_timestamp ON channel_analysis(analysis_timestamp);
CREATE INDEX IF NOT EXISTS idx_crew_insights_channel_crew ON crew_insights(channel_id, crew_member);
CREATE INDEX IF NOT EXISTS idx_crew_insights_relevance ON crew_insights(relevance_score);
CREATE INDEX IF NOT EXISTS idx_crew_insights_type ON crew_insights(insight_type);
CREATE INDEX IF NOT EXISTS idx_insight_vectors_crew ON insight_vectors(crew_member);
CREATE INDEX IF NOT EXISTS idx_crew_cost_optimization_tier ON crew_cost_optimization(cost_tier);

-- Create GIN indexes for JSONB columns
CREATE INDEX IF NOT EXISTS idx_channel_analysis_key_themes ON channel_analysis USING GIN(key_themes);
CREATE INDEX IF NOT EXISTS idx_channel_analysis_content_vectors ON channel_analysis USING GIN(content_vectors);
CREATE INDEX IF NOT EXISTS idx_crew_insights_vector_embedding ON crew_insights USING GIN(vector_embedding);
CREATE INDEX IF NOT EXISTS idx_crew_insights_metadata ON crew_insights USING GIN(metadata);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_channel_analysis_updated_at 
    BEFORE UPDATE ON channel_analysis 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_insights_updated_at 
    BEFORE UPDATE ON crew_insights 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_cost_optimization_updated_at 
    BEFORE UPDATE ON crew_cost_optimization 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert default crew cost optimization data
INSERT INTO crew_cost_optimization (crew_member, cost_tier, max_cost_per_analysis, priority_level, analysis_limits) VALUES
('captain_picard', 'premium', 0.10, 1, '{"max_videos": 20, "max_insights": 10}'),
('commander_riker', 'premium', 0.10, 1, '{"max_videos": 20, "max_insights": 10}'),
('commander_data', 'standard', 0.05, 2, '{"max_videos": 15, "max_insights": 8}'),
('geordi_la_forge', 'standard', 0.05, 2, '{"max_videos": 15, "max_insights": 8}'),
('lieutenant_worf', 'standard', 0.05, 2, '{"max_videos": 15, "max_insights": 8}'),
('counselor_troi', 'economy', 0.02, 3, '{"max_videos": 10, "max_insights": 5}'),
('lieutenant_uhura', 'economy', 0.02, 3, '{"max_videos": 10, "max_insights": 5}'),
('dr_crusher', 'economy', 0.02, 3, '{"max_videos": 10, "max_insights": 5}'),
('quark', 'economy', 0.02, 3, '{"max_videos": 10, "max_insights": 5}')
ON CONFLICT (crew_member) DO NOTHING;

-- Comments for documentation
COMMENT ON TABLE channel_analysis IS 'Stores comprehensive YouTube channel analysis with vector-optimized data';
COMMENT ON TABLE crew_insights IS 'Stores crew-specialized insights with vector embeddings for similarity search';
COMMENT ON TABLE crew_cost_optimization IS 'Manages cost optimization settings for each crew member';
COMMENT ON TABLE insight_vectors IS 'Optimized vector storage for rapid similarity search and crew collaboration';

COMMENT ON FUNCTION search_similar_insights IS 'Searches for similar insights using vector similarity';
COMMENT ON FUNCTION get_crew_collaboration_insights IS 'Identifies collaboration opportunities between crew members';
COMMENT ON FUNCTION analyze_cost_efficiency IS 'Analyzes cost efficiency of crew member analysis performance';
