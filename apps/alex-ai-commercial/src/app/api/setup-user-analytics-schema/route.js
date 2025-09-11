"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
async function POST() {
    try {
        console.log('🏗️ Setting up user analytics database schema...');
        // Create user_sessions table
        const createUserSessionsTable = `
      CREATE TABLE IF NOT EXISTS user_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID,
        session_id VARCHAR(255) UNIQUE NOT NULL,
        first_visit TIMESTAMP WITH TIME ZONE NOT NULL,
        last_activity TIMESTAMP WITH TIME ZONE NOT NULL,
        total_visits INTEGER DEFAULT 1,
        average_session_duration INTEGER DEFAULT 0,
        preferred_update_frequency INTEGER DEFAULT 1440, -- minutes (24 hours default)
        last_manual_refresh TIMESTAMP WITH TIME ZONE,
        last_automatic_refresh TIMESTAMP WITH TIME ZONE,
        total_manual_refreshes INTEGER DEFAULT 0,
        total_automatic_refreshes INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create user_interactions table
        const createUserInteractionsTable = `
      CREATE TABLE IF NOT EXISTS user_interactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(255) NOT NULL,
        action_type VARCHAR(50) NOT NULL CHECK (action_type IN ('login', 'manual_refresh', 'automatic_refresh', 'page_view', 'job_search', 'scraping_trigger')),
        timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
        metadata JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create user_analytics_summary table for aggregated data
        const createUserAnalyticsSummaryTable = `
      CREATE TABLE IF NOT EXISTS user_analytics_summary (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id VARCHAR(255) NOT NULL,
        date DATE NOT NULL,
        total_interactions INTEGER DEFAULT 0,
        manual_refreshes INTEGER DEFAULT 0,
        automatic_refreshes INTEGER DEFAULT 0,
        page_views INTEGER DEFAULT 0,
        job_searches INTEGER DEFAULT 0,
        scraping_triggers INTEGER DEFAULT 0,
        session_duration INTEGER DEFAULT 0, -- in minutes
        preferred_frequency INTEGER DEFAULT 1440, -- in minutes
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(session_id, date)
      );
    `;
        // Create indexes for better performance
        const createIndexes = `
      -- Indexes for user_sessions
      CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON user_sessions(last_activity);
      CREATE INDEX IF NOT EXISTS idx_user_sessions_preferred_frequency ON user_sessions(preferred_update_frequency);
      
      -- Indexes for user_interactions
      CREATE INDEX IF NOT EXISTS idx_user_interactions_session_id ON user_interactions(session_id);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_action_type ON user_interactions(action_type);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_timestamp ON user_interactions(timestamp);
      CREATE INDEX IF NOT EXISTS idx_user_interactions_session_timestamp ON user_interactions(session_id, timestamp);
      
      -- Indexes for user_analytics_summary
      CREATE INDEX IF NOT EXISTS idx_user_analytics_summary_session_id ON user_analytics_summary(session_id);
      CREATE INDEX IF NOT EXISTS idx_user_analytics_summary_date ON user_analytics_summary(date);
      CREATE INDEX IF NOT EXISTS idx_user_analytics_summary_session_date ON user_analytics_summary(session_id, date);
    `;
        // Create functions for analytics calculations
        const createFunctions = `
      -- Function to calculate user activity score
      CREATE OR REPLACE FUNCTION calculate_user_activity_score(session_id_param VARCHAR(255))
      RETURNS INTEGER AS $$
      DECLARE
        activity_score INTEGER := 0;
        recent_interactions INTEGER;
        manual_refresh_rate NUMERIC;
        time_since_last_activity INTEGER;
      BEGIN
        -- Count recent interactions (last 24 hours)
        SELECT COUNT(*) INTO recent_interactions
        FROM user_interactions
        WHERE session_id = session_id_param
        AND timestamp > NOW() - INTERVAL '24 hours';
        
        -- Calculate manual refresh rate
        SELECT 
          CASE 
            WHEN total_visits > 0 THEN (total_manual_refreshes::NUMERIC / total_visits::NUMERIC) * 100
            ELSE 0
          END
        INTO manual_refresh_rate
        FROM user_sessions
        WHERE session_id = session_id_param;
        
        -- Calculate time since last activity (in minutes)
        SELECT EXTRACT(EPOCH FROM (NOW() - last_activity)) / 60
        INTO time_since_last_activity
        FROM user_sessions
        WHERE session_id = session_id_param;
        
        -- Calculate activity score
        activity_score := recent_interactions * 10;
        activity_score := activity_score + (manual_refresh_rate * 2);
        
        -- Reduce score based on time since last activity
        IF time_since_last_activity > 60 THEN
          activity_score := activity_score - (time_since_last_activity / 60);
        END IF;
        
        -- Ensure score is not negative
        IF activity_score < 0 THEN
          activity_score := 0;
        END IF;
        
        RETURN activity_score;
      END;
      $$ LANGUAGE plpgsql;

      -- Function to get recommended update frequency
      CREATE OR REPLACE FUNCTION get_recommended_update_frequency(session_id_param VARCHAR(255))
      RETURNS INTEGER AS $$
      DECLARE
        activity_score INTEGER;
        recommended_frequency INTEGER;
        current_frequency INTEGER;
      BEGIN
        -- Get current frequency
        SELECT preferred_update_frequency INTO current_frequency
        FROM user_sessions
        WHERE session_id = session_id_param;
        
        -- Calculate activity score
        SELECT calculate_user_activity_score(session_id_param) INTO activity_score;
        
        -- Determine recommended frequency based on activity score
        IF activity_score > 100 THEN
          -- Very active user: 30 minutes to 2 hours
          recommended_frequency := 30 + (RANDOM() * 90);
        ELSIF activity_score > 50 THEN
          -- Active user: 2 to 6 hours
          recommended_frequency := 120 + (RANDOM() * 240);
        ELSIF activity_score > 20 THEN
          -- Moderate user: 6 to 12 hours
          recommended_frequency := 360 + (RANDOM() * 360);
        ELSE
          -- Passive user: 12 to 24 hours
          recommended_frequency := 720 + (RANDOM() * 720);
        END IF;
        
        -- Smooth the transition (don't change too drastically)
        IF ABS(recommended_frequency - current_frequency) > (current_frequency * 0.5) THEN
          recommended_frequency := current_frequency + ((recommended_frequency - current_frequency) * 0.3);
        END IF;
        
        -- Ensure minimum and maximum bounds
        recommended_frequency := GREATEST(30, LEAST(2880, recommended_frequency));
        
        RETURN recommended_frequency;
      END;
      $$ LANGUAGE plpgsql;

      -- Function to update session analytics
      CREATE OR REPLACE FUNCTION update_session_analytics()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Update the updated_at timestamp
        NEW.updated_at = NOW();
        
        -- Update average session duration
        IF NEW.last_activity IS NOT NULL AND OLD.last_activity IS NOT NULL THEN
          NEW.average_session_duration := 
            (OLD.average_session_duration + 
             EXTRACT(EPOCH FROM (NEW.last_activity - OLD.last_activity)) / 60) / 2;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Trigger to automatically update session analytics
      DROP TRIGGER IF EXISTS trigger_update_session_analytics ON user_sessions;
      CREATE TRIGGER trigger_update_session_analytics
        BEFORE UPDATE ON user_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_session_analytics();
    `;
        // Create RLS policies for security
        const createRLSPolicies = `
      -- Enable RLS on all tables
      ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE user_analytics_summary ENABLE ROW LEVEL SECURITY;

      -- Policies for user_sessions (allow all operations for now)
      CREATE POLICY "Allow all operations on user_sessions" ON user_sessions
        FOR ALL USING (true);

      -- Policies for user_interactions
      CREATE POLICY "Allow all operations on user_interactions" ON user_interactions
        FOR ALL USING (true);

      -- Policies for user_analytics_summary
      CREATE POLICY "Allow all operations on user_analytics_summary" ON user_analytics_summary
        FOR ALL USING (true);
    `;
        // Execute all SQL statements
        const statements = [
            createUserSessionsTable,
            createUserInteractionsTable,
            createUserAnalyticsSummaryTable,
            createIndexes,
            createFunctions,
            createRLSPolicies
        ];
        for (const statement of statements) {
            const { error } = await supabase_1.supabase.rpc('exec_sql', { sql: statement });
            if (error) {
                console.error('Error executing SQL statement:', error);
                throw error;
            }
        }
        console.log('✅ User analytics database schema setup complete');
        return server_1.NextResponse.json({
            success: true,
            message: 'User analytics database schema setup complete',
            tables: [
                'user_sessions',
                'user_interactions',
                'user_analytics_summary'
            ],
            features: [
                'User behavior tracking',
                'Activity score calculation',
                'Adaptive update frequency',
                'Session analytics',
                'Performance indexes',
                'Row Level Security'
            ]
        });
    }
    catch (error) {
        console.error('❌ Failed to setup user analytics schema:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map