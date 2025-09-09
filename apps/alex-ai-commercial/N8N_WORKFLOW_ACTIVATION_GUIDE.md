# n8n Workflow Activation Guide

## 🚨 **IMMEDIATE ACTION REQUIRED**

### **Step 1: Resolve Webhook Conflicts**
1. Go to: https://n8n.pbradygeorgen.com
2. Find the workflow: **"LLM_Democratic_Collaboration"**
3. **DEACTIVATE** this workflow (toggle off)
4. This resolves the webhook path conflict

### **Step 2: Import New Workflows**
Import these optimized workflow files:
- `n8n-workflow-job-opportunities-optimized.json`
- `n8n-workflow-contacts-optimized.json`
- `n8n-workflow-resume-analysis-optimized.json`
- `n8n-workflow-mcp-request-optimized.json`

### **Step 3: Activate New Workflows**
1. After importing, activate each workflow
2. Test the endpoints using the commands below

## 🧪 **Testing Commands**

```bash
# Test Job Opportunities
curl -X POST https://n8n.pbradygeorgen.com/webhook/alex-ai-job-opportunities \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'

# Test Contacts
curl -X POST https://n8n.pbradygeorgen.com/webhook/alex-ai-contacts \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'

# Test MCP Request
curl -X POST https://n8n.pbradygeorgen.com/webhook/alex-ai-mcp-request \
  -H "X-N8N-API-KEY: your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}, "context": {"session_id": "test"}}'
```

## ✅ **Success Indicators**
- All workflows show "Active" status
- All test commands return 200 OK
- No webhook path conflicts in n8n dashboard

## 🔄 **After Activation**
Run the system test:
```bash
node test-system-simple.js
```

Expected result: 100% success rate
