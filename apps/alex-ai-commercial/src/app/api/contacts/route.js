"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
async function GET() {
    try {
        console.log('👥 Fetching contacts from Supabase...');
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        const { data: contacts, error } = await supabase
            .from('contacts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) {
            console.error('❌ Error fetching contacts:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Retrieved ${contacts?.length || 0} contacts`);
        return server_1.NextResponse.json(contacts || []);
    }
    catch (error) {
        console.error('❌ Unexpected error in contacts API:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
async function POST(request) {
    try {
        console.log('📝 Creating new contact...');
        const body = await request.json();
        const supabase = (0, supabase_1.getSupabaseClientSync)();
        const { data: contact, error } = await supabase
            .from('contacts')
            .insert([{
                name: body.name,
                email: body.email,
                phone: body.phone,
                company: body.company,
                position: body.position,
                linkedin_url: body.linkedin_url,
                notes: body.notes
            }])
            .select()
            .single();
        if (error) {
            console.error('❌ Error creating contact:', error);
            return server_1.NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        console.log(`✅ Created contact: ${contact.id}`);
        return server_1.NextResponse.json(contact);
    }
    catch (error) {
        console.error('❌ Unexpected error creating contact:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map