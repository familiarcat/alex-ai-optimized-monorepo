/**
 * Alex AI API Client
 *
 * Handles communication with the Alex AI backend services
 * including crew member selection and context-aware responses.
 */
import * as vscode from 'vscode';
export interface ChatRequest {
    message: string;
    context?: CodeContext;
    crewMember?: string;
    timestamp?: string;
}
export interface ChatResponse {
    response: string;
    crewMember: string;
    timestamp: string;
    suggestions?: string[];
    codeActions?: CodeAction[];
}
export interface CodeContext {
    filePath?: string;
    language?: string;
    content?: string;
    selection?: {
        start: {
            line: number;
            character: number;
        };
        end: {
            line: number;
            character: number;
        };
    };
    projectType?: string;
    dependencies?: string[];
}
export interface CodeAction {
    type: 'refactor' | 'optimize' | 'explain' | 'generate';
    title: string;
    description: string;
    code?: string;
    range?: vscode.Range;
}
export interface CrewMember {
    id: string;
    name: string;
    department: string;
    specialization: string;
    personality: string;
    capabilities: string[];
}
export declare class AlexAIClient {
    private context;
    private axiosInstance;
    private apiUrl;
    private apiKey;
    private isConnected;
    constructor(context: vscode.ExtensionContext);
    /**
     * Send a chat message to Alex AI
     */
    sendMessage(request: ChatRequest): Promise<ChatResponse>;
    /**
     * Get available crew members
     */
    getCrewMembers(): Promise<CrewMember[]>;
    /**
     * Get system status
     */
    getStatus(): Promise<any>;
    /**
     * Test connection to Alex AI
     */
    testConnection(): Promise<boolean>;
    /**
     * Get connection status
     */
    isConnectedToAlexAI(): boolean;
    /**
     * Update API configuration
     */
    updateConfiguration(apiUrl: string, apiKey: string): void;
    /**
     * Get default crew members (fallback)
     */
    private getDefaultCrewMembers;
}
//# sourceMappingURL=alexAIClient.d.ts.map