#!/bin/bash

# Alex AI Lottie Export Automation Script
# Automates After Effects project generation and Lottie export

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
EXPORT_DIR="$PROJECT_DIR/exports"
AE_SCRIPT_DIR="$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if After Effects is installed
check_after_effects() {
    log_info "Checking for After Effects installation..."
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        if [ -d "/Applications/Adobe After Effects 2024" ]; then
            AE_PATH="/Applications/Adobe After Effects 2024/After Effects 2024.app"
        elif [ -d "/Applications/Adobe After Effects 2023" ]; then
            AE_PATH="/Applications/Adobe After Effects 2023/After Effects 2023.app"
        else
            log_error "After Effects not found. Please install After Effects 2023 or 2024."
            exit 1
        fi
    else
        # Windows
        if [ -d "C:/Program Files/Adobe/Adobe After Effects 2024" ]; then
            AE_PATH="C:/Program Files/Adobe/Adobe After Effects 2024/After Effects.exe"
        elif [ -d "C:/Program Files/Adobe/Adobe After Effects 2023" ]; then
            AE_PATH="C:/Program Files/Adobe/Adobe After Effects 2023/After Effects.exe"
        else
            log_error "After Effects not found. Please install After Effects 2023 or 2024."
            exit 1
        fi
    fi
    
    log_success "After Effects found at: $AE_PATH"
}

# Create export directory
create_export_dir() {
    log_info "Creating export directory..."
    mkdir -p "$EXPORT_DIR"
    log_success "Export directory created: $EXPORT_DIR"
}

# Generate After Effects project
generate_ae_project() {
    log_info "Generating After Effects project..."
    
    # Run the project generator script
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"$AE_PATH\" to activate"
        sleep 2
        osascript -e "tell application \"$AE_PATH\" to do script file \"$AE_SCRIPT_DIR/AlexAI_Project_Generator.jsx\""
    else
        "$AE_PATH" -r "$AE_SCRIPT_DIR/AlexAI_Project_Generator.jsx"
    fi
    
    log_success "After Effects project generated"
}

# Export Lottie animations
export_lottie() {
    log_info "Exporting Lottie animations..."
    
    # Run the Bodymoving export script
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"$AE_PATH\" to do script file \"$AE_SCRIPT_DIR/Bodymoving_Export.jsx\""
    else
        "$AE_PATH" -r "$AE_SCRIPT_DIR/Bodymoving_Export.jsx"
    fi
    
    log_success "Lottie animations exported"
}

# Copy exports to React project
copy_to_react() {
    log_info "Copying Lottie files to React project..."
    
    REACT_PUBLIC_DIR="$(dirname "$PROJECT_DIR")/public/lottie"
    mkdir -p "$REACT_PUBLIC_DIR"
    
    # Copy all JSON files from export directory
    find "$EXPORT_DIR" -name "*.json" -exec cp {} "$REACT_PUBLIC_DIR/" \;
    
    log_success "Lottie files copied to React project"
}

# Update Lottie asset manager
update_asset_manager() {
    log_info "Updating Lottie asset manager..."
    
    ASSET_MANAGER_FILE="$(dirname "$PROJECT_DIR")/lib/lottie-asset-manager.ts"
    
    # Generate asset list
    ASSET_LIST=""
    for file in "$EXPORT_DIR"/*.json; do
        if [ -f "$file" ]; then
            filename=$(basename "$file" .json)
            ASSET_LIST="$ASSET_LIST\n    '$filename': '/lottie/$filename.json',"
        fi
    done
    
    # Update the asset manager file
    cat > "$ASSET_MANAGER_FILE" << EOF
// Auto-generated Lottie asset manager
// Generated on $(date)

export const LOTTIE_ASSETS = {${ASSET_LIST}
};

export function getLottieAsset(name: string): string {
    return LOTTIE_ASSETS[name] || '';
}

export function getAllLottieAssets(): Record<string, string> {
    return LOTTIE_ASSETS;
}
EOF
    
    log_success "Asset manager updated"
}

# Main execution
main() {
    log_info "Starting Alex AI Lottie export process..."
    
    check_after_effects
    create_export_dir
    generate_ae_project
    export_lottie
    copy_to_react
    update_asset_manager
    
    log_success "Lottie export process completed successfully!"
    log_info "Exported animations are available in: $EXPORT_DIR"
    log_info "React project updated with new Lottie assets"
}

# Run main function
main "$@"
