"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
exports.DELETE = DELETE;
const server_1 = require("next/server");
const live_data_store_1 = require("@/lib/live-data-store");
async function GET() {
    try {
        console.log('📊 Fetching live job data...');
        const jobs = live_data_store_1.liveDataStore.getJobs();
        const status = live_data_store_1.liveDataStore.getStatus();
        console.log(`✅ Retrieved ${jobs.length} live jobs`);
        return server_1.NextResponse.json({
            success: true,
            data: jobs,
            status,
            message: `Found ${jobs.length} live jobs`
        });
    }
    catch (error) {
        console.error('❌ Error fetching live jobs:', error);
        return server_1.NextResponse.json({
            success: false,
            error: 'Failed to fetch live jobs',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
async function POST(request) {
    try {
        console.log('📝 Adding jobs to live data store...');
        const body = await request.json();
        const { jobs } = body;
        if (!Array.isArray(jobs)) {
            return server_1.NextResponse.json({
                success: false,
                error: 'Jobs must be an array'
            }, { status: 400 });
        }
        live_data_store_1.liveDataStore.addJobs(jobs);
        const status = live_data_store_1.liveDataStore.getStatus();
        console.log(`✅ Added ${jobs.length} jobs to live data store`);
        return server_1.NextResponse.json({
            success: true,
            message: `Added ${jobs.length} jobs to live data store`,
            status
        });
    }
    catch (error) {
        console.error('❌ Error adding jobs to live data store:', error);
        return server_1.NextResponse.json({
            success: false,
            error: 'Failed to add jobs to live data store',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
async function DELETE() {
    try {
        console.log('🗑️ Clearing live data store...');
        live_data_store_1.liveDataStore.clear();
        return server_1.NextResponse.json({
            success: true,
            message: 'Live data store cleared'
        });
    }
    catch (error) {
        console.error('❌ Error clearing live data store:', error);
        return server_1.NextResponse.json({
            success: false,
            error: 'Failed to clear live data store',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map