-- YouTube Analysis Storage Schema for Supabase
-- This table stores YouTube video analysis results from crew members

CREATE TABLE IF NOT EXISTS youtube_analysis (
    id SERIAL PRIMARY KEY,
    video_id VARCHAR(11) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    channel VARCHAR(255) NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    duration VARCHAR(20),
    view_count BIGINT,
    like_count BIGINT,
    comment_count BIGINT,
    tags JSONB,
    category_id VARCHAR(10),
    extracted_concepts JSONB NOT NULL,
    crew_member VARCHAR(100) NOT NULL,
    analysis_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    analysis_focus TEXT,
    request_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_youtube_analysis_video_id ON youtube_analysis(video_id);
CREATE INDEX IF NOT EXISTS idx_youtube_analysis_crew_member ON youtube_analysis(crew_member);
CREATE INDEX IF NOT EXISTS idx_youtube_analysis_analysis_timestamp ON youtube_analysis(analysis_timestamp);
CREATE INDEX IF NOT EXISTS idx_youtube_analysis_channel ON youtube_analysis(channel);
CREATE INDEX IF NOT EXISTS idx_youtube_analysis_extracted_concepts ON youtube_analysis USING GIN(extracted_concepts);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_youtube_analysis_updated_at 
    BEFORE UPDATE ON youtube_analysis 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a view for easy querying of analysis results
CREATE OR REPLACE VIEW youtube_analysis_summary AS
SELECT 
    video_id,
    title,
    channel,
    published_at,
    view_count,
    like_count,
    comment_count,
    crew_member,
    analysis_timestamp,
    analysis_focus,
    jsonb_array_length(extracted_concepts) as concept_count,
    extracted_concepts
FROM youtube_analysis
ORDER BY analysis_timestamp DESC;

-- Create a function to get analysis statistics by crew member
CREATE OR REPLACE FUNCTION get_crew_analysis_stats(crew_name VARCHAR DEFAULT NULL)
RETURNS TABLE (
    crew_member VARCHAR,
    total_analyses BIGINT,
    latest_analysis TIMESTAMP WITH TIME ZONE,
    avg_concepts_per_analysis NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ya.crew_member,
        COUNT(*) as total_analyses,
        MAX(ya.analysis_timestamp) as latest_analysis,
        AVG(jsonb_array_length(ya.extracted_concepts)) as avg_concepts_per_analysis
    FROM youtube_analysis ya
    WHERE (crew_name IS NULL OR ya.crew_member = crew_name)
    GROUP BY ya.crew_member
    ORDER BY total_analyses DESC;
END;
$$ LANGUAGE plpgsql;

-- Create a function to search concepts across all analyses
CREATE OR REPLACE FUNCTION search_concepts(search_term TEXT)
RETURNS TABLE (
    video_id VARCHAR,
    title TEXT,
    channel VARCHAR,
    crew_member VARCHAR,
    analysis_timestamp TIMESTAMP WITH TIME ZONE,
    matching_concepts JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ya.video_id,
        ya.title,
        ya.channel,
        ya.crew_member,
        ya.analysis_timestamp,
        (
            SELECT jsonb_agg(concept)
            FROM jsonb_array_elements(ya.extracted_concepts) as concept
            WHERE concept->>'concept' ILIKE '%' || search_term || '%'
        ) as matching_concepts
    FROM youtube_analysis ya
    WHERE ya.extracted_concepts::text ILIKE '%' || search_term || '%'
    ORDER BY ya.analysis_timestamp DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions (adjust based on your Supabase setup)
-- ALTER TABLE youtube_analysis ENABLE ROW LEVEL SECURITY;

-- Create RLS policies if needed
-- CREATE POLICY "Enable read access for authenticated users" ON youtube_analysis
--     FOR SELECT USING (auth.role() = 'authenticated');

-- CREATE POLICY "Enable insert access for authenticated users" ON youtube_analysis
--     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- CREATE POLICY "Enable update access for authenticated users" ON youtube_analysis
--     FOR UPDATE USING (auth.role() = 'authenticated');

-- Insert sample data for testing (optional)
-- INSERT INTO youtube_analysis (
--     video_id, title, channel, extracted_concepts, crew_member, analysis_focus
-- ) VALUES (
--     'dQw4w9WgXcQ',
--     'Rick Astley - Never Gonna Give You Up',
--     'Rick Astley',
--     '[{"concept": "music", "frequency": 15}, {"concept": "video", "frequency": 8}]',
--     'Commander Data',
--     'Data patterns, analytical concepts, logical frameworks'
-- );

COMMENT ON TABLE youtube_analysis IS 'Stores YouTube video analysis results from crew members';
COMMENT ON COLUMN youtube_analysis.video_id IS 'YouTube video ID (11 characters)';
COMMENT ON COLUMN youtube_analysis.extracted_concepts IS 'JSON array of extracted concepts with frequency counts';
COMMENT ON COLUMN youtube_analysis.crew_member IS 'Name of the crew member who performed the analysis';
COMMENT ON COLUMN youtube_analysis.analysis_focus IS 'Specific focus area for the analysis';
COMMENT ON COLUMN youtube_analysis.request_id IS 'Unique identifier for the analysis request';
