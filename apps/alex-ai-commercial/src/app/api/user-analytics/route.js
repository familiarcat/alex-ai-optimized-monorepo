"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
exports.GET = GET;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
async function POST(request) {
    try {
        console.log('📊 Tracking user analytics event...');
        const body = await request.json();
        const { type, data, session_id } = body;
        if (!type || !session_id) {
            return server_1.NextResponse.json({ success: false, error: 'Missing required fields: type, session_id' }, { status: 400 });
        }
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        // Store the analytics event
        const { data: event, error } = await supabase
            .from('user_analytics_events')
            .insert([{
                session_id,
                event_type: type,
                event_data: data,
                timestamp: new Date().toISOString()
            }])
            .select()
            .single();
        if (error) {
            console.error('❌ Error storing analytics event:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Tracked analytics event: ${type} for session ${session_id}`);
        return server_1.NextResponse.json({ success: true, event });
    }
    catch (error) {
        console.error('❌ Unexpected error in user analytics API:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
async function GET(request) {
    try {
        const url = new URL(request.url);
        const sessionId = url.searchParams.get('session_id');
        if (!sessionId) {
            return server_1.NextResponse.json({ success: false, error: 'Missing session_id parameter' }, { status: 400 });
        }
        console.log(`📊 Fetching analytics for session: ${sessionId}`);
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        const { data: events, error } = await supabase
            .from('user_analytics_events')
            .select('*')
            .eq('session_id', sessionId)
            .order('timestamp', { ascending: false });
        if (error) {
            console.error('❌ Error fetching analytics events:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Retrieved ${events?.length || 0} analytics events`);
        return server_1.NextResponse.json({ success: true, events: events || [] });
    }
    catch (error) {
        console.error('❌ Unexpected error fetching analytics:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map