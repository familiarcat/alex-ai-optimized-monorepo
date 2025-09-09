#!/bin/bash

echo "🚀 Installing n8n Webhook Proxy"
echo "================================"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install express axios cors dotenv

echo ""
echo "✅ Installation complete!"
echo ""
echo "🚀 To start the proxy server:"
echo "   node n8n-webhook-proxy.js"
echo ""
echo "🧪 To test the proxy:"
echo "   curl http://localhost:8001/health"
echo ""
echo "🔗 Proxy endpoints will be available at:"
echo "   http://localhost:8001/webhook/alex-ai-job-opportunities"
echo "   http://localhost:8001/webhook/alex-ai-resume-analysis"
echo "   http://localhost:8001/webhook/alex-ai-mcp-request"
echo "   http://localhost:8001/webhook/alex-ai-contacts"
