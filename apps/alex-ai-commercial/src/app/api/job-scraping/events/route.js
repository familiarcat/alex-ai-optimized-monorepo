"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
async function GET(request) {
    // Set up Server-Sent Events
    const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });
    const stream = new ReadableStream({
        start(controller) {
            console.log('🔌 Client connected to job scraping events');
            // Send initial connection message
            const initialMessage = `data: ${JSON.stringify({
                type: 'connected',
                message: 'Connected to job scraping events',
                timestamp: new Date().toISOString()
            })}\n\n`;
            controller.enqueue(new TextEncoder().encode(initialMessage));
            // Send current jobs
            const sendCurrentJobs = async () => {
                try {
                    const response = await fetch(`${request.nextUrl.origin}/api/job-scraping`);
                    const jobs = await response.json();
                    const jobsMessage = `data: ${JSON.stringify({
                        type: 'jobs_list',
                        jobs: jobs,
                        timestamp: new Date().toISOString()
                    })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(jobsMessage));
                }
                catch (error) {
                    console.error('❌ Error sending current jobs:', error);
                }
            };
            // Send current jobs immediately
            sendCurrentJobs();
            // Set up periodic updates
            const interval = setInterval(async () => {
                try {
                    // Check for new jobs
                    const response = await fetch(`${request.nextUrl.origin}/api/job-scraping`);
                    const jobs = await response.json();
                    // Send heartbeat
                    const heartbeatMessage = `data: ${JSON.stringify({
                        type: 'heartbeat',
                        timestamp: new Date().toISOString(),
                        jobCount: jobs.length
                    })}\n\n`;
                    controller.enqueue(new TextEncoder().encode(heartbeatMessage));
                }
                catch (error) {
                    console.error('❌ Error in periodic update:', error);
                }
            }, 30000); // Every 30 seconds
            // Handle client disconnect
            request.signal.addEventListener('abort', () => {
                console.log('🔌 Client disconnected from job scraping events');
                clearInterval(interval);
                controller.close();
            });
            // Cleanup on stream end
            const cleanup = () => {
                clearInterval(interval);
                controller.close();
            };
            // Set up cleanup timeout (1 hour)
            setTimeout(cleanup, 60 * 60 * 1000);
        }
    });
    return new Response(stream, { headers });
}
// Handle job updates (called by other endpoints)
async function POST(request) {
    try {
        const body = await request.json();
        const { jobId, status, jobs } = body;
        console.log(`📨 Broadcasting job update: ${jobId} - ${status}`);
        // In a real implementation, you would broadcast this to all connected clients
        // For now, we'll just log it
        const updateMessage = {
            type: 'job_update',
            jobId,
            status,
            jobs,
            timestamp: new Date().toISOString()
        };
        console.log('📡 Broadcasting:', updateMessage);
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
    catch (error) {
        console.error('❌ Error broadcasting job update:', error);
        return new Response(JSON.stringify({ error: 'Failed to broadcast update' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
//# sourceMappingURL=route.js.map