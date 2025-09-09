#!/bin/bash

# Alex AI Crew - Turborepo Structure Optimization Script
# =====================================================
# This script implements the crew's recommendations for proper Turborepo structure

set -e

echo "🚀 Alex AI Crew - Turborepo Structure Optimization"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "turbo.json" ]; then
    echo "❌ Error: Not in a Turborepo root directory"
    echo "Please run this script from the monorepo root"
    exit 1
fi

echo "✅ Confirmed: Running in Turborepo root directory"
echo ""

# Create backup
echo "📦 Creating backup of current structure..."
BACKUP_DIR="turborepo_structure_backup_$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"
echo "Backup directory: $BACKUP_DIR"
echo ""

# Phase 1: Critical Fixes
echo "🔧 Phase 1: Critical Fixes"
echo "-------------------------"

# 1. Move src/ directory to packages/alex-ai-core/
if [ -d "src" ]; then
    echo "📁 Moving src/ directory to packages/alex-ai-core/..."
    mkdir -p packages/alex-ai-core
    cp -r src/* packages/alex-ai-core/ 2>/dev/null || true
    mv src "$BACKUP_DIR/"
    echo "✅ Moved src/ to packages/alex-ai-core/"
else
    echo "ℹ️  src/ directory not found (already moved or doesn't exist)"
fi

# 2. Remove conflicting lockfile
if [ -f "package-lock.json" ]; then
    echo "🗑️  Removing conflicting package-lock.json..."
    mv package-lock.json "$BACKUP_DIR/"
    echo "✅ Removed package-lock.json (keeping pnpm-lock.yaml)"
else
    echo "ℹ️  package-lock.json not found (already removed)"
fi

# 3. Move stress test files
echo "🧪 Moving stress test files to tests/stress/..."
mkdir -p tests/stress
if ls stress_test_* 1> /dev/null 2>&1; then
    mv stress_test_* tests/stress/ 2>/dev/null || true
    echo "✅ Moved stress test files to tests/stress/"
else
    echo "ℹ️  No stress test files found at root level"
fi

# 4. Move milestone packages
echo "📦 Moving milestone packages to archives/milestones/..."
mkdir -p archives/milestones
if ls milestone-* 1> /dev/null 2>&1; then
    mv milestone-* archives/milestones/ 2>/dev/null || true
    echo "✅ Moved milestone packages to archives/milestones/"
else
    echo "ℹ️  No milestone packages found at root level"
fi

# Move other milestone-related files
if ls *-milestone-* 1> /dev/null 2>&1; then
    mv *-milestone-* archives/milestones/ 2>/dev/null || true
    echo "✅ Moved milestone-related files to archives/milestones/"
fi

# 5. Move backup directories
echo "💾 Moving backup directories to archives/backups/..."
mkdir -p archives/backups
if ls *backup* 1> /dev/null 2>&1; then
    mv *backup* archives/backups/ 2>/dev/null || true
    echo "✅ Moved backup directories to archives/backups/"
else
    echo "ℹ️  No backup directories found at root level"
fi

# Move specific backup directories
if [ -d "final_cleanup_backup_20250906_203310" ]; then
    mv final_cleanup_backup_20250906_203310 archives/backups/ 2>/dev/null || true
    echo "✅ Moved final_cleanup_backup_20250906_203310 to archives/backups/"
fi

if [ -d "monorepo_cleanup_backup_20250906_202737" ]; then
    mv monorepo_cleanup_backup_20250906_202737 archives/backups/ 2>/dev/null || true
    echo "✅ Moved monorepo_cleanup_backup_20250906_202737 to archives/backups/"
fi

echo ""
echo "🔧 Phase 2: Organization"
echo "----------------------"

# 6. Create CI/CD structure
echo "🚀 Creating CI/CD structure..."
mkdir -p .github/workflows
echo "✅ Created .github/workflows/ directory"

# 7. Move configuration files to config/ (if they exist)
echo "⚙️  Organizing configuration files..."
if ls alex_ai_*.json 1> /dev/null 2>&1; then
    mkdir -p config/alex-ai
    mv alex_ai_*.json config/alex-ai/ 2>/dev/null || true
    echo "✅ Moved Alex AI config files to config/alex-ai/"
fi

# 8. Move YOLO mode files to appropriate location
echo "🎯 Organizing YOLO mode files..."
if ls yolo_* 1> /dev/null 2>&1; then
    mkdir -p config/yolo-mode
    mv yolo_* config/yolo-mode/ 2>/dev/null || true
    echo "✅ Moved YOLO mode files to config/yolo-mode/"
fi

# 9. Move crew-related files
echo "👥 Organizing crew-related files..."
if ls crew_* 1> /dev/null 2>&1; then
    mkdir -p config/crew
    mv crew_* config/crew/ 2>/dev/null || true
    echo "✅ Moved crew files to config/crew/"
fi

# 10. Move cursor AI files
echo "🤖 Organizing Cursor AI files..."
if ls cursor_ai_* 1> /dev/null 2>&1; then
    mkdir -p config/cursor-ai
    mv cursor_ai_* config/cursor-ai/ 2>/dev/null || true
    echo "✅ Moved Cursor AI files to config/cursor-ai/"
fi

echo ""
echo "🔧 Phase 3: Cleanup"
echo "-----------------"

# 11. Move remaining scattered files
echo "🧹 Cleaning up remaining scattered files..."

# Move HTML files to appropriate location
if ls *.html 1> /dev/null 2>&1; then
    mkdir -p docs/html
    mv *.html docs/html/ 2>/dev/null || true
    echo "✅ Moved HTML files to docs/html/"
fi

# Move CSS files to appropriate location
if ls *.css 1> /dev/null 2>&1; then
    mkdir -p packages/alex-ai-components/styles
    mv *.css packages/alex-ai-components/styles/ 2>/dev/null || true
    echo "✅ Moved CSS files to packages/alex-ai-components/styles/"
fi

# Move database files to appropriate location
if ls *.db 1> /dev/null 2>&1; then
    mkdir -p data/databases
    mv *.db data/databases/ 2>/dev/null || true
    echo "✅ Moved database files to data/databases/"
fi

# Move Python files to appropriate location
if ls *.py 1> /dev/null 2>&1; then
    mkdir -p packages/alex-ai-core/python
    mv *.py packages/alex-ai-core/python/ 2>/dev/null || true
    echo "✅ Moved Python files to packages/alex-ai-core/python/"
fi

# Move shell scripts to scripts/ directory
if ls *.sh 1> /dev/null 2>&1; then
    mv *.sh scripts/ 2>/dev/null || true
    echo "✅ Moved shell scripts to scripts/"
fi

# Move text files to docs/
if ls *.txt 1> /dev/null 2>&1; then
    mkdir -p docs/text
    mv *.txt docs/text/ 2>/dev/null || true
    echo "✅ Moved text files to docs/text/"
fi

# Move markdown files to docs/ (except README.md)
if ls *.md 1> /dev/null 2>&1; then
    mkdir -p docs/markdown
    for file in *.md; do
        if [ "$file" != "README.md" ]; then
            mv "$file" docs/markdown/ 2>/dev/null || true
        fi
    done
    echo "✅ Moved markdown files to docs/markdown/"
fi

echo ""
echo "📊 Summary"
echo "---------"

# Count files in root directory
ROOT_FILES=$(find . -maxdepth 1 -type f | wc -l | tr -d ' ')
echo "📁 Files remaining in root directory: $ROOT_FILES"

# List remaining files
echo ""
echo "📋 Remaining files in root directory:"
ls -la | grep "^-" | awk '{print "  " $9}' | grep -v "^  $"

echo ""
echo "✅ Turborepo structure optimization complete!"
echo ""
echo "📦 Backup created at: $BACKUP_DIR"
echo "🔍 Review the changes and test your build process"
echo "📚 See ALEX_AI_TURBOREPO_STRUCTURE_ANALYSIS.md for detailed recommendations"
echo ""
echo "🚀 Next steps:"
echo "  1. Test the build: pnpm turbo run build"
echo "  2. Update any import paths that may have changed"
echo "  3. Update documentation to reflect new structure"
echo "  4. Commit the changes to version control"
echo ""
echo "🎉 Alex AI Crew mission accomplished!"

