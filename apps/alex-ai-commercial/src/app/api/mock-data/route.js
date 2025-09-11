"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const server_1 = require("next/server");
// Mock data for when database tables don't exist yet
const mockJobOpportunities = [
    {
        id: 'mock-1',
        company: 'TechCorp',
        position: 'Senior AI Engineer',
        location: 'St. Louis, MO',
        remote_option: 'Hybrid',
        salary_range: '$120,000 - $150,000',
        description: 'Leading AI development team with cutting-edge technologies',
        requirements: 'Python, Machine Learning, 5+ years experience',
        benefits: 'Health insurance, 401k, flexible hours',
        application_url: 'https://techcorp.com/careers/ai-engineer',
        source: 'mock',
        scraped_at: new Date().toISOString(),
        alex_ai_score: 95,
        st_louis_area: true,
        st_louis_focus: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'mock-2',
        company: 'DataFlow Inc',
        position: 'Machine Learning Engineer',
        location: 'Remote',
        remote_option: 'Remote',
        salary_range: '$100,000 - $130,000',
        description: 'Building ML pipelines and data processing systems',
        requirements: 'Python, TensorFlow, 3+ years experience',
        benefits: 'Remote work, stock options, learning budget',
        application_url: 'https://dataflow.com/careers/ml-engineer',
        source: 'mock',
        scraped_at: new Date().toISOString(),
        alex_ai_score: 88,
        st_louis_area: false,
        st_louis_focus: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'mock-3',
        company: 'InnovateLab',
        position: 'AI Research Scientist',
        location: 'St. Louis, MO',
        remote_option: 'On-site',
        salary_range: '$140,000 - $180,000',
        description: 'Cutting-edge AI research and development',
        requirements: 'PhD in AI/ML, Python, research experience',
        benefits: 'Research budget, conference attendance, sabbatical',
        application_url: 'https://innovatelab.com/careers/research-scientist',
        source: 'mock',
        scraped_at: new Date().toISOString(),
        alex_ai_score: 92,
        st_louis_area: true,
        st_louis_focus: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'mock-4',
        company: 'CloudTech',
        position: 'DevOps Engineer',
        location: 'Remote',
        remote_option: 'Remote',
        salary_range: '$90,000 - $120,000',
        description: 'Cloud infrastructure management and automation',
        requirements: 'AWS, Docker, Kubernetes, 3+ years experience',
        benefits: 'Remote work, health insurance, 401k',
        application_url: 'https://cloudtech.com/careers/devops',
        source: 'mock',
        scraped_at: new Date().toISOString(),
        alex_ai_score: 75,
        st_louis_area: false,
        st_louis_focus: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'mock-5',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        location: 'St. Louis, MO',
        remote_option: 'Hybrid',
        salary_range: '$80,000 - $110,000',
        description: 'Building web applications and APIs',
        requirements: 'React, Node.js, TypeScript, 2+ years experience',
        benefits: 'Equity, flexible hours, learning budget',
        application_url: 'https://startupxyz.com/careers/fullstack',
        source: 'mock',
        scraped_at: new Date().toISOString(),
        alex_ai_score: 70,
        st_louis_area: true,
        st_louis_focus: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];
const mockContacts = [
    {
        id: 'contact-1',
        name: 'John Smith',
        email: 'john@techcorp.com',
        phone: '+1-314-555-0123',
        company: 'TechCorp',
        position: 'HR Manager',
        linkedin_url: 'https://linkedin.com/in/johnsmith',
        notes: 'Met at AI conference, very interested in our AI initiatives',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'contact-2',
        name: 'Sarah Johnson',
        email: 'sarah@dataflow.com',
        phone: '+1-314-555-0456',
        company: 'DataFlow Inc',
        position: 'Recruiter',
        linkedin_url: 'https://linkedin.com/in/sarahjohnson',
        notes: 'Reached out about ML engineering opportunities',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'contact-3',
        name: 'Mike Davis',
        email: 'mike@innovatelab.com',
        phone: '+1-314-555-0789',
        company: 'InnovateLab',
        position: 'Engineering Manager',
        linkedin_url: 'https://linkedin.com/in/mikedavis',
        notes: 'Former colleague, knows about our AI research background',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
];
const mockApplications = [
    {
        id: 'app-1',
        job_id: 'mock-1',
        status: 'applied',
        application_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        notes: 'Applied through company website, waiting for response',
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        job_opportunities: {
            id: 'mock-1',
            company: 'TechCorp',
            position: 'Senior AI Engineer',
            location: 'St. Louis, MO'
        }
    },
    {
        id: 'app-2',
        job_id: 'mock-3',
        status: 'interview_scheduled',
        application_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        notes: 'Phone interview scheduled for next week',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        job_opportunities: {
            id: 'mock-3',
            company: 'InnovateLab',
            position: 'AI Research Scientist',
            location: 'St. Louis, MO'
        }
    }
];
async function GET(request) {
    try {
        const url = new URL(request.url);
        const type = url.searchParams.get('type') || 'jobs';
        console.log(`📊 Serving mock data for type: ${type}`);
        switch (type) {
            case 'jobs':
                return server_1.NextResponse.json(mockJobOpportunities);
            case 'contacts':
                return server_1.NextResponse.json(mockContacts);
            case 'applications':
                return server_1.NextResponse.json(mockApplications);
            case 'all':
                return server_1.NextResponse.json({
                    jobs: mockJobOpportunities,
                    contacts: mockContacts,
                    applications: mockApplications
                });
            default:
                return server_1.NextResponse.json(mockJobOpportunities);
        }
    }
    catch (error) {
        console.error('❌ Error serving mock data:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { type, data } = body;
        console.log(`📝 Creating mock ${type} record`);
        const newRecord = {
            id: `mock-${Date.now()}`,
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
        return server_1.NextResponse.json(newRecord);
    }
    catch (error) {
        console.error('❌ Error creating mock record:', error);
        return server_1.NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
//# sourceMappingURL=route.js.map