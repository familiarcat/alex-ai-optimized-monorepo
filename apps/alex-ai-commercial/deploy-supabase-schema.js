const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function deploySchema() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Supabase credentials not found');
        process.exit(1);
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    try {
        // Read SQL schema
        const schema = fs.readFileSync('supabase-unified-schema.sql', 'utf8');
        
        // Execute schema
        const { data, error } = await supabase.rpc('exec_sql', { sql: schema });
        
        if (error) {
            console.error('❌ Schema deployment failed:', error);
            process.exit(1);
        }
        
        console.log('✅ Supabase schema deployed successfully');
        
        // Test the schema
        const { data: testData, error: testError } = await supabase
            .from('job_opportunities')
            .select('count')
            .limit(1);
            
        if (testError) {
            console.error('❌ Schema test failed:', testError);
            process.exit(1);
        }
        
        console.log('✅ Schema test passed');
        
    } catch (error) {
        console.error('❌ Error deploying schema:', error);
        process.exit(1);
    }
}

deploySchema();
