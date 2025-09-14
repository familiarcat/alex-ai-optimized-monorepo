#!/usr/bin/env python3
"""
Check App Status
Shows the status of all running Alex AI specialized apps
"""

import subprocess
import json
import time
from datetime import datetime

def check_port_status(port):
    """Check if a port is in use"""
    try:
        result = subprocess.run(['lsof', '-i', f':{port}'], 
                              capture_output=True, text=True, timeout=5)
        return result.returncode == 0
    except:
        return False

def get_app_info():
    """Get information about all Alex AI apps"""
    apps = {
        "alex-ai-master-dashboard": {
            "port": 3000,
            "crew_lead": "Captain Picard",
            "description": "Master dashboard and command center",
            "url": "http://localhost:3000"
        },
        "alex-ai-data-analytics": {
            "port": 3001,
            "crew_lead": "Commander Data",
            "description": "Advanced analytics and data processing platform",
            "url": "http://localhost:3001"
        },
        "alex-ai-communication-hub": {
            "port": 3002,
            "crew_lead": "Lieutenant Uhura", 
            "description": "Unified communication and notification system",
            "url": "http://localhost:3002"
        },
        "alex-ai-job-search": {
            "port": 3003,
            "crew_lead": "Commander Data + Lieutenant Uhura",
            "description": "AI-powered job search platform",
            "url": "http://localhost:3003"
        },
        "alex-ai-commercial": {
            "port": 3004,
            "crew_lead": "Quark + Dr. Crusher",
            "description": "Monetized Alex AI platform with ethical business practices",
            "url": "http://localhost:3004"
        }
    }
    return apps

def main():
    """Main execution function"""
    print("🚀 Alex AI Specialized Apps Status Check")
    print("=" * 50)
    
    apps = get_app_info()
    
    print(f"📅 Check Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print()
    
    running_apps = []
    stopped_apps = []
    
    for app_name, app_info in apps.items():
        is_running = check_port_status(app_info["port"])
        
        if is_running:
            status = "🟢 RUNNING"
            running_apps.append(app_name)
        else:
            status = "🔴 STOPPED"
            stopped_apps.append(app_name)
        
        print(f"{status} | {app_name}")
        print(f"    Port: {app_info['port']}")
        print(f"    Crew Lead: {app_info['crew_lead']}")
        print(f"    Description: {app_info['description']}")
        print(f"    URL: {app_info['url']}")
        print()
    
    # Summary
    print("📊 SUMMARY")
    print("-" * 20)
    print(f"🟢 Running Apps: {len(running_apps)}")
    for app in running_apps:
        print(f"   • {app}")
    
    print(f"🔴 Stopped Apps: {len(stopped_apps)}")
    for app in stopped_apps:
        print(f"   • {app}")
    
    print()
    print("🌐 Quick Access URLs:")
    for app_name, app_info in apps.items():
        if check_port_status(app_info["port"]):
            print(f"   • {app_name}: {app_info['url']}")
    
    return {
        "timestamp": datetime.now().isoformat(),
        "running_apps": running_apps,
        "stopped_apps": stopped_apps,
        "total_apps": len(apps),
        "running_count": len(running_apps)
    }

if __name__ == "__main__":
    main()
