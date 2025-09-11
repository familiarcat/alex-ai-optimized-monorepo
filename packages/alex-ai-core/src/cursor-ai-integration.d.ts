#!/usr/bin/env node
export = CursorAIIntegration;
/**
 * Cursor AI Integration Configuration
 * ==================================
 *
 * This module defines default behaviors for Cursor AI interactions,
 * including automatic acceptance of edit confirmation prompts.
 */
declare class CursorAIIntegration {
    defaultBehaviors: {
        acceptEditPrompts: boolean;
        keyboardShortcuts: {
            accept: string;
            reject: string;
        };
        autoAcceptFileTypes: string[];
        autoAcceptPatterns: RegExp[];
    };
    /**
     * Check if a file should be automatically accepted
     * @param {string} filename - The filename to check
     * @returns {boolean} - Whether to auto-accept
     */
    shouldAutoAccept(filename: string): boolean;
    /**
     * Get the appropriate response for a Cursor AI prompt
     * @param {string} filename - The filename being edited
     * @param {string} promptType - Type of prompt (edit, create, etc.)
     * @returns {string} - Response action
     */
    getResponse(filename: string, promptType?: string): string;
    /**
     * Generate Cursor AI integration instructions
     * @returns {string} - Integration instructions
     */
    getIntegrationInstructions(): string;
    /**
     * Update crew memories with Cursor AI integration behavior
     * @returns {Object} - Memory update
     */
    updateCrewMemories(): Object;
}
//# sourceMappingURL=cursor-ai-integration.d.ts.map