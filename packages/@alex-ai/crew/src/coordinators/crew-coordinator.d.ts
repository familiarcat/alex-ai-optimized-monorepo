#!/usr/bin/env node
export = AlexAICrewCoordinator;
declare class AlexAICrewCoordinator {
    crew: {
        "Captain Picard": {
            specialization: string;
            tasks: string[];
        };
        "Commander Data": {
            specialization: string;
            tasks: string[];
        };
        "Lt. La Forge": {
            specialization: string;
            tasks: string[];
        };
        "Dr. Crusher": {
            specialization: string;
            tasks: string[];
        };
        "Counselor Troi": {
            specialization: string;
            tasks: string[];
        };
        "Lt. Worf": {
            specialization: string;
            tasks: string[];
        };
        "Ensign Wesley": {
            specialization: string;
            tasks: string[];
        };
        Q: {
            specialization: string;
            tasks: string[];
        };
        Guinan: {
            specialization: string;
            tasks: string[];
        };
    };
    coordinateTask(task: any, options?: {}): Promise<{
        success: boolean;
        output: string;
        assignedCrew: string[];
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        assignedCrew: string[];
        output?: undefined;
    }>;
    assignTaskToCrew(task: any): string[];
    getCrewStatus(): {
        totalCrew: number;
        crew: {
            "Captain Picard": {
                specialization: string;
                tasks: string[];
            };
            "Commander Data": {
                specialization: string;
                tasks: string[];
            };
            "Lt. La Forge": {
                specialization: string;
                tasks: string[];
            };
            "Dr. Crusher": {
                specialization: string;
                tasks: string[];
            };
            "Counselor Troi": {
                specialization: string;
                tasks: string[];
            };
            "Lt. Worf": {
                specialization: string;
                tasks: string[];
            };
            "Ensign Wesley": {
                specialization: string;
                tasks: string[];
            };
            Q: {
                specialization: string;
                tasks: string[];
            };
            Guinan: {
                specialization: string;
                tasks: string[];
            };
        };
        timestamp: string;
    };
}
//# sourceMappingURL=crew-coordinator.d.ts.map