# n8n Workflow Deployment Instructions

## 🚀 Quick Deployment

1. **Access n8n Dashboard**
   - Go to: https://n8n.pbradygeorgen.com
   - Login with your credentials

2. **Import Workflows**
   - Click "Import from file" or "Import from URL"
   - Import each workflow JSON file:
     - `n8n-workflow-job-opportunities.json`
     - `n8n-workflow-contacts.json`
     - `n8n-workflow-resume-analysis.json`
     - `n8n-workflow-mcp-request.json`

3. **Configure Supabase Connection**
   - For each workflow, configure the Supabase node
   - Use your Supabase credentials from ~/.zshrc
   - Test the connection

4. **Activate Workflows**
   - Toggle each workflow to "Active"
   - Test the webhook endpoints

## 🔧 Manual Configuration

### Job Opportunities Workflow
- **Webhook URL**: `https://n8n.pbradygeorgen.com/webhook/job-opportunities`
- **Method**: POST
- **Authentication**: X-N8N-API-KEY header

### Contacts Workflow
- **Webhook URL**: `https://n8n.pbradygeorgen.com/webhook/contacts`
- **Method**: POST
- **Authentication**: X-N8N-API-KEY header

### Resume Analysis Workflow
- **Webhook URL**: `https://n8n.pbradygeorgen.com/webhook/resume-analysis`
- **Method**: POST
- **Authentication**: X-N8N-API-KEY header

### MCP Request Workflow
- **Webhook URL**: `https://n8n.pbradygeorgen.com/webhook/mcp-request`
- **Method**: POST
- **Authentication**: X-N8N-API-KEY header

## 🧪 Testing

After deployment, test each endpoint:

```bash
# Test job opportunities
curl -X POST https://n8n.pbradygeorgen.com/webhook/job-opportunities \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'

# Test contacts
curl -X POST https://n8n.pbradygeorgen.com/webhook/contacts \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'

# Test MCP request
curl -X POST https://n8n.pbradygeorgen.com/webhook/mcp-request \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}, "context": {"session_id": "test"}}'
```

## 📊 Monitoring

- Check workflow executions in n8n dashboard
- Monitor webhook response times
- Review error logs for any issues
- Test data flow from Supabase to application

## 🔄 Updates

To update workflows:
1. Export current workflow from n8n
2. Modify the JSON configuration
3. Import updated workflow
4. Test the changes
5. Activate if successful
