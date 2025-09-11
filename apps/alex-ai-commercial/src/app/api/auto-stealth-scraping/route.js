"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
// Import auto stealth scraping service only on server-side
let autoStealthScrapingService = null;
try {
    if (typeof window === 'undefined') {
        const { autoStealthScrapingService: service } = require('@/lib/auto-stealth-scraping');
        autoStealthScrapingService = service;
    }
}
catch (error) {
    console.warn('Auto stealth scraping service not available:', error);
}
// GET - Get auto scraping status and configuration
async function GET() {
    try {
        if (!autoStealthScrapingService) {
            return server_1.NextResponse.json({
                success: false,
                error: 'Auto stealth scraping service not available',
                status: { enabled: false, isRunning: false, totalJobs: 0, recentJobs: 0, successRate: 0 },
                config: null,
                recentJobs: []
            }, { status: 503 });
        }
        const status = autoStealthScrapingService.getStatus();
        const config = autoStealthScrapingService.getConfig();
        const recentJobs = autoStealthScrapingService.getRecentJobs();
        return server_1.NextResponse.json({
            success: true,
            status,
            config,
            recentJobs,
            message: 'Auto stealth scraping status retrieved successfully'
        });
    }
    catch (error) {
        console.error('Error getting auto stealth scraping status:', error);
        return server_1.NextResponse.json({
            success: false,
            error: 'Failed to get auto stealth scraping status',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
// POST - Start/stop auto scraping or trigger manual scraping
async function POST(request) {
    try {
        if (!autoStealthScrapingService) {
            return server_1.NextResponse.json({
                success: false,
                error: 'Auto stealth scraping service not available',
                message: 'Service is not available in this environment'
            }, { status: 503 });
        }
        const body = await request.json();
        const { action, config, manualScraping } = body;
        switch (action) {
            case 'start':
                autoStealthScrapingService.startAutoScraping();
                return server_1.NextResponse.json({
                    success: true,
                    message: 'Auto stealth scraping started successfully',
                    status: autoStealthScrapingService.getStatus()
                });
            case 'stop':
                autoStealthScrapingService.stopAutoScraping();
                return server_1.NextResponse.json({
                    success: true,
                    message: 'Auto stealth scraping stopped successfully',
                    status: autoStealthScrapingService.getStatus()
                });
            case 'update-config':
                if (!config) {
                    return server_1.NextResponse.json({ success: false, error: 'Configuration is required' }, { status: 400 });
                }
                autoStealthScrapingService.updateConfig(config);
                return server_1.NextResponse.json({
                    success: true,
                    message: 'Auto stealth scraping configuration updated successfully',
                    config: autoStealthScrapingService.getConfig()
                });
            case 'manual-trigger':
                if (!manualScraping) {
                    return server_1.NextResponse.json({ success: false, error: 'Manual scraping parameters are required' }, { status: 400 });
                }
                const { source, searchTerm, location, maxResults = 10 } = manualScraping;
                const jobId = await autoStealthScrapingService.triggerManualScraping(source, searchTerm, location, maxResults);
                return server_1.NextResponse.json({
                    success: true,
                    message: 'Manual stealth scraping triggered successfully',
                    jobId,
                    status: autoStealthScrapingService.getStatus()
                });
            case 'cleanup':
                autoStealthScrapingService.cleanupOldJobs();
                return server_1.NextResponse.json({
                    success: true,
                    message: 'Old auto scraping jobs cleaned up successfully',
                    status: autoStealthScrapingService.getStatus()
                });
            default:
                return server_1.NextResponse.json({ success: false, error: 'Invalid action. Use: start, stop, update-config, manual-trigger, or cleanup' }, { status: 400 });
        }
    }
    catch (error) {
        console.error('Error handling auto stealth scraping request:', error);
        return server_1.NextResponse.json({
            success: false,
            error: 'Failed to handle auto stealth scraping request',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map