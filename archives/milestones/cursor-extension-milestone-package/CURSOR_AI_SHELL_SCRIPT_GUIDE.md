# Cursor AI Shell Script Generation Guide

## 🎯 Purpose
This guide ensures Cursor AI generates proper shell scripts automatically without causing dquote> issues.

## 📋 Mandatory Rules

### ✅ ALWAYS DO:
- Use simple echo commands
- Each echo command on its own line
- No complex strings or multi-line echo commands
- No quotes that span multiple lines
- Simple, self-contained commands

### ❌ NEVER DO:
- Complex multi-line echo commands
- Quotes that span multiple lines
- Complex string manipulation in single commands
- Complex printf statements with special characters

## 🔧 Correct Template

```bash
#!/bin/bash

echo "Script starting"
echo "==============="
echo ""
echo "Status: Running"
echo "Progress: 0%"
echo ""
echo "Processing..."
echo "Status: Complete"
echo ""
echo "Script finished"
```

## 🔧 Incorrect Template

```bash
#!/bin/bash

echo "🎉 MILESTONE: Comprehensive AI System
====================================="
echo "✅ COMPREHENSIVE AI ECOSYSTEM COMPLETE:"
echo "  • 8 Claude Sub-Agents (Technical Implementation)"
```

## 🎯 Integration Points

1. **Supabase Memory**: Shell script rules stored in collective memory
2. **N8N Workflows**: Validation workflows for generated scripts
3. **Cursor AI Helper**: Helper script for proper template generation
4. **Documentation**: This guide for reference

## 🚀 Usage

When generating shell scripts, Cursor AI should:
1. Reference this guide
2. Use the correct template
3. Validate generated scripts
4. Follow simple formatting rules

This ensures all generated shell scripts work without dquote> issues.
