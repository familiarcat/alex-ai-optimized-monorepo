#!/usr/bin/env python3
"""
N8N Sync Monitor
================
Real-time monitoring system for N8N bi-directional sync operations
"""

import os
import sys
import json
import time
import requests
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import logging
from dataclasses import dataclass

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@dataclass
class SyncStatus:
    """Sync status data class"""
    is_healthy: bool
    last_sync: Optional[str]
    total_workflows: int
    active_workflows: int
    sync_errors: int
    performance_metrics: Dict

class N8NSyncMonitor:
    def __init__(self):
        self.n8n_url = os.getenv('N8N_URL', 'https://n8n.pbradygeorgen.com')
        self.n8n_api_key = os.getenv('N8N_API_KEY')
        self.monitor_interval = int(os.getenv('MONITOR_INTERVAL', '60'))  # seconds
        self.alert_threshold = int(os.getenv('ALERT_THRESHOLD', '5'))  # error threshold
        
    def check_n8n_health(self) -> bool:
        """Check N8N instance health"""
        try:
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.n8n_url}/health",
                headers=headers,
                timeout=10
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f"N8N health check failed: {e}")
            return False
    
    def get_workflow_status(self) -> Dict:
        """Get workflow status from N8N"""
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
                
                active_workflows = [w for w in workflows if w.get('active', False)]
                
                return {
                    'total_workflows': len(workflows),
                    'active_workflows': len(active_workflows),
                    'workflows': workflows
                }
            else:
                logger.error(f"Failed to fetch workflows: {response.status_code}")
                return {'total_workflows': 0, 'active_workflows': 0, 'workflows': []}
                
        except Exception as e:
            logger.error(f"Error fetching workflow status: {e}")
            return {'total_workflows': 0, 'active_workflows': 0, 'workflows': []}
    
    def check_sync_health(self) -> SyncStatus:
        """Check overall sync health"""
        try:
            # Check N8N health
            n8n_healthy = self.check_n8n_health()
            
            # Get workflow status
            workflow_status = self.get_workflow_status()
            
            # Load sync history
            sync_history_file = 'n8n-sync-history.json'
            sync_errors = 0
            last_sync = None
            
            if os.path.exists(sync_history_file):
                try:
                    with open(sync_history_file, 'r') as f:
                        sync_history = json.load(f)
                    
                    last_sync = sync_history.get('last_sync')
                    sync_operations = sync_history.get('sync_operations', [])
                    
                    # Count recent errors (last 24 hours)
                    cutoff_time = datetime.now() - timedelta(hours=24)
                    for op in sync_operations:
                        if op.get('timestamp'):
                            op_time = datetime.fromisoformat(op['timestamp'].replace('Z', '+00:00'))
                            if op_time > cutoff_time and op.get('status') == 'failed':
                                sync_errors += 1
                                
                except Exception as e:
                    logger.error(f"Failed to load sync history: {e}")
            
            # Calculate performance metrics
            performance_metrics = {
                'n8n_response_time': self.measure_n8n_response_time(),
                'sync_frequency': self.calculate_sync_frequency(),
                'error_rate': sync_errors / max(1, len(sync_history.get('sync_operations', []))) if 'sync_history' in locals() else 0
            }
            
            # Determine overall health
            is_healthy = (
                n8n_healthy and 
                sync_errors < self.alert_threshold and
                performance_metrics['n8n_response_time'] < 5.0
            )
            
            return SyncStatus(
                is_healthy=is_healthy,
                last_sync=last_sync,
                total_workflows=workflow_status['total_workflows'],
                active_workflows=workflow_status['active_workflows'],
                sync_errors=sync_errors,
                performance_metrics=performance_metrics
            )
            
        except Exception as e:
            logger.error(f"Error checking sync health: {e}")
            return SyncStatus(
                is_healthy=False,
                last_sync=None,
                total_workflows=0,
                active_workflows=0,
                sync_errors=999,
                performance_metrics={}
            )
    
    def measure_n8n_response_time(self) -> float:
        """Measure N8N API response time"""
        try:
            start_time = time.time()
            headers = {
                'X-N8N-API-KEY': self.n8n_api_key,
                'Content-Type': 'application/json'
            }
            
            response = requests.get(
                f"{self.n8n_url}/api/v1/workflows",
                headers=headers,
                timeout=10
            )
            
            end_time = time.time()
            return end_time - start_time
            
        except Exception as e:
            logger.error(f"Failed to measure response time: {e}")
            return 999.0
    
    def calculate_sync_frequency(self) -> str:
        """Calculate sync frequency from history"""
        try:
            sync_history_file = 'n8n-sync-history.json'
            if not os.path.exists(sync_history_file):
                return "No sync history"
            
            with open(sync_history_file, 'r') as f:
                sync_history = json.load(f)
            
            sync_operations = sync_history.get('sync_operations', [])
            if not sync_operations:
                return "No sync operations"
            
            # Calculate average time between syncs
            timestamps = []
            for op in sync_operations:
                if op.get('timestamp'):
                    try:
                        op_time = datetime.fromisoformat(op['timestamp'].replace('Z', '+00:00'))
                        timestamps.append(op_time)
                    except:
                        continue
            
            if len(timestamps) < 2:
                return "Insufficient data"
            
            timestamps.sort()
            intervals = []
            for i in range(1, len(timestamps)):
                interval = (timestamps[i] - timestamps[i-1]).total_seconds() / 60  # minutes
                intervals.append(interval)
            
            avg_interval = sum(intervals) / len(intervals)
            
            if avg_interval < 60:
                return f"Every {avg_interval:.1f} minutes"
            elif avg_interval < 1440:
                return f"Every {avg_interval/60:.1f} hours"
            else:
                return f"Every {avg_interval/1440:.1f} days"
                
        except Exception as e:
            logger.error(f"Failed to calculate sync frequency: {e}")
            return "Error calculating frequency"
    
    def generate_dashboard_data(self) -> Dict:
        """Generate dashboard data for web interface"""
        try:
            sync_status = self.check_sync_health()
            workflow_status = self.get_workflow_status()
            
            # Get recent sync operations
            recent_operations = []
            sync_history_file = 'n8n-sync-history.json'
            if os.path.exists(sync_history_file):
                try:
                    with open(sync_history_file, 'r') as f:
                        sync_history = json.load(f)
                    
                    sync_operations = sync_history.get('sync_operations', [])
                    # Get last 10 operations
                    recent_operations = sync_operations[-10:]
                    
                except Exception as e:
                    logger.error(f"Failed to load recent operations: {e}")
            
            dashboard_data = {
                'timestamp': datetime.now().isoformat(),
                'sync_status': {
                    'is_healthy': sync_status.is_healthy,
                    'last_sync': sync_status.last_sync,
                    'total_workflows': sync_status.total_workflows,
                    'active_workflows': sync_status.active_workflows,
                    'sync_errors': sync_status.sync_errors,
                    'performance_metrics': sync_status.performance_metrics
                },
                'workflow_status': workflow_status,
                'recent_operations': recent_operations,
                'alerts': self.generate_alerts(sync_status)
            }
            
            return dashboard_data
            
        except Exception as e:
            logger.error(f"Failed to generate dashboard data: {e}")
            return {'error': str(e)}
    
    def generate_alerts(self, sync_status: SyncStatus) -> List[Dict]:
        """Generate alerts based on sync status"""
        alerts = []
        
        if not sync_status.is_healthy:
            alerts.append({
                'level': 'critical',
                'message': 'Sync system is unhealthy',
                'timestamp': datetime.now().isoformat()
            })
        
        if sync_status.sync_errors >= self.alert_threshold:
            alerts.append({
                'level': 'warning',
                'message': f'High sync error count: {sync_status.sync_errors}',
                'timestamp': datetime.now().isoformat()
            })
        
        if sync_status.performance_metrics.get('n8n_response_time', 0) > 5.0:
            alerts.append({
                'level': 'warning',
                'message': f'Slow N8N response time: {sync_status.performance_metrics["n8n_response_time"]:.2f}s',
                'timestamp': datetime.now().isoformat()
            })
        
        if not sync_status.last_sync:
            alerts.append({
                'level': 'info',
                'message': 'No recent sync operations detected',
                'timestamp': datetime.now().isoformat()
            })
        else:
            last_sync_time = datetime.fromisoformat(sync_status.last_sync.replace('Z', '+00:00'))
            time_since_sync = datetime.now() - last_sync_time.replace(tzinfo=None)
            
            if time_since_sync > timedelta(hours=24):
                alerts.append({
                    'level': 'warning',
                    'message': f'No sync in {time_since_sync.days} days',
                    'timestamp': datetime.now().isoformat()
                })
        
        return alerts
    
    def save_dashboard_data(self, dashboard_data: Dict):
        """Save dashboard data to file"""
        try:
            dashboard_file = 'n8n-sync-dashboard.json'
            with open(dashboard_file, 'w') as f:
                json.dump(dashboard_data, f, indent=2)
            
            logger.info(f"Dashboard data saved: {dashboard_file}")
            
        except Exception as e:
            logger.error(f"Failed to save dashboard data: {e}")
    
    def run_monitor(self):
        """Run the monitoring loop"""
        logger.info("🔍 Starting N8N Sync Monitor...")
        
        try:
            while True:
                # Generate dashboard data
                dashboard_data = self.generate_dashboard_data()
                
                # Save dashboard data
                self.save_dashboard_data(dashboard_data)
                
                # Log status
                sync_status = dashboard_data.get('sync_status', {})
                logger.info(f"Monitor check - Healthy: {sync_status.get('is_healthy')}, "
                           f"Workflows: {sync_status.get('active_workflows')}/{sync_status.get('total_workflows')}, "
                           f"Errors: {sync_status.get('sync_errors')}")
                
                # Log alerts
                alerts = dashboard_data.get('alerts', [])
                for alert in alerts:
                    if alert['level'] == 'critical':
                        logger.critical(f"ALERT: {alert['message']}")
                    elif alert['level'] == 'warning':
                        logger.warning(f"ALERT: {alert['message']}")
                    else:
                        logger.info(f"INFO: {alert['message']}")
                
                # Wait for next check
                time.sleep(self.monitor_interval)
                
        except KeyboardInterrupt:
            logger.info("Monitor stopped by user")
        except Exception as e:
            logger.error(f"Monitor error: {e}")

def main():
    """Main function"""
    print("🔍 N8N Sync Monitor")
    print("=" * 30)
    
    # Check environment variables
    if not os.getenv('N8N_API_KEY'):
        print("❌ Error: N8N_API_KEY environment variable not set")
        sys.exit(1)
    
    # Initialize monitor
    monitor = N8NSyncMonitor()
    
    # Run monitor
    monitor.run_monitor()

if __name__ == "__main__":
    main()
