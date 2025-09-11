#!/usr/bin/env node
export = AlexAIMonitoring;
/**
 * Alex AI Monitoring and Alerting System
 * Monitors crew coordination and system health
 */
declare class AlexAIMonitoring {
    alerts: any[];
    metrics: {};
    monitorCrewCoordination(): Promise<{
        active: number;
        tasks: string[];
        health: string;
    }>;
    monitorSystemHealth(): Promise<{
        cpu: number;
        memory: number;
        disk: number;
        status: string;
    }>;
    triggerAlert(type: any, message: any): void;
    getAlerts(): any[];
}
//# sourceMappingURL=monitor.d.ts.map