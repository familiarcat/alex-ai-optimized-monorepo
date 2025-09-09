#!/usr/bin/env python3
"""
Create N8N workflow for job opportunities that fetches data from Supabase
"""

import os
import requests
import json

# N8N configuration
N8N_BASE_URL = "https://n8n.pbradygeorgen.com"
N8N_API_KEY = os.getenv('N8N_API_KEY')

def create_job_opportunities_workflow():
    """Create a workflow for job opportunities"""
    
    workflow = {
        "name": "Alex AI Job Opportunities - Live Data",
        "nodes": [
            {
                "parameters": {
                    "httpMethod": "POST",
                    "path": "alex-ai-job-opportunities",
                    "responseMode": "responseNode",
                    "options": {}
                },
                "id": "webhook-trigger",
                "name": "Job Opportunities Webhook",
                "type": "n8n-nodes-base.webhook",
                "typeVersion": 1,
                "position": [240, 300]
            },
            {
                "parameters": {
                    "url": "https://rpkkkbufdwxmjaerbhbn.supabase.co/rest/v1/job_opportunities",
                    "authentication": "genericCredentialType",
                    "options": {
                        "headers": {
                            "apikey": "sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU",
                            "Authorization": "Bearer sb_publishable_ibWfa8oHqDMzbhEr6BxgBw_0aXaq3DU"
                        }
                    }
                },
                "id": "supabase-fetch",
                "name": "Fetch Job Opportunities from Supabase",
                "type": "n8n-nodes-base.httpRequest",
                "typeVersion": 1,
                "position": [460, 300]
            },
            {
                "parameters": {
                    "jsCode": "// Process and format job opportunities data\nconst supabaseData = $input.all()[0].json;\n\n// Check if we got data from Supabase\nif (!supabaseData || supabaseData.length === 0) {\n  // Return empty data with proper structure\n  return {\n    data: [],\n    total: 0,\n    message: \"No job opportunities found\",\n    timestamp: new Date().toISOString(),\n    source: \"supabase\"\n  };\n}\n\n// Format the data for the frontend\nconst formattedJobs = supabaseData.map(job => ({\n  id: job.id,\n  company: job.company || 'Unknown Company',\n  position: job.position || 'Unknown Position',\n  location: job.location || 'Unknown Location',\n  remote_option: job.remote_option || 'Not specified',\n  salary_range: job.salary_range || 'Not specified',\n  description: job.description || 'No description available',\n  requirements: job.requirements || 'No requirements specified',\n  benefits: job.benefits || 'No benefits specified',\n  application_url: job.application_url || '#',\n  source: job.source || 'supabase',\n  scraped_at: job.scraped_at || new Date().toISOString(),\n  alex_ai_score: job.alex_ai_score || 0,\n  st_louis_area: job.st_louis_area || false,\n  st_louis_focus: job.st_louis_focus || false,\n  created_at: job.created_at || new Date().toISOString(),\n  updated_at: job.updated_at || new Date().toISOString()\n}));\n\nreturn {\n  data: formattedJobs,\n  total: formattedJobs.length,\n  message: `Found ${formattedJobs.length} job opportunities`,\n  timestamp: new Date().toISOString(),\n  source: \"supabase\"\n};"
                },
                "id": "data-processor",
                "name": "Process Job Data",
                "type": "n8n-nodes-base.code",
                "typeVersion": 2,
                "position": [680, 300]
            },
            {
                "parameters": {
                    "respondWith": "json",
                    "responseBody": "={{ $json }}",
                    "options": {}
                },
                "id": "webhook-response",
                "name": "Job Opportunities Response",
                "type": "n8n-nodes-base.respondToWebhook",
                "typeVersion": 1,
                "position": [900, 300]
            }
        ],
        "connections": {
            "Job Opportunities Webhook": {
                "main": [[{"node": "Fetch Job Opportunities from Supabase", "type": "main", "index": 0}]]
            },
            "Fetch Job Opportunities from Supabase": {
                "main": [[{"node": "Process Job Data", "type": "main", "index": 0}]]
            },
            "Process Job Data": {
                "main": [[{"node": "Job Opportunities Response", "type": "main", "index": 0}]]
            }
        },
        "settings": {
            "executionOrder": "v1"
        }
    }
    
    # Create the workflow
    headers = {
        "X-N8N-API-Key": N8N_API_KEY,
        "Content-Type": "application/json"
    }
    
    response = requests.post(
        f"{N8N_BASE_URL}/api/v1/workflows",
        headers=headers,
        json=workflow
    )
    
    if response.status_code in [200, 201]:
        print("✅ Job opportunities workflow created successfully!")
        workflow_data = response.json()
        print(f"Workflow ID: {workflow_data.get('id')}")
        print(f"Webhook URL: {N8N_BASE_URL}/webhook/alex-ai-job-opportunities")
        return workflow_data
    else:
        print(f"❌ Failed to create workflow: {response.status_code}")
        print(f"Response: {response.text}")
        return None

def test_webhook(workflow_id):
    """Test the webhook after creation"""
    webhook_url = f"{N8N_BASE_URL}/webhook/alex-ai-job-opportunities"
    
    test_data = {
        "test": True,
        "timestamp": "2025-01-09T00:00:00Z"
    }
    
    response = requests.post(
        webhook_url,
        json=test_data,
        headers={"Content-Type": "application/json"}
    )
    
    print(f"\\n🧪 Testing webhook: {webhook_url}")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text[:200]}...")

if __name__ == "__main__":
    print("🚀 Creating N8N workflow for job opportunities...")
    
    if not N8N_API_KEY:
        print("❌ N8N_API_KEY environment variable not set")
        exit(1)
    
    workflow = create_job_opportunities_workflow()
    
    if workflow:
        print("\\n🎉 Workflow creation completed!")
        print("\\nNext steps:")
        print("1. The workflow should be automatically active")
        print("2. Test the webhook endpoint")
        print("3. Update the frontend to use the new webhook")
        
        # Test the webhook
        test_webhook(workflow.get('id'))
    else:
        print("\\n❌ Failed to create workflow")
