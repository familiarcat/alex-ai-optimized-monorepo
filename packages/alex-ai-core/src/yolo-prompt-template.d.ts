#!/usr/bin/env node
export = AlexAIYOLOPromptTemplate;
/**
 * Alex AI YOLO Mode Prompt Template System
 * ========================================
 *
 * This system automatically prepends "/yolo on" to all Alex AI prompts
 * that involve Cursor AI interactions, ensuring streamlined operations.
 */
declare class AlexAIYOLOPromptTemplate {
    yoloCommand: string;
    templateVersion: string;
    lastUpdated: string;
    /**
     * Generate a prompt with YOLO Mode automatically enabled
     * @param {string} userPrompt - The original user prompt
     * @param {string} operationType - Type of operation (file_creation, code_editing, system_ops, etc.)
     * @returns {string} - Enhanced prompt with YOLO Mode
     */
    generateYOLOPrompt(userPrompt: string, operationType?: string): string;
    /**
     * Get operation-specific context for YOLO Mode
     * @param {string} operationType - Type of operation
     * @returns {string} - Context string
     */
    getOperationContext(operationType: string): string;
    /**
     * Check if a prompt should include YOLO Mode
     * @param {string} prompt - The prompt to check
     * @returns {boolean} - Whether YOLO Mode should be included
     */
    shouldIncludeYOLO(prompt: string): boolean;
    /**
     * Process a user prompt and return the YOLO-enhanced version
     * @param {string} userPrompt - Original user prompt
     * @param {object} options - Additional options
     * @returns {string} - Processed prompt
     */
    processPrompt(userPrompt: string, options?: object): string;
    /**
     * Get YOLO Mode status and configuration
     * @returns {object} - Status information
     */
    getYOLOStatus(): object;
    /**
     * Create a batch of YOLO-enhanced prompts
     * @param {Array} prompts - Array of prompts to process
     * @param {object} options - Processing options
     * @returns {Array} - Array of processed prompts
     */
    processBatch(prompts: any[], options?: object): any[];
    /**
     * Generate usage examples
     * @returns {object} - Usage examples
     */
    getUsageExamples(): object;
}
//# sourceMappingURL=yolo-prompt-template.d.ts.map