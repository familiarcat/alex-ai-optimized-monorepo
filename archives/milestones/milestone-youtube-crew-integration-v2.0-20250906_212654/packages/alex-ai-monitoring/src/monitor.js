#!/usr/bin/env node
/**
 * Alex AI Monitoring and Alerting System
 * Monitors crew coordination and system health
 */

class AlexAIMonitoring {
    constructor() {
        this.alerts = [];
        this.metrics = {};
    }

    async monitorCrewCoordination() {
        console.log('👥 Monitoring crew coordination...');
        
        // Simulate crew monitoring
        const crewStatus = {
            active: 9,
            tasks: ['build', 'test', 'deploy'],
            health: 'good'
        };
        
        if (crewStatus.health !== 'good') {
            this.triggerAlert('crew-health', 'Crew coordination health degraded');
        }
        
        return crewStatus;
    }

    async monitorSystemHealth() {
        console.log('🔍 Monitoring system health...');
        
        // Simulate system health monitoring
        const systemHealth = {
            cpu: 45,
            memory: 60,
            disk: 30,
            status: 'healthy'
        };
        
        if (systemHealth.memory > 80) {
            this.triggerAlert('memory-high', 'Memory usage above 80%');
        }
        
        return systemHealth;
    }

    triggerAlert(type, message) {
        const alert = {
            type,
            message,
            timestamp: new Date().toISOString(),
            severity: 'warning'
        };
        
        this.alerts.push(alert);
        console.log(`🚨 ALERT: ${message}`);
    }

    getAlerts() {
        return this.alerts;
    }
}

// CLI interface
if (require.main === module) {
    const monitoring = new AlexAIMonitoring();
    
    monitoring.monitorCrewCoordination()
        .then(() => monitoring.monitorSystemHealth())
        .then(() => {
            const alerts = monitoring.getAlerts();
            if (alerts.length > 0) {
                console.log('📊 Active alerts:', alerts);
            } else {
                console.log('✅ All systems healthy');
            }
        })
        .catch(error => {
            console.error('❌ Monitoring failed:', error);
            process.exit(1);
        });
}

module.exports = AlexAIMonitoring;
