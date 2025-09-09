from scripts.utilities.shared_functions import *
#!/usr/bin/env python3
"""
N8N Bi-Directional Sync System
==============================
This script implements comprehensive bi-directional synchronization between
the development environment and N8N production instance at n8n.pbradygeorgen.com
"""

import os
import sys
import json
import time
import requests
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('n8n-sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class N8NBidirectionalSync:
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.workflows_dir = 'workflows'
        self.analysis_dir = 'analysis'
        self.sync_log_file = 'n8n-sync-history.json'
        
        # Ensure directories exist
        os.makedirs(self.workflows_dir, exist_ok=True)
        os.makedirs(self.analysis_dir, exist_ok=True)
        
        # Load sync history
        self.sync_history = self.load_sync_history()
        
    def load_sync_history(self) -> Dict:
        """Load sync history from file"""
        if os.path.exists(self.sync_log_file):
            try:
                with open(self.sync_log_file, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Failed to load sync history: {e}")
        return {
            'last_sync': None,
            'workflow_hashes': {},
            'sync_operations': [],
            'conflicts': []
        }
    
    def save_sync_history(self):
        """Save sync history to file"""
        try:
            with open(self.sync_log_file, 'w') as f:
                json.dump(self.sync_history, f, indent=2)
        except Exception as e:
            logger.error(f"Failed to save sync history: {e}")
    
    def get_workflow_hash(self, workflow_data: Dict) -> str:
        """Generate hash for workflow data"""
        # Create a stable hash based on workflow structure
        workflow_str = json.dumps(workflow_data, sort_keys=True)
        return hashlib.sha256(workflow_str.encode()).hexdigest()[:16]
    
    def fetch_n8n_workflows(self) -> List[Dict]:
        """Fetch all workflows from N8N production"""
        try:
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.n8n_url}/api/v1/workflows",
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                workflows = data.get('data', [])
                logger.info(f"Fetched {len(workflows)} workflows from N8N")
                return workflows
            else:
                logger.error(f"Failed to fetch workflows: {response.status_code}")
                return []
                
        except Exception as e:
            logger.error(f"Error fetching N8N workflows: {e}")
            return []
    
    def sync_workflow_from_n8n(self, workflow: Dict) -> bool:
        """Sync a single workflow from N8N to local development"""
        try:
            workflow_name = workflow.get('name', 'unnamed')
            workflow_id = workflow.get('id')
            
            # Create safe filename
            safe_name = workflow_name.replace(' ', '_').replace('/', '_')
            local_file = os.path.join(self.workflows_dir, f"{safe_name}.json")
            
            # Generate hash for change detection
            workflow_hash = self.get_workflow_hash(workflow)
            
            # Check if workflow has changed
            if workflow_id in self.sync_history['workflow_hashes']:
                if self.sync_history['workflow_hashes'][workflow_id] == workflow_hash:
                    logger.debug(f"No changes detected for workflow: {workflow_name}")
                    return True
            
            # Create backup if file exists
            if os.path.exists(local_file):
                backup_file = f"{local_file}.backup.{int(time.time())}"
                os.rename(local_file, backup_file)
                logger.info(f"Created backup: {backup_file}")
            
            # Save workflow to local file
            with open(local_file, 'w') as f:
                json.dump(workflow, f, indent=2)
            
            # Update sync history
            self.sync_history['workflow_hashes'][workflow_id] = workflow_hash
            
            # Log sync operation
            sync_operation = {
                'timestamp': datetime.now().isoformat(),
                'operation': 'n8n_to_dev',
                'workflow_name': workflow_name,
                'workflow_id': workflow_id,
                'file_path': local_file,
                'hash': workflow_hash
            }
            self.sync_history['sync_operations'].append(sync_operation)
            
            logger.info(f"Synced workflow from N8N: {workflow_name}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to sync workflow {workflow_name}: {e}")
            return False
    
    def analyze_workflow_changes(self, workflow: Dict) -> Dict:
        """Analyze workflow for changes and potential issues"""
        try:
            workflow_name = workflow.get('name', 'unnamed')
            nodes = workflow.get('nodes', [])
            connections = workflow.get('connections', {})
            
            analysis = {
                'workflow_name': workflow_name,
                'analysis_timestamp': datetime.now().isoformat(),
                'change_source': 'n8n_production',
                'metrics': {
                    'node_count': len(nodes),
                    'connection_count': len(connections),
                    'webhook_count': len([n for n in nodes if n.get('type') == 'n8n-nodes-base.webhook']),
                    'function_count': len([n for n in nodes if n.get('type') == 'n8n-nodes-base.function']),
                    'http_request_count': len([n for n in nodes if n.get('type') == 'n8n-nodes-base.httpRequest'])
                },
                'issues': [],
                'recommendations': []
            }
            
            # Check for potential issues
            webhook_nodes = [n for n in nodes if n.get('type') == 'n8n-nodes-base.webhook']
            if not webhook_nodes:
                analysis['issues'].append("No webhook triggers found")
                analysis['recommendations'].append("Consider adding webhook triggers for external access")
            
            response_nodes = [n for n in nodes if n.get('type') == 'n8n-nodes-base.respondToWebhook']
            if not response_nodes:
                analysis['issues'].append("No response nodes found")
                analysis['recommendations'].append("Add response nodes for proper webhook responses")
            
            function_nodes = [n for n in nodes if n.get('type') == 'n8n-nodes-base.function']
            if function_nodes:
                analysis['issues'].append("Contains custom functions - review code")
                analysis['recommendations'].append("Review custom function code for security and functionality")
            
            http_nodes = [n for n in nodes if n.get('type') == 'n8n-nodes-base.httpRequest']
            if http_nodes:
                analysis['issues'].append("Contains HTTP requests - verify endpoints")
                analysis['recommendations'].append("Verify all HTTP endpoints are accessible and secure")
            
            # Check for duplicate node names
            node_names = [n.get('name', '') for n in nodes]
            duplicates = [name for name in set(node_names) if node_names.count(name) > 1]
            if duplicates:
                analysis['issues'].append(f"Duplicate node names: {duplicates}")
                analysis['recommendations'].append("Rename duplicate nodes to avoid conflicts")
            
            # Add general recommendations
            analysis['recommendations'].extend([
                "Review changes for security implications",
                "Test workflow functionality in development",
                "Consider impact on dependent workflows",
                "Monitor performance after deployment"
            ])
            
            return analysis
            
        except Exception as e:
            logger.error(f"Failed to analyze workflow {workflow_name}: {e}")
            return {'error': str(e)}
    
    def save_analysis(self, analysis: Dict):
        """Save workflow analysis to file"""
        try:
            workflow_name = analysis.get('workflow_name', 'unnamed')
            safe_name = workflow_name.replace(' ', '_').replace('/', '_')
            analysis_file = os.path.join(
                self.analysis_dir, 
                f"{safe_name}-analysis-{int(time.time())}.json"
            )
            
            with open(analysis_file, 'w') as f:
                json.dump(analysis, f, indent=2)
            
            logger.info(f"Analysis saved: {analysis_file}")
            
        except Exception as e:
            logger.error(f"Failed to save analysis: {e}")
    
    def sync_from_n8n_to_dev(self) -> Dict:
        """Sync all workflows from N8N production to development"""
        logger.info("🔄 Starting sync from N8N production to development...")
        
        # Fetch workflows from N8N
        workflows = self.fetch_n8n_workflows()
        
        if not workflows:
            logger.error("No workflows fetched from N8N")
            return {'success': False, 'error': 'No workflows fetched'}
        
        sync_results = {
            'success': True,
            'timestamp': datetime.now().isoformat(),
            'total_workflows': len(workflows),
            'synced_workflows': 0,
            'failed_workflows': 0,
            'analyses_created': 0,
            'workflows': []
        }
        
        for workflow in workflows:
            workflow_name = workflow.get('name', 'unnamed')
            workflow_id = workflow.get('id')
            
            try:
                # Sync workflow
                if self.sync_workflow_from_n8n(workflow):
                    sync_results['synced_workflows'] += 1
                    
                    # Analyze workflow
                    analysis = self.analyze_workflow_changes(workflow)
                    if 'error' not in analysis:
                        self.save_analysis(analysis)
                        sync_results['analyses_created'] += 1
                    
                    sync_results['workflows'].append({
                        'name': workflow_name,
                        'id': workflow_id,
                        'status': 'synced',
                        'analysis': analysis.get('issues', [])
                    })
                else:
                    sync_results['failed_workflows'] += 1
                    sync_results['workflows'].append({
                        'name': workflow_name,
                        'id': workflow_id,
                        'status': 'failed'
                    })
                    
            except Exception as e:
                logger.error(f"Error processing workflow {workflow_name}: {e}")
                sync_results['failed_workflows'] += 1
                sync_results['workflows'].append({
                    'name': workflow_name,
                    'id': workflow_id,
                    'status': 'error',
                    'error': str(e)
                })
        
        # Update sync history
        self.sync_history['last_sync'] = datetime.now().isoformat()
        self.save_sync_history()
        
        logger.info(f"Sync completed: {sync_results['synced_workflows']} synced, {sync_results['failed_workflows']} failed")
        return sync_results
    
    def generate_sync_report(self, sync_results: Dict) -> str:
        """Generate a comprehensive sync report"""
        report = f"""
# N8N Bi-Directional Sync Report

**Generated**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
**Source**: N8N Production (n8n.pbradygeorgen.com)
**Target**: Development Environment

## Sync Summary

- **Total Workflows**: {sync_results['total_workflows']}
- **Successfully Synced**: {sync_results['synced_workflows']}
- **Failed**: {sync_results['failed_workflows']}
- **Analyses Created**: {sync_results['analyses_created']}

## Workflow Details

"""
        
        for workflow in sync_results['workflows']:
            status_icon = "✅" if workflow['status'] == 'synced' else "❌"
            report += f"- {status_icon} **{workflow['name']}** ({workflow['id']})\n"
            
            if workflow['status'] == 'synced' and 'analysis' in workflow:
                if workflow['analysis']:
                    report += f"  - Issues: {', '.join(workflow['analysis'])}\n"
                else:
                    report += f"  - No issues detected\n"
            elif workflow['status'] == 'failed':
                report += f"  - Error: {workflow.get('error', 'Unknown error')}\n"
        
        report += f"""
## Recommendations

1. **Review Synced Workflows**: Check all successfully synced workflows
2. **Test Functionality**: Test workflows in development environment
3. **Address Issues**: Fix any issues identified in analysis
4. **Monitor Performance**: Watch for performance impacts
5. **Security Review**: Ensure all changes are secure

## Next Steps

- [ ] Review individual workflow analyses in `{self.analysis_dir}/`
- [ ] Test modified workflows in development
- [ ] Deploy to production if approved
- [ ] Monitor production performance

---
*Report generated by N8N Bi-Directional Sync System*
"""
        
        return report
    
    def run_sync(self) -> Dict:
        """Run the complete bi-directional sync process"""
        logger.info("🚀 Starting N8N Bi-Directional Sync...")
        
        try:
            # Sync from N8N to development
            sync_results = self.sync_from_n8n_to_dev()
            
            # Generate report
            report = self.generate_sync_report(sync_results)
            
            # Save report
            report_file = f"n8n-sync-report-{int(time.time())}.md"
            with open(report_file, 'w') as f:
                f.write(report)
            
            logger.info(f"Sync report saved: {report_file}")
            
            return {
                'success': True,
                'sync_results': sync_results,
                'report_file': report_file
            }
            
        except Exception as e:
            logger.error(f"Sync failed: {e}")
            return {'success': False, 'error': str(e)}

    print("🔄 N8N Bi-Directional Sync System")
    print("=" * 50)
    
    # Check environment variables
    if not os.getenv('N8N_API_KEY'):
        print("❌ Error: N8N_API_KEY environment variable not set")
        sys.exit(1)
    
    # Initialize sync system
    sync_system = N8NBidirectionalSync()
    
    # Run sync
    result = sync_system.run_sync()
    
    if result['success']:
        print("✅ Sync completed successfully!")
        print(f"📊 Report: {result['report_file']}")
    else:
        print(f"❌ Sync failed: {result['error']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
