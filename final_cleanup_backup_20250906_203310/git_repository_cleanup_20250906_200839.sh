#!/bin/bash
# Git Repository Cleanup Script
# Generated: 2025-09-06 20:08:39

set -e

echo "🧹 Starting Git Repository Cleanup..."

# Step 1: Commit all changes in main repository
echo "📝 Step 1: Committing changes in main repository..."
cd .
git add .
git commit -m "Cleanup: Commit all changes before repository consolidation" || echo "No changes to commit"

# Step 2: Handle sub-repositories

echo "📁 Handling sub-repository: alex-ai-job-search"
cd ./alex-ai-job-search
git add .
git commit -m "Cleanup: Commit changes before consolidation" || echo "No changes to commit"
cd .

# Step 3: Create .gitmodules file for submodules
echo "📋 Step 3: Creating .gitmodules file..."
cat > .gitmodules << 'EOF'

[submodule "alex-ai-job-search"]
    path = alex-ai-job-search
    url = ./alex-ai-job-search
EOF

# Step 4: Update .gitignore
echo "📝 Step 4: Updating .gitignore..."
cat >> .gitignore << 'EOF'

# Submodules
.gitmodules

# Sub-project specific ignores
node_modules/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
env/
venv/
.venv/
pip-log.txt
pip-delete-this-directory.txt
.tox/
.coverage
.coverage.*
.cache
nosetests.xml
coverage.xml
*.cover
*.log
.git
.mypy_cache
.pytest_cache
.hypothesis

# OS specific
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF

# Step 5: Create documentation
echo "📚 Step 5: Creating documentation..."
cat > REPOSITORY_STRUCTURE.md << 'EOF'
# Repository Structure

## Main Repository
This is the main repository containing the Alex AI system and related projects.

## Sub-repositories

### alex-ai-job-search
- Path: `alex-ai-job-search/`
- Type: Git submodule
- Purpose: Independent development history

## Sub-projects

### alex-ai-job-search
- Path: `alex-ai-job-search/`
- Type: Node.js/JavaScript
- Indicators: package.json

### alex-ai-job-search/.next
- Path: `alex-ai-job-search/.next/`
- Type: Node.js/JavaScript
- Indicators: package.json

### .
- Path: `./`
- Type: Python
- Indicators: requirements.txt

### credential-security-milestone-v1.0-20250906_041507
- Path: `credential-security-milestone-v1.0-20250906_041507/`
- Type: Python
- Indicators: requirements.txt

### mcp-memory-optimization-milestone-v1.0-20250906_054431
- Path: `mcp-memory-optimization-milestone-v1.0-20250906_054431/`
- Type: Python
- Indicators: requirements.txt

### alexai-base-package
- Path: `alexai-base-package/`
- Type: Python
- Indicators: requirements.txt

## Usage
- Main development happens in the root directory
- Sub-repositories are managed as git submodules
- Sub-projects are organized within the main repository structure

## Maintenance
- Use `git submodule update --init --recursive` to initialize submodules
- Use `git submodule update --remote` to update submodules
- Use `git submodule foreach git pull origin main` to update all submodules
EOF

echo "✅ Git repository cleanup complete!"
echo "📊 Repository structure:"
tree -L 2 -a

echo ""
echo "🎉 Repository consolidation complete!"
echo "📋 Next steps:"
echo "   1. Review the new structure"
echo "   2. Initialize submodules: git submodule update --init --recursive"
echo "   3. Test the consolidated repository"
echo "   4. Update any hardcoded paths"
