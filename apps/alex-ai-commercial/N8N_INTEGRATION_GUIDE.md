# n8n Integration Guide for Alex AI Job Search

## Overview

This guide explains how to set up n8n.pbradygeorgen.com webhooks to provide live job opportunity data for both localhost and production environments, ensuring a single source of truth in Supabase.

## Architecture

```
n8n.pbradygeorgen.com (Live Data Source)
    ↓ (Webhook API)
Supabase Database (Single Source of Truth)
    ↓ (Unified Data Service)
Alex AI Job Search App (localhost & production)
```

## Required n8n Webhook Endpoints

### 1. Job Opportunities Webhook
- **Endpoint:** `POST /webhook/job-opportunities`
- **Purpose:** Provide live job opportunity data
- **Headers:** `X-N8N-API-KEY: {your-api-key}`
- **Request Body:**
  ```json
  {
    "action": "get_all",
    "timestamp": "2025-09-05T04:17:32.000Z",
    "source": "alex-ai-job-search"
  }
  ```
- **Response Format:**
  ```json
  {
    "data": [
      {
        "id": "job-123",
        "external_id": "n8n-job-123",
        "company": "Microsoft",
        "position": "Software Engineer - AI/ML",
        "location": "Redmond, WA",
        "remote_option": "Hybrid",
        "salary_range": "$120k-180k",
        "alex_ai_score": 95,
        "application_url": "https://careers.microsoft.com/us/en/job/123456",
        "description": "AI/ML platform development for Azure services",
        "requirements": "Python, Machine Learning, Azure, AI/ML",
        "benefits": "Health, 401k, Stock options, Unlimited PTO",
        "work_life_balance": "Flexible hours, remote options, work-life balance focus",
        "alex_ai_leverage": "Direct AI/ML expertise, Alex AI system development",
        "company_type": "tech",
        "st_louis_area": false,
        "st_louis_focus": false,
        "remote_friendly": true,
        "is_remote": false,
        "central_timezone": true,
        "n8n_workflow_id": "workflow-123",
        "n8n_execution_id": "exec-456",
        "alex_ai_crew_analysis": {
          "crew_consensus": "High match for AI/ML role",
          "confidence_score": 0.95,
          "key_factors": ["AI/ML expertise", "Azure experience", "Remote friendly"]
        },
        "alex_ai_memory_id": "memory-789",
        "alex_ai_leverage_factors": ["AI/ML", "Azure", "Remote work"]
      }
    ]
  }
  ```

### 2. Contacts Webhook
- **Endpoint:** `POST /webhook/contacts`
- **Purpose:** Provide contact information for companies
- **Request Body:**
  ```json
  {
    "action": "get_all",
    "timestamp": "2025-09-05T04:17:32.000Z",
    "source": "alex-ai-job-search"
  }
  ```
- **Response Format:**
  ```json
  {
    "data": [
      {
        "id": "contact-123",
        "external_id": "n8n-contact-123",
        "company": "Microsoft",
        "name": "Eric Boyd",
        "title": "VP AI Platform",
        "email": "eric.boyd@microsoft.com",
        "linkedin": "https://linkedin.com/in/ericboyd",
        "phone": null,
        "confidence_level": "high",
        "contact_type": "hiring_manager",
        "notes": "VP AI Platform - Direct contact for AI/ML roles",
        "n8n_workflow_id": "workflow-123",
        "n8n_execution_id": "exec-456"
      }
    ]
  }
  ```

### 3. Resume Analysis Webhook
- **Endpoint:** `POST /webhook/resume-analysis`
- **Purpose:** Analyze resume and provide skills/experience data
- **Request Body:**
  ```json
  {
    "action": "get_all",
    "timestamp": "2025-09-05T04:17:32.000Z",
    "source": "alex-ai-job-search"
  }
  ```
- **Response Format:**
  ```json
  {
    "data": [
      {
        "id": "analysis-123",
        "user_id": "user-456",
        "resume_path": "/resumes/Brady_Georgen_Resume_Final.docx",
        "analysis_date": "2025-09-05T04:17:32.000Z",
        "key_skills": ["Python", "JavaScript", "React", "Node.js", "Machine Learning", "n8n", "OpenAI", "Supabase"],
        "experience_level": "Senior",
        "alex_ai_expertise": "Advanced",
        "best_matches": [
          {"company": "Microsoft", "position": "Software Engineer AI/ML", "score": 95},
          {"company": "Daugherty Business Solutions", "position": "Senior Consultant III", "score": 92}
        ],
        "analysis_data": {
          "st_louis_focus": "Strong local presence with 8 opportunities in St. Louis area",
          "remote_preference": "15 remote opportunities in Central Time Zone",
          "work_life_balance": "All opportunities prioritize work-life balance",
          "alex_ai_leverage": "High leverage in AI/ML, automation, and client-facing roles"
        },
        "n8n_workflow_id": "workflow-123",
        "n8n_execution_id": "exec-456"
      }
    ]
  }
  ```

## n8n Workflow Setup

### 1. Create Job Opportunities Workflow
1. **Trigger:** Webhook
   - Method: POST
   - Path: `/job-opportunities`
   - Authentication: API Key (X-N8N-API-KEY)

2. **Data Source Node:** 
   - Connect to your job scraping source
   - Could be LinkedIn, Indeed, company websites, etc.

3. **Data Processing Node:**
   - Transform data to match the required format
   - Add Alex AI scoring and analysis
   - Include n8n metadata (workflow_id, execution_id)

4. **Response Node:**
   - Return data in the specified JSON format
   - Include proper error handling

### 2. Create Contacts Workflow
1. **Trigger:** Webhook
   - Method: POST
   - Path: `/contacts`
   - Authentication: API Key (X-N8N-API-KEY)

2. **Data Source Node:**
   - Connect to your contact database
   - Could be CRM, LinkedIn, company directories, etc.

3. **Data Processing Node:**
   - Transform contact data
   - Add confidence levels and contact types
   - Include n8n metadata

4. **Response Node:**
   - Return contacts in the specified format

### 3. Create Resume Analysis Workflow
1. **Trigger:** Webhook
   - Method: POST
   - Path: `/resume-analysis`
   - Authentication: API Key (X-N8N-API-KEY)

2. **Data Source Node:**
   - Connect to resume storage
   - Could be file system, cloud storage, etc.

3. **AI Processing Node:**
   - Use OpenAI or similar for resume analysis
   - Extract skills, experience level, etc.
   - Generate Alex AI expertise assessment

4. **Response Node:**
   - Return analysis in the specified format

## Environment Configuration

### 1. n8n Environment Variables
```bash
# n8n.pbradygeorgen.com
N8N_API_KEY=your-secure-api-key
N8N_URL=https://n8n.pbradygeorgen.com
```

### 2. Supabase Environment Variables
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Application Environment Variables
```bash
# Alex AI Job Search App
N8N_URL=https://n8n.pbradygeorgen.com
N8N_API_KEY=your-secure-api-key
ALEX_AI_API_URL=https://n8n.pbradygeorgen.com
```

## Data Synchronization

### 1. Automatic Sync
- **Frequency:** Every 5 minutes in production
- **Method:** Background service using `n8nSyncService`
- **Fallback:** Local mock data if n8n unavailable

### 2. Manual Sync
- **Trigger:** User clicks "Sync Now" button
- **Method:** Immediate full synchronization
- **Status:** Real-time sync status display

### 3. Sync Monitoring
- **Logging:** All sync operations logged to Supabase
- **Status:** Real-time sync status dashboard
- **Alerts:** Error notifications for failed syncs

## Testing the Integration

### 1. Test n8n Connectivity
```bash
curl -X POST https://n8n.pbradygeorgen.com/webhook/job-opportunities \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'
```

### 2. Test Supabase Connection
```bash
curl -X GET https://your-supabase-url.supabase.co/rest/v1/job_opportunities \
  -H "apikey: your-supabase-anon-key" \
  -H "Authorization: Bearer your-supabase-anon-key"
```

### 3. Test Application Integration
1. Start the application
2. Check the Data Sync Dashboard
3. Verify job opportunities are loading
4. Test manual sync functionality

## Troubleshooting

### Common Issues

1. **n8n Webhook Not Responding**
   - Check if workflow is active
   - Verify webhook URL is correct
   - Check API key authentication

2. **Supabase Sync Failing**
   - Verify Supabase credentials
   - Check database schema matches expected format
   - Review RLS policies

3. **Data Not Updating**
   - Check sync service is running
   - Verify n8n data format matches expected schema
   - Review error logs

### Debug Steps

1. **Check Sync Status**
   - View Data Sync Dashboard
   - Review sync logs in Supabase
   - Test individual webhook endpoints

2. **Verify Data Flow**
   - n8n → Supabase → Application
   - Check each step independently
   - Review data transformation

3. **Monitor Performance**
   - Check sync frequency
   - Monitor response times
   - Review error rates

## Security Considerations

1. **API Key Security**
   - Use strong, unique API keys
   - Rotate keys regularly
   - Store keys securely

2. **Data Privacy**
   - Encrypt sensitive data
   - Use HTTPS for all communications
   - Implement proper access controls

3. **Rate Limiting**
   - Implement rate limiting on webhooks
   - Monitor for abuse
   - Set appropriate timeouts

## Production Deployment

### 1. n8n Setup
- Activate all required workflows
- Configure production webhook URLs
- Set up monitoring and alerts

### 2. Supabase Setup
- Run database migrations
- Configure RLS policies
- Set up monitoring

### 3. Application Setup
- Configure production environment variables
- Enable automatic sync
- Set up error monitoring

## Maintenance

### 1. Regular Tasks
- Monitor sync status
- Review error logs
- Update API keys as needed

### 2. Data Quality
- Verify data accuracy
- Clean up old records
- Update data schemas as needed

### 3. Performance Optimization
- Monitor sync performance
- Optimize database queries
- Scale infrastructure as needed

---

This integration ensures that both localhost and production environments use the same live data from n8n.pbradygeorgen.com, with Supabase serving as the single source of truth for all job search data.

