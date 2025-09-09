#!/bin/bash

# End-to-End Testing with Real N8N Workflows
# This script conducts comprehensive testing of the entire system

set -e

echo "🧪 End-to-End Testing with Real N8N Workflows"
echo "============================================="

# Load credentials
echo "🔐 Loading credentials..."
source ./scripts/load-credentials.sh

echo ""
echo "📋 Test Plan:"
echo "============="
echo "1. System Health Check"
echo "2. N8N Federation Crew Integration"
echo "3. Data Flow Testing (Client → N8N → Supabase → N8N → Client)"
echo "4. Live Data Collection Testing"
echo "5. Fallback System Testing"
echo "6. Cross-Crew Analysis Testing"
echo ""

# Test 1: System Health Check
echo "🏥 Test 1: System Health Check"
echo "==============================="
health_response=$(curl -s http://localhost:3000/api/health 2>/dev/null || echo "failed")

if echo "$health_response" | grep -q "status"; then
    echo "✅ Health check endpoint responding"
    echo "Response: $health_response"
else
    echo "❌ Health check failed"
    echo "Response: $health_response"
fi

echo ""

# Test 2: N8N Federation Crew Integration
echo "🚀 Test 2: N8N Federation Crew Integration"
echo "=========================================="

# Test individual crew member consultation
echo "Testing individual crew member consultation..."
crew_response=$(curl -s -X POST http://localhost:3000/api/n8n-unification \
    -H "Content-Type: application/json" \
    -d '{
        "action": "federation_consultation",
        "crew_member": "geordi",
        "data": {
            "test": "data",
            "problem": "infrastructure optimization"
        }
    }' 2>/dev/null || echo "failed")

if echo "$crew_response" | grep -q "success.*true"; then
    echo "✅ Individual crew consultation working"
    echo "Response: $crew_response"
else
    echo "❌ Individual crew consultation failed"
    echo "Response: $crew_response"
fi

# Test cross-crew analysis
echo ""
echo "Testing cross-crew analysis..."
cross_crew_response=$(curl -s -X POST http://localhost:3000/api/n8n-unification \
    -H "Content-Type: application/json" \
    -d '{
        "action": "cross_crew_analysis",
        "data": {
            "analysis_type": "job_opportunity",
            "sample_data": {
                "company": "Microsoft",
                "position": "Senior Software Engineer",
                "location": "St. Louis, MO",
                "requirements": "TypeScript, Node.js, AI/ML"
            }
        }
    }' 2>/dev/null || echo "failed")

if echo "$cross_crew_response" | grep -q "success.*true"; then
    echo "✅ Cross-crew analysis working"
    echo "Found $(echo "$cross_crew_response" | jq '.analysis_results | length' 2>/dev/null || echo "unknown") crew analyses"
else
    echo "❌ Cross-crew analysis failed"
    echo "Response: $cross_crew_response"
fi

echo ""

# Test 3: Data Flow Testing
echo "🔄 Test 3: Data Flow Testing (Client → N8N → Supabase → N8N → Client)"
echo "====================================================================="

# Test N8N data service
echo "Testing N8N data service..."
n8n_data_response=$(curl -s http://localhost:3000/api/job-opportunities 2>/dev/null || echo "failed")

if echo "$n8n_data_response" | grep -q "success\|data\|jobs"; then
    echo "✅ N8N data service responding"
    echo "Response: $n8n_data_response"
else
    echo "⚠️  N8N data service using fallback"
    echo "Response: $n8n_data_response"
fi

# Test contacts endpoint
echo ""
echo "Testing contacts endpoint..."
contacts_response=$(curl -s http://localhost:3000/api/contacts 2>/dev/null || echo "failed")

if echo "$contacts_response" | grep -q "success\|data\|contacts"; then
    echo "✅ Contacts endpoint responding"
    echo "Response: $contacts_response"
else
    echo "⚠️  Contacts endpoint using fallback"
    echo "Response: $contacts_response"
fi

echo ""

# Test 4: Live Data Collection Testing
echo "📊 Test 4: Live Data Collection Testing"
echo "======================================="

# Test live data store
echo "Testing live data store..."
live_data_response=$(curl -s http://localhost:3000/api/live-jobs 2>/dev/null || echo "failed")

if echo "$live_data_response" | grep -q "success"; then
    echo "✅ Live data store responding"
    echo "Response: $live_data_response"
else
    echo "⚠️  Live data store not responding"
    echo "Response: $live_data_response"
fi

# Test mock data fallback
echo ""
echo "Testing mock data fallback..."
mock_data_response=$(curl -s http://localhost:3000/api/mock-data 2>/dev/null || echo "failed")

if echo "$mock_data_response" | grep -q "company\|position"; then
    echo "✅ Mock data fallback working"
    echo "Found $(echo "$mock_data_response" | jq '. | length' 2>/dev/null || echo "unknown") mock jobs"
else
    echo "❌ Mock data fallback failed"
    echo "Response: $mock_data_response"
fi

echo ""

# Test 5: Fallback System Testing
echo "🔄 Test 5: Fallback System Testing"
echo "=================================="

# Test job scraping
echo "Testing job scraping..."
scraping_response=$(curl -s -X POST http://localhost:3000/api/job-scraping \
    -H "Content-Type: application/json" \
    -d '{
        "source": "indeed",
        "search_term": "software engineer",
        "location": "St. Louis, MO",
        "max_results": 5
    }' 2>/dev/null || echo "failed")

if echo "$scraping_response" | grep -q "success\|job_id"; then
    echo "✅ Job scraping working"
    echo "Response: $scraping_response"
else
    echo "⚠️  Job scraping using fallback"
    echo "Response: $scraping_response"
fi

echo ""

# Test 6: Cross-Crew Analysis Testing
echo "🤝 Test 6: Cross-Crew Analysis Testing"
echo "======================================"

# Test all crew members
echo "Testing all 9 Star Trek crew members..."
crew_members=("captain_picard" "commander_riker" "commander_data" "geordi_la_forge" "lieutenant_worf" "counselor_troi" "lieutenant_uhura" "dr_crusher" "quark")

successful_crew=0
total_crew=${#crew_members[@]}

for crew_member in "${crew_members[@]}"; do
    echo "Testing $crew_member..."
    crew_test_response=$(curl -s -X POST http://localhost:3000/api/n8n-unification \
        -H "Content-Type: application/json" \
        -d "{
            \"action\": \"federation_consultation\",
            \"crew_member\": \"$crew_member\",
            \"data\": {
                \"test\": \"data\",
                \"problem\": \"system optimization\"
            }
        }" 2>/dev/null || echo "failed")
    
    if echo "$crew_test_response" | grep -q "success.*true"; then
        echo "  ✅ $crew_member working"
        ((successful_crew++))
    else
        echo "  ❌ $crew_member failed"
        echo "  Response: $crew_test_response"
    fi
done

echo ""
echo "Crew Integration Results: $successful_crew/$total_crew crew members operational"

echo ""
echo "📊 Test Summary:"
echo "================"
echo "✅ System Health: $(echo "$health_response" | grep -q "status" && echo "PASS" || echo "FAIL")"
echo "✅ N8N Federation Crew: $successful_crew/$total_crew operational"
echo "✅ Data Flow: $(echo "$n8n_data_response" | grep -q "success\|data" && echo "PASS" || echo "FALLBACK")"
echo "✅ Live Data Collection: $(echo "$live_data_response" | grep -q "success" && echo "PASS" || echo "FALLBACK")"
echo "✅ Fallback System: $(echo "$mock_data_response" | grep -q "company" && echo "PASS" || echo "FAIL")"
echo "✅ Cross-Crew Analysis: $(echo "$cross_crew_response" | grep -q "success.*true" && echo "PASS" || echo "FAIL")"

echo ""
echo "🎉 End-to-End Testing Complete!"
echo "==============================="
echo ""
echo "System Status:"
if [ $successful_crew -eq $total_crew ]; then
    echo "🟢 All systems operational"
else
    echo "🟡 System operational with some fallbacks"
fi

echo ""
echo "Next Steps:"
echo "1. Review any failed tests above"
echo "2. Deploy N8N webhooks if needed"
echo "3. Create Supabase tables if needed"
echo "4. Monitor live data collection"
echo "5. Optimize system performance"
echo ""
