#!/bin/bash
# Safe cleanup of old Alex AI files

echo "🧹 Cleaning up old Alex AI files..."

# Create backup directory
mkdir -p backups/old-alex-ai-$(date +%Y%m%d-%H%M%S)

# Backup old files
echo "�� Creating backup..."
cp -r .alexai backups/old-alex-ai-$(date +%Y%m%d-%H%M%S)/
cp -r alexai-base-package backups/old-alex-ai-$(date +%Y%m%d-%H%M%S)/
cp alex-ai-*.json backups/old-alex-ai-$(date +%Y%m%d-%H%M%S)/

# Remove old files
echo "🗑️  Removing old files..."
rm -rf .alexai
rm -rf alexai-base-package
rm -f alex-ai-*.json

echo "✅ Cleanup complete!"
echo "📁 Backup created in: backups/old-alex-ai-$(date +%Y%m%d-%H%M%S)/"
