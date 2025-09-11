"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
async function POST() {
    try {
        console.log('🏗️ Setting up job scraping database schema...');
        // Create scraping_jobs table
        const createScrapingJobsTable = `
      CREATE TABLE IF NOT EXISTS scraping_jobs (
        id VARCHAR(255) PRIMARY KEY,
        source VARCHAR(100) NOT NULL,
        search_term VARCHAR(255),
        location VARCHAR(255),
        max_results INTEGER DEFAULT 10,
        status VARCHAR(50) DEFAULT 'started',
        status_message TEXT,
        jobs_found INTEGER DEFAULT 0,
        jobs_stored INTEGER DEFAULT 0,
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create job_opportunities table (enhanced for scraping)
        const createJobOpportunitiesTable = `
      CREATE TABLE IF NOT EXISTS job_opportunities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        external_id VARCHAR(255) UNIQUE,
        company VARCHAR(255) NOT NULL,
        position VARCHAR(255) NOT NULL,
        location VARCHAR(255),
        remote_option VARCHAR(100),
        salary_range VARCHAR(100),
        alex_ai_score INTEGER DEFAULT 0,
        application_url TEXT,
        description TEXT,
        requirements TEXT,
        benefits TEXT,
        work_life_balance TEXT,
        alex_ai_leverage TEXT,
        company_type VARCHAR(50),
        st_louis_area BOOLEAN DEFAULT FALSE,
        st_louis_focus BOOLEAN DEFAULT FALSE,
        remote_friendly BOOLEAN DEFAULT FALSE,
        is_remote BOOLEAN DEFAULT FALSE,
        central_timezone BOOLEAN DEFAULT FALSE,
        
        -- n8n integration fields
        n8n_workflow_id VARCHAR(255),
        n8n_execution_id VARCHAR(255),
        n8n_data_source VARCHAR(100) DEFAULT 'n8n',
        
        -- Alex AI crew analysis
        alex_ai_crew_analysis JSONB,
        alex_ai_memory_id VARCHAR(255),
        alex_ai_leverage_factors TEXT[],
        
        -- Scraping metadata
        scraped_at TIMESTAMP WITH TIME ZONE,
        analyzed_at TIMESTAMP WITH TIME ZONE,
        scraping_job_id VARCHAR(255),
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create contacts table (enhanced for scraping)
        const createContactsTable = `
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        external_id VARCHAR(255) UNIQUE,
        company VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        title VARCHAR(255),
        email VARCHAR(255),
        linkedin VARCHAR(255),
        phone VARCHAR(50),
        confidence_level VARCHAR(20) DEFAULT 'medium',
        contact_type VARCHAR(50),
        notes TEXT,
        
        -- n8n integration fields
        n8n_workflow_id VARCHAR(255),
        n8n_execution_id VARCHAR(255),
        n8n_data_source VARCHAR(100) DEFAULT 'n8n',
        
        -- Scraping metadata
        scraped_at TIMESTAMP WITH TIME ZONE,
        scraping_job_id VARCHAR(255),
        
        -- Timestamps
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        last_synced_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create applications table
        const createApplicationsTable = `
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        job_id UUID REFERENCES job_opportunities(id) ON DELETE CASCADE,
        user_id UUID,
        resume_version VARCHAR(255),
        cover_letter TEXT,
        application_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        status VARCHAR(50) DEFAULT 'applied',
        response_date TIMESTAMP WITH TIME ZONE,
        interview_date TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
        // Create indexes for performance
        const createIndexes = `
      -- Job opportunities indexes
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_company ON job_opportunities(company);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_position ON job_opportunities(position);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_alex_ai_score ON job_opportunities(alex_ai_score);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_company_type ON job_opportunities(company_type);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_st_louis ON job_opportunities(st_louis_area);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_remote ON job_opportunities(remote_friendly);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_external_id ON job_opportunities(external_id);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_scraping_job ON job_opportunities(scraping_job_id);
      CREATE INDEX IF NOT EXISTS idx_job_opportunities_updated_at ON job_opportunities(updated_at);
      
      -- Contacts indexes
      CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
      CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
      CREATE INDEX IF NOT EXISTS idx_contacts_contact_type ON contacts(contact_type);
      CREATE INDEX IF NOT EXISTS idx_contacts_external_id ON contacts(external_id);
      CREATE INDEX IF NOT EXISTS idx_contacts_scraping_job ON contacts(scraping_job_id);
      
      -- Applications indexes
      CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
      CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      
      -- Scraping jobs indexes
      CREATE INDEX IF NOT EXISTS idx_scraping_jobs_status ON scraping_jobs(status);
      CREATE INDEX IF NOT EXISTS idx_scraping_jobs_source ON scraping_jobs(source);
      CREATE INDEX IF NOT EXISTS idx_scraping_jobs_created_at ON scraping_jobs(created_at);
    `;
        // Test database connection first
        console.log('Testing database connection...');
        const { data: testData, error: testError } = await supabase_1.supabase
            .from('scraping_jobs')
            .select('count')
            .limit(1);
        if (testError && testError.code === '42P01') {
            console.log('Tables do not exist, need to create them manually in Supabase');
            return server_1.NextResponse.json({
                success: false,
                message: 'Database tables need to be created manually in Supabase dashboard',
                instructions: [
                    '1. Go to Supabase Dashboard → SQL Editor',
                    '2. Run the following SQL commands:',
                    '3. Then test the job scraping endpoints'
                ],
                sql_commands: [
                    createScrapingJobsTable,
                    createJobOpportunitiesTable,
                    createContactsTable,
                    createApplicationsTable,
                    createIndexes
                ]
            });
        }
        return server_1.NextResponse.json({
            success: true,
            message: 'Database schema setup completed successfully',
            tables: ['scraping_jobs', 'job_opportunities', 'contacts', 'applications'],
            indexes: 'Performance indexes created'
        });
    }
    catch (error) {
        console.error('❌ Database schema setup failed:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map