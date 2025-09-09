#!/bin/bash

echo "🚀 Starting Unified Webhook Server"
echo "=================================="
echo ""

# Kill any existing processes on port 8002
echo "🧹 Cleaning up port 8002..."
lsof -ti:8002 | xargs kill -9 2>/dev/null || true

# Start the unified server
echo "🚀 Starting unified webhook server..."
nohup node unified-webhook-server.js > unified-server.log 2>&1 &

# Wait for server to start
echo "⏳ Waiting for server to start..."
sleep 3

# Test the server
echo "🧪 Testing server..."
node test-unified-server.js

echo ""
echo "✅ Unified server is ready!"
echo "🔗 Server running on: http://localhost:8002"
echo "📋 Logs: tail -f unified-server.log"
