#!/usr/bin/env python3
"""
Consolidated Script: alexai-init
================================

This script consolidates the following similar scripts:
- ./scripts/alexai-init.sh
- ./alexai-base-package/alexai-init.sh

Generated: 2025-09-06 20:27:37
"""

#!/bin/bash

# AlexAI Project Initialization for Musician Show and Tour App
echo "🧠 Initializing AlexAI Supercharged Crew for musician-show-tour-app..."

# Load environment variables from ~/.zshrc
source ~/.zshrc

# Initialize Supabase connection
echo "💾 Connecting to Supabase memory system..."
export SUPABASE_URL="${SUPABASE_URL:-}"
export SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY:-}"

# Initialize N8N integration
echo "🔧 Setting up N8N workflow integration..."
export N8N_BASE_URL="${N8N_BASE_URL:-}"
export N8N_API_KEY="${N8N_API_KEY:-}"

# Initialize LLM API keys
echo "🤖 Configuring LLM routing..."
export ANTHROPIC_API_KEY="${ANTHROPIC_API_KEY:-}"
export OPENAI_API_KEY="${OPENAI_API_KEY:-}"
export OPENROUTER_API_KEY="${OPENROUTER_API_KEY:-}"

# Create project memory entry
if [ -n "$SUPABASE_URL" ] && [ -n "$SUPABASE_ANON_KEY" ]; then
    echo "📝 Creating project memory entry..."
    curl -X POST "$SUPABASE_URL/rest/v1/crew_memories" \
      -H "apikey: $SUPABASE_ANON_KEY" \
      -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
      -H "Content-Type: application/json" \
      -d '{
        "crew_member": "System-Wide",
        "mission_id": "project-creation-musician-show-tour-app",
        "memory_type": "project_creation",
        "content": "New project created: musician-show-tour-app. AlexAI Supercharged Crew activated with 22 specialized agents, philosophical grounding, and full integration capabilities. Project focuses on musician show and tour management.",
        "importance": "high"
      }' || echo "⚠️  Could not connect to Supabase (check your credentials)"
else
    echo "⚠️  Supabase credentials not found in environment"
fi

echo "✅ AlexAI Supercharged Crew initialized for musician-show-tour-app!"
echo "🚀 Ready to collaborate with 22 specialized AI agents!"
echo "📚 Check .alexai/ directory for philosophy and crew information"
