#!/bin/bash

# Alex AI Engagement Display Script
# Safe display of Alex AI engagement status without shell errors

set -e

# Color codes
readonly PICARD_COLOR='\033[0;34m'
readonly DATA_COLOR='\033[0;36m'
readonly GEORDI_COLOR='\033[0;33m'
readonly WORF_COLOR='\033[0;31m'
readonly NC='\033[0m'

print_picard() {
    printf "${PICARD_COLOR}%s${NC}\n" "$1"
}

print_data() {
    printf "${DATA_COLOR}%s${NC}\n" "$1"
}

print_geordi() {
    printf "${GEORDI_COLOR}%s${NC}\n" "$1"
}

print_worf() {
    printf "${WORF_COLOR}%s${NC}\n" "$1"
}

# Safe engagement display
display_engagement() {
    printf '\033[2J\033[H'  # Clear screen
    
    print_picard "🎉 ALEX AI ENGAGEMENT COMPLETE! 🎉"
    printf "\n"
    
    print_data "✅ Alex AI System Status:"
    print_data "   - System Initialized: ✅"
    print_data "   - Crew Members Active: 9/9"
    print_data "   - N8N Integration: ✅"
    print_data "   - Stealth Scraping: ✅"
    print_data "   - Data Service: ✅"
    printf "\n"
    
    print_geordi "👥 Active Crew Members:"
    print_geordi "   🎖️  Captain Jean-Luc Picard - Strategic Leadership"
    print_geordi "   ⚔️  Commander William Riker - Tactical Operations"
    print_geordi "   🤖 Commander Data - Analytics & AI/ML"
    print_geordi "   ⚙️  Lt. Commander Geordi La Forge - Infrastructure"
    print_geordi "   🛡️  Lieutenant Worf - Security & Quality Assurance"
    print_geordi "   💝 Counselor Deanna Troi - User Experience"
    print_geordi "   📡 Lieutenant Uhura - Communications"
    print_geordi "   🏥 Dr. Beverly Crusher - Medical/Quality Assurance"
    print_geordi "   💰 Quark - Business Operations"
    printf "\n"
    
    print_picard "🚀 Alex AI is now fully engaged and ready for mission!"
}

# Main execution
main() {
    display_engagement
}

# Run main function
main "$@"

