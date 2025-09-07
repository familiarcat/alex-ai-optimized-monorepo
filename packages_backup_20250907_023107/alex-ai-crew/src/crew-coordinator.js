#!/usr/bin/env node
/**
 * Alex AI Crew Coordinator for Turborepo
 * Coordinates crew members with Turborepo tasks
 */

const { execSync } = require('child_process');

class AlexAICrewCoordinator {
    constructor() {
        this.crew = {
            "Captain Picard": { specialization: "Strategic Planning", tasks: ["build", "deploy"] },
            "Commander Data": { specialization: "Technical Analysis", tasks: ["build", "test", "type-check"] },
            "Lt. La Forge": { specialization: "Infrastructure", tasks: ["build", "deploy", "monitor"] },
            "Dr. Crusher": { specialization: "Quality Assurance", tasks: ["test", "lint", "quality"] },
            "Counselor Troi": { specialization: "Developer Experience", tasks: ["dev", "monitor"] },
            "Lt. Worf": { specialization: "Security", tasks: ["security", "audit"] },
            "Ensign Wesley": { specialization: "Innovation", tasks: ["research", "experiment"] },
            "Q": { specialization: "Advanced Analysis", tasks: ["optimize", "analyze"] },
            "Guinan": { specialization: "Wisdom", tasks: ["review", "advise"] }
        };
    }

    async coordinateTask(task, options = {}) {
        console.log(`🚀 Crew coordinating task: ${task}`);
        
        // Assign task to appropriate crew members
        const assignedCrew = this.assignTaskToCrew(task);
        
        console.log(`👥 Assigned crew: ${assignedCrew.join(', ')}`);
        
        // Execute Turborepo task with crew coordination
        try {
            const command = `npx turbo run ${task}`;
            console.log(`⚡ Executing: ${command}`);
            
            const output = execSync(command, { 
                encoding: 'utf8',
                stdio: 'inherit'
            });
            
            console.log('✅ Task completed successfully');
            return { success: true, output, assignedCrew };
            
        } catch (error) {
            console.error('❌ Task failed:', error.message);
            return { success: false, error: error.message, assignedCrew };
        }
    }

    assignTaskToCrew(task) {
        const assigned = [];
        
        for (const [name, member] of Object.entries(this.crew)) {
            if (member.tasks.includes(task)) {
                assigned.push(name);
            }
        }
        
        return assigned;
    }

    getCrewStatus() {
        return {
            totalCrew: Object.keys(this.crew).length,
            crew: this.crew,
            timestamp: new Date().toISOString()
        };
    }
}

// CLI interface
if (require.main === module) {
    const coordinator = new AlexAICrewCoordinator();
    const task = process.argv[2] || 'build';
    
    coordinator.coordinateTask(task)
        .then(result => {
            if (result.success) {
                console.log('🎉 Crew coordination complete!');
                process.exit(0);
            } else {
                console.error('💥 Crew coordination failed!');
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('💥 Crew coordination error:', error);
            process.exit(1);
        });
}

module.exports = AlexAICrewCoordinator;
