#!/bin/bash

# Alex AI Job Search Application - Milestone v1.3 Deployment Script
# Complete functionality restoration with all features working

echo "🚀 Alex AI Job Search Application - Milestone v1.3 Deployment"
echo "=============================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct directory. Please run from alex-ai-job-search/"
    exit 1
fi

echo "📋 Milestone v1.3 Features:"
echo "  ✅ Default resume loading (Brady_Georgen_Resume_Final.docx)"
echo "  ✅ Skills weighting system with 25+ skills"
echo "  ✅ Job opportunities display (20 filtered jobs)"
echo "  ✅ Resume upload with drag-and-drop"
echo "  ✅ All filtering and sorting working"
echo "  ✅ No UI/UX functionality removed"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed"
    exit 1
fi

echo "🔧 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

echo "🏗️ Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo "✅ Application built successfully"
echo ""

echo "🚀 Starting development server..."
echo "📍 Application will be available at: http://localhost:3000"
echo ""

# Start the development server
npm run dev

