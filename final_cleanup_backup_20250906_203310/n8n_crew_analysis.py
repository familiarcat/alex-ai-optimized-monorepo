#!/usr/bin/env python3
"""
N8N Crew Analysis for Brady Georgen Resume
Analyzing resume to identify best Alex AI leverage opportunities
"""

import json
from datetime import datetime

class ResumeAnalyzer:
    def __init__(self):
        self.resume_data = {
            "name": "P. Brady Georgen",
            "title": "Developer & Creative Technologist | Full-Stack Engineer | Sustainability Technology Leader",
            "experience_years": 15,
            "key_skills": [
                "React", "Node.js", "TypeScript", "Next.js", "Vue.js", "React Native",
                "AWS", "Azure", "Docker", "Terraform", "Kubernetes",
                "PostgreSQL", "MongoDB", "BigQuery", "Kafka",
                "n8n", "Cursor AI", "Claude", "ChatGPT", "Gemini",
                "Agile/Scrum Leadership", "Technical Architecture", "Cross-Functional Collaboration"
            ],
            "ai_experience": {
                "alex_ai_system": "Unified AI system integrating Cursor AI, Claude, ChatGPT, Gemini",
                "automation_platforms": ["n8n", "Custom AI Workflows"],
                "client_implementations": [
                    "Pie Guy STL - AI Administrative Consultancy",
                    "Crimson Serpents Outpost - WordPress Optimization",
                    "Ice's Plain and Fancy - AI Administrative Consultancy"
                ],
                "results": {
                    "operational_efficiency": "45% increase",
                    "order_fulfillment": "30% reduction in cycle time",
                    "client_satisfaction": "20% improvement",
                    "operational_waste": "25% reduction"
                }
            },
            "leadership_experience": {
                "bayer_project": {
                    "role": "Lead Architect & Technical Lead",
                    "team_size": "15+ developers across 3 continents",
                    "duration": "4 years",
                    "complexity": "Multi-source data integration, real-time processing, internationalization"
                },
                "daugherty_experience": "9+ years (2014-2023)",
                "freelance_leadership": "Solo architect and developer for end-to-end solutions"
            },
            "sustainability_focus": {
                "energy_efficiency": "15-25% reduction in energy consumption",
                "carbon_footprint": "20% reduction in operational carbon footprint",
                "waste_reduction": "25% reduction in operational waste",
                "green_technology": "Integration of sustainability metrics and environmental impact tracking"
            }
        }

    def analyze_alex_ai_leverage_potential(self, job_opportunities):
        """Analyze which jobs would best leverage Alex AI capabilities"""
        analysis_results = []
        
        for job in job_opportunities:
            alex_ai_score = 0
            leverage_factors = []
            
            # AI/Automation Focus
            if any(keyword in job.get('description', '').lower() for keyword in ['ai', 'automation', 'workflow', 'process optimization']):
                alex_ai_score += 30
                leverage_factors.append("AI/Automation focus aligns with Alex AI expertise")
            
            # Marketing Technology
            if any(keyword in job.get('description', '').lower() for keyword in ['marketing automation', 'campaign management', 'digital marketing', 'crm']):
                alex_ai_score += 25
                leverage_factors.append("Marketing tech aligns with Alex AI client implementations")
            
            # Data-Driven Solutions
            if any(keyword in job.get('description', '').lower() for keyword in ['data analytics', 'business intelligence', 'reporting', 'metrics']):
                alex_ai_score += 20
                leverage_factors.append("Data-driven approach matches Alex AI capabilities")
            
            # Client-Facing Role
            if any(keyword in job.get('description', '').lower() for keyword in ['client', 'consultant', 'advisor', 'strategist']):
                alex_ai_score += 15
                leverage_factors.append("Client-facing role leverages Alex AI implementation experience")
            
            # Technical Leadership
            if any(keyword in job.get('description', '').lower() for keyword in ['lead', 'architect', 'senior', 'principal', 'manager']):
                alex_ai_score += 10
                leverage_factors.append("Leadership role matches technical leadership experience")
            
            analysis_results.append({
                'company': job.get('company', ''),
                'position': job.get('position', ''),
                'alex_ai_score': alex_ai_score,
                'leverage_factors': leverage_factors,
                'recommendation': self._get_recommendation(alex_ai_score)
            })
        
        return sorted(analysis_results, key=lambda x: x['alex_ai_score'], reverse=True)

    def _get_recommendation(self, score):
        """Get recommendation based on Alex AI leverage score"""
        if score >= 70:
            return "EXCELLENT - High Alex AI leverage potential"
        elif score >= 50:
            return "GOOD - Moderate Alex AI leverage potential"
        elif score >= 30:
            return "FAIR - Some Alex AI leverage potential"
        else:
            return "LOW - Limited Alex AI leverage potential"

    def generate_crew_consensus(self, job_opportunities):
        """Generate crew consensus on best opportunities"""
        alex_ai_analysis = self.analyze_alex_ai_leverage_potential(job_opportunities)
        
        crew_consensus = {
            "timestamp": datetime.now().isoformat(),
            "crew_members": [
                "Technical Lead Analyst",
                "AI Strategy Specialist", 
                "Client Success Manager",
                "Sustainability Consultant"
            ],
            "consensus_findings": {
                "top_alex_ai_opportunities": alex_ai_analysis[:5],
                "key_insights": [
                    "Alex AI system provides competitive advantage in AI/automation roles",
                    "Client implementation experience valuable for consulting positions",
                    "Sustainability focus aligns with green technology companies",
                    "Technical leadership experience crucial for senior roles"
                ],
                "strategic_recommendations": [
                    "Prioritize roles that combine AI/automation with client-facing responsibilities",
                    "Emphasize Alex AI results in applications (45% efficiency, 30% cycle time reduction)",
                    "Target companies with digital transformation initiatives",
                    "Focus on roles requiring both technical and business acumen"
                ]
            }
        }
        
        return crew_consensus

def main():
    """Main analysis function"""
    analyzer = ResumeAnalyzer()
    
    # Sample job opportunities for analysis
    sample_jobs = [
        {
            "company": "Microsoft",
            "position": "Software Engineer - AI/ML",
            "description": "Develop AI-powered solutions, automation workflows, and machine learning models"
        },
        {
            "company": "HubSpot",
            "position": "Marketing Automation Specialist",
            "description": "Design and implement marketing automation workflows, CRM optimization, campaign management"
        },
        {
            "company": "Wpromote",
            "position": "Managing Director - Central Region",
            "description": "Lead integrated marketing teams, drive client growth, oversee digital marketing strategies"
        },
        {
            "company": "Breakthrough Fuel",
            "position": "Solutions Architect",
            "description": "Design data-driven solutions for transportation optimization, sustainability metrics, cost reduction"
        },
        {
            "company": "Veterans United",
            "position": "Software Engineer",
            "description": "Build software supporting veterans, full-stack development, client-focused solutions"
        }
    ]
    
    # Generate analysis
    crew_consensus = analyzer.generate_crew_consensus(sample_jobs)
    
    # Output results
    print("N8N Crew Analysis Results:")
    print("=" * 50)
    print(json.dumps(crew_consensus, indent=2))
    
    return crew_consensus

if __name__ == "__main__":
    main()
