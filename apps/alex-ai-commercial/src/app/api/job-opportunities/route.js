"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
const rate_limiter_1 = require("@/lib/rate-limiter");
const security_1 = require("@/lib/security");
async function GET(request) {
    try {
        // Apply rate limiting
        const rateLimitResponse = (0, rate_limiter_1.withRateLimit)(rate_limiter_1.rateLimiters.api)(request);
        if (rateLimitResponse)
            return rateLimitResponse;
        console.log('📋 Fetching job opportunities from Supabase...');
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        const { data: jobs, error } = await supabase
            .from('job_opportunities')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('❌ Error fetching job opportunities:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Retrieved ${jobs?.length || 0} job opportunities`);
        return server_1.NextResponse.json(jobs || []);
    }
    catch (error) {
        console.error('❌ Unexpected error in job opportunities API:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
async function POST(request) {
    try {
        // Apply rate limiting
        const rateLimitResponse = (0, rate_limiter_1.withRateLimit)(rate_limiter_1.rateLimiters.api)(request);
        if (rateLimitResponse)
            return rateLimitResponse;
        console.log('📝 Creating new job opportunity...');
        const body = await request.json();
        // Validate input data
        if (!security_1.ValidationSchemas.jobTitle(body.position)) {
            return server_1.NextResponse.json({ success: false, error: 'Invalid job title' }, { status: 400 });
        }
        if (!security_1.ValidationSchemas.location(body.location)) {
            return server_1.NextResponse.json({ success: false, error: 'Invalid location' }, { status: 400 });
        }
        // Sanitize input
        const sanitizedBody = {
            ...body,
            company: security_1.SecurityManager.sanitizeInput(body.company || ''),
            position: security_1.SecurityManager.sanitizeInput(body.position),
            location: security_1.SecurityManager.sanitizeInput(body.location),
            description: security_1.SecurityManager.sanitizeInput(body.description || ''),
            requirements: security_1.SecurityManager.sanitizeInput(body.requirements || ''),
            benefits: security_1.SecurityManager.sanitizeInput(body.benefits || '')
        };
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        const { data: job, error } = await supabase
            .from('job_opportunities')
            .insert([{
                company: sanitizedBody.company,
                position: sanitizedBody.position,
                location: sanitizedBody.location,
                remote_option: sanitizedBody.remote_option,
                salary_range: sanitizedBody.salary_range,
                description: sanitizedBody.description,
                requirements: sanitizedBody.requirements,
                benefits: sanitizedBody.benefits,
                application_url: sanitizedBody.application_url,
                source: sanitizedBody.source || 'manual',
                scraped_at: new Date().toISOString(),
                alex_ai_score: sanitizedBody.alex_ai_score || 0,
                st_louis_area: sanitizedBody.st_louis_area || false,
                st_louis_focus: sanitizedBody.st_louis_focus || false
            }])
            .select()
            .single();
        if (error) {
            console.error('❌ Error creating job opportunity:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Created job opportunity: ${job.id}`);
        return server_1.NextResponse.json(job);
    }
    catch (error) {
        console.error('❌ Unexpected error creating job opportunity:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map