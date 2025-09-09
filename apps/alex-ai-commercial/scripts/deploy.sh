#!/bin/bash

# Alex AI Job Search - Deployment Script
# This script handles the complete deployment process

set -e

echo "🚀 Starting Alex AI Job Search Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    
    if ! command -v vercel &> /dev/null; then
        print_warning "Vercel CLI not found. Installing..."
        npm install -g vercel@latest
    fi
    
    print_success "All dependencies are available"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    npm ci
    print_success "Dependencies installed"
}

# Run linting and type checking
run_quality_checks() {
    print_status "Running quality checks..."
    
    print_status "Running ESLint..."
    npm run lint
    
    print_status "Running TypeScript check..."
    npm run type-check
    
    print_success "Quality checks passed"
}

# Run tests
run_tests() {
    print_status "Running tests..."
    npm run test
    print_success "Tests passed"
}

# Build the application
build_application() {
    print_status "Building application..."
    npm run build
    print_success "Application built successfully"
}

# Deploy to Vercel
deploy_to_vercel() {
    local environment=${1:-preview}
    
    print_status "Deploying to Vercel ($environment)..."
    
    if [ "$environment" = "production" ]; then
        vercel --prod --token=$VERCEL_TOKEN
    else
        vercel --token=$VERCEL_TOKEN
    fi
    
    print_success "Deployed to Vercel ($environment)"
}

# Run database migrations
run_database_migrations() {
    print_status "Running database migrations..."
    
    if command -v supabase &> /dev/null; then
        supabase db push --project-ref $SUPABASE_PROJECT_REF
        print_success "Database migrations completed"
    else
        print_warning "Supabase CLI not found. Skipping database migrations."
    fi
}

# Test deployment
test_deployment() {
    local url=${1:-"https://alex-ai-job-search.vercel.app"}
    
    print_status "Testing deployment at $url..."
    
    # Wait for deployment to be ready
    sleep 30
    
    # Test health endpoint
    if curl -f "$url/api/health" > /dev/null 2>&1; then
        print_success "Deployment is healthy"
    else
        print_error "Deployment health check failed"
        exit 1
    fi
}

# Main deployment function
main() {
    local environment=${1:-preview}
    
    print_status "Starting deployment process for environment: $environment"
    
    # Load environment variables
    if [ -f ".env.local" ]; then
        source .env.local
        print_status "Environment variables loaded"
    else
        print_warning ".env.local not found. Make sure environment variables are set."
    fi
    
    # Run deployment steps
    check_dependencies
    install_dependencies
    run_quality_checks
    run_tests
    build_application
    
    if [ "$environment" = "production" ]; then
        run_database_migrations
    fi
    
    deploy_to_vercel $environment
    test_deployment
    
    print_success "🎉 Deployment completed successfully!"
    
    if [ "$environment" = "production" ]; then
        print_success "Production URL: https://alex-ai-job-search.vercel.app"
    else
        print_success "Preview URL: Check Vercel dashboard for preview URL"
    fi
}

# Handle command line arguments
case "${1:-}" in
    "production")
        main "production"
        ;;
    "preview")
        main "preview"
        ;;
    "test")
        print_status "Running tests only..."
        check_dependencies
        install_dependencies
        run_quality_checks
        run_tests
        print_success "All tests passed!"
        ;;
    "build")
        print_status "Building application only..."
        check_dependencies
        install_dependencies
        build_application
        print_success "Build completed!"
        ;;
    *)
        echo "Usage: $0 {production|preview|test|build}"
        echo ""
        echo "Commands:"
        echo "  production  - Deploy to production"
        echo "  preview     - Deploy to preview (default)"
        echo "  test        - Run tests only"
        echo "  build       - Build application only"
        exit 1
        ;;
esac
