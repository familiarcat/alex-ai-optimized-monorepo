#!/bin/bash
echo "📊 N8N Sync Status"
echo "=================="
echo ""

if [ -f "n8n-sync-dashboard.json" ]; then
    echo "Dashboard Data:"
    python3 -c "
import json
try:
    with open('n8n-sync-dashboard.json', 'r') as f:
        data = json.load(f)
    sync_status = data.get('sync_status', {})
    print(f'  Health: {\"✅ Healthy\" if sync_status.get(\"is_healthy\") else \"❌ Unhealthy\"}')
    print(f'  Last Sync: {sync_status.get(\"last_sync\", \"Never\")}')
    print(f'  Workflows: {sync_status.get(\"active_workflows\", 0)}/{sync_status.get(\"total_workflows\", 0)}')
    print(f'  Errors (24h): {sync_status.get(\"sync_errors\", 0)}')
except Exception as e:
    print(f'  Error reading dashboard data: {e}')
"
else
    echo "No dashboard data available"
fi

echo ""
echo "Recent Sync Operations:"
if [ -f "n8n-sync-history.json" ]; then
    python3 -c "
import json
try:
    with open('n8n-sync-history.json', 'r') as f:
        data = json.load(f)
    operations = data.get('sync_operations', [])
    for op in operations[-5:]:
        print(f'  {op.get(\"timestamp\", \"Unknown\")} - {op.get(\"operation\", \"Unknown\")} - {op.get(\"workflow_name\", \"Unknown\")}')
except Exception as e:
    print(f'  Error reading sync history: {e}')
"
else
    echo "  No sync history available"
fi
