"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
async function POST() {
    try {
        console.log('🏗️ Setting up scheduled scraping database schema...');
        // Create scheduled_scraping_configs table
        const createScheduledConfigsTable = `
      CREATE TABLE IF NOT EXISTS scheduled_scraping_configs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        source VARCHAR(100) NOT NULL,
        search_term VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        max_results INTEGER DEFAULT 10,
        schedule VARCHAR(50) DEFAULT 'hourly' CHECK (schedule IN ('hourly', 'daily', 'weekly', 'manual')),
        enabled BOOLEAN DEFAULT TRUE,
        last_run TIMESTAMP WITH TIME ZONE,
        next_run TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create scraping_jobs table (enhanced for scheduled jobs)
        const createScrapingJobsTable = `
      CREATE TABLE IF NOT EXISTS scraping_jobs (
        id VARCHAR(255) PRIMARY KEY,
        config_id UUID REFERENCES scheduled_scraping_configs(id) ON DELETE SET NULL,
        source VARCHAR(100) NOT NULL,
        search_term VARCHAR(255),
        location VARCHAR(255),
        max_results INTEGER DEFAULT 10,
        status VARCHAR(50) DEFAULT 'started' CHECK (status IN ('started', 'scraping', 'completed', 'failed', 'cancelled')),
        status_message TEXT,
        jobs_found INTEGER DEFAULT 0,
        jobs_stored INTEGER DEFAULT 0,
        scheduled BOOLEAN DEFAULT FALSE,
        triggered_by VARCHAR(50) DEFAULT 'manual' CHECK (triggered_by IN ('manual', 'scheduled', 'api', 'webhook')),
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create scraping_schedule_logs table for audit trail
        const createScheduleLogsTable = `
      CREATE TABLE IF NOT EXISTS scraping_schedule_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        config_id UUID REFERENCES scheduled_scraping_configs(id) ON DELETE CASCADE,
        job_id VARCHAR(255) REFERENCES scraping_jobs(id) ON DELETE SET NULL,
        action VARCHAR(50) NOT NULL CHECK (action IN ('created', 'updated', 'enabled', 'disabled', 'triggered', 'completed', 'failed')),
        details JSONB,
        triggered_by VARCHAR(50) DEFAULT 'system' CHECK (triggered_by IN ('system', 'user', 'api', 'webhook')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create indexes for better performance
        const createIndexes = `
      -- Indexes for scheduled_scraping_configs
      CREATE INDEX IF NOT EXISTS idx_scheduled_configs_enabled ON scheduled_scraping_configs(enabled);
      CREATE INDEX IF NOT EXISTS idx_scheduled_configs_next_run ON scheduled_scraping_configs(next_run);
      CREATE INDEX IF NOT EXISTS idx_scheduled_configs_schedule ON scheduled_scraping_configs(schedule);
      
      -- Indexes for scraping_jobs
      CREATE INDEX IF NOT EXISTS idx_scraping_jobs_config_id ON scraping_jobs(config_id);
      CREATE INDEX IF NOT EXISTS idx_scraping_jobs_scheduled ON scraping_jobs(scheduled);
      CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_scraping_jobs_created_at ON scraping_jobs(created_at);
      
      -- Indexes for scraping_schedule_logs
      CREATE INDEX IF NOT EXISTS idx_schedule_logs_config_id ON scraping_schedule_logs(config_id);
      CREATE INDEX IF NOT EXISTS idx_schedule_logs_created_at ON scraping_schedule_logs(created_at);
      CREATE INDEX IF NOT EXISTS idx_schedule_logs_action ON scraping_schedule_logs(action);
    `;
        // Create functions for automatic next run calculation
        const createFunctions = `
      -- Function to calculate next run time
      CREATE OR REPLACE FUNCTION calculate_next_run(schedule_type VARCHAR(50))
      RETURNS TIMESTAMP WITH TIME ZONE AS $$
      BEGIN
        CASE schedule_type
          WHEN 'hourly' THEN
            RETURN NOW() + INTERVAL '1 hour';
          WHEN 'daily' THEN
            RETURN NOW() + INTERVAL '1 day';
          WHEN 'weekly' THEN
            RETURN NOW() + INTERVAL '1 week';
          ELSE
            RETURN NOW() + INTERVAL '1 hour'; -- Default to hourly
        END CASE;
      END;
      $$ LANGUAGE plpgsql;

      -- Function to update next run time after job completion
      CREATE OR REPLACE FUNCTION update_next_run_after_completion()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Only update if this is a scheduled job that just completed
        IF NEW.status = 'completed' AND OLD.status != 'completed' AND NEW.scheduled = TRUE THEN
          UPDATE scheduled_scraping_configs 
          SET 
            last_run = NEW.completed_at,
            next_run = calculate_next_run(schedule),
            updated_at = NOW()
          WHERE id = NEW.config_id;
        END IF;
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Trigger to automatically update next run time
      DROP TRIGGER IF EXISTS trigger_update_next_run ON scraping_jobs;
      CREATE TRIGGER trigger_update_next_run
        AFTER UPDATE ON scraping_jobs
        FOR EACH ROW
        EXECUTE FUNCTION update_next_run_after_completion();
    `;
        // Create RLS policies for security
        const createRLSPolicies = `
      -- Enable RLS on all tables
      ALTER TABLE scheduled_scraping_configs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE scraping_jobs ENABLE ROW LEVEL SECURITY;
      ALTER TABLE scraping_schedule_logs ENABLE ROW LEVEL SECURITY;

      -- Policies for scheduled_scraping_configs
      CREATE POLICY "Allow all operations on scheduled_scraping_configs" ON scheduled_scraping_configs
        FOR ALL USING (true);

      -- Policies for scraping_jobs
      CREATE POLICY "Allow all operations on scraping_jobs" ON scraping_jobs
        FOR ALL USING (true);

      -- Policies for scraping_schedule_logs
      CREATE POLICY "Allow all operations on scraping_schedule_logs" ON scraping_schedule_logs
        FOR ALL USING (true);
    `;
        // Execute all SQL statements
        const statements = [
            createScheduledConfigsTable,
            createScrapingJobsTable,
            createScheduleLogsTable,
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
        // Insert default configurations
        const defaultConfigs = [
            {
                name: 'AI Engineer Jobs - St. Louis',
                source: 'linkedin',
                search_term: 'AI Engineer',
                location: 'St. Louis, MO',
                max_results: 20,
                schedule: 'hourly',
                enabled: true,
                next_run: new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour from now
            },
            {
                name: 'Remote AI Jobs',
                source: 'indeed',
                search_term: 'Machine Learning Engineer',
                location: 'Remote',
                max_results: 15,
                schedule: 'hourly',
                enabled: true,
                next_run: new Date(Date.now() + 60 * 60 * 1000).toISOString()
            },
            {
                name: 'Tech Jobs - Missouri',
                source: 'glassdoor',
                search_term: 'Software Engineer',
                location: 'Missouri',
                max_results: 10,
                schedule: 'hourly',
                enabled: true,
                next_run: new Date(Date.now() + 60 * 60 * 1000).toISOString()
            }
        ];
        const { error: insertError } = await supabase_1.supabase
            .from('scheduled_scraping_configs')
            .insert(defaultConfigs);
        if (insertError) {
            console.warn('Warning: Could not insert default configurations:', insertError);
        }
        console.log('✅ Scheduled scraping database schema setup complete');
        return server_1.NextResponse.json({
            success: true,
            message: 'Scheduled scraping database schema setup complete',
            tables: [
                'scheduled_scraping_configs',
                'scraping_jobs (enhanced)',
                'scraping_schedule_logs'
            ],
            features: [
                'Automatic next run calculation',
                'Audit trail logging',
                'Performance indexes',
                'Row Level Security',
                'Default configurations'
            ]
        });
    }
    catch (error) {
        console.error('❌ Failed to setup scheduled scraping schema:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map