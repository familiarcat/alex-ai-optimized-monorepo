"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const supabase_1 = require("@/lib/supabase");
// Default scraping configurations
const DEFAULT_SCRAPING_CONFIGS = [
    {
        name: 'AI Engineer Jobs - St. Louis',
        source: 'linkedin',
        searchTerm: 'AI Engineer',
        location: 'St. Louis, MO',
        maxResults: 20,
        schedule: 'hourly',
        enabled: true
    },
    {
        name: 'Remote AI Jobs',
        source: 'indeed',
        searchTerm: 'Machine Learning Engineer',
        location: 'Remote',
        maxResults: 15,
        schedule: 'hourly',
        enabled: true
    },
    {
        name: 'Tech Jobs - Missouri',
        source: 'glassdoor',
        searchTerm: 'Software Engineer',
        location: 'Missouri',
        maxResults: 10,
        schedule: 'hourly',
        enabled: true
    }
];
// GET - Retrieve scheduled scraping configurations and status
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const action = searchParams.get('action');
        if (action === 'status') {
            // Get current scraping status and next scheduled runs
            const configs = await getScheduledConfigs();
            const status = {
                totalConfigs: configs.length,
                enabledConfigs: configs.filter(c => c.enabled).length,
                lastRun: configs.reduce((latest, config) => {
                    if (!config.lastRun)
                        return latest;
                    if (!latest || new Date(config.lastRun) > new Date(latest)) {
                        return config.lastRun;
                    }
                    return latest;
                }, null),
                nextRun: configs.reduce((earliest, config) => {
                    if (!config.nextRun)
                        return earliest;
                    if (!earliest || new Date(config.nextRun) < new Date(earliest)) {
                        return config.nextRun;
                    }
                    return earliest;
                }, null),
                configs: configs.map(config => ({
                    id: config.id,
                    name: config.name,
                    source: config.source,
                    schedule: config.schedule,
                    enabled: config.enabled,
                    lastRun: config.lastRun,
                    nextRun: config.nextRun
                }))
            };
            return server_1.NextResponse.json({ success: true, status });
        }
        if (action === 'configs') {
            // Get all scheduled configurations
            const configs = await getScheduledConfigs();
            return server_1.NextResponse.json({ success: true, configs });
        }
        // Default: get recent scraping jobs
        const recentJobs = await getRecentScheduledJobs();
        return server_1.NextResponse.json({ success: true, jobs: recentJobs });
    }
    catch (error) {
        console.error('❌ Failed to get scheduled scraping data:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
// POST - Create or update scheduled scraping configuration
async function POST(request) {
    try {
        const { action, config, configId } = await request.json();
        if (action === 'create') {
            // Create new scheduled scraping configuration
            const newConfig = await createScheduledConfig(config);
            return server_1.NextResponse.json({
                success: true,
                config: newConfig,
                message: 'Scheduled scraping configuration created successfully'
            });
        }
        if (action === 'update') {
            // Update existing configuration
            const updatedConfig = await updateScheduledConfig(configId, config);
            return server_1.NextResponse.json({
                success: true,
                config: updatedConfig,
                message: 'Scheduled scraping configuration updated successfully'
            });
        }
        if (action === 'toggle') {
            // Toggle configuration enabled/disabled
            const toggledConfig = await toggleScheduledConfig(configId);
            return server_1.NextResponse.json({
                success: true,
                config: toggledConfig,
                message: `Scheduled scraping ${toggledConfig.enabled ? 'enabled' : 'disabled'}`
            });
        }
        if (action === 'run-now') {
            // Manually trigger scheduled scraping
            const result = await runScheduledScraping(configId);
            return server_1.NextResponse.json({
                success: true,
                result,
                message: 'Scheduled scraping triggered manually'
            });
        }
        if (action === 'run-all') {
            // Manually trigger all enabled scheduled scrapings
            const results = await runAllScheduledScraping();
            return server_1.NextResponse.json({
                success: true,
                results,
                message: `Triggered ${results.length} scheduled scraping jobs`
            });
        }
        if (action === 'initialize') {
            // Initialize default configurations
            const initialized = await initializeDefaultConfigs();
            return server_1.NextResponse.json({
                success: true,
                initialized,
                message: 'Default scheduled scraping configurations initialized'
            });
        }
        return server_1.NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }
    catch (error) {
        console.error('❌ Failed to process scheduled scraping request:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
// DELETE - Remove scheduled scraping configuration
async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const configId = searchParams.get('configId');
        if (!configId) {
            return server_1.NextResponse.json({ success: false, error: 'Configuration ID required' }, { status: 400 });
        }
        const deleted = await deleteScheduledConfig(configId);
        return server_1.NextResponse.json({
            success: true,
            deleted,
            message: 'Scheduled scraping configuration deleted successfully'
        });
    }
    catch (error) {
        console.error('❌ Failed to delete scheduled scraping configuration:', error);
        return server_1.NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
// Helper functions
async function getScheduledConfigs() {
    try {
        const { data, error } = await supabase_1.supabase
            .from('scheduled_scraping_configs')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching scheduled configs:', error);
        return [];
    }
}
async function getRecentScheduledJobs() {
    try {
        const { data, error } = await supabase_1.supabase
            .from('scraping_jobs')
            .select('*')
            .eq('scheduled', true)
            .order('created_at', { ascending: false })
            .limit(50);
        if (error)
            throw error;
        return data || [];
    }
    catch (error) {
        console.error('Error fetching recent scheduled jobs:', error);
        return [];
    }
}
async function createScheduledConfig(config) {
    const { data, error } = await supabase_1.supabase
        .from('scheduled_scraping_configs')
        .insert([{
            ...config,
            nextRun: calculateNextRun(config.schedule)
        }])
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
async function updateScheduledConfig(configId, updates) {
    const { data, error } = await supabase_1.supabase
        .from('scheduled_scraping_configs')
        .update({
        ...updates,
        updated_at: new Date().toISOString(),
        nextRun: updates.schedule ? calculateNextRun(updates.schedule) : undefined
    })
        .eq('id', configId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
async function toggleScheduledConfig(configId) {
    const { data, error } = await supabase_1.supabase
        .from('scheduled_scraping_configs')
        .update({
        enabled: supabase_1.supabase.raw('NOT enabled'),
        updated_at: new Date().toISOString()
    })
        .eq('id', configId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
async function runScheduledScraping(configId) {
    const config = await getScheduledConfig(configId);
    if (!config) {
        throw new Error('Configuration not found');
    }
    // Trigger the scraping job
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/job-scraping`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            source: config.source,
            searchTerm: config.search_term,
            location: config.location,
            maxResults: config.max_results,
            scheduled: true,
            configId: config.id
        })
    });
    const result = await response.json();
    // Update last run time
    await updateScheduledConfig(configId, {
        lastRun: new Date().toISOString(),
        nextRun: calculateNextRun(config.schedule)
    });
    return result;
}
async function runAllScheduledScraping() {
    const configs = await getScheduledConfigs();
    const enabledConfigs = configs.filter(c => c.enabled);
    const results = [];
    for (const config of enabledConfigs) {
        try {
            const result = await runScheduledScraping(config.id);
            results.push({ configId: config.id, success: true, result });
        }
        catch (error) {
            results.push({
                configId: config.id,
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
    return results;
}
async function getScheduledConfig(configId) {
    const { data, error } = await supabase_1.supabase
        .from('scheduled_scraping_configs')
        .select('*')
        .eq('id', configId)
        .single();
    if (error)
        return null;
    return data;
}
async function deleteScheduledConfig(configId) {
    const { data, error } = await supabase_1.supabase
        .from('scheduled_scraping_configs')
        .delete()
        .eq('id', configId)
        .select()
        .single();
    if (error)
        throw error;
    return data;
}
async function initializeDefaultConfigs() {
    const existingConfigs = await getScheduledConfigs();
    if (existingConfigs.length > 0) {
        return { message: 'Configurations already exist', count: existingConfigs.length };
    }
    const results = [];
    for (const config of DEFAULT_SCRAPING_CONFIGS) {
        try {
            const created = await createScheduledConfig(config);
            results.push(created);
        }
        catch (error) {
            console.error('Error creating default config:', error);
        }
    }
    return { message: 'Default configurations created', count: results.length, configs: results };
}
function calculateNextRun(schedule) {
    const now = new Date();
    switch (schedule) {
        case 'hourly':
            return new Date(now.getTime() + 60 * 60 * 1000).toISOString();
        case 'daily':
            return new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
        case 'weekly':
            return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
        default:
            return new Date(now.getTime() + 60 * 60 * 1000).toISOString(); // Default to hourly
    }
}
//# sourceMappingURL=route.js.map