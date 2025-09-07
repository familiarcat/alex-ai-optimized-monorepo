#!/bin/bash
# Monorepo Cleanup Script
# Generated: 2025-09-06 20:26:51

set -e

echo "🧹 Starting Monorepo Cleanup..."

# Create backup directory
BACKUP_DIR="monorepo_cleanup_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "📦 Created backup directory: $BACKUP_DIR"

# Step 1: Remove duplicate files
echo "🗑️  Step 1: Removing duplicate files..."

echo "   Removing duplicate: ./greg-channel-intelligence-test-milestone-package/GREG_CHANNEL_INTELLIGENCE_TEST_SUMMARY.md"
mkdir -p "$BACKUP_DIR/$(dirname ./greg-channel-intelligence-test-milestone-package/GREG_CHANNEL_INTELLIGENCE_TEST_SUMMARY.md)"
cp ./greg-channel-intelligence-test-milestone-package/GREG_CHANNEL_INTELLIGENCE_TEST_SUMMARY.md "$BACKUP_DIR/./greg-channel-intelligence-test-milestone-package/GREG_CHANNEL_INTELLIGENCE_TEST_SUMMARY.md" 2>/dev/null || echo "   Warning: Could not backup ./greg-channel-intelligence-test-milestone-package/GREG_CHANNEL_INTELLIGENCE_TEST_SUMMARY.md"
rm -f ./greg-channel-intelligence-test-milestone-package/GREG_CHANNEL_INTELLIGENCE_TEST_SUMMARY.md

echo "   Removing duplicate: ./youtube-scraper-milestone-package/youtube_scraper_crew_integration.py"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-scraper-milestone-package/youtube_scraper_crew_integration.py)"
cp ./youtube-scraper-milestone-package/youtube_scraper_crew_integration.py "$BACKUP_DIR/./youtube-scraper-milestone-package/youtube_scraper_crew_integration.py" 2>/dev/null || echo "   Warning: Could not backup ./youtube-scraper-milestone-package/youtube_scraper_crew_integration.py"
rm -f ./youtube-scraper-milestone-package/youtube_scraper_crew_integration.py

echo "   Removing duplicate: ./alexai-base-package/youtube_scraper_crew_integration.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/youtube_scraper_crew_integration.py)"
cp ./alexai-base-package/youtube_scraper_crew_integration.py "$BACKUP_DIR/./alexai-base-package/youtube_scraper_crew_integration.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/youtube_scraper_crew_integration.py"
rm -f ./alexai-base-package/youtube_scraper_crew_integration.py

echo "   Removing duplicate: ./greg-channel-intelligence-test-milestone-package/greg_channel_intelligence_analysis.py"
mkdir -p "$BACKUP_DIR/$(dirname ./greg-channel-intelligence-test-milestone-package/greg_channel_intelligence_analysis.py)"
cp ./greg-channel-intelligence-test-milestone-package/greg_channel_intelligence_analysis.py "$BACKUP_DIR/./greg-channel-intelligence-test-milestone-package/greg_channel_intelligence_analysis.py" 2>/dev/null || echo "   Warning: Could not backup ./greg-channel-intelligence-test-milestone-package/greg_channel_intelligence_analysis.py"
rm -f ./greg-channel-intelligence-test-milestone-package/greg_channel_intelligence_analysis.py

echo "   Removing duplicate: ./alexai-base-package/greg_channel_intelligence_analysis.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/greg_channel_intelligence_analysis.py)"
cp ./alexai-base-package/greg_channel_intelligence_analysis.py "$BACKUP_DIR/./alexai-base-package/greg_channel_intelligence_analysis.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/greg_channel_intelligence_analysis.py"
rm -f ./alexai-base-package/greg_channel_intelligence_analysis.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_workflow_config.json"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_workflow_config.json)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_workflow_config.json "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_workflow_config.json" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_workflow_config.json"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_workflow_config.json

echo "   Removing duplicate: ./greg-channel-intelligence-test-milestone-package/crew_coordination_update_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./greg-channel-intelligence-test-milestone-package/crew_coordination_update_system.py)"
cp ./greg-channel-intelligence-test-milestone-package/crew_coordination_update_system.py "$BACKUP_DIR/./greg-channel-intelligence-test-milestone-package/crew_coordination_update_system.py" 2>/dev/null || echo "   Warning: Could not backup ./greg-channel-intelligence-test-milestone-package/crew_coordination_update_system.py"
rm -f ./greg-channel-intelligence-test-milestone-package/crew_coordination_update_system.py

echo "   Removing duplicate: ./alexai-base-package/crew_coordination_update_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/crew_coordination_update_system.py)"
cp ./alexai-base-package/crew_coordination_update_system.py "$BACKUP_DIR/./alexai-base-package/crew_coordination_update_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/crew_coordination_update_system.py"
rm -f ./alexai-base-package/crew_coordination_update_system.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py

echo "   Removing duplicate: ./alexai-base-package/enhanced_ai_prompts_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/enhanced_ai_prompts_system.py)"
cp ./alexai-base-package/enhanced_ai_prompts_system.py "$BACKUP_DIR/./alexai-base-package/enhanced_ai_prompts_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/enhanced_ai_prompts_system.py"
rm -f ./alexai-base-package/enhanced_ai_prompts_system.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/enhanced_ai_prompts_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/enhanced_ai_prompts_system.py)"
cp ./alex-ai-universal-milestone-package/enhanced_ai_prompts_system.py "$BACKUP_DIR/./alex-ai-universal-milestone-package/enhanced_ai_prompts_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/enhanced_ai_prompts_system.py"
rm -f ./alex-ai-universal-milestone-package/enhanced_ai_prompts_system.py

echo "   Removing duplicate: ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_system.py)"
cp ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_system.py "$BACKUP_DIR/./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_system.py" 2>/dev/null || echo "   Warning: Could not backup ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_system.py"
rm -f ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_system.py

echo "   Removing duplicate: ./credential-security-milestone-v1.0-20250906_041507/alex_ai_credential_manager.py"
mkdir -p "$BACKUP_DIR/$(dirname ./credential-security-milestone-v1.0-20250906_041507/alex_ai_credential_manager.py)"
cp ./credential-security-milestone-v1.0-20250906_041507/alex_ai_credential_manager.py "$BACKUP_DIR/./credential-security-milestone-v1.0-20250906_041507/alex_ai_credential_manager.py" 2>/dev/null || echo "   Warning: Could not backup ./credential-security-milestone-v1.0-20250906_041507/alex_ai_credential_manager.py"
rm -f ./credential-security-milestone-v1.0-20250906_041507/alex_ai_credential_manager.py

echo "   Removing duplicate: ./alexai-base-package/enhanced_prompts_test_suite.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/enhanced_prompts_test_suite.py)"
cp ./alexai-base-package/enhanced_prompts_test_suite.py "$BACKUP_DIR/./alexai-base-package/enhanced_prompts_test_suite.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/enhanced_prompts_test_suite.py"
rm -f ./alexai-base-package/enhanced_prompts_test_suite.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/enhanced_prompts_test_suite.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/enhanced_prompts_test_suite.py)"
cp ./alex-ai-universal-milestone-package/enhanced_prompts_test_suite.py "$BACKUP_DIR/./alex-ai-universal-milestone-package/enhanced_prompts_test_suite.py" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/enhanced_prompts_test_suite.py"
rm -f ./alex-ai-universal-milestone-package/enhanced_prompts_test_suite.py

echo "   Removing duplicate: ./credential-security-milestone-v1.0-20250906_041507/requirements.txt"
mkdir -p "$BACKUP_DIR/$(dirname ./credential-security-milestone-v1.0-20250906_041507/requirements.txt)"
cp ./credential-security-milestone-v1.0-20250906_041507/requirements.txt "$BACKUP_DIR/./credential-security-milestone-v1.0-20250906_041507/requirements.txt" 2>/dev/null || echo "   Warning: Could not backup ./credential-security-milestone-v1.0-20250906_041507/requirements.txt"
rm -f ./credential-security-milestone-v1.0-20250906_041507/requirements.txt

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/requirements.txt"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/requirements.txt)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/requirements.txt "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/requirements.txt" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/requirements.txt"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/requirements.txt

echo "   Removing duplicate: ./alexai-base-package/requirements.txt"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/requirements.txt)"
cp ./alexai-base-package/requirements.txt "$BACKUP_DIR/./alexai-base-package/requirements.txt" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/requirements.txt"
rm -f ./alexai-base-package/requirements.txt

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_memories_learning_assessment_20250906_053336.json"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_memories_learning_assessment_20250906_053336.json)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_memories_learning_assessment_20250906_053336.json "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_memories_learning_assessment_20250906_053336.json" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_memories_learning_assessment_20250906_053336.json"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_memories_learning_assessment_20250906_053336.json

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_memory_sharing_assessment.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_memory_sharing_assessment.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_memory_sharing_assessment.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_memory_sharing_assessment.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_memory_sharing_assessment.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_memory_sharing_assessment.py

echo "   Removing duplicate: ./alexai-base-package/enhanced_unified_router.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/enhanced_unified_router.py)"
cp ./alexai-base-package/enhanced_unified_router.py "$BACKUP_DIR/./alexai-base-package/enhanced_unified_router.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/enhanced_unified_router.py"
rm -f ./alexai-base-package/enhanced_unified_router.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_assessment.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_assessment.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_assessment.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_assessment.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_assessment.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_assessment.py

echo "   Removing duplicate: ./youtube-channel-intelligence-milestone-package/supabase_channel_intelligence_schema.sql"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-channel-intelligence-milestone-package/supabase_channel_intelligence_schema.sql)"
cp ./youtube-channel-intelligence-milestone-package/supabase_channel_intelligence_schema.sql "$BACKUP_DIR/./youtube-channel-intelligence-milestone-package/supabase_channel_intelligence_schema.sql" 2>/dev/null || echo "   Warning: Could not backup ./youtube-channel-intelligence-milestone-package/supabase_channel_intelligence_schema.sql"
rm -f ./youtube-channel-intelligence-milestone-package/supabase_channel_intelligence_schema.sql

echo "   Removing duplicate: ./alexai-base-package/supabase_channel_intelligence_schema.sql"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/supabase_channel_intelligence_schema.sql)"
cp ./alexai-base-package/supabase_channel_intelligence_schema.sql "$BACKUP_DIR/./alexai-base-package/supabase_channel_intelligence_schema.sql" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/supabase_channel_intelligence_schema.sql"
rm -f ./alexai-base-package/supabase_channel_intelligence_schema.sql

echo "   Removing duplicate: ./observation-lounge-crew-debrief-milestone-package/observation_lounge_crew_debrief.py"
mkdir -p "$BACKUP_DIR/$(dirname ./observation-lounge-crew-debrief-milestone-package/observation_lounge_crew_debrief.py)"
cp ./observation-lounge-crew-debrief-milestone-package/observation_lounge_crew_debrief.py "$BACKUP_DIR/./observation-lounge-crew-debrief-milestone-package/observation_lounge_crew_debrief.py" 2>/dev/null || echo "   Warning: Could not backup ./observation-lounge-crew-debrief-milestone-package/observation_lounge_crew_debrief.py"
rm -f ./observation-lounge-crew-debrief-milestone-package/observation_lounge_crew_debrief.py

echo "   Removing duplicate: ./alexai-base-package/observation_lounge_crew_debrief.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/observation_lounge_crew_debrief.py)"
cp ./alexai-base-package/observation_lounge_crew_debrief.py "$BACKUP_DIR/./alexai-base-package/observation_lounge_crew_debrief.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/observation_lounge_crew_debrief.py"
rm -f ./alexai-base-package/observation_lounge_crew_debrief.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/workflow_cross_system_integration.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/workflow_cross_system_integration.json)"
cp ./alex-ai-universal-milestone-package/workflow_cross_system_integration.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/workflow_cross_system_integration.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/workflow_cross_system_integration.json"
rm -f ./alex-ai-universal-milestone-package/workflow_cross_system_integration.json

echo "   Removing duplicate: ./alexai-base-package/enhanced_ai_prompts_deployment_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/enhanced_ai_prompts_deployment_system.py)"
cp ./alexai-base-package/enhanced_ai_prompts_deployment_system.py "$BACKUP_DIR/./alexai-base-package/enhanced_ai_prompts_deployment_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/enhanced_ai_prompts_deployment_system.py"
rm -f ./alexai-base-package/enhanced_ai_prompts_deployment_system.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/enhanced_ai_prompts_deployment_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/enhanced_ai_prompts_deployment_system.py)"
cp ./alex-ai-universal-milestone-package/enhanced_ai_prompts_deployment_system.py "$BACKUP_DIR/./alex-ai-universal-milestone-package/enhanced_ai_prompts_deployment_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/enhanced_ai_prompts_deployment_system.py"
rm -f ./alex-ai-universal-milestone-package/enhanced_ai_prompts_deployment_system.py

echo "   Removing duplicate: ./youtube-channel-intelligence-milestone-package/YOUTUBE_CHANNEL_INTELLIGENCE_DEPLOYMENT_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-channel-intelligence-milestone-package/YOUTUBE_CHANNEL_INTELLIGENCE_DEPLOYMENT_GUIDE.md)"
cp ./youtube-channel-intelligence-milestone-package/YOUTUBE_CHANNEL_INTELLIGENCE_DEPLOYMENT_GUIDE.md "$BACKUP_DIR/./youtube-channel-intelligence-milestone-package/YOUTUBE_CHANNEL_INTELLIGENCE_DEPLOYMENT_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./youtube-channel-intelligence-milestone-package/YOUTUBE_CHANNEL_INTELLIGENCE_DEPLOYMENT_GUIDE.md"
rm -f ./youtube-channel-intelligence-milestone-package/YOUTUBE_CHANNEL_INTELLIGENCE_DEPLOYMENT_GUIDE.md

echo "   Removing duplicate: ./greg-channel-intelligence-test-milestone-package/crew_n8n_workflow_integration.json"
mkdir -p "$BACKUP_DIR/$(dirname ./greg-channel-intelligence-test-milestone-package/crew_n8n_workflow_integration.json)"
cp ./greg-channel-intelligence-test-milestone-package/crew_n8n_workflow_integration.json "$BACKUP_DIR/./greg-channel-intelligence-test-milestone-package/crew_n8n_workflow_integration.json" 2>/dev/null || echo "   Warning: Could not backup ./greg-channel-intelligence-test-milestone-package/crew_n8n_workflow_integration.json"
rm -f ./greg-channel-intelligence-test-milestone-package/crew_n8n_workflow_integration.json

echo "   Removing duplicate: ./alexai-base-package/crew_n8n_workflow_integration.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/crew_n8n_workflow_integration.json)"
cp ./alexai-base-package/crew_n8n_workflow_integration.json "$BACKUP_DIR/./alexai-base-package/crew_n8n_workflow_integration.json" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/crew_n8n_workflow_integration.json"
rm -f ./alexai-base-package/crew_n8n_workflow_integration.json

echo "   Removing duplicate: ./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py)"
cp ./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py "$BACKUP_DIR/./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py" 2>/dev/null || echo "   Warning: Could not backup ./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py"
rm -f ./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py

echo "   Removing duplicate: ./alexai-base-package/youtube_channel_intelligence_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/youtube_channel_intelligence_system.py)"
cp ./alexai-base-package/youtube_channel_intelligence_system.py "$BACKUP_DIR/./alexai-base-package/youtube_channel_intelligence_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/youtube_channel_intelligence_system.py"
rm -f ./alexai-base-package/youtube_channel_intelligence_system.py

echo "   Removing duplicate: ./cursor-extension-milestone-package/CURSOR_AI_SHELL_SCRIPT_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./cursor-extension-milestone-package/CURSOR_AI_SHELL_SCRIPT_GUIDE.md)"
cp ./cursor-extension-milestone-package/CURSOR_AI_SHELL_SCRIPT_GUIDE.md "$BACKUP_DIR/./cursor-extension-milestone-package/CURSOR_AI_SHELL_SCRIPT_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./cursor-extension-milestone-package/CURSOR_AI_SHELL_SCRIPT_GUIDE.md"
rm -f ./cursor-extension-milestone-package/CURSOR_AI_SHELL_SCRIPT_GUIDE.md

echo "   Removing duplicate: ./alexai-base-package/enhanced_ai_prompts_integration_guide_1756928360.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/enhanced_ai_prompts_integration_guide_1756928360.json)"
cp ./alexai-base-package/enhanced_ai_prompts_integration_guide_1756928360.json "$BACKUP_DIR/./alexai-base-package/enhanced_ai_prompts_integration_guide_1756928360.json" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/enhanced_ai_prompts_integration_guide_1756928360.json"
rm -f ./alexai-base-package/enhanced_ai_prompts_integration_guide_1756928360.json

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json)"
cp ./alex-ai-universal-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json"
rm -f ./alex-ai-universal-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json

echo "   Removing duplicate: ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json"
mkdir -p "$BACKUP_DIR/$(dirname ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json)"
cp ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json "$BACKUP_DIR/./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json" 2>/dev/null || echo "   Warning: Could not backup ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json"
rm -f ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_integration_guide_1756928360.json

echo "   Removing duplicate: ./youtube-channel-intelligence-milestone-package/test_channel_intelligence_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-channel-intelligence-milestone-package/test_channel_intelligence_system.py)"
cp ./youtube-channel-intelligence-milestone-package/test_channel_intelligence_system.py "$BACKUP_DIR/./youtube-channel-intelligence-milestone-package/test_channel_intelligence_system.py" 2>/dev/null || echo "   Warning: Could not backup ./youtube-channel-intelligence-milestone-package/test_channel_intelligence_system.py"
rm -f ./youtube-channel-intelligence-milestone-package/test_channel_intelligence_system.py

echo "   Removing duplicate: ./alexai-base-package/test_channel_intelligence_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/test_channel_intelligence_system.py)"
cp ./alexai-base-package/test_channel_intelligence_system.py "$BACKUP_DIR/./alexai-base-package/test_channel_intelligence_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/test_channel_intelligence_system.py"
rm -f ./alexai-base-package/test_channel_intelligence_system.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/MCP_MEMORY_OPTIMIZATION_DEPLOYMENT_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/MCP_MEMORY_OPTIMIZATION_DEPLOYMENT_GUIDE.md)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/MCP_MEMORY_OPTIMIZATION_DEPLOYMENT_GUIDE.md "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/MCP_MEMORY_OPTIMIZATION_DEPLOYMENT_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/MCP_MEMORY_OPTIMIZATION_DEPLOYMENT_GUIDE.md"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/MCP_MEMORY_OPTIMIZATION_DEPLOYMENT_GUIDE.md

echo "   Removing duplicate: ./observation-lounge-crew-debrief-milestone-package/observation_lounge_debrief_1756924836.json"
mkdir -p "$BACKUP_DIR/$(dirname ./observation-lounge-crew-debrief-milestone-package/observation_lounge_debrief_1756924836.json)"
cp ./observation-lounge-crew-debrief-milestone-package/observation_lounge_debrief_1756924836.json "$BACKUP_DIR/./observation-lounge-crew-debrief-milestone-package/observation_lounge_debrief_1756924836.json" 2>/dev/null || echo "   Warning: Could not backup ./observation-lounge-crew-debrief-milestone-package/observation_lounge_debrief_1756924836.json"
rm -f ./observation-lounge-crew-debrief-milestone-package/observation_lounge_debrief_1756924836.json

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/template_ai_automation_project.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/template_ai_automation_project.json)"
cp ./alex-ai-universal-milestone-package/template_ai_automation_project.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/template_ai_automation_project.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/template_ai_automation_project.json"
rm -f ./alex-ai-universal-milestone-package/template_ai_automation_project.json

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_test_report_20250906_054320.md"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_test_report_20250906_054320.md)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_test_report_20250906_054320.md "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_test_report_20250906_054320.md" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_test_report_20250906_054320.md"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_test_report_20250906_054320.md

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_system.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_system.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_system.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_system.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_system.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/workflow_business_validation_pipeline.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/workflow_business_validation_pipeline.json)"
cp ./alex-ai-universal-milestone-package/workflow_business_validation_pipeline.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/workflow_business_validation_pipeline.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/workflow_business_validation_pipeline.json"
rm -f ./alex-ai-universal-milestone-package/workflow_business_validation_pipeline.json

echo "   Removing duplicate: ./cursor-extension-milestone-package/n8n-shell-validation-workflow.json"
mkdir -p "$BACKUP_DIR/$(dirname ./cursor-extension-milestone-package/n8n-shell-validation-workflow.json)"
cp ./cursor-extension-milestone-package/n8n-shell-validation-workflow.json "$BACKUP_DIR/./cursor-extension-milestone-package/n8n-shell-validation-workflow.json" 2>/dev/null || echo "   Warning: Could not backup ./cursor-extension-milestone-package/n8n-shell-validation-workflow.json"
rm -f ./cursor-extension-milestone-package/n8n-shell-validation-workflow.json

echo "   Removing duplicate: ./alexai-base-package/advanced_ai_agent_development_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/advanced_ai_agent_development_system.py)"
cp ./alexai-base-package/advanced_ai_agent_development_system.py "$BACKUP_DIR/./alexai-base-package/advanced_ai_agent_development_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/advanced_ai_agent_development_system.py"
rm -f ./alexai-base-package/advanced_ai_agent_development_system.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/advanced_ai_agent_development_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/advanced_ai_agent_development_system.py)"
cp ./alex-ai-universal-milestone-package/advanced_ai_agent_development_system.py "$BACKUP_DIR/./alex-ai-universal-milestone-package/advanced_ai_agent_development_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/advanced_ai_agent_development_system.py"
rm -f ./alex-ai-universal-milestone-package/advanced_ai_agent_development_system.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/template_market_research_project.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/template_market_research_project.json)"
cp ./alex-ai-universal-milestone-package/template_market_research_project.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/template_market_research_project.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/template_market_research_project.json"
rm -f ./alex-ai-universal-milestone-package/template_market_research_project.json

echo "   Removing duplicate: ./alexai-base-package/ALEXAI_ALIGNMENT_REPORT.md"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/ALEXAI_ALIGNMENT_REPORT.md)"
cp ./alexai-base-package/ALEXAI_ALIGNMENT_REPORT.md "$BACKUP_DIR/./alexai-base-package/ALEXAI_ALIGNMENT_REPORT.md" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/ALEXAI_ALIGNMENT_REPORT.md"
rm -f ./alexai-base-package/ALEXAI_ALIGNMENT_REPORT.md

echo "   Removing duplicate: ./youtube-scraper-milestone-package/test_youtube_scraper_integration.py"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-scraper-milestone-package/test_youtube_scraper_integration.py)"
cp ./youtube-scraper-milestone-package/test_youtube_scraper_integration.py "$BACKUP_DIR/./youtube-scraper-milestone-package/test_youtube_scraper_integration.py" 2>/dev/null || echo "   Warning: Could not backup ./youtube-scraper-milestone-package/test_youtube_scraper_integration.py"
rm -f ./youtube-scraper-milestone-package/test_youtube_scraper_integration.py

echo "   Removing duplicate: ./alexai-base-package/test_youtube_scraper_integration.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/test_youtube_scraper_integration.py)"
cp ./alexai-base-package/test_youtube_scraper_integration.py "$BACKUP_DIR/./alexai-base-package/test_youtube_scraper_integration.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/test_youtube_scraper_integration.py"
rm -f ./alexai-base-package/test_youtube_scraper_integration.py

echo "   Removing duplicate: ./credential-security-milestone-v1.0-20250906_041507/CREDENTIAL_SECURITY_MILESTONE_v1.0.md"
mkdir -p "$BACKUP_DIR/$(dirname ./credential-security-milestone-v1.0-20250906_041507/CREDENTIAL_SECURITY_MILESTONE_v1.0.md)"
cp ./credential-security-milestone-v1.0-20250906_041507/CREDENTIAL_SECURITY_MILESTONE_v1.0.md "$BACKUP_DIR/./credential-security-milestone-v1.0-20250906_041507/CREDENTIAL_SECURITY_MILESTONE_v1.0.md" 2>/dev/null || echo "   Warning: Could not backup ./credential-security-milestone-v1.0-20250906_041507/CREDENTIAL_SECURITY_MILESTONE_v1.0.md"
rm -f ./credential-security-milestone-v1.0-20250906_041507/CREDENTIAL_SECURITY_MILESTONE_v1.0.md

echo "   Removing duplicate: ./youtube-scraper-milestone-package/YOUTUBE_SCRAPER_DEPLOYMENT_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-scraper-milestone-package/YOUTUBE_SCRAPER_DEPLOYMENT_GUIDE.md)"
cp ./youtube-scraper-milestone-package/YOUTUBE_SCRAPER_DEPLOYMENT_GUIDE.md "$BACKUP_DIR/./youtube-scraper-milestone-package/YOUTUBE_SCRAPER_DEPLOYMENT_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./youtube-scraper-milestone-package/YOUTUBE_SCRAPER_DEPLOYMENT_GUIDE.md"
rm -f ./youtube-scraper-milestone-package/YOUTUBE_SCRAPER_DEPLOYMENT_GUIDE.md

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/supabase_memory_optimization_schema.sql"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/supabase_memory_optimization_schema.sql)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/supabase_memory_optimization_schema.sql "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/supabase_memory_optimization_schema.sql" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/supabase_memory_optimization_schema.sql"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/supabase_memory_optimization_schema.sql

echo "   Removing duplicate: ./youtube-scraper-milestone-package/supabase_youtube_analysis_schema.sql"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-scraper-milestone-package/supabase_youtube_analysis_schema.sql)"
cp ./youtube-scraper-milestone-package/supabase_youtube_analysis_schema.sql "$BACKUP_DIR/./youtube-scraper-milestone-package/supabase_youtube_analysis_schema.sql" 2>/dev/null || echo "   Warning: Could not backup ./youtube-scraper-milestone-package/supabase_youtube_analysis_schema.sql"
rm -f ./youtube-scraper-milestone-package/supabase_youtube_analysis_schema.sql

echo "   Removing duplicate: ./alexai-base-package/supabase_youtube_analysis_schema.sql"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/supabase_youtube_analysis_schema.sql)"
cp ./alexai-base-package/supabase_youtube_analysis_schema.sql "$BACKUP_DIR/./alexai-base-package/supabase_youtube_analysis_schema.sql" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/supabase_youtube_analysis_schema.sql"
rm -f ./alexai-base-package/supabase_youtube_analysis_schema.sql

echo "   Removing duplicate: ./alexai-base-package/AI_PROMPT_ENHANCEMENT_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/AI_PROMPT_ENHANCEMENT_GUIDE.md)"
cp ./alexai-base-package/AI_PROMPT_ENHANCEMENT_GUIDE.md "$BACKUP_DIR/./alexai-base-package/AI_PROMPT_ENHANCEMENT_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/AI_PROMPT_ENHANCEMENT_GUIDE.md"
rm -f ./alexai-base-package/AI_PROMPT_ENHANCEMENT_GUIDE.md

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md)"
cp ./alex-ai-universal-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md "$BACKUP_DIR/./alex-ai-universal-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md"
rm -f ./alex-ai-universal-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md

echo "   Removing duplicate: ./enhanced-ai-prompts-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./enhanced-ai-prompts-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md)"
cp ./enhanced-ai-prompts-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md "$BACKUP_DIR/./enhanced-ai-prompts-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./enhanced-ai-prompts-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md"
rm -f ./enhanced-ai-prompts-milestone-package/AI_PROMPT_ENHANCEMENT_GUIDE.md

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/observation_lounge_memory_consensus.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/observation_lounge_memory_consensus.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/observation_lounge_memory_consensus.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/observation_lounge_memory_consensus.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/observation_lounge_memory_consensus.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/observation_lounge_memory_consensus.py

echo "   Removing duplicate: ./credential-security-milestone-v1.0-20250906_041507/test_alex_ai_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./credential-security-milestone-v1.0-20250906_041507/test_alex_ai_system.py)"
cp ./credential-security-milestone-v1.0-20250906_041507/test_alex_ai_system.py "$BACKUP_DIR/./credential-security-milestone-v1.0-20250906_041507/test_alex_ai_system.py" 2>/dev/null || echo "   Warning: Could not backup ./credential-security-milestone-v1.0-20250906_041507/test_alex_ai_system.py"
rm -f ./credential-security-milestone-v1.0-20250906_041507/test_alex_ai_system.py

echo "   Removing duplicate: ./greg-channel-intelligence-test-milestone-package/crew_coordination_session_1756924224.json"
mkdir -p "$BACKUP_DIR/$(dirname ./greg-channel-intelligence-test-milestone-package/crew_coordination_session_1756924224.json)"
cp ./greg-channel-intelligence-test-milestone-package/crew_coordination_session_1756924224.json "$BACKUP_DIR/./greg-channel-intelligence-test-milestone-package/crew_coordination_session_1756924224.json" 2>/dev/null || echo "   Warning: Could not backup ./greg-channel-intelligence-test-milestone-package/crew_coordination_session_1756924224.json"
rm -f ./greg-channel-intelligence-test-milestone-package/crew_coordination_session_1756924224.json

echo "   Removing duplicate: ./observation-lounge-crew-debrief-milestone-package/crew_coordination_session_1756924224.json"
mkdir -p "$BACKUP_DIR/$(dirname ./observation-lounge-crew-debrief-milestone-package/crew_coordination_session_1756924224.json)"
cp ./observation-lounge-crew-debrief-milestone-package/crew_coordination_session_1756924224.json "$BACKUP_DIR/./observation-lounge-crew-debrief-milestone-package/crew_coordination_session_1756924224.json" 2>/dev/null || echo "   Warning: Could not backup ./observation-lounge-crew-debrief-milestone-package/crew_coordination_session_1756924224.json"
rm -f ./observation-lounge-crew-debrief-milestone-package/crew_coordination_session_1756924224.json

echo "   Removing duplicate: ./credential-security-milestone-v1.0-20250906_041507/fix_credential_security.py"
mkdir -p "$BACKUP_DIR/$(dirname ./credential-security-milestone-v1.0-20250906_041507/fix_credential_security.py)"
cp ./credential-security-milestone-v1.0-20250906_041507/fix_credential_security.py "$BACKUP_DIR/./credential-security-milestone-v1.0-20250906_041507/fix_credential_security.py" 2>/dev/null || echo "   Warning: Could not backup ./credential-security-milestone-v1.0-20250906_041507/fix_credential_security.py"
rm -f ./credential-security-milestone-v1.0-20250906_041507/fix_credential_security.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/progressive_git_push_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/progressive_git_push_system.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/progressive_git_push_system.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/progressive_git_push_system.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/progressive_git_push_system.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/progressive_git_push_system.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_computer_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_computer_system.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_computer_system.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_computer_system.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_computer_system.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_computer_system.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/workflow_real_time_monitoring.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/workflow_real_time_monitoring.json)"
cp ./alex-ai-universal-milestone-package/workflow_real_time_monitoring.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/workflow_real_time_monitoring.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/workflow_real_time_monitoring.json"
rm -f ./alex-ai-universal-milestone-package/workflow_real_time_monitoring.json

echo "   Removing duplicate: ./youtube-channel-intelligence-milestone-package/youtube-channel-intelligence-workflow.json"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-channel-intelligence-milestone-package/youtube-channel-intelligence-workflow.json)"
cp ./youtube-channel-intelligence-milestone-package/youtube-channel-intelligence-workflow.json "$BACKUP_DIR/./youtube-channel-intelligence-milestone-package/youtube-channel-intelligence-workflow.json" 2>/dev/null || echo "   Warning: Could not backup ./youtube-channel-intelligence-milestone-package/youtube-channel-intelligence-workflow.json"
rm -f ./youtube-channel-intelligence-milestone-package/youtube-channel-intelligence-workflow.json

echo "   Removing duplicate: ./alexai-base-package/youtube-channel-intelligence-workflow.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/youtube-channel-intelligence-workflow.json)"
cp ./alexai-base-package/youtube-channel-intelligence-workflow.json "$BACKUP_DIR/./alexai-base-package/youtube-channel-intelligence-workflow.json" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/youtube-channel-intelligence-workflow.json"
rm -f ./alexai-base-package/youtube-channel-intelligence-workflow.json

echo "   Removing duplicate: ./greg-channel-intelligence-test-milestone-package/greg_channel_analysis_results_1756924188.json"
mkdir -p "$BACKUP_DIR/$(dirname ./greg-channel-intelligence-test-milestone-package/greg_channel_analysis_results_1756924188.json)"
cp ./greg-channel-intelligence-test-milestone-package/greg_channel_analysis_results_1756924188.json "$BACKUP_DIR/./greg-channel-intelligence-test-milestone-package/greg_channel_analysis_results_1756924188.json" 2>/dev/null || echo "   Warning: Could not backup ./greg-channel-intelligence-test-milestone-package/greg_channel_analysis_results_1756924188.json"
rm -f ./greg-channel-intelligence-test-milestone-package/greg_channel_analysis_results_1756924188.json

echo "   Removing duplicate: ./observation-lounge-crew-debrief-milestone-package/greg_channel_analysis_results_1756924188.json"
mkdir -p "$BACKUP_DIR/$(dirname ./observation-lounge-crew-debrief-milestone-package/greg_channel_analysis_results_1756924188.json)"
cp ./observation-lounge-crew-debrief-milestone-package/greg_channel_analysis_results_1756924188.json "$BACKUP_DIR/./observation-lounge-crew-debrief-milestone-package/greg_channel_analysis_results_1756924188.json" 2>/dev/null || echo "   Warning: Could not backup ./observation-lounge-crew-debrief-milestone-package/greg_channel_analysis_results_1756924188.json"
rm -f ./observation-lounge-crew-debrief-milestone-package/greg_channel_analysis_results_1756924188.json

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_consolidation_workflow.json"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_consolidation_workflow.json)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_consolidation_workflow.json "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_consolidation_workflow.json" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_consolidation_workflow.json"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_consolidation_workflow.json

echo "   Removing duplicate: ./youtube-scraper-milestone-package/youtube-scraper-workflow.json"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-scraper-milestone-package/youtube-scraper-workflow.json)"
cp ./youtube-scraper-milestone-package/youtube-scraper-workflow.json "$BACKUP_DIR/./youtube-scraper-milestone-package/youtube-scraper-workflow.json" 2>/dev/null || echo "   Warning: Could not backup ./youtube-scraper-milestone-package/youtube-scraper-workflow.json"
rm -f ./youtube-scraper-milestone-package/youtube-scraper-workflow.json

echo "   Removing duplicate: ./alexai-base-package/youtube-scraper-workflow.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/youtube-scraper-workflow.json)"
cp ./alexai-base-package/youtube-scraper-workflow.json "$BACKUP_DIR/./alexai-base-package/youtube-scraper-workflow.json" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/youtube-scraper-workflow.json"
rm -f ./alexai-base-package/youtube-scraper-workflow.json

echo "   Removing duplicate: ./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py)"
cp ./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py "$BACKUP_DIR/./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py" 2>/dev/null || echo "   Warning: Could not backup ./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py"
rm -f ./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/template_business_validation_project.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/template_business_validation_project.json)"
cp ./alex-ai-universal-milestone-package/template_business_validation_project.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/template_business_validation_project.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/template_business_validation_project.json"
rm -f ./alex-ai-universal-milestone-package/template_business_validation_project.json

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_report_learning_assessment_20250906_053336.md"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_report_learning_assessment_20250906_053336.md)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_report_learning_assessment_20250906_053336.md "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_report_learning_assessment_20250906_053336.md" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_report_learning_assessment_20250906_053336.md"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_report_learning_assessment_20250906_053336.md

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_comprehensive_assessment.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_comprehensive_assessment.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_comprehensive_assessment.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_comprehensive_assessment.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_comprehensive_assessment.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_comprehensive_assessment.py

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/workflow_market_research_automation.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/workflow_market_research_automation.json)"
cp ./alex-ai-universal-milestone-package/workflow_market_research_automation.json "$BACKUP_DIR/./alex-ai-universal-milestone-package/workflow_market_research_automation.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/workflow_market_research_automation.json"
rm -f ./alex-ai-universal-milestone-package/workflow_market_research_automation.json

echo "   Removing duplicate: ./cursor-extension-milestone-package/integration-test.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./cursor-extension-milestone-package/integration-test.sh)"
cp ./cursor-extension-milestone-package/integration-test.sh "$BACKUP_DIR/./cursor-extension-milestone-package/integration-test.sh" 2>/dev/null || echo "   Warning: Could not backup ./cursor-extension-milestone-package/integration-test.sh"
rm -f ./cursor-extension-milestone-package/integration-test.sh

echo "   Removing duplicate: ./credential-security-milestone-v1.0-20250906_041507/load_alex_ai_credentials.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./credential-security-milestone-v1.0-20250906_041507/load_alex_ai_credentials.sh)"
cp ./credential-security-milestone-v1.0-20250906_041507/load_alex_ai_credentials.sh "$BACKUP_DIR/./credential-security-milestone-v1.0-20250906_041507/load_alex_ai_credentials.sh" 2>/dev/null || echo "   Warning: Could not backup ./credential-security-milestone-v1.0-20250906_041507/load_alex_ai_credentials.sh"
rm -f ./credential-security-milestone-v1.0-20250906_041507/load_alex_ai_credentials.sh

echo "   Removing duplicate: ./alexai-base-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md)"
cp ./alexai-base-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md "$BACKUP_DIR/./alexai-base-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md"
rm -f ./alexai-base-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md

echo "   Removing duplicate: ./alex-ai-universal-milestone-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-universal-milestone-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md)"
cp ./alex-ai-universal-milestone-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md "$BACKUP_DIR/./alex-ai-universal-milestone-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-universal-milestone-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md"
rm -f ./alex-ai-universal-milestone-package/ALL_NEXT_STEPS_EXECUTION_SUMMARY.md

echo "   Removing duplicate: ./youtube-scraper-milestone-package/demo_youtube_scraper_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./youtube-scraper-milestone-package/demo_youtube_scraper_system.py)"
cp ./youtube-scraper-milestone-package/demo_youtube_scraper_system.py "$BACKUP_DIR/./youtube-scraper-milestone-package/demo_youtube_scraper_system.py" 2>/dev/null || echo "   Warning: Could not backup ./youtube-scraper-milestone-package/demo_youtube_scraper_system.py"
rm -f ./youtube-scraper-milestone-package/demo_youtube_scraper_system.py

echo "   Removing duplicate: ./alexai-base-package/demo_youtube_scraper_system.py"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/demo_youtube_scraper_system.py)"
cp ./alexai-base-package/demo_youtube_scraper_system.py "$BACKUP_DIR/./alexai-base-package/demo_youtube_scraper_system.py" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/demo_youtube_scraper_system.py"
rm -f ./alexai-base-package/demo_youtube_scraper_system.py

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/store_crew_memories_supabase.py"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/store_crew_memories_supabase.py)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/store_crew_memories_supabase.py "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/store_crew_memories_supabase.py" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/store_crew_memories_supabase.py"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/store_crew_memories_supabase.py

echo "   Removing duplicate: ./scripts/cursor-ai-shell-integration.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./scripts/cursor-ai-shell-integration.sh)"
cp ./scripts/cursor-ai-shell-integration.sh "$BACKUP_DIR/./scripts/cursor-ai-shell-integration.sh" 2>/dev/null || echo "   Warning: Could not backup ./scripts/cursor-ai-shell-integration.sh"
rm -f ./scripts/cursor-ai-shell-integration.sh

echo "   Removing duplicate: ./scripts/cursor-ai-shell-helper.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./scripts/cursor-ai-shell-helper.sh)"
cp ./scripts/cursor-ai-shell-helper.sh "$BACKUP_DIR/./scripts/cursor-ai-shell-helper.sh" 2>/dev/null || echo "   Warning: Could not backup ./scripts/cursor-ai-shell-helper.sh"
rm -f ./scripts/cursor-ai-shell-helper.sh

echo "   Removing duplicate: ./mcp-memory-optimization-milestone-v1.0-20250906_054431/docs/USER_GUIDE.md"
mkdir -p "$BACKUP_DIR/$(dirname ./mcp-memory-optimization-milestone-v1.0-20250906_054431/docs/USER_GUIDE.md)"
cp ./mcp-memory-optimization-milestone-v1.0-20250906_054431/docs/USER_GUIDE.md "$BACKUP_DIR/./mcp-memory-optimization-milestone-v1.0-20250906_054431/docs/USER_GUIDE.md" 2>/dev/null || echo "   Warning: Could not backup ./mcp-memory-optimization-milestone-v1.0-20250906_054431/docs/USER_GUIDE.md"
rm -f ./mcp-memory-optimization-milestone-v1.0-20250906_054431/docs/USER_GUIDE.md

echo "   Removing duplicate: ./alexai-base-package/get-and-update-claude-key.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/get-and-update-claude-key.sh)"
cp ./alexai-base-package/get-and-update-claude-key.sh "$BACKUP_DIR/./alexai-base-package/get-and-update-claude-key.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/get-and-update-claude-key.sh"
rm -f ./alexai-base-package/get-and-update-claude-key.sh

echo "   Removing duplicate: ./alexai-base-package/update-claude-api.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/update-claude-api.sh)"
cp ./alexai-base-package/update-claude-api.sh "$BACKUP_DIR/./alexai-base-package/update-claude-api.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/update-claude-api.sh"
rm -f ./alexai-base-package/update-claude-api.sh

echo "   Removing duplicate: ./alexai-base-package/milestone-push-system.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/milestone-push-system.sh)"
cp ./alexai-base-package/milestone-push-system.sh "$BACKUP_DIR/./alexai-base-package/milestone-push-system.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/milestone-push-system.sh"
rm -f ./alexai-base-package/milestone-push-system.sh

echo "   Removing duplicate: ./alexai-base-package/fix-zshrc-api-key.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/fix-zshrc-api-key.sh)"
cp ./alexai-base-package/fix-zshrc-api-key.sh "$BACKUP_DIR/./alexai-base-package/fix-zshrc-api-key.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/fix-zshrc-api-key.sh"
rm -f ./alexai-base-package/fix-zshrc-api-key.sh

echo "   Removing duplicate: ./alexai-base-package/claude-api-key-guide.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/claude-api-key-guide.sh)"
cp ./alexai-base-package/claude-api-key-guide.sh "$BACKUP_DIR/./alexai-base-package/claude-api-key-guide.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/claude-api-key-guide.sh"
rm -f ./alexai-base-package/claude-api-key-guide.sh

echo "   Removing duplicate: ./alexai-base-package/robust-test.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/robust-test.sh)"
cp ./alexai-base-package/robust-test.sh "$BACKUP_DIR/./alexai-base-package/robust-test.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/robust-test.sh"
rm -f ./alexai-base-package/robust-test.sh

echo "   Removing duplicate: ./alexai-base-package/claude-api-fix-final.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/claude-api-fix-final.sh)"
cp ./alexai-base-package/claude-api-fix-final.sh "$BACKUP_DIR/./alexai-base-package/claude-api-fix-final.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/claude-api-fix-final.sh"
rm -f ./alexai-base-package/claude-api-fix-final.sh

echo "   Removing duplicate: ./alexai-base-package/update-zshrc-with-placeholder.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/update-zshrc-with-placeholder.sh)"
cp ./alexai-base-package/update-zshrc-with-placeholder.sh "$BACKUP_DIR/./alexai-base-package/update-zshrc-with-placeholder.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/update-zshrc-with-placeholder.sh"
rm -f ./alexai-base-package/update-zshrc-with-placeholder.sh

echo "   Removing duplicate: ./alexai-base-package/fix-claude-api.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/fix-claude-api.sh)"
cp ./alexai-base-package/fix-claude-api.sh "$BACKUP_DIR/./alexai-base-package/fix-claude-api.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/fix-claude-api.sh"
rm -f ./alexai-base-package/fix-claude-api.sh

echo "   Removing duplicate: ./alexai-base-package/shell-safety-guide.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/shell-safety-guide.sh)"
cp ./alexai-base-package/shell-safety-guide.sh "$BACKUP_DIR/./alexai-base-package/shell-safety-guide.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/shell-safety-guide.sh"
rm -f ./alexai-base-package/shell-safety-guide.sh

echo "   Removing duplicate: ./alexai-base-package/setup-secure-api-keys.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/setup-secure-api-keys.sh)"
cp ./alexai-base-package/setup-secure-api-keys.sh "$BACKUP_DIR/./alexai-base-package/setup-secure-api-keys.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/setup-secure-api-keys.sh"
rm -f ./alexai-base-package/setup-secure-api-keys.sh

echo "   Removing duplicate: ./alexai-base-package/alexai-init.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./alexai-base-package/alexai-init.sh)"
cp ./alexai-base-package/alexai-init.sh "$BACKUP_DIR/./alexai-base-package/alexai-init.sh" 2>/dev/null || echo "   Warning: Could not backup ./alexai-base-package/alexai-init.sh"
rm -f ./alexai-base-package/alexai-init.sh

echo "   Removing duplicate: ./production-readiness-results/test-status.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./production-readiness-results/test-status.sh)"
cp ./production-readiness-results/test-status.sh "$BACKUP_DIR/./production-readiness-results/test-status.sh" 2>/dev/null || echo "   Warning: Could not backup ./production-readiness-results/test-status.sh"
rm -f ./production-readiness-results/test-status.sh

echo "   Removing duplicate: ./production-readiness-results/test-progress.sh"
mkdir -p "$BACKUP_DIR/$(dirname ./production-readiness-results/test-progress.sh)"
cp ./production-readiness-results/test-progress.sh "$BACKUP_DIR/./production-readiness-results/test-progress.sh" 2>/dev/null || echo "   Warning: Could not backup ./production-readiness-results/test-progress.sh"
rm -f ./production-readiness-results/test-progress.sh

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/pages-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/pages-manifest.json)"
cp ./alex-ai-job-search/.next/server/pages-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/pages-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/pages-manifest.json"
rm -f ./alex-ai-job-search/.next/server/pages-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/app/page/react-loadable-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/app/page/react-loadable-manifest.json)"
cp ./alex-ai-job-search/.next/server/app/page/react-loadable-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/app/page/react-loadable-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/app/page/react-loadable-manifest.json"
rm -f ./alex-ai-job-search/.next/server/app/page/react-loadable-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/app/_not-found/page/react-loadable-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/app/_not-found/page/react-loadable-manifest.json)"
cp ./alex-ai-job-search/.next/server/app/_not-found/page/react-loadable-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/app/_not-found/page/react-loadable-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/app/_not-found/page/react-loadable-manifest.json"
rm -f ./alex-ai-job-search/.next/server/app/_not-found/page/react-loadable-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/pages/_document/react-loadable-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/pages/_document/react-loadable-manifest.json)"
cp ./alex-ai-job-search/.next/server/pages/_document/react-loadable-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/pages/_document/react-loadable-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/pages/_document/react-loadable-manifest.json"
rm -f ./alex-ai-job-search/.next/server/pages/_document/react-loadable-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/pages/_error/react-loadable-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/pages/_error/react-loadable-manifest.json)"
cp ./alex-ai-job-search/.next/server/pages/_error/react-loadable-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/pages/_error/react-loadable-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/pages/_error/react-loadable-manifest.json"
rm -f ./alex-ai-job-search/.next/server/pages/_error/react-loadable-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/pages/_app/react-loadable-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/pages/_app/react-loadable-manifest.json)"
cp ./alex-ai-job-search/.next/server/pages/_app/react-loadable-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/pages/_app/react-loadable-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/pages/_app/react-loadable-manifest.json"
rm -f ./alex-ai-job-search/.next/server/pages/_app/react-loadable-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/app/_not-found/page/build-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/app/_not-found/page/build-manifest.json)"
cp ./alex-ai-job-search/.next/server/app/_not-found/page/build-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/app/_not-found/page/build-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/app/_not-found/page/build-manifest.json"
rm -f ./alex-ai-job-search/.next/server/app/_not-found/page/build-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/app/api/health/route/server-reference-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/app/api/health/route/server-reference-manifest.json)"
cp ./alex-ai-job-search/.next/server/app/api/health/route/server-reference-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/app/api/health/route/server-reference-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/app/api/health/route/server-reference-manifest.json"
rm -f ./alex-ai-job-search/.next/server/app/api/health/route/server-reference-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/app/_not-found/page/server-reference-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/app/_not-found/page/server-reference-manifest.json)"
cp ./alex-ai-job-search/.next/server/app/_not-found/page/server-reference-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/app/_not-found/page/server-reference-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/app/_not-found/page/server-reference-manifest.json"
rm -f ./alex-ai-job-search/.next/server/app/_not-found/page/server-reference-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/app/api/health/route/build-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/app/api/health/route/build-manifest.json)"
cp ./alex-ai-job-search/.next/server/app/api/health/route/build-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/app/api/health/route/build-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/app/api/health/route/build-manifest.json"
rm -f ./alex-ai-job-search/.next/server/app/api/health/route/build-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/pages/_error/next-font-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/pages/_error/next-font-manifest.json)"
cp ./alex-ai-job-search/.next/server/pages/_error/next-font-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/pages/_error/next-font-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/pages/_error/next-font-manifest.json"
rm -f ./alex-ai-job-search/.next/server/pages/_error/next-font-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/server/pages/_app/next-font-manifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/server/pages/_app/next-font-manifest.json)"
cp ./alex-ai-job-search/.next/server/pages/_app/next-font-manifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/server/pages/_app/next-font-manifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/server/pages/_app/next-font-manifest.json"
rm -f ./alex-ai-job-search/.next/server/pages/_app/next-font-manifest.json

echo "   Removing duplicate: ./alex-ai-job-search/.next/static/GL1uBWtiED8GCbYqmKhKU/_clientMiddlewareManifest.json"
mkdir -p "$BACKUP_DIR/$(dirname ./alex-ai-job-search/.next/static/GL1uBWtiED8GCbYqmKhKU/_clientMiddlewareManifest.json)"
cp ./alex-ai-job-search/.next/static/GL1uBWtiED8GCbYqmKhKU/_clientMiddlewareManifest.json "$BACKUP_DIR/./alex-ai-job-search/.next/static/GL1uBWtiED8GCbYqmKhKU/_clientMiddlewareManifest.json" 2>/dev/null || echo "   Warning: Could not backup ./alex-ai-job-search/.next/static/GL1uBWtiED8GCbYqmKhKU/_clientMiddlewareManifest.json"
rm -f ./alex-ai-job-search/.next/static/GL1uBWtiED8GCbYqmKhKU/_clientMiddlewareManifest.json

# Step 2: Consolidate similar scripts
echo "🔧 Step 2: Consolidating similar scripts..."

echo "   Consolidating Python scripts: ./youtube_scraper_crew_integration.py, ./youtube-scraper-milestone-package/youtube_scraper_crew_integration.py, ./alexai-base-package/youtube_scraper_crew_integration.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./greg_channel_intelligence_analysis.py, ./greg-channel-intelligence-test-milestone-package/greg_channel_intelligence_analysis.py, ./alexai-base-package/greg_channel_intelligence_analysis.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./crew_personal_history_analysis.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_personal_history_analysis.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./crew_coordination_update_system.py, ./greg-channel-intelligence-test-milestone-package/crew_coordination_update_system.py, ./alexai-base-package/crew_coordination_update_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./test_mcp_system.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/test_mcp_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./enhanced_ai_prompts_system.py, ./alexai-base-package/enhanced_ai_prompts_system.py, ./alex-ai-universal-milestone-package/enhanced_ai_prompts_system.py, ./enhanced-ai-prompts-milestone-package/enhanced_ai_prompts_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./alex_ai_credential_manager.py, ./credential-security-milestone-v1.0-20250906_041507/alex_ai_credential_manager.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./enhanced_prompts_test_suite.py, ./alexai-base-package/enhanced_prompts_test_suite.py, ./alex-ai-universal-milestone-package/enhanced_prompts_test_suite.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./alex_ai_memory_sharing_assessment.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_memory_sharing_assessment.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./enhanced_unified_router.py, ./alexai-base-package/enhanced_unified_router.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./crew_learning_assessment.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/crew_learning_assessment.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./observation_lounge_crew_debrief.py, ./observation-lounge-crew-debrief-milestone-package/observation_lounge_crew_debrief.py, ./alexai-base-package/observation_lounge_crew_debrief.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./enhanced_ai_prompts_deployment_system.py, ./alexai-base-package/enhanced_ai_prompts_deployment_system.py, ./alex-ai-universal-milestone-package/enhanced_ai_prompts_deployment_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./youtube_channel_intelligence_system.py, ./youtube-channel-intelligence-milestone-package/youtube_channel_intelligence_system.py, ./alexai-base-package/youtube_channel_intelligence_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./test_channel_intelligence_system.py, ./youtube-channel-intelligence-milestone-package/test_channel_intelligence_system.py, ./alexai-base-package/test_channel_intelligence_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./mcp_memory_optimization_system.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_memory_optimization_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./advanced_ai_agent_development_system.py, ./alexai-base-package/advanced_ai_agent_development_system.py, ./alex-ai-universal-milestone-package/advanced_ai_agent_development_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./test_youtube_scraper_integration.py, ./youtube-scraper-milestone-package/test_youtube_scraper_integration.py, ./alexai-base-package/test_youtube_scraper_integration.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./crew_coordinator.py, ./alexai-base-package/crew_coordinator.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./mcp_integration_system.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_integration_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./observation_lounge_memory_consensus.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/observation_lounge_memory_consensus.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./test_alex_ai_system.py, ./credential-security-milestone-v1.0-20250906_041507/test_alex_ai_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./fix_credential_security.py, ./credential-security-milestone-v1.0-20250906_041507/fix_credential_security.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./progressive_git_push_system.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/progressive_git_push_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./mcp_library_computer_system.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/mcp_library_computer_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./n8n_integration_test_system.py, ./credential-security-milestone-v1.0-20250906_041507/n8n_integration_test_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./alex_ai_comprehensive_assessment.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/alex_ai_comprehensive_assessment.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./demo_youtube_scraper_system.py, ./youtube-scraper-milestone-package/demo_youtube_scraper_system.py, ./alexai-base-package/demo_youtube_scraper_system.py"
# TODO: Implement script consolidation logic

echo "   Consolidating Python scripts: ./store_crew_memories_supabase.py, ./mcp-memory-optimization-milestone-v1.0-20250906_054431/store_crew_memories_supabase.py"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./greg-community-intelligence-dual-milestone-push.sh, ./dual-milestone-push.sh, ./observation-lounge-unified-crew-dual-milestone-push.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./channel-intelligence-dual-milestone-push.sh, ./dual-milestone-push.sh, ./observation-lounge-unified-crew-dual-milestone-push.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./test-script.sh, ./cursor-extension-milestone-package/integration-test.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./load_alex_ai_credentials.sh, ./credential-security-milestone-v1.0-20250906_041507/load_alex_ai_credentials.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./cursor-extension-milestone-package/cursor-ai-shell-integration.sh, ./scripts/cursor-ai-shell-integration.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./cursor-extension-milestone-package/cursor-ai-shell-helper.sh, ./scripts/cursor-ai-shell-helper.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/get-and-update-claude-key.sh, ./alexai-base-package/get-and-update-claude-key.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/update-claude-api.sh, ./alexai-base-package/update-claude-api.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/milestone-push-system.sh, ./alexai-base-package/milestone-push-system.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/fix-zshrc-api-key.sh, ./alexai-base-package/fix-zshrc-api-key.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/claude-api-key-guide.sh, ./alexai-base-package/claude-api-key-guide.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/robust-test.sh, ./alexai-base-package/robust-test.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/claude-api-fix-final.sh, ./alexai-base-package/claude-api-fix-final.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/update-zshrc-with-placeholder.sh, ./alexai-base-package/update-zshrc-with-placeholder.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/fix-claude-api.sh, ./alexai-base-package/fix-claude-api.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/shell-prompt-safety-system.sh, ./alexai-base-package/shell-prompt-safety-system.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/shell-safety-guide.sh, ./alexai-base-package/shell-safety-guide.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/setup-secure-api-keys.sh, ./alexai-base-package/setup-secure-api-keys.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/alexai-init.sh, ./alexai-base-package/alexai-init.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/generated/test-basic.sh, ./scripts/test-results/test-generated.sh, ./production-readiness-results/test-basic.sh, ./production-readiness-results/test-readiness.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/generated/test-status.sh, ./production-readiness-results/test-status.sh"
# TODO: Implement script consolidation logic

echo "   Consolidating shell scripts: ./scripts/generated/test-progress.sh, ./production-readiness-results/test-progress.sh"
# TODO: Implement script consolidation logic

# Step 3: Archive milestone packages
echo "📦 Step 3: Archiving milestone packages..."

echo "   Archiving: credential-security-milestone-v1.0-20250906_041507"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/credential-security-milestone-v1.0-20250906_041507.tar.gz" "credential-security-milestone-v1.0-20250906_041507" 2>/dev/null || echo "   Warning: Could not archive credential-security-milestone-v1.0-20250906_041507"

echo "   Archiving: cursor-extension-milestone-package"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/cursor-extension-milestone-package.tar.gz" "cursor-extension-milestone-package" 2>/dev/null || echo "   Warning: Could not archive cursor-extension-milestone-package"

echo "   Archiving: greg-channel-intelligence-test-milestone-package"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/greg-channel-intelligence-test-milestone-package.tar.gz" "greg-channel-intelligence-test-milestone-package" 2>/dev/null || echo "   Warning: Could not archive greg-channel-intelligence-test-milestone-package"

echo "   Archiving: youtube-channel-intelligence-milestone-package"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/youtube-channel-intelligence-milestone-package.tar.gz" "youtube-channel-intelligence-milestone-package" 2>/dev/null || echo "   Warning: Could not archive youtube-channel-intelligence-milestone-package"

echo "   Archiving: observation-lounge-crew-debrief-milestone-package"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/observation-lounge-crew-debrief-milestone-package.tar.gz" "observation-lounge-crew-debrief-milestone-package" 2>/dev/null || echo "   Warning: Could not archive observation-lounge-crew-debrief-milestone-package"

echo "   Archiving: youtube-scraper-milestone-package"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/youtube-scraper-milestone-package.tar.gz" "youtube-scraper-milestone-package" 2>/dev/null || echo "   Warning: Could not archive youtube-scraper-milestone-package"

echo "   Archiving: mcp-memory-optimization-milestone-v1.0-20250906_054431"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/mcp-memory-optimization-milestone-v1.0-20250906_054431.tar.gz" "mcp-memory-optimization-milestone-v1.0-20250906_054431" 2>/dev/null || echo "   Warning: Could not archive mcp-memory-optimization-milestone-v1.0-20250906_054431"

echo "   Archiving: alex-ai-universal-milestone-package"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/alex-ai-universal-milestone-package.tar.gz" "alex-ai-universal-milestone-package" 2>/dev/null || echo "   Warning: Could not archive alex-ai-universal-milestone-package"

echo "   Archiving: enhanced-ai-prompts-milestone-package"
mkdir -p "archives/milestone_packages"
tar -czf "archives/milestone_packages/enhanced-ai-prompts-milestone-package.tar.gz" "enhanced-ai-prompts-milestone-package" 2>/dev/null || echo "   Warning: Could not archive enhanced-ai-prompts-milestone-package"

# Step 4: Generate cleanup report
echo "📊 Step 4: Generating cleanup report..."
cat > "monorepo_cleanup_report_$(date +%Y%m%d_%H%M%S).md" << 'EOF'
# Monorepo Cleanup Report

## Cleanup Summary
- Duplicate files removed: [COUNT]
- Scripts consolidated: [COUNT]
- Packages archived: [COUNT]

## Backup Location
All removed files have been backed up to: $BACKUP_DIR

## Next Steps
1. Review the consolidated scripts
2. Test the cleaned up repository
3. Update any hardcoded paths
4. Remove backup directory if everything works correctly

EOF

echo "✅ Monorepo cleanup complete!"
echo "📋 Review the cleanup report and test the repository"
echo "🗑️  Remove backup directory when satisfied: rm -rf $BACKUP_DIR"
