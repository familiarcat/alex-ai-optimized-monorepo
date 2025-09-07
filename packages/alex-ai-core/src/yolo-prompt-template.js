#!/usr/bin/env node
/**
 * Alex AI YOLO Mode Prompt Template System
 * ========================================
 * 
 * This system automatically prepends "/yolo on" to all Alex AI prompts
 * that involve Cursor AI interactions, ensuring streamlined operations.
 */

class AlexAIYOLOPromptTemplate {
    constructor() {
        this.yoloCommand = "/yolo on";
        this.templateVersion = "1.0";
        this.lastUpdated = new Date().toISOString();
    }
    
    /**
     * Generate a prompt with YOLO Mode automatically enabled
     * @param {string} userPrompt - The original user prompt
     * @param {string} operationType - Type of operation (file_creation, code_editing, system_ops, etc.)
     * @returns {string} - Enhanced prompt with YOLO Mode
     */
    generateYOLOPrompt(userPrompt, operationType = "general") {
        const yoloPrefix = this.yoloCommand;
        const operationContext = this.getOperationContext(operationType);
        
        return `${yoloPrefix}\n\n${operationContext}\n\n${userPrompt}`;
    }
    
    /**
     * Get operation-specific context for YOLO Mode
     * @param {string} operationType - Type of operation
     * @returns {string} - Context string
     */
    getOperationContext(operationType) {
        const contexts = {
            "file_creation": "Creating new files with streamlined workflow...",
            "code_editing": "Editing existing code with optimized operations...",
            "system_ops": "Running system operations with enhanced efficiency...",
            "milestone_ops": "Executing milestone operations with streamlined workflow...",
            "git_ops": "Performing Git operations with optimized workflow...",
            "npm_ops": "Running npm operations with enhanced efficiency...",
            "testing": "Executing tests with streamlined workflow...",
            "deployment": "Deploying with optimized operations...",
            "general": "Executing Alex AI operations with streamlined workflow..."
        };
        
        return contexts[operationType] || contexts["general"];
    }
    
    /**
     * Check if a prompt should include YOLO Mode
     * @param {string} prompt - The prompt to check
     * @returns {boolean} - Whether YOLO Mode should be included
     */
    shouldIncludeYOLO(prompt) {
        const yoloKeywords = [
            "create", "edit", "modify", "run", "execute", "build", "deploy",
            "install", "update", "commit", "push", "pull", "test", "generate",
            "write", "add", "remove", "delete", "move", "copy", "rename"
        ];
        
        const lowerPrompt = prompt.toLowerCase();
        return yoloKeywords.some(keyword => lowerPrompt.includes(keyword));
    }
    
    /**
     * Process a user prompt and return the YOLO-enhanced version
     * @param {string} userPrompt - Original user prompt
     * @param {object} options - Additional options
     * @returns {string} - Processed prompt
     */
    processPrompt(userPrompt, options = {}) {
        const {
            operationType = "general",
            forceYOLO = false,
            includeContext = true
        } = options;
        
        // Check if YOLO should be included
        if (!forceYOLO && !this.shouldIncludeYOLO(userPrompt)) {
            return userPrompt;
        }
        
        // Check if YOLO is already included
        if (userPrompt.includes(this.yoloCommand)) {
            return userPrompt;
        }
        
        // Generate YOLO-enhanced prompt
        if (includeContext) {
            return this.generateYOLOPrompt(userPrompt, operationType);
        } else {
            return `${this.yoloCommand}\n\n${userPrompt}`;
        }
    }
    
    /**
     * Get YOLO Mode status and configuration
     * @returns {object} - Status information
     */
    getYOLOStatus() {
        return {
            command: this.yoloCommand,
            version: this.templateVersion,
            lastUpdated: this.lastUpdated,
            status: "active",
            benefits: [
                "Eliminates confirmation prompts",
                "Streamlines development workflow",
                "Reduces cognitive load",
                "Enhances productivity",
                "Maintains operational momentum"
            ]
        };
    }
    
    /**
     * Create a batch of YOLO-enhanced prompts
     * @param {Array} prompts - Array of prompts to process
     * @param {object} options - Processing options
     * @returns {Array} - Array of processed prompts
     */
    processBatch(prompts, options = {}) {
        return prompts.map(prompt => this.processPrompt(prompt, options));
    }
    
    /**
     * Generate usage examples
     * @returns {object} - Usage examples
     */
    getUsageExamples() {
        return {
            "file_creation": {
                "original": "Create a new Python script for data processing",
                "enhanced": "/yolo on\n\nCreating new files with streamlined workflow...\n\nCreate a new Python script for data processing"
            },
            "code_editing": {
                "original": "Modify the existing API to include authentication",
                "enhanced": "/yolo on\n\nEditing existing code with optimized operations...\n\nModify the existing API to include authentication"
            },
            "system_ops": {
                "original": "Run npm install and start the development server",
                "enhanced": "/yolo on\n\nRunning system operations with enhanced efficiency...\n\nRun npm install and start the development server"
            },
            "milestone_ops": {
                "original": "Create a milestone push for the latest features",
                "enhanced": "/yolo on\n\nExecuting milestone operations with streamlined workflow...\n\nCreate a milestone push for the latest features"
            }
        };
    }
}

// Export for use in other modules
module.exports = AlexAIYOLOPromptTemplate;

// If run directly, display usage information
if (require.main === module) {
    const template = new AlexAIYOLOPromptTemplate();
    
    console.log("🚀 Alex AI YOLO Mode Prompt Template System");
    console.log("=" * 50);
    console.log(`Version: ${template.templateVersion}`);
    console.log(`YOLO Command: ${template.yoloCommand}`);
    console.log(`Status: ${template.getYOLOStatus().status}`);
    
    console.log("\n📋 Usage Examples:");
    const examples = template.getUsageExamples();
    Object.entries(examples).forEach(([type, example]) => {
        console.log(`\n${type.toUpperCase()}:`);
        console.log(`Original: ${example.original}`);
        console.log(`Enhanced: ${example.enhanced}`);
    });
    
    console.log("\n🎯 Benefits:");
    template.getYOLOStatus().benefits.forEach(benefit => {
        console.log(`- ${benefit}`);
    });
}

