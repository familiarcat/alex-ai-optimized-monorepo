from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Alex AI System Test Script
Demonstrates the full Alex AI superagent system capabilities
"""

import json
import sys
import os
from datetime import datetime

# Add current directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_job_search_system():
    """Test the Alex AI Job Search System"""
    print("🚀 Testing Alex AI Job Search System...")
    
    try:
        from alex_ai_job_search_system import AlexAIJobSearchSystem
        
        # Initialize system
        job_search = AlexAIJobSearchSystem()
        
        # Run job search automation
        results = job_search.run_job_search_automation()
        
        print("✅ Job Search System: OPERATIONAL")
        print(f"   📊 Total Opportunities: {results['total_opportunities']}")
        print(f"   🏆 Top Opportunities: {len(results['top_opportunities'])}")
        print(f"   🏢 Org Structures: {len(results['org_structures'])}")
        
        return True
    except Exception as e:
        print(f"❌ Job Search System Error: {e}")
        return False

def test_crew_coordinator():
    """Test the Crew Coordinator System"""
    print("\n🧠 Testing Crew Coordinator System...")
    
    try:
        from crew_coordinator import ObservationLoungeCoordinator
        
        # Initialize coordinator
        coordinator = ObservationLoungeCoordinator()
        
        # Test input data
        test_input = {
            "mission": "Test Alex AI System Integration",
            "crew_members": ["all"],
            "priority": "high",
            "context": "Demonstrating Alex AI superagent capabilities"
        }
        
        # Run coordination
        result = coordinator.coordinate_observation_lounge(test_input)
        
        print("✅ Crew Coordinator: OPERATIONAL")
        print(f"   👥 Crew Members: {len(result.get('crew_insights', []))}")
        print(f"   🎯 Strategic Themes: {len(result.get('strategic_themes', []))}")
        print(f"   📋 Recommendations: {len(result.get('recommendations', []))}")
        
        return True
    except Exception as e:
        print(f"❌ Crew Coordinator Error: {e}")
        return False

def test_enhanced_router():
    """Test the Enhanced Unified Router"""
    print("\n🔀 Testing Enhanced Unified Router...")
    
    try:
        from enhanced_unified_router import EnhancedUnifiedRouter
        
        # Initialize router
        router = EnhancedUnifiedRouter()
        
        # Test routing
        test_request = {
            "task": "Generate a comprehensive analysis of the musician tour app market",
            "complexity": "high",
            "context": "Market research and competitive analysis"
        }
        
        result = router.route_request(test_request)
        
        print("✅ Enhanced Router: OPERATIONAL")
        print(f"   🎯 Routing Decision: {result.get('routing', {}).get('selected_crew', 'Unknown')}")
        print(f"   💰 Cost Optimization: {result.get('routing', {}).get('cost_optimization', 'Unknown')}")
        
        return True
    except Exception as e:
        print(f"❌ Enhanced Router Error: {e}")
        return False

    print("🧠 ALEX AI SUPERAGENT SYSTEM TEST")
    print("=" * 50)
    
    # Test results
    tests = [
        ("Job Search System", test_job_search_system),
        ("Crew Coordinator", test_crew_coordinator),
        ("Enhanced Router", test_enhanced_router)
    ]
    
    results = []
    
    for test_name, test_func in tests:
        try:
            success = test_func()
            results.append((test_name, success))
        except Exception as e:
            print(f"❌ {test_name} Failed: {e}")
            results.append((test_name, False))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 ALEX AI SYSTEM TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    
    for test_name, success in results:
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print(f"\n🎯 Overall Status: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALEX AI SUPERAGENT SYSTEM: FULLY OPERATIONAL!")
        print("🚀 Ready for production deployment!")
    else:
        print("⚠️  Some components need attention")
    
    return passed == total

if __name__ == "__main__":
    main()
