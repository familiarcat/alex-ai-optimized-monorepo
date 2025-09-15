#!/usr/bin/env python3
"""
UI-N8N API Change Tracker
========================
Track UI design decisions that require N8N API changes
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any, Optional

class UIN8NAPITracker:
    def __init__(self):
        self.tracker_file = "ui-n8n-api-changes.json"
        self.memory_file = "ui-design-memory.json"
        self.changes = self.load_existing_changes()
        self.memory = self.load_design_memory()
    
    def load_existing_changes(self) -> List[Dict[str, Any]]:
        """Load existing UI-N8N API changes"""
        if os.path.exists(self.tracker_file):
            try:
                with open(self.tracker_file, 'r') as f:
                    return json.load(f)
            except:
                return []
        return []
    
    def load_design_memory(self) -> Dict[str, Any]:
        """Load UI design memory"""
        if os.path.exists(self.memory_file):
            try:
                with open(self.memory_file, 'r') as f:
                    return json.load(f)
            except:
                return {"design_decisions": [], "api_requirements": [], "n8n_workflows": {}}
        return {"design_decisions": [], "api_requirements": [], "n8n_workflows": {}}
    
    def track_ui_design_decision(self, 
                                component: str, 
                                decision: str, 
                                n8n_impact: str = None,
                                api_requirements: List[str] = None,
                                priority: str = "medium") -> Dict[str, Any]:
        """Track a UI design decision and its N8N API impact"""
        
        change_record = {
            "id": f"ui_change_{len(self.changes) + 1}",
            "timestamp": datetime.now().isoformat(),
            "component": component,
            "decision": decision,
            "n8n_impact": n8n_impact,
            "api_requirements": api_requirements or [],
            "priority": priority,
            "status": "pending",
            "crew_assignment": self.assign_crew_member(component, decision),
            "estimated_effort": self.estimate_effort(decision, n8n_impact)
        }
        
        self.changes.append(change_record)
        self.save_changes()
        
        # Update design memory
        self.update_design_memory(component, decision, n8n_impact, api_requirements)
        
        return change_record
    
    def assign_crew_member(self, component: str, decision: str) -> str:
        """Assign appropriate crew member based on component and decision"""
        component_lower = component.lower()
        decision_lower = decision.lower()
        
        if "auth" in component_lower or "security" in decision_lower:
            return "lieutenant_worf"
        elif "api" in component_lower or "data" in decision_lower:
            return "commander_data"
        elif "ui" in component_lower or "user" in decision_lower:
            return "counselor_troi"
        elif "workflow" in component_lower or "integration" in decision_lower:
            return "geordi_la_forge"
        elif "communication" in component_lower or "webhook" in decision_lower:
            return "lieutenant_uhura"
        elif "business" in component_lower or "cost" in decision_lower:
            return "quark"
        else:
            return "commander_riker"
    
    def estimate_effort(self, decision: str, n8n_impact: str) -> str:
        """Estimate effort required for N8N API changes"""
        if not n8n_impact:
            return "low"
        
        impact_lower = n8n_impact.lower()
        if "new workflow" in impact_lower or "major change" in impact_lower:
            return "high"
        elif "modify" in impact_lower or "update" in impact_lower:
            return "medium"
        else:
            return "low"
    
    def update_design_memory(self, component: str, decision: str, n8n_impact: str, api_requirements: List[str]):
        """Update design memory with new decision"""
        memory_entry = {
            "timestamp": datetime.now().isoformat(),
            "component": component,
            "decision": decision,
            "n8n_impact": n8n_impact,
            "api_requirements": api_requirements or []
        }
        
        self.memory["design_decisions"].append(memory_entry)
        
        # Update API requirements
        if api_requirements:
            for req in api_requirements:
                if req not in self.memory["api_requirements"]:
                    self.memory["api_requirements"].append(req)
        
        self.save_memory()
    
    def get_n8n_workflow_requirements(self) -> Dict[str, Any]:
        """Get current N8N workflow requirements based on UI decisions"""
        requirements = {
            "workflows_to_create": [],
            "workflows_to_modify": [],
            "api_endpoints_needed": [],
            "webhook_endpoints_needed": [],
            "crew_assignments": {}
        }
        
        for change in self.changes:
            if change["status"] == "pending" and change["n8n_impact"]:
                # Analyze N8N impact
                impact = change["n8n_impact"].lower()
                
                if "new workflow" in impact:
                    requirements["workflows_to_create"].append({
                        "component": change["component"],
                        "description": change["decision"],
                        "assigned_crew": change["crew_assignment"]
                    })
                elif "modify" in impact or "update" in impact:
                    requirements["workflows_to_modify"].append({
                        "component": change["component"],
                        "description": change["decision"],
                        "assigned_crew": change["crew_assignment"]
                    })
                
                # Track API requirements
                for req in change["api_requirements"]:
                    if req not in requirements["api_endpoints_needed"]:
                        requirements["api_endpoints_needed"].append(req)
                
                # Track crew assignments
                crew = change["crew_assignment"]
                if crew not in requirements["crew_assignments"]:
                    requirements["crew_assignments"][crew] = []
                requirements["crew_assignments"][crew].append(change["component"])
        
        return requirements
    
    def generate_crew_report(self) -> Dict[str, Any]:
        """Generate report for crew members about UI-N8N API changes"""
        requirements = self.get_n8n_workflow_requirements()
        
        report = {
            "timestamp": datetime.now().isoformat(),
            "total_changes": len(self.changes),
            "pending_changes": len([c for c in self.changes if c["status"] == "pending"]),
            "crew_assignments": requirements["crew_assignments"],
            "workflow_requirements": requirements,
            "priority_changes": [c for c in self.changes if c["priority"] == "high" and c["status"] == "pending"],
            "recent_changes": self.changes[-5:] if self.changes else []
        }
        
        return report
    
    def save_changes(self):
        """Save changes to file"""
        with open(self.tracker_file, 'w') as f:
            json.dump(self.changes, f, indent=2)
    
    def save_memory(self):
        """Save design memory to file"""
        with open(self.memory_file, 'w') as f:
            json.dump(self.memory, f, indent=2)
    
    def print_status(self):
        """Print current status of UI-N8N API changes"""
        print("🎨 UI-N8N API Change Tracker Status")
        print("=" * 50)
        print(f"📊 Total Changes: {len(self.changes)}")
        print(f"⏳ Pending Changes: {len([c for c in self.changes if c['status'] == 'pending'])}")
        print(f"✅ Completed Changes: {len([c for c in self.changes if c['status'] == 'completed'])}")
        print()
        
        if self.changes:
            print("🔥 Recent Changes:")
            for change in self.changes[-3:]:
                status_icon = "⏳" if change["status"] == "pending" else "✅"
                print(f"   {status_icon} {change['component']}: {change['decision'][:50]}...")
            print()
        
        requirements = self.get_n8n_workflow_requirements()
        if requirements["workflows_to_create"] or requirements["workflows_to_modify"]:
            print("🚀 N8N Workflow Requirements:")
            if requirements["workflows_to_create"]:
                print("   📝 Workflows to Create:")
                for wf in requirements["workflows_to_create"]:
                    print(f"      • {wf['component']} - {wf['assigned_crew']}")
            if requirements["workflows_to_modify"]:
                print("   🔧 Workflows to Modify:")
                for wf in requirements["workflows_to_modify"]:
                    print(f"      • {wf['component']} - {wf['assigned_crew']}")
            print()

def main():
    """Main function to demonstrate UI-N8N API tracking"""
    print("🎨 UI-N8N API Change Tracker")
    print("=" * 40)
    print("Initializing tracker for frontend development...")
    print()
    
    tracker = UIN8NAPITracker()
    
    # Example UI design decisions that might affect N8N API
    example_changes = [
        {
            "component": "JobCard",
            "decision": "Add real-time status updates for job applications",
            "n8n_impact": "Need new workflow for real-time job status polling",
            "api_requirements": ["GET /api/jobs/{id}/status", "WebSocket /ws/job-updates"],
            "priority": "high"
        },
        {
            "component": "AlexAICrewDashboard",
            "decision": "Add crew member activity monitoring",
            "n8n_impact": "Modify existing crew workflow to include activity tracking",
            "api_requirements": ["GET /api/crew/activity", "POST /api/crew/activity"],
            "priority": "medium"
        },
        {
            "component": "ResumeUpload",
            "decision": "Add AI-powered resume analysis with crew feedback",
            "n8n_impact": "Create new workflow for AI analysis with crew member integration",
            "api_requirements": ["POST /api/resume/analyze", "GET /api/crew/feedback"],
            "priority": "high"
        }
    ]
    
    print("📝 Tracking example UI design decisions...")
    for change in example_changes:
        tracker.track_ui_design_decision(
            component=change["component"],
            decision=change["decision"],
            n8n_impact=change["n8n_impact"],
            api_requirements=change["api_requirements"],
            priority=change["priority"]
        )
        print(f"   ✅ Tracked: {change['component']}")
    
    print()
    tracker.print_status()
    
    # Generate crew report
    report = tracker.generate_crew_report()
    
    print("👥 Crew Assignments:")
    for crew, components in report["crew_assignments"].items():
        print(f"   • {crew}: {', '.join(components)}")
    print()
    
    print("📁 Files Created:")
    print("   - ui-n8n-api-changes.json")
    print("   - ui-design-memory.json")
    print()
    
    print("✅ UI-N8N API Change Tracker ready for frontend development!")

if __name__ == "__main__":
    main()

















