from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Alex AI Crew Mermaid Models Generator
Deep learning analysis to create organizational Mermaid models for target companies
"""

import json
from datetime import datetime
from typing import Dict, List, Optional
import re

class AlexAICrewMermaidModels:
            "Technical Lead Analyst",
            "AI Strategy Specialist", 
            "Client Success Manager",
            "Sustainability Consultant",
            "Organizational Structure Expert"
        ]
        
        self.target_companies = [
            "Microsoft", "HubSpot", "Wpromote", "Breakthrough Fuel", 
            "Daugherty Business Solutions", "Veterans United Home Loans",
            "Blayzer Digital", "Rankings.io", "SteadyRain", "Anheuser-Busch"
        ]
        
        self.mermaid_models = {}

    def analyze_company_structure(self, company_name: str, company_data: Dict) -> Dict:
        """Analyze company structure using Alex AI crew expertise"""
        
        # Technical Lead Analyst perspective
        technical_analysis = self._technical_lead_analysis(company_name, company_data)
        
        # AI Strategy Specialist perspective
        ai_strategy_analysis = self._ai_strategy_analysis(company_name, company_data)
        
        # Client Success Manager perspective
        client_success_analysis = self._client_success_analysis(company_name, company_data)
        
        # Sustainability Consultant perspective
        sustainability_analysis = self._sustainability_analysis(company_name, company_data)
        
        # Organizational Structure Expert perspective
        org_structure_analysis = self._org_structure_analysis(company_name, company_data)
        
        return {
            "company_name": company_name,
            "analysis_timestamp": datetime.now().isoformat(),
            "crew_analysis": {
                "technical_lead": technical_analysis,
                "ai_strategy": ai_strategy_analysis,
                "client_success": client_success_analysis,
                "sustainability": sustainability_analysis,
                "org_structure": org_structure_analysis
            },
            "consensus_recommendations": self._generate_consensus_recommendations(
                technical_analysis, ai_strategy_analysis, client_success_analysis,
                sustainability_analysis, org_structure_analysis
            )
        }

    def _technical_lead_analysis(self, company_name: str, company_data: Dict) -> Dict:
        """Technical Lead Analyst perspective on company structure"""
        alex_ai_score = company_data.get("alex_ai_score", 0)
        priority = company_data.get("priority", "medium")
        
        # Analyze technical leadership opportunities
        technical_opportunities = []
        if alex_ai_score >= 70:
            technical_opportunities.append("High Alex AI leverage potential")
        if priority == "high":
            technical_opportunities.append("High priority target")
        
        # Identify key technical contacts
        technical_contacts = self._identify_technical_contacts(company_data)
        
        return {
            "perspective": "Technical Leadership & Architecture",
            "alex_ai_leverage_score": alex_ai_score,
            "technical_opportunities": technical_opportunities,
            "key_technical_contacts": technical_contacts,
            "recommended_approach": self._get_technical_approach(company_name, alex_ai_score),
            "mermaid_focus": "Technical hierarchy and decision-making structure"
        }

    def _ai_strategy_analysis(self, company_name: str, company_data: Dict) -> Dict:
        """AI Strategy Specialist perspective on company structure"""
        alex_ai_score = company_data.get("alex_ai_score", 0)
        
        # Analyze AI/automation opportunities
        ai_opportunities = []
        if alex_ai_score >= 80:
            ai_opportunities.append("Excellent AI/automation alignment")
        elif alex_ai_score >= 60:
            ai_opportunities.append("Good AI/automation potential")
        else:
            ai_opportunities.append("Limited AI/automation focus")
        
        # Identify AI strategy contacts
        ai_contacts = self._identify_ai_strategy_contacts(company_data)
        
        return {
            "perspective": "AI Strategy & Automation",
            "ai_alignment_score": alex_ai_score,
            "ai_opportunities": ai_opportunities,
            "ai_strategy_contacts": ai_contacts,
            "alex_ai_leverage_points": self._get_alex_ai_leverage_points(company_name),
            "mermaid_focus": "AI/automation decision-making and implementation structure"
        }

    def _client_success_analysis(self, company_name: str, company_data: Dict) -> Dict:
        """Client Success Manager perspective on company structure"""
        
        # Analyze client-facing opportunities
        client_opportunities = []
        if "marketing" in company_name.lower() or "digital" in company_name.lower():
            client_opportunities.append("Strong client-facing role potential")
        if company_data.get("priority") == "high":
            client_opportunities.append("High-value client relationships")
        
        # Identify client success contacts
        client_contacts = self._identify_client_success_contacts(company_data)
        
        return {
            "perspective": "Client Success & Relationship Management",
            "client_opportunities": client_opportunities,
            "client_success_contacts": client_contacts,
            "relationship_building_strategy": self._get_relationship_strategy(company_name),
            "mermaid_focus": "Client relationship and success management structure"
        }

    def _sustainability_analysis(self, company_name: str, company_data: Dict) -> Dict:
        """Sustainability Consultant perspective on company structure"""
        
        # Analyze sustainability alignment
        sustainability_opportunities = []
        if "breakthrough" in company_name.lower() or "fuel" in company_name.lower():
            sustainability_opportunities.append("Direct sustainability mission alignment")
        if "microsoft" in company_name.lower():
            sustainability_opportunities.append("Strong sustainability initiatives (carbon negative)")
        
        # Identify sustainability contacts
        sustainability_contacts = self._identify_sustainability_contacts(company_data)
        
        return {
            "perspective": "Sustainability & Environmental Impact",
            "sustainability_opportunities": sustainability_opportunities,
            "sustainability_contacts": sustainability_contacts,
            "environmental_alignment": self._get_environmental_alignment(company_name),
            "mermaid_focus": "Sustainability and environmental impact decision structure"
        }

    def _org_structure_analysis(self, company_name: str, company_data: Dict) -> Dict:
        """Organizational Structure Expert perspective"""
        
        # Analyze organizational complexity
        org_complexity = self._assess_org_complexity(company_name)
        
        # Identify key decision makers
        decision_makers = self._identify_decision_makers(company_data)
        
        # Analyze reporting structure
        reporting_structure = self._analyze_reporting_structure(company_name)
        
        return {
            "perspective": "Organizational Structure & Decision Making",
            "org_complexity": org_complexity,
            "key_decision_makers": decision_makers,
            "reporting_structure": reporting_structure,
            "mermaid_focus": "Complete organizational hierarchy and decision flow"
        }

    def _identify_technical_contacts(self, company_data: Dict) -> List[Dict]:
        """Identify key technical contacts"""
        contacts = []
        
        # Look for technical leadership in company data
        leadership = company_data.get("main_info", {}).get("leadership", [])
        for leader in leadership:
            title = leader.get("title", "").lower()
            if any(keyword in title for keyword in ["cto", "vp engineering", "director", "lead", "architect"]):
                contacts.append({
                    "name": leader.get("name", "Unknown"),
                    "title": leader.get("title", "Unknown"),
                    "type": "technical_leadership",
                    "priority": "high"
                })
        
        return contacts

    def _identify_ai_strategy_contacts(self, company_data: Dict) -> List[Dict]:
        """Identify AI strategy contacts"""
        contacts = []
        
        # Look for AI/strategy related roles
        leadership = company_data.get("main_info", {}).get("leadership", [])
        for leader in leadership:
            title = leader.get("title", "").lower()
            if any(keyword in title for keyword in ["strategy", "innovation", "digital", "transformation"]):
                contacts.append({
                    "name": leader.get("name", "Unknown"),
                    "title": leader.get("title", "Unknown"),
                    "type": "ai_strategy",
                    "priority": "high"
                })
        
        return contacts

    def _identify_client_success_contacts(self, company_data: Dict) -> List[Dict]:
        """Identify client success contacts"""
        contacts = []
        
        # Look for client-facing roles
        leadership = company_data.get("main_info", {}).get("leadership", [])
        for leader in leadership:
            title = leader.get("title", "").lower()
            if any(keyword in title for keyword in ["client", "customer", "account", "sales", "marketing"]):
                contacts.append({
                    "name": leader.get("name", "Unknown"),
                    "title": leader.get("title", "Unknown"),
                    "type": "client_success",
                    "priority": "medium"
                })
        
        return contacts

    def _identify_sustainability_contacts(self, company_data: Dict) -> List[Dict]:
        """Identify sustainability contacts"""
        contacts = []
        
        # Look for sustainability-related roles
        leadership = company_data.get("main_info", {}).get("leadership", [])
        for leader in leadership:
            title = leader.get("title", "").lower()
            if any(keyword in title for keyword in ["sustainability", "environment", "esg", "impact"]):
                contacts.append({
                    "name": leader.get("name", "Unknown"),
                    "title": leader.get("title", "Unknown"),
                    "type": "sustainability",
                    "priority": "high"
                })
        
        return contacts

    def _identify_decision_makers(self, company_data: Dict) -> List[Dict]:
        """Identify key decision makers"""
        decision_makers = []
        
        # Look for executive and senior leadership
        leadership = company_data.get("main_info", {}).get("leadership", [])
        for leader in leadership:
            title = leader.get("title", "").lower()
            if any(keyword in title for keyword in ["ceo", "president", "vp", "director", "head"]):
                decision_makers.append({
                    "name": leader.get("name", "Unknown"),
                    "title": leader.get("title", "Unknown"),
                    "decision_authority": "high" if any(keyword in title for keyword in ["ceo", "president", "vp"]) else "medium",
                    "type": "executive"
                })
        
        return decision_makers

    def _assess_org_complexity(self, company_name: str) -> str:
        """Assess organizational complexity"""
        if company_name in ["Microsoft", "Anheuser-Busch"]:
            return "high"
        elif company_name in ["HubSpot", "Wpromote", "Breakthrough Fuel"]:
            return "medium"
        else:
            return "low"

    def _analyze_reporting_structure(self, company_name: str) -> Dict:
        """Analyze reporting structure"""
        if company_name == "Microsoft":
            return {
                "levels": "multiple",
                "structure": "matrix_organization",
                "decision_flow": "distributed"
            }
        elif company_name in ["HubSpot", "Wpromote"]:
            return {
                "levels": "moderate",
                "structure": "flat_hierarchy",
                "decision_flow": "collaborative"
            }
        else:
            return {
                "levels": "few",
                "structure": "traditional_hierarchy",
                "decision_flow": "top_down"
            }

    def _get_technical_approach(self, company_name: str, alex_ai_score: int) -> str:
        """Get technical approach recommendation"""
        if alex_ai_score >= 80:
            return "Lead with Alex AI automation expertise and technical architecture experience"
        elif alex_ai_score >= 60:
            return "Emphasize full-stack development and technical leadership capabilities"
        else:
            return "Focus on general technical skills and problem-solving abilities"

    def _get_alex_ai_leverage_points(self, company_name: str) -> List[str]:
        """Get Alex AI leverage points for company"""
        leverage_points = []
        
        if "hubspot" in company_name.lower():
            leverage_points.extend([
                "Marketing automation workflows",
                "CRM optimization",
                "Campaign management systems"
            ])
        elif "wpromote" in company_name.lower():
            leverage_points.extend([
                "Digital marketing strategy",
                "Client portfolio management",
                "Integrated marketing teams"
            ])
        elif "breakthrough" in company_name.lower():
            leverage_points.extend([
                "Data-driven solutions",
                "Transportation optimization",
                "Sustainability metrics tracking"
            ])
        elif "microsoft" in company_name.lower():
            leverage_points.extend([
                "AI/ML platform development",
                "Cloud architecture",
                "Enterprise-scale solutions"
            ])
        
        return leverage_points

    def _get_relationship_strategy(self, company_name: str) -> str:
        """Get relationship building strategy"""
        if "daugherty" in company_name.lower():
            return "Leverage existing 9+ year relationship and network connections"
        elif "microsoft" in company_name.lower():
            return "Focus on technical innovation and sustainability alignment"
        else:
            return "Build relationships through shared values and technical expertise"

    def _get_environmental_alignment(self, company_name: str) -> str:
        """Get environmental alignment assessment"""
        if "breakthrough" in company_name.lower():
            return "Perfect alignment - direct sustainability mission"
        elif "microsoft" in company_name.lower():
            return "Strong alignment - carbon negative by 2030"
        else:
            return "Moderate alignment - general sustainability awareness"

    def _generate_consensus_recommendations(self, *analyses) -> Dict:
        """Generate consensus recommendations from all crew members"""
        return {
            "priority_score": self._calculate_priority_score(*analyses),
            "key_contacts": self._consolidate_key_contacts(*analyses),
            "application_strategy": self._consolidate_application_strategy(*analyses),
            "mermaid_model_focus": self._determine_mermaid_focus(*analyses)
        }

    def _calculate_priority_score(self, *analyses) -> int:
        """Calculate overall priority score"""
        scores = []
        for analysis in analyses:
            if "alex_ai_score" in analysis:
                scores.append(analysis["alex_ai_score"])
            elif "ai_alignment_score" in analysis:
                scores.append(analysis["ai_alignment_score"])
        
        return sum(scores) // len(scores) if scores else 50

    def _consolidate_key_contacts(self, *analyses) -> List[Dict]:
        """Consolidate key contacts from all analyses"""
        all_contacts = []
        for analysis in analyses:
            for key in analysis:
                if "contacts" in key:
                    all_contacts.extend(analysis[key])
        
        # Remove duplicates and prioritize
        unique_contacts = []
        seen_names = set()
        for contact in all_contacts:
            name = contact.get("name", "")
            if name not in seen_names and name != "Unknown":
                unique_contacts.append(contact)
                seen_names.add(name)
        
        return unique_contacts

    def _consolidate_application_strategy(self, *analyses) -> str:
        """Consolidate application strategy recommendations"""
        strategies = []
        for analysis in analyses:
            if "recommended_approach" in analysis:
                strategies.append(analysis["recommended_approach"])
            elif "relationship_building_strategy" in analysis:
                strategies.append(analysis["relationship_building_strategy"])
        
        return " | ".join(strategies) if strategies else "Standard application approach"

    def _determine_mermaid_focus(self, *analyses) -> str:
        """Determine Mermaid model focus"""
        focuses = []
        for analysis in analyses:
            if "mermaid_focus" in analysis:
                focuses.append(analysis["mermaid_focus"])
        
        return " | ".join(focuses) if focuses else "General organizational structure"

    def generate_comprehensive_mermaid_model(self, company_name: str, analysis: Dict) -> str:
        """Generate comprehensive Mermaid organizational model"""
        
        # Get consensus recommendations
        consensus = analysis["consensus_recommendations"]
        priority_score = consensus["priority_score"]
        
        # Generate Mermaid code based on company type and priority
        if priority_score >= 80:
            return self._generate_high_priority_mermaid(company_name, analysis)
        elif priority_score >= 60:
            return self._generate_medium_priority_mermaid(company_name, analysis)
        else:
            return self._generate_standard_mermaid(company_name, analysis)

    def _generate_high_priority_mermaid(self, company_name: str, analysis: Dict) -> str:
        """Generate detailed Mermaid model for high-priority companies"""
        mermaid_code = f"graph TD\n"
        mermaid_code += f"    CEO[\"CEO<br/>Strategic Leadership\"]\n"
        mermaid_code += f"    CTO[\"CTO<br/>Technical Leadership\"]\n"
        mermaid_code += f"    VP_ENG[\"VP Engineering<br/>Development Teams\"]\n"
        mermaid_code += f"    VP_MKT[\"VP Marketing<br/>Client Strategy\"]\n"
        mermaid_code += f"    AI_DIR[\"AI Strategy Director<br/>Alex AI Integration\"]\n"
        mermaid_code += f"    SUST_DIR[\"Sustainability Director<br/>Environmental Impact\"]\n"
        
        mermaid_code += f"    CEO --> CTO\n"
        mermaid_code += f"    CEO --> VP_MKT\n"
        mermaid_code += f"    CTO --> VP_ENG\n"
        mermaid_code += f"    CTO --> AI_DIR\n"
        mermaid_code += f"    VP_MKT --> SUST_DIR\n"
        
        # Add Alex AI integration points
        mermaid_code += f"    AI_DIR --> ALEX_AI[\"Alex AI System<br/>Automation & Optimization\"]\n"
        mermaid_code += f"    SUST_DIR --> ENV_METRICS[\"Environmental Metrics<br/>Sustainability Tracking\"]\n"
        
        return mermaid_code

    def _generate_medium_priority_mermaid(self, company_name: str, analysis: Dict) -> str:
        """Generate Mermaid model for medium-priority companies"""
        mermaid_code = f"graph TD\n"
        mermaid_code += f"    CEO[\"CEO\"]\n"
        mermaid_code += f"    TECH_LEAD[\"Technical Lead<br/>Development\"]\n"
        mermaid_code += f"    MKT_LEAD[\"Marketing Lead<br/>Client Relations\"]\n"
        mermaid_code += f"    AI_SPEC[\"AI Specialist<br/>Automation\"]\n"
        
        mermaid_code += f"    CEO --> TECH_LEAD\n"
        mermaid_code += f"    CEO --> MKT_LEAD\n"
        mermaid_code += f"    TECH_LEAD --> AI_SPEC\n"
        
        return mermaid_code

    def _generate_standard_mermaid(self, company_name: str, analysis: Dict) -> str:
        """Generate standard Mermaid model"""
        mermaid_code = f"graph TD\n"
        mermaid_code += f"    CEO[\"CEO\"]\n"
        mermaid_code += f"    DIR1[\"Director 1\"]\n"
        mermaid_code += f"    DIR2[\"Director 2\"]\n"
        mermaid_code += f"    MGR1[\"Manager 1\"]\n"
        mermaid_code += f"    MGR2[\"Manager 2\"]\n"
        
        mermaid_code += f"    CEO --> DIR1\n"
        mermaid_code += f"    CEO --> DIR2\n"
        mermaid_code += f"    DIR1 --> MGR1\n"
        mermaid_code += f"    DIR2 --> MGR2\n"
        
        return mermaid_code

    def run_comprehensive_analysis(self, company_data: Dict) -> Dict:
        """Run comprehensive analysis for all companies"""
        results = {}
        
        for company_name, data in company_data.items():
            print(f"Alex AI Crew analyzing {company_name}...")
            
            # Analyze company structure
            analysis = self.analyze_company_structure(company_name, data)
            
            # Generate Mermaid model
            mermaid_model = self.generate_comprehensive_mermaid_model(company_name, analysis)
            analysis["mermaid_model"] = mermaid_model
            
            results[company_name] = analysis
        
        return results

    # Sample company data (would normally come from web scraping)
    sample_company_data = {
        "Microsoft": {
            "alex_ai_score": 65,
            "priority": "high",
            "main_info": {
                "leadership": [
                    {"name": "Satya Nadella", "title": "CEO"},
                    {"name": "Scott Guthrie", "title": "Executive VP, Cloud + AI"},
                    {"name": "Rajesh Jha", "title": "Executive VP, Experiences + Devices"}
                ]
            }
        },
        "HubSpot": {
            "alex_ai_score": 85,
            "priority": "high",
            "main_info": {
                "leadership": [
                    {"name": "Yamini Rangan", "title": "CEO"},
                    {"name": "Dharmesh Shah", "title": "CTO & Co-founder"},
                    {"name": "Brian Halligan", "title": "Executive Chair & Co-founder"}
                ]
            }
        }
    }
    
    # Initialize Alex AI crew
    alex_ai_crew = AlexAICrewMermaidModels()
    
    # Run comprehensive analysis
    results = alex_ai_crew.run_comprehensive_analysis(sample_company_data)
    
    # Save results
    with open("alex_ai_crew_analysis_results.json", 'w') as f:
        json.dump(results, f, indent=2)
    
    print("Alex AI Crew analysis completed!")
    print(f"Analyzed {len(results)} companies")
    
    return results

if __name__ == "__main__":
    main()
