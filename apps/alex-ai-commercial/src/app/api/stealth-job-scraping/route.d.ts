/**
 * Stealth Job Scraping API
 *
 * This API endpoint provides IP-protected job scraping using Puppeteer stealth techniques
 * to avoid detection and protect the user's IP address from being logged.
 */
import { NextRequest, NextResponse } from 'next/server';
interface ScrapingJob {
    id: string;
    source: string;
    searchTerm: string;
    location: string;
    status: 'pending' | 'scraping' | 'completed' | 'failed';
    jobsFound: number;
    jobsStored: number;
    startedAt: string;
    completedAt?: string;
    error?: string;
}
export declare function GET(): Promise<NextResponse<ScrapingJob[]> | NextResponse<{
    error: string;
}>>;
export declare function POST(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<{
    success: boolean;
    jobId: string;
    message: string;
    estimatedTime: string;
    protection: string;
}>>;
/**
 * Get specific scraping job
 */
export declare function PUT(request: NextRequest): Promise<NextResponse<{
    error: string;
}> | NextResponse<ScrapingJob>>;
export {};
//# sourceMappingURL=route.d.ts.map