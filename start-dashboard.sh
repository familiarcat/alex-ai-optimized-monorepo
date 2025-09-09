#!/bin/bash
echo "📊 Starting N8N Sync Dashboard..."
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080 --directory scripts
    echo "Dashboard available at: http://localhost:8080/n8n-sync-dashboard.html"
else
    echo "Python 3 not available. Please open scripts/n8n-sync-dashboard.html in your browser"
fi
