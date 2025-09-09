# Manual n8n Workflow Activation Guide

## 🚨 **IMMEDIATE ACTION REQUIRED**

Based on the n8n dashboard screenshot, you need to manually resolve the webhook conflicts and activate the workflows.

## 🔍 **Current Issue**

The `LLM_Democratic_Collaboration` workflow is using the webhook path `/webhook/llm-collaboration`, which conflicts with our new workflows.

## 📋 **Step-by-Step Solution**

### **Step 1: Deactivate Conflicting Workflow**
1. Go to: https://n8n.pbradygeorgen.com
2. Find the workflow: **"LLM_Democratic_Collaboration"** (the one that's currently active)
3. Click the **toggle switch** to deactivate it (turn it OFF)
4. This will resolve the webhook path conflict

### **Step 2: Import New Workflows**
1. In the n8n dashboard, click **"Create Workflow"**
2. Click **"Import from file"** or **"Import from URL"**
3. Import each of these files in order:
   - `n8n-workflow-job-opportunities-optimized.json`
   - `n8n-workflow-contacts-optimized.json`
   - `n8n-workflow-resume-analysis-optimized.json`
   - `n8n-workflow-mcp-request-optimized.json`

### **Step 3: Activate New Workflows**
1. After importing each workflow, click the **toggle switch** to activate it
2. Verify each workflow shows **"Active"** status
3. Test the webhook endpoints using the commands below

## 🧪 **Testing Commands**

Run these commands to test each endpoint:

```bash
# Test Job Opportunities
curl -X POST https://n8n.pbradygeorgen.com/webhook/alex-ai-job-opportunities \
  -H "X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'

# Test Contacts
curl -X POST https://n8n.pbradygeorgen.com/webhook/alex-ai-contacts \
  -H "X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'

# Test Resume Analysis
curl -X POST https://n8n.pbradygeorgen.com/webhook/alex-ai-resume-analysis \
  -H "X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw" \
  -H "Content-Type: application/json" \
  -d '{"action": "get_all", "timestamp": "2025-09-05T04:17:32.000Z", "source": "test"}'

# Test MCP Request
curl -X POST https://n8n.pbradygeorgen.com/webhook/alex-ai-mcp-request \
  -H "X-N8N-API-KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.API_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERAPI_KEY_PLACEHOLDERMjIyfQ.wFPf3jA0X2zdNkaPqoPzTEAE-MsS-XcM6Gk20KYr4Dw" \
  -H "Content-Type: application/json" \
  -d '{"method": "ping", "params": {}, "context": {"session_id": "test"}}'
```

## ✅ **Success Indicators**

- All workflows show **"Active"** status in n8n dashboard
- All test commands return **200 OK** with JSON responses
- No webhook path conflicts in n8n dashboard
- System test shows **100% success rate**

## 🔄 **After Activation**

Run the system test to verify everything is working:

```bash
node test-system-simple.js
```

Expected result: **100% success rate**

## 📁 **Workflow Files Location**

The optimized workflow files are in your current directory:
- `n8n-workflow-job-opportunities-optimized.json`
- `n8n-workflow-contacts-optimized.json`
- `n8n-workflow-resume-analysis-optimized.json`
- `n8n-workflow-mcp-request-optimized.json`

## 🎯 **Quick Summary**

1. **Deactivate** `LLM_Democratic_Collaboration` workflow
2. **Import** the 4 optimized workflow JSON files
3. **Activate** all new workflows
4. **Test** with the provided curl commands
5. **Verify** with `node test-system-simple.js`

This should resolve the webhook conflicts and get your system working at 100%!

