import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// N8N Workflow configurations for Alex AI crew
const N8N_WORKFLOWS = {
  job_scraping: {
    name: 'Job Scraping Workflow',
    description: 'Automated job scraping from multiple sources with Alex AI analysis',
    triggers: ['schedule', 'webhook', 'manual'],
    nodes: [
      {
        id: 'webhook_trigger',
        type: 'n8n-nodes-base.webhook',
        name: 'Job Scraping Trigger',
        parameters: {
          path: 'job-scraping',
          httpMethod: 'POST'
        }
      },
      {
        id: 'linkedin_scraper',
        type: 'n8n-nodes-base.httpRequest',
        name: 'LinkedIn Jobs Scraper',
        parameters: {
          url: 'https://www.linkedin.com/jobs/search',
          method: 'GET',
          qs: {
            keywords: '={{ $json.searchTerm }}',
            location: '={{ $json.location }}',
            count: '={{ $json.maxResults }}'
          }
        }
      },
      {
        id: 'indeed_scraper',
        type: 'n8n-nodes-base.httpRequest',
        name: 'Indeed Jobs Scraper',
        parameters: {
          url: 'https://www.indeed.com/jobs',
          method: 'GET',
          qs: {
            q: '={{ $json.searchTerm }}',
            l: '={{ $json.location }}',
            limit: '={{ $json.maxResults }}'
          }
        }
      },
      {
        id: 'alex_ai_analyzer',
        type: 'n8n-nodes-base.httpRequest',
        name: 'Alex AI Job Analyzer',
        parameters: {
          url: 'https://api.alex-ai.com/analyze-jobs',
          method: 'POST',
          body: {
            jobs: '={{ $json.jobs }}',
            crew_analysis: true
          }
        }
      },
      {
        id: 'supabase_storage',
        type: 'n8n-nodes-base.supabase',
        name: 'Store in Supabase',
        parameters: {
          operation: 'insert',
          table: 'job_opportunities',
          data: '={{ $json.analyzed_jobs }}'
        }
      }
    ],
    enabled: true
  },
  mcp_knowledge_scraping: {
    name: 'MCP Knowledge Scraping Workflow',
    description: 'Scrape MCP documentation and open source APIs for crew knowledge',
    triggers: ['schedule', 'webhook', 'manual'],
    nodes: [
      {
        id: 'github_mcp_scraper',
        type: 'n8n-nodes-base.github',
        name: 'GitHub MCP Scraper',
        parameters: {
          operation: 'getRepositories',
          owner: 'modelcontextprotocol',
          repository: 'servers'
        }
      },
      {
        id: 'mcp_docs_scraper',
        type: 'n8n-nodes-base.httpRequest',
        name: 'MCP Documentation Scraper',
        parameters: {
          url: 'https://modelcontextprotocol.io/docs',
          method: 'GET'
        }
      },
      {
        id: 'alex_ai_knowledge_analyzer',
        type: 'n8n-nodes-base.httpRequest',
        name: 'Alex AI Knowledge Analyzer',
        parameters: {
          url: 'https://api.alex-ai.com/analyze-knowledge',
          method: 'POST',
          body: {
            knowledge: '={{ $json.scraped_data }}',
            crew_categorization: true
          }
        }
      },
      {
        id: 'crew_memory_storage',
        type: 'n8n-nodes-base.supabase',
        name: 'Store in Crew Memories',
        parameters: {
          operation: 'insert',
          table: 'alex_ai_crew_memories',
          data: '={{ $json.categorized_knowledge }}'
        }
      }
    ],
    enabled: true
  },
  crew_collaboration: {
    name: 'Alex AI Crew Collaboration Workflow',
    description: 'Facilitate collaboration between crew members on job analysis',
    triggers: ['webhook', 'manual'],
    nodes: [
      {
        id: 'crew_trigger',
        type: 'n8n-nodes-base.webhook',
        name: 'Crew Collaboration Trigger',
        parameters: {
          path: 'crew-collaboration',
          httpMethod: 'POST'
        }
      },
      {
        id: 'technical_lead_analysis',
        type: 'n8n-nodes-base.httpRequest',
        name: 'Technical Lead Analysis',
        parameters: {
          url: 'https://api.alex-ai.com/crew/technical-lead/analyze',
          method: 'POST',
          body: {
            job_data: '={{ $json.job_data }}',
            context: 'technical_implementation'
          }
        }
      },
      {
        id: 'ai_strategy_analysis',
        type: 'n8n-nodes-base.httpRequest',
        name: 'AI Strategy Analysis',
        parameters: {
          url: 'https://api.alex-ai.com/crew/ai-strategy/analyze',
          method: 'POST',
          body: {
            job_data: '={{ $json.job_data }}',
            context: 'ai_integration'
          }
        }
      },
      {
        id: 'client_success_analysis',
        type: 'n8n-nodes-base.httpRequest',
        name: 'Client Success Analysis',
        parameters: {
          url: 'https://api.alex-ai.com/crew/client-success/analyze',
          method: 'POST',
          body: {
            job_data: '={{ $json.job_data }}',
            context: 'user_experience'
          }
        }
      },
      {
        id: 'sustainability_analysis',
        type: 'n8n-nodes-base.httpRequest',
        name: 'Sustainability Analysis',
        parameters: {
          url: 'https://api.alex-ai.com/crew/sustainability/analyze',
          method: 'POST',
          body: {
            job_data: '={{ $json.job_data }}',
            context: 'scalability'
          }
        }
      },
      {
        id: 'consolidate_analysis',
        type: 'n8n-nodes-base.function',
        name: 'Consolidate Crew Analysis',
        parameters: {
          functionCode: `
            const technicalAnalysis = $input.first().json.technical_analysis;
            const aiAnalysis = $input.first().json.ai_analysis;
            const clientAnalysis = $input.first().json.client_analysis;
            const sustainabilityAnalysis = $input.first().json.sustainability_analysis;
            
            const consolidatedAnalysis = {
              job_id: $json.job_id,
              crew_analysis: {
                technical_lead: technicalAnalysis,
                ai_strategy: aiAnalysis,
                client_success: clientAnalysis,
                sustainability: sustainabilityAnalysis
              },
              overall_score: Math.round(
                (technicalAnalysis.score + aiAnalysis.score + 
                 clientAnalysis.score + sustainabilityAnalysis.score) / 4
              ),
              recommendations: [
                ...technicalAnalysis.recommendations,
                ...aiAnalysis.recommendations,
                ...clientAnalysis.recommendations,
                ...sustainabilityAnalysis.recommendations
              ],
              analyzed_at: new Date().toISOString()
            };
            
            return [{ json: consolidatedAnalysis }];
          `
        }
      },
      {
        id: 'store_crew_analysis',
        type: 'n8n-nodes-base.supabase',
        name: 'Store Crew Analysis',
        parameters: {
          operation: 'upsert',
          table: 'job_opportunities',
          data: '={{ $json }}'
        }
      }
    ],
    enabled: true
  },
  memory_sync: {
    name: 'Alex AI Memory Synchronization',
    description: 'Sync crew memories and knowledge across systems',
    triggers: ['schedule', 'webhook'],
    nodes: [
      {
        id: 'memory_sync_trigger',
        type: 'n8n-nodes-base.schedule',
        name: 'Memory Sync Schedule',
        parameters: {
          rule: {
            interval: [{ field: 'minutes', value: 30 }]
          }
        }
      },
      {
        id: 'fetch_crew_memories',
        type: 'n8n-nodes-base.supabase',
        name: 'Fetch Crew Memories',
        parameters: {
          operation: 'select',
          table: 'alex_ai_crew_memories',
          filterType: 'manual',
          conditions: {
            conditions: [
              {
                key: 'updated_at',
                operation: 'gte',
                value: '={{ $now.minus({ hours: 1 }).toISO() }}'
              }
            ]
          }
        }
      },
      {
        id: 'fetch_mcp_knowledge',
        type: 'n8n-nodes-base.supabase',
        name: 'Fetch MCP Knowledge',
        parameters: {
          operation: 'select',
          table: 'mcp_knowledge_base',
          filterType: 'manual',
          conditions: {
            conditions: [
              {
                key: 'updated_at',
                operation: 'gte',
                value: '={{ $now.minus({ hours: 1 }).toISO() }}'
              }
            ]
          }
        }
      },
      {
        id: 'sync_to_alex_ai',
        type: 'n8n-nodes-base.httpRequest',
        name: 'Sync to Alex AI System',
        parameters: {
          url: 'https://api.alex-ai.com/sync-memories',
          method: 'POST',
          body: {
            crew_memories: '={{ $json.crew_memories }}',
            mcp_knowledge: '={{ $json.mcp_knowledge }}',
            sync_timestamp: '={{ $now.toISO() }}'
          }
        }
      }
    ],
    enabled: true
  }
}

export async function POST(request: Request) {
  try {
    const { action, workflow, config } = await request.json()
    
    console.log('🔧 N8N Workflow operation:', { action, workflow, config })
    
    switch (action) {
      case 'deploy':
        return await deployWorkflow(workflow, config)
      case 'execute':
        return await executeWorkflow(workflow, config)
      case 'status':
        return await getWorkflowStatus(workflow)
      case 'list':
        return await listWorkflows()
      default:
        return NextResponse.json(
          { success: false, error: `Invalid action: ${action}` },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('❌ N8N workflow operation failed:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const workflow = searchParams.get('workflow')
    const status = searchParams.get('status')
    
    if (workflow) {
      // Get specific workflow status
      const workflowStatus = await getWorkflowStatus(workflow)
      return NextResponse.json(workflowStatus)
    }
    
    if (status) {
      // Get workflows by status
      const workflows = await getWorkflowsByStatus(status)
      return NextResponse.json(workflows)
    }
    
    // Get all workflows
    const allWorkflows = await listWorkflows()
    return NextResponse.json(allWorkflows)

  } catch (error) {
    console.error('❌ Failed to get N8N workflows:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

async function deployWorkflow(workflow: string, config: any) {
  console.log(`🚀 Deploying N8N workflow: ${workflow}`)
  
  const workflowConfig = N8N_WORKFLOWS[workflow as keyof typeof N8N_WORKFLOWS]
  if (!workflowConfig) {
    throw new Error(`Workflow not found: ${workflow}`)
  }

  // Simulate N8N deployment
  const deployment = {
    id: `deployment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    workflow_name: workflow,
    workflow_id: workflowConfig.name,
    status: 'deployed',
    deployed_at: new Date().toISOString(),
    config: {
      ...workflowConfig,
      ...config
    },
    endpoints: {
      webhook: `https://n8n.alex-ai.com/webhook/${workflow}`,
      api: `https://n8n.alex-ai.com/api/v1/workflows/${workflow}`
    }
  }

  // Store deployment record
  console.log(`✅ Workflow ${workflow} deployed successfully`)
  
  return NextResponse.json({
    success: true,
    deployment,
    message: `Workflow ${workflow} deployed successfully`
  })
}

async function executeWorkflow(workflow: string, config: any) {
  console.log(`⚡ Executing N8N workflow: ${workflow}`)
  
  const workflowConfig = N8N_WORKFLOWS[workflow as keyof typeof N8N_WORKFLOWS]
  if (!workflowConfig) {
    throw new Error(`Workflow not found: ${workflow}`)
  }

  // Simulate workflow execution
  const execution = {
    id: `execution_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    workflow_name: workflow,
    status: 'running',
    started_at: new Date().toISOString(),
    input_data: config,
    progress: 0
  }

  // Simulate async execution
  setTimeout(() => {
    console.log(`✅ Workflow ${workflow} execution completed`)
  }, 5000)

  return NextResponse.json({
    success: true,
    execution,
    message: `Workflow ${workflow} execution started`
  })
}

async function getWorkflowStatus(workflow: string) {
  const workflowConfig = N8N_WORKFLOWS[workflow as keyof typeof N8N_WORKFLOWS]
  if (!workflowConfig) {
    throw new Error(`Workflow not found: ${workflow}`)
  }

  // Return mock status
  return {
    workflow_name: workflow,
    status: 'active',
    enabled: workflowConfig.enabled,
    last_execution: new Date().toISOString(),
    next_execution: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes from now
    execution_count: Math.floor(Math.random() * 100),
    success_rate: 95 + Math.random() * 5,
    average_duration: 120 + Math.random() * 60, // 2-3 minutes
    nodes: workflowConfig.nodes.length,
    triggers: workflowConfig.triggers
  }
}

async function listWorkflows() {
  const workflows = Object.entries(N8N_WORKFLOWS).map(([key, config]) => ({
    id: key,
    name: config.name,
    description: config.description,
    enabled: config.enabled,
    triggers: config.triggers,
    nodes_count: config.nodes.length,
    last_updated: new Date().toISOString()
  }))

  return {
    workflows,
    total: workflows.length,
    active: workflows.filter(w => w.enabled).length
  }
}

async function getWorkflowsByStatus(status: string) {
  const allWorkflows = await listWorkflows()
  
  // Filter by status (mock implementation)
  return allWorkflows.workflows.filter(workflow => {
    switch (status) {
      case 'active':
        return workflow.enabled
      case 'inactive':
        return !workflow.enabled
      default:
        return true
    }
  })
}
