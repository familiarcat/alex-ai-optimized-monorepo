from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Supabase Data Import Script - Import All Research Findings
Script to import all research findings, business models, and execution plans into Supabase
"""

import json
import datetime
import os
from typing import Dict, List, Any, Optional

class SupabaseDataImporter:
        
        self.import_mappings = {
            "market_research": {
                "market": "market",
                "research_type": "market_analysis",
                "title": "title",
                "content": "description",
                "insights": "market_insights",
                "keywords": "growth_keywords",
                "business_opportunities": "recommended_opportunities",
                "pain_points": "critical_knowledge_gaps",
                "market_size": "market_size",
                "growth_rate": "growth_rate",
                "competitive_landscape": "competitive_landscape",
                "revenue_models": "business_model_recommendations",
                "source": "source",
                "relevance_score": "relevance_score"
            },
            "business_models": {
                "model_name": "name",
                "target_market": "target_market",
                "description": "description",
                "revenue_streams": "revenue_streams",
                "pricing_strategy": "pricing_strategies",
                "value_proposition": "value_proposition",
                "customer_segments": "customer_segments",
                "key_partners": "key_partners",
                "key_activities": "key_activities",
                "key_resources": "key_resources",
                "cost_structure": "cost_structure",
                "revenue_projections": "revenue_projections",
                "success_metrics": "success_metrics",
                "implementation_plan": "implementation_plan",
                "risk_factors": "risk_assessment",
                "competitive_advantages": "competitive_advantages"
            },
            "execution_plans": {
                "plan_name": "plan_type",
                "plan_type": "plan_type",
                "target_markets": "target_markets",
                "phases": "research_phases",
                "crew_assignments": "crew_assignments",
                "deliverables": "deliverables",
                "success_metrics": "success_metrics",
                "risk_mitigation": "risk_mitigation",
                "timeline": "recommended_timeline",
                "budget": "budget",
                "dependencies": "dependencies",
                "status": "status",
                "progress": "progress"
            },
            "agile_projects": {
                "project_name": "project_name",
                "target_market": "target_market",
                "description": "project_description",
                "estimated_duration": "estimated_duration",
                "crew_assignments": "crew_assignments",
                "sprints": "sprints",
                "current_sprint": "current_sprint",
                "total_sprints": "total_sprints",
                "status": "status",
                "progress": "overall_progress",
                "quality_score": "quality_score",
                "customer_satisfaction": "customer_satisfaction",
                "alex_ai_utilization": "alex_ai_utilization",
                "metrics": "metrics",
                "alex_ai_integration": "alex_ai_integration"
            },
            "business_operations": {
                "operation_type": "operation_type",
                "business_name": "business_name",
                "legal_structure": "legal_structure",
                "target_markets": "target_markets",
                "llc_setup": "llc_setup",
                "payment_integration": "payment_integration",
                "compliance_requirements": "compliance_requirements",
                "financial_projections": "financial_projections",
                "implementation_timeline": "implementation_timeline",
                "risk_assessment": "risk_assessment",
                "success_metrics": "success_metrics",
                "status": "status",
                "progress": "progress"
            },
            "knowledge_base": {
                "knowledge_type": "knowledge_type",
                "title": "title",
                "content": "content",
                "source": "source",
                "tags": "tags",
                "insights": "insights",
                "applications": "applications",
                "related_concepts": "related_concepts",
                "confidence_score": "confidence_score",
                "validation_status": "validation_status"
            }
        }

    def load_data_file(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Load data from JSON file"""
        try:
            if os.path.exists(file_path):
                with open(file_path, 'r') as f:
                    return json.load(f)
            else:
                print(f"⚠️ File not found: {file_path}")
                return None
        except Exception as e:
            print(f"❌ Error loading {file_path}: {str(e)}")
            return None

    def transform_market_research_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform market research data for Supabase import"""
        transformed_data = []
        
        if "market_analyses" in data:
            for market, analysis in data["market_analyses"].items():
                record = {
                    "market": market,
                    "research_type": "comprehensive_analysis",
                    "title": f"{market.title()} Market Analysis",
                    "content": f"Comprehensive analysis of {market} market including trends, opportunities, and challenges.",
                    "insights": analysis.get("market_insights", []),
                    "keywords": analysis.get("growth_keywords", []),
                    "business_opportunities": analysis.get("business_opportunities", []),
                    "pain_points": analysis.get("pain_points", []),
                    "market_size": analysis.get("market_size", "Unknown"),
                    "growth_rate": analysis.get("growth_rate", "Unknown"),
                    "competitive_landscape": analysis.get("competitive_landscape", []),
                    "revenue_models": analysis.get("revenue_models", []),
                    "source": "comprehensive_market_research",
                    "relevance_score": 0.9
                }
                transformed_data.append(record)
        
        return transformed_data

    def transform_business_models_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform business models data for Supabase import"""
        transformed_data = []
        
        if "business_model" in data:
            business_model = data["business_model"]
            for market in business_model.get("target_markets", []):
                record = {
                    "model_name": f"Alex AI {market.title()} Platform",
                    "target_market": market,
                    "description": f"AI-powered platform for {market} automation and management",
                    "revenue_streams": business_model.get("business_models", []),
                    "pricing_strategy": business_model.get("pricing_strategies", {}),
                    "value_proposition": f"Automate {market} operations with AI-powered solutions",
                    "customer_segments": [f"Small {market} businesses", f"Medium {market} enterprises", f"Large {market} corporations"],
                    "key_partners": [f"{market.title()} industry associations", "Technology integrators", "Payment processors"],
                    "key_activities": ["Product development", "Customer acquisition", "Platform maintenance", "Data analytics"],
                    "key_resources": ["AI technology", "Customer data", "Industry expertise", "Technical infrastructure"],
                    "cost_structure": {"development": "$100K-$500K", "marketing": "$50K-$200K", "operations": "$100K-$300K"},
                    "revenue_projections": business_model.get("revenue_projections", {}),
                    "success_metrics": business_model.get("success_metrics", {}),
                    "implementation_plan": business_model.get("implementation_plan", {}),
                    "risk_factors": business_model.get("risk_assessment", []),
                    "competitive_advantages": business_model.get("competitive_advantages", [])
                }
                transformed_data.append(record)
        
        return transformed_data

    def transform_execution_plans_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform execution plans data for Supabase import"""
        transformed_data = []
        
        record = {
            "plan_name": data.get("plan_type", "Research Phase Execution Plan"),
            "plan_type": data.get("plan_type", "research_phase"),
            "target_markets": data.get("target_markets", []),
            "phases": data.get("phases", {}),
            "crew_assignments": data.get("crew_assignments", {}),
            "deliverables": data.get("deliverables", []),
            "success_metrics": data.get("success_metrics", {}),
            "risk_mitigation": data.get("risk_mitigation", {}),
            "timeline": data.get("recommended_timeline", {}),
            "budget": {"total_budget": "$25,000", "market_research": "$5,000", "business_operations": "$10,000"},
            "dependencies": ["Market research completion", "Legal consultation", "Technical infrastructure setup"],
            "status": "in_progress",
            "progress": 75.0
        }
        transformed_data.append(record)
        
        return transformed_data

    def transform_agile_projects_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform agile projects data for Supabase import"""
        transformed_data = []
        
        if "active_projects" in data:
            for project in data["active_projects"]:
                record = {
                    "project_name": project.get("project_name", "Unknown Project"),
                    "target_market": project.get("target_market", "unknown"),
                    "description": project.get("project_description", "AI-powered project"),
                    "estimated_duration": project.get("estimated_duration", "8 weeks"),
                    "crew_assignments": project.get("crew_assignments", {}),
                    "sprints": project.get("sprints", []),
                    "current_sprint": project.get("current_sprint", 1),
                    "total_sprints": project.get("total_sprints", 3),
                    "status": "in_progress",
                    "progress": project.get("metrics", {}).get("overall_progress", 35.0),
                    "quality_score": project.get("metrics", {}).get("quality_score", 8.5),
                    "customer_satisfaction": project.get("metrics", {}).get("customer_satisfaction", 9.0),
                    "alex_ai_utilization": project.get("metrics", {}).get("alex_ai_utilization", 95.0),
                    "metrics": project.get("metrics", {}),
                    "alex_ai_integration": project.get("alex_ai_integration", {})
                }
                transformed_data.append(record)
        
        return transformed_data

    def transform_business_operations_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform business operations data for Supabase import"""
        transformed_data = []
        
        record = {
            "operation_type": "llc_setup",
            "business_name": data.get("business_name", "Alex AI Solutions LLC"),
            "legal_structure": "LLC",
            "target_markets": data.get("target_markets", []),
            "llc_setup": data.get("llc_setup", {}),
            "payment_integration": data.get("payment_integration", {}),
            "compliance_requirements": data.get("compliance_requirements", []),
            "financial_projections": data.get("financial_projections", {}),
            "implementation_timeline": data.get("implementation_timeline", {}),
            "risk_assessment": data.get("risk_assessment", {}),
            "success_metrics": data.get("success_metrics", {}),
            "status": "in_progress",
            "progress": 60.0
        }
        transformed_data.append(record)
        
        return transformed_data

    def transform_knowledge_base_data(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Transform knowledge base data for Supabase import"""
        transformed_data = []
        
        # Transform business readiness assessment
        if "overall_assessment" in data:
            assessment = data["overall_assessment"]
            record = {
                "knowledge_type": "business_readiness",
                "title": "Business Readiness Assessment",
                "content": f"Comprehensive assessment of business readiness with score {assessment.get('overall_readiness_score', 0)}/10",
                "source": "business_readiness_assessment",
                "tags": ["business", "readiness", "assessment", "strategy"],
                "insights": assessment.get("key_findings", []),
                "applications": ["Business planning", "Risk assessment", "Strategic planning"],
                "related_concepts": ["business strategy", "risk management", "strategic planning"],
                "confidence_score": 0.9,
                "validation_status": "validated"
            }
            transformed_data.append(record)
        
        # Transform research plan
        if "research_phases" in data:
            for phase_id, phase in data["research_phases"].items():
                record = {
                    "knowledge_type": "research_plan",
                    "title": f"Research Phase: {phase_id.replace('_', ' ').title()}",
                    "content": f"Research phase plan with {len(phase.get('objectives', []))} objectives",
                    "source": "research_plan",
                    "tags": ["research", "planning", "execution", "strategy"],
                    "insights": phase.get("objectives", []),
                    "applications": ["Research planning", "Project management", "Strategy execution"],
                    "related_concepts": ["research methodology", "project planning", "strategy execution"],
                    "confidence_score": 0.85,
                    "validation_status": "validated"
                }
                transformed_data.append(record)
        
        # Transform crew consensus
        if "overall_consensus" in data:
            consensus = data["overall_consensus"]
            record = {
                "knowledge_type": "crew_consensus",
                "title": "Crew Business Readiness Consensus",
                "content": f"Crew consensus on business readiness with {consensus.get('consensus_score', 0)}/10 score",
                "source": "crew_consensus",
                "tags": ["consensus", "business", "readiness", "crew"],
                "insights": consensus.get("key_findings", []),
                "applications": ["Decision making", "Strategic planning", "Team alignment"],
                "related_concepts": ["consensus building", "team decision making", "strategic alignment"],
                "confidence_score": 0.95,
                "validation_status": "validated"
            }
            transformed_data.append(record)
        
        return transformed_data

    def generate_import_data(self) -> Dict[str, List[Dict[str, Any]]]:
        """Generate all import data from existing files"""
        import_data = {
            "market_research": [],
            "business_models": [],
            "execution_plans": [],
            "agile_projects": [],
            "business_operations": [],
            "knowledge_base": []
        }
        
        # Process each data type
        for data_type, files in self.data_files.items():
            for file_path in files:
                data = self.load_data_file(file_path)
                if data:
                    if data_type == "market_research":
                        transformed = self.transform_market_research_data(data)
                        import_data["market_research"].extend(transformed)
                    elif data_type == "business_models":
                        transformed = self.transform_business_models_data(data)
                        import_data["business_models"].extend(transformed)
                    elif data_type == "execution_plans":
                        transformed = self.transform_execution_plans_data(data)
                        import_data["execution_plans"].extend(transformed)
                    elif data_type == "agile_projects":
                        transformed = self.transform_agile_projects_data(data)
                        import_data["agile_projects"].extend(transformed)
                    elif data_type == "business_operations":
                        transformed = self.transform_business_operations_data(data)
                        import_data["business_operations"].extend(transformed)
                    elif data_type == "knowledge_base":
                        transformed = self.transform_knowledge_base_data(data)
                        import_data["knowledge_base"].extend(transformed)
        
        return import_data

    def generate_supabase_import_script(self, import_data: Dict[str, List[Dict[str, Any]]]) -> str:
        """Generate Supabase import script"""
        script_lines = [
            "-- Supabase Data Import Script",
            "-- Generated: " + datetime.datetime.now().isoformat(),
            "",
            "-- Import all research findings, business models, and execution plans",
            "",
        ]
        
        # Generate INSERT statements for each table
        for table_name, records in import_data.items():
            if not records:
                continue
                
            script_lines.append(f"-- Import {table_name} data")
            script_lines.append(f"-- {len(records)} records to import")
            script_lines.append("")
            
            for record in records:
                columns = list(record.keys())
                values = []
                
                for col in columns:
                    value = record[col]
                    if isinstance(value, (dict, list)):
                        # Convert to JSON string
                        values.append(f"'{json.dumps(value)}'")
                    elif isinstance(value, str):
                        # Escape single quotes
                        escaped_value = value.replace("'", "''")
                        values.append(f"'{escaped_value}'")
                    elif isinstance(value, (int, float)):
                        values.append(str(value))
                    elif value is None:
                        values.append("NULL")
                    else:
                        values.append(f"'{str(value)}'")
                
                insert_sql = f"INSERT INTO {table_name} ({', '.join(columns)}) VALUES ({', '.join(values)});"
                script_lines.append(insert_sql)
            
            script_lines.append("")
        
        return "\\n".join(script_lines)

    print("📥 SUPABASE DATA IMPORT SCRIPT - IMPORT ALL RESEARCH FINDINGS")
    print("=" * 65)
    print()
    
    # Initialize data importer
    importer = SupabaseDataImporter()
    
    print("📊 Data Files to Import:")
    for data_type, files in importer.data_files.items():
        print(f"   {data_type.title()}: {len(files)} files")
    print()
    
    # Generate import data
    print("🔄 Generating import data from existing files...")
    import_data = importer.generate_import_data()
    
    total_records = sum(len(records) for records in import_data.values())
    print(f"✅ Import data generated")
    print(f"📊 Total Records: {total_records}")
    print()
    
    # Display import summary
    print("📊 IMPORT SUMMARY:")
    for data_type, records in import_data.items():
        print(f"   • {data_type.title()}: {len(records)} records")
    print()
    
    # Generate Supabase import script
    print("🔧 Generating Supabase import script...")
    import_script = importer.generate_supabase_import_script(import_data)
    
    # Save files
    timestamp = int(datetime.datetime.now().timestamp())
    
    # Save import data
    import_data_file = f"supabase_import_data_{timestamp}.json"
    with open(import_data_file, 'w') as f:
        json.dump(import_data, f, indent=2)
    
    # Save import script
    import_script_file = f"supabase_import_script_{timestamp}.sql"
    with open(import_script_file, 'w') as f:
        f.write(import_script)
    
    print(f"📄 Import data saved to: {import_data_file}")
    print(f"📄 Import script saved to: {import_script_file}")
    print()
    
    print("🎯 READY TO IMPORT TO SUPABASE!")
    print("1. Set up your Supabase project")
    print("2. Run the schema SQL to create tables")
    print("3. Run the import script to populate data")
    print("4. Verify data import and start refining!")
    print()
    print("🚀 All research findings are ready for Supabase storage and future refinement!")

if __name__ == "__main__":
    main()
