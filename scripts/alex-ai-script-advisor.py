#!/usr/bin/env python3
"""
Alex AI Script Advisor
======================
Main interface for Alex AI to access script intelligence capabilities
"""

import sys
import json
import argparse
import os

# Add scripts directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from alex_ai_script_intelligence_system import AlexAIScriptIntelligenceSystem

class AlexAIScriptAdvisor:
    def __init__(self):
        self.system = AlexAIScriptIntelligenceSystem()
    
    def advise_on_script_creation(self, purpose: str, functionality: list) -> dict:
        """Main advisor function for script creation decisions"""
        print(f"🤔 Alex AI is analyzing: '{purpose}' with functionality: {functionality}")
        
        # Get suggestion
        suggestion = self.system.suggest_script_creation(purpose, functionality)
        
        # Format response
        response = {
            "action": suggestion["action"],
            "reasoning": suggestion["reasoning"],
            "recommendations": []
        }
        
        if suggestion["action"] == "extend":
            response["recommendations"].append(f"Extend existing script: {suggestion['recommended_script']['file_name']}")
            response["recommendations"].append(f"Similarity: {suggestion['similarity_score']:.2%}")
            response["recommendations"].extend(suggestion["extension_suggestions"])
            response["target_script"] = suggestion["recommended_script"]
        
        elif suggestion["action"] == "create_new":
            response["recommendations"].append(f"Create new script in category: {suggestion['recommended_category']}")
            if "similar_scripts" in suggestion:
                response["recommendations"].append(f"Found {len(suggestion['similar_scripts'])} similar scripts for reference")
                response["similar_scripts"] = suggestion["similar_scripts"][:3]  # Top 3
        
        return response
    
    def get_script_template(self, category: str, functionality: list) -> str:
        """Get script template for new script creation"""
        return self.system.create_script_template(category, functionality)
    
    def find_existing_scripts(self, query: str) -> list:
        """Find existing scripts by query"""
        return self.system.search_scripts_by_text(query)
    
    def get_extension_recommendations(self, script_name: str) -> dict:
        """Get extension recommendations for existing script"""
        return self.system.get_extension_recommendations(script_name)
    
    def recommend_categorization(self, script_name: str, functionality: list) -> dict:
        """Recommend categorization for script"""
        return self.system.recommend_categorization(script_name, functionality)
    
    def generate_script_report(self, script_name: str) -> dict:
        """Generate comprehensive script report"""
        return self.system.generate_script_report(script_name)

def main():
    """Command line interface for Alex AI Script Advisor"""
    parser = argparse.ArgumentParser(description="Alex AI Script Advisor")
    parser.add_argument("--purpose", help="Script purpose")
    parser.add_argument("--functionality", nargs="+", help="Script functionality list")
    parser.add_argument("--query", help="Search query for existing scripts")
    parser.add_argument("--script-name", help="Script name for analysis")
    parser.add_argument("--action", choices=["advise", "search", "extend", "categorize", "report"], 
                       default="advise", help="Action to perform")
    
    args = parser.parse_args()
    
    advisor = AlexAIScriptAdvisor()
    
    if args.action == "advise":
        if not args.purpose or not args.functionality:
            print("❌ Error: --purpose and --functionality are required for advice")
            sys.exit(1)
        
        advice = advisor.advise_on_script_creation(args.purpose, args.functionality)
        print("\n🎯 Alex AI Script Creation Advice:")
        print(f"Action: {advice['action']}")
        print(f"Reasoning: {advice['reasoning']}")
        print("\n📋 Recommendations:")
        for rec in advice["recommendations"]:
            print(f"  • {rec}")
        
        if "target_script" in advice:
            print(f"\n🎯 Target Script: {advice['target_script']['file_name']}")
            print(f"   Path: {advice['target_script']['file_path']}")
            print(f"   Category: {advice['target_script']['category']}")
    
    elif args.action == "search":
        if not args.query:
            print("❌ Error: --query is required for search")
            sys.exit(1)
        
        results = advisor.find_existing_scripts(args.query)
        print(f"\n🔍 Found {len(results)} scripts matching '{args.query}':")
        for i, script in enumerate(results[:10], 1):  # Show top 10
            print(f"  {i}. {script['file_name']} (Score: {script.get('relevance_score', 0):.2f})")
            print(f"     Path: {script['file_path']}")
            print(f"     Purpose: {script['purpose']}")
            print()
    
    elif args.action == "extend":
        if not args.script_name:
            print("❌ Error: --script-name is required for extension analysis")
            sys.exit(1)
        
        recommendations = advisor.get_extension_recommendations(args.script_name)
        if recommendations:
            print(f"\n🔧 Extension Recommendations for {args.script_name}:")
            print(f"Extension Opportunities: {recommendations['extension_opportunities']}")
            print(f"Similar Scripts: {len(recommendations['similar_scripts'])}")
            print("Recommendations:")
            for rec in recommendations["recommendations"]:
                print(f"  • {rec}")
        else:
            print(f"❌ Script '{args.script_name}' not found")
    
    elif args.action == "categorize":
        if not args.script_name or not args.functionality:
            print("❌ Error: --script-name and --functionality are required for categorization")
            sys.exit(1)
        
        categorization = advisor.recommend_categorization(args.script_name, args.functionality)
        print(f"\n📁 Categorization Recommendation for {args.script_name}:")
        print(f"Recommended Category: {categorization['recommended_category']}")
        print(f"Reasoning: {categorization['reasoning']}")
        if categorization['similar_scripts']:
            print(f"Similar Scripts: {len(categorization['similar_scripts'])}")
    
    elif args.action == "report":
        if not args.script_name:
            print("❌ Error: --script-name is required for report generation")
            sys.exit(1)
        
        report = advisor.generate_script_report(args.script_name)
        if report:
            print(f"\n📊 Comprehensive Report for {args.script_name}:")
            script_info = report['script_info']
            print(f"File: {script_info['file_path']}")
            print(f"Category: {script_info['category']}")
            print(f"Purpose: {script_info['purpose']}")
            print(f"Functionality: {', '.join(script_info['functionality'])}")
            print(f"Complexity Score: {script_info['complexity_score']}/10")
            print(f"Maintenance Priority: {script_info['maintenance_priority']}")
            print(f"Similar Scripts: {len(report['similar_scripts'])}")
            print(f"Consolidation Opportunities: {len(report['consolidation_opportunities'])}")
        else:
            print(f"❌ Script '{args.script_name}' not found")

if __name__ == "__main__":
    main()
