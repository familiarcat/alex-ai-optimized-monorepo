#!/bin/bash

echo "🚀 Deploying Alex AI Job Search to Production"
echo "============================================="
echo ""

# Load credentials
source ~/.zshrc

# Build for production
echo "🏗️ Building for production..."
npm run build

# Start production server
echo "🚀 Starting production server..."
npm start

echo "✅ Production deployment complete!"
echo "📍 Application available at: http://localhost:3000"
