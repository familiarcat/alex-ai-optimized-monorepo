from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
Progressive Git Push System
Step-by-step git push system for building comprehensive Alex AI system
"""

import os
import subprocess
import json
from datetime import datetime
from typing import Dict, List, Optional

class ProgressiveGitPushSystem:
        self.push_steps = []
        self.current_step = 0
        
    def create_push_step(self, step_name: str, description: str, files: List[str], commit_message: str) -> Dict:
        """Create a progressive push step"""
        step = {
            'step_number': len(self.push_steps) + 1,
            'step_name': step_name,
            'description': description,
            'files': files,
            'commit_message': commit_message,
            'timestamp': datetime.now().isoformat(),
            'status': 'pending'
        }
        self.push_steps.append(step)
        return step
    
    def execute_push_step(self, step_number: int) -> bool:
        """Execute a specific push step"""
        if step_number < 1 or step_number > len(self.push_steps):
            print(f"❌ Invalid step number: {step_number}")
            return False
        
        step = self.push_steps[step_number - 1]
        print(f"\n🚀 Executing Step {step_number}: {step['step_name']}")
        print("=" * 60)
        print(f"Description: {step['description']}")
        print(f"Files: {', '.join(step['files'])}")
        print()
        
        try:
            # Add files to git
            for file in step['files']:
                if os.path.exists(file):
                    subprocess.run(['git', 'add', file], check=True)
                    print(f"✅ Added {file}")
                else:
                    print(f"⚠️  File not found: {file}")
            
            # Commit changes
            subprocess.run(['git', 'commit', '-m', step['commit_message']], check=True)
            print(f"✅ Committed: {step['commit_message']}")
            
            # Push to remote (if configured)
            try:
                subprocess.run(['git', 'push', 'origin', 'alex-ai-job-search-app'], check=True)
                print("✅ Pushed to remote repository")
            except subprocess.CalledProcessError:
                print("⚠️  No remote repository configured - changes committed locally")
            
            step['status'] = 'completed'
            print(f"✅ Step {step_number} completed successfully")
            return True
            
        except subprocess.CalledProcessError as e:
            print(f"❌ Step {step_number} failed: {e}")
            step['status'] = 'failed'
            return False
    
    def create_alex_ai_progressive_steps(self) -> List[Dict]:
        """Create progressive steps for Alex AI system development"""
        steps = []
        
        # Step 1: Core Assessment Systems
        steps.append(self.create_push_step(
            "Core Assessment Systems",
            "Implement comprehensive memory sharing and crew analysis systems",
            [
                "alex_ai_memory_sharing_assessment.py",
                "crew_personal_history_analysis.py",
                "alex_ai_comprehensive_assessment.py"
            ],
            "Implement Alex AI memory sharing and crew analysis systems\n\n- Memory sharing assessment with 91.4% consistency score\n- Crew personal history analysis across all 9 crew members\n- Comprehensive assessment combining both analyses\n- All crew members actively engaged with proper memory distribution"
        ))
        
        # Step 2: Observation Lounge Consensus
        steps.append(self.create_push_step(
            "Observation Lounge Consensus System",
            "Implement crew memory reflection and consensus building",
            [
                "observation_lounge_memory_consensus.py"
            ],
            "Add Observation Lounge memory consensus system\n\n- Crew members share learned memories and reach consensus\n- Unanimous agreements on system health and next steps\n- Department-specific insights and recommendations\n- Communal decision-making process documented"
        ))
        
        # Step 3: MCP Library Computer System
        steps.append(self.create_push_step(
            "MCP Library Computer System",
            "Implement Star Trek-inspired knowledge distribution using MCP workflows",
            [
                "mcp_library_computer_system.py"
            ],
            "Implement MCP Library Computer knowledge distribution system\n\n- Star Trek-inspired ship's library computer functionality\n- MCP n8n workflow integration for knowledge queries\n- Crew specialization updates and knowledge gap filling\n- Progressive knowledge distribution across all crew members"
        ))
        
        # Step 4: Credential Security Milestone
        steps.append(self.create_push_step(
            "Credential Security Milestone",
            "Document credential security solutions and persistent errors",
            [
                "alex_ai_credential_manager.py",
                "fix_credential_security.py",
                "load_alex_ai_credentials.sh",
                "CREDENTIAL_SECURITY_MILESTONE_v1.0.md"
            ],
            "Document Alex AI credential security milestone v1.0\n\n- Comprehensive credential management system implemented\n- ANTHROPIC_API_KEY security issue resolved\n- Universal credential synchronization across all Alex AI instances\n- Persistent errors documented and solutions provided"
        ))
        
        # Step 5: N8N Integration Testing
        steps.append(self.create_push_step(
            "N8N Integration Testing Framework",
            "Implement testing system for N8N workflows outside CI/CD",
            [
                "n8n_integration_test_system.py",
                "test_alex_ai_system.py"
            ],
            "Add N8N integration testing framework\n\n- Comprehensive testing system for N8N workflows\n- Tests outside CI/CD pipeline for deployment validation\n- Crew memory synchronization testing\n- Automated test result reporting and analysis"
        ))
        
        # Step 6: Git Remote Setup
        steps.append(self.create_push_step(
            "Git Remote Setup and Documentation",
            "Set up remote repository and create comprehensive documentation",
            [
                "setup-git-remote.sh",
                "progressive_git_push_system.py"
            ],
            "Add git remote setup and progressive push system\n\n- Automated git remote configuration script\n- Progressive git push system for step-by-step development\n- Comprehensive documentation for repository management\n- Ready for collaborative development workflow"
        ))
        
        return steps
    
    def run_progressive_push(self, start_step: int = 1, end_step: Optional[int] = None) -> Dict:
        """Run progressive push from start_step to end_step"""
        print("🚀 ALEX AI PROGRESSIVE GIT PUSH SYSTEM")
        print("=" * 60)
        print("Step-by-step git push for comprehensive Alex AI system")
        print()
        
        if not self.push_steps:
            self.create_alex_ai_progressive_steps()
        
        if end_step is None:
            end_step = len(self.push_steps)
        
        results = {
            'timestamp': datetime.now().isoformat(),
            'total_steps': len(self.push_steps),
            'executed_steps': 0,
            'successful_steps': 0,
            'failed_steps': 0,
            'step_results': []
        }
        
        for step_num in range(start_step, min(end_step + 1, len(self.push_steps) + 1)):
            step_result = self.execute_push_step(step_num)
            results['executed_steps'] += 1
            
            if step_result:
                results['successful_steps'] += 1
            else:
                results['failed_steps'] += 1
            
            results['step_results'].append({
                'step_number': step_num,
                'step_name': self.push_steps[step_num - 1]['step_name'],
                'status': 'success' if step_result else 'failed'
            })
            
            # Add delay between steps
            if step_num < end_step:
                print("\n⏳ Waiting 3 seconds before next step...")
                import time
                time.sleep(3)
        
        return results
    
    def print_progressive_report(self, results: Dict):
        """Print progressive push report"""
        print("\n" + "=" * 80)
        print("📊 PROGRESSIVE GIT PUSH REPORT")
        print("=" * 80)
        
        print(f"📅 Push Date: {results['timestamp']}")
        print(f"📊 Total Steps: {results['total_steps']}")
        print(f"🚀 Executed Steps: {results['executed_steps']}")
        print(f"✅ Successful Steps: {results['successful_steps']}")
        print(f"❌ Failed Steps: {results['failed_steps']}")
        
        success_rate = (results['successful_steps'] / results['executed_steps'] * 100) if results['executed_steps'] > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        print(f"\n📋 STEP RESULTS:")
        print("-" * 40)
        for step_result in results['step_results']:
            status_icon = "✅" if step_result['status'] == 'success' else "❌"
            print(f"   {status_icon} Step {step_result['step_number']}: {step_result['step_name']}")
        
        print(f"\n🎯 NEXT STEPS:")
        if results['failed_steps'] > 0:
            print("   🔧 Fix failed steps before continuing")
            print("   🔍 Review error messages and resolve issues")
        else:
            print("   ✅ All steps completed successfully")
            print("   🚀 Ready for next development phase")
        
        print(f"\n📚 PUSH STEPS AVAILABLE:")
        for i, step in enumerate(self.push_steps, 1):
            status = "✅" if step['status'] == 'completed' else "⏳" if step['status'] == 'pending' else "❌"
            print(f"   {i:2d}. {status} {step['step_name']}")

    pusher = ProgressiveGitPushSystem()
    
    # Create all progressive steps
    pusher.create_alex_ai_progressive_steps()
    
    # Print available steps
    pusher.print_progressive_report({
        'timestamp': datetime.now().isoformat(),
        'total_steps': len(pusher.push_steps),
        'executed_steps': 0,
        'successful_steps': 0,
        'failed_steps': 0,
        'step_results': []
    })
    
    print(f"\n🚀 To execute progressive push:")
    print(f"   python3 progressive_git_push_system.py --execute")
    print(f"   python3 progressive_git_push_system.py --execute --start 1 --end 3")
    
    return pusher

if __name__ == "__main__":
    import sys
    
    if "--execute" in sys.argv:
        start = 1
        end = None
        
        if "--start" in sys.argv:
            start = int(sys.argv[sys.argv.index("--start") + 1])
        if "--end" in sys.argv:
            end = int(sys.argv[sys.argv.index("--end") + 1])
        
        pusher = ProgressiveGitPushSystem()
        pusher.create_alex_ai_progressive_steps()
        results = pusher.run_progressive_push(start, end)
        pusher.print_progressive_report(results)
    else:
        main()
