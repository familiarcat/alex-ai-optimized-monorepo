"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
async function GET() {
    try {
        console.log('📋 Fetching applications from Supabase...');
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        const { data: applications, error } = await supabase
            .from('applications')
            .select(`
        *,
        job_opportunities (
          id,
          company,
          position,
          location
        )
      `)
            .order('created_at', { ascending: false });
        if (error) {
            console.error('❌ Error fetching applications:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Retrieved ${applications?.length || 0} applications`);
        return server_1.NextResponse.json(applications || []);
    }
    catch (error) {
        console.error('❌ Unexpected error in applications API:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
async function POST(request) {
    try {
        console.log('📝 Creating new application...');
        const body = await request.json();
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        const { data: application, error } = await supabase
            .from('applications')
            .insert([{
                job_id: body.job_id,
                status: body.status || 'applied',
                application_date: body.application_date || new Date().toISOString(),
                notes: body.notes
            }])
            .select(`
        *,
        job_opportunities (
          id,
          company,
          position,
          location
        )
      `)
            .single();
        if (error) {
            console.error('❌ Error creating application:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Created application: ${application.id}`);
        return server_1.NextResponse.json(application);
    }
    catch (error) {
        console.error('❌ Unexpected error creating application:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map