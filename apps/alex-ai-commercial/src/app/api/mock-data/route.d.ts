import { NextResponse } from 'next/server';
export declare function GET(request: Request): Promise<NextResponse<{
    id: string;
    company: string;
    position: string;
    location: string;
    remote_option: string;
    salary_range: string;
    description: string;
    requirements: string;
    benefits: string;
    application_url: string;
    source: string;
    scraped_at: string;
    alex_ai_score: number;
    st_louis_area: boolean;
    st_louis_focus: boolean;
    created_at: string;
    updated_at: string;
}[]> | NextResponse<{
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    position: string;
    linkedin_url: string;
    notes: string;
    created_at: string;
    updated_at: string;
}[]> | NextResponse<{
    id: string;
    job_id: string;
    status: string;
    application_date: string;
    notes: string;
    created_at: string;
    updated_at: string;
    job_opportunities: {
        id: string;
        company: string;
        position: string;
        location: string;
    };
}[]> | NextResponse<{
    jobs: {
        id: string;
        company: string;
        position: string;
        location: string;
        remote_option: string;
        salary_range: string;
        description: string;
        requirements: string;
        benefits: string;
        application_url: string;
        source: string;
        scraped_at: string;
        alex_ai_score: number;
        st_louis_area: boolean;
        st_louis_focus: boolean;
        created_at: string;
        updated_at: string;
    }[];
    contacts: {
        id: string;
        name: string;
        email: string;
        phone: string;
        company: string;
        position: string;
        linkedin_url: string;
        notes: string;
        created_at: string;
        updated_at: string;
    }[];
    applications: {
        id: string;
        job_id: string;
        status: string;
        application_date: string;
        notes: string;
        created_at: string;
        updated_at: string;
        job_opportunities: {
            id: string;
            company: string;
            position: string;
            location: string;
        };
    }[];
}> | NextResponse<{
    success: boolean;
    error: string;
}>>;
export declare function POST(request: Request): Promise<NextResponse<any>>;
//# sourceMappingURL=route.d.ts.map