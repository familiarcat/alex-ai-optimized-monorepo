/**
 * Alex AI API Client
 * 
 * Handles communication with the Alex AI backend services
 * including crew member selection and context-aware responses.
 */

import * as vscode from 'vscode';
import axios, { AxiosInstance } from 'axios';

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
        start: { line: number; character: number };
        end: { line: number; character: number };
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

export class AlexAIClient {
    private axiosInstance: AxiosInstance;
    private apiUrl: string;
    private apiKey: string;
    private isConnected: boolean = false;

    constructor(private context: vscode.ExtensionContext) {
        this.apiUrl = vscode.workspace.getConfiguration('alex-ai').get('apiUrl', 'http://localhost:3000');
        this.apiKey = vscode.workspace.getConfiguration('alex-ai').get('apiKey', '');
        
        this.axiosInstance = axios.create({
            baseURL: this.apiUrl,
            timeout: 30000,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': this.apiKey ? `Bearer ${this.apiKey}` : ''
            }
        });

        // Test connection on initialization
        this.testConnection();
    }

    /**
     * Send a chat message to Alex AI
     */
    async sendMessage(request: ChatRequest): Promise<ChatResponse> {
        try {
            const response = await this.axiosInstance.post('/api/chat', {
                message: request.message,
                context: request.context,
                crewMember: request.crewMember,
                timestamp: request.timestamp || new Date().toISOString()
            });

            return response.data;
        } catch (error) {
            console.error('Error sending message to Alex AI:', error);
            throw new Error('Failed to communicate with Alex AI. Please check your connection and API key.');
        }
    }

    /**
     * Get available crew members
     */
    async getCrewMembers(): Promise<CrewMember[]> {
        try {
            const response = await this.axiosInstance.get('/api/crew-members');
            return response.data;
        } catch (error) {
            console.error('Error fetching crew members:', error);
            // Return default crew members if API fails
            return this.getDefaultCrewMembers();
        }
    }

    /**
     * Get system status
     */
    async getStatus(): Promise<any> {
        try {
            const response = await this.axiosInstance.get('/api/status');
            return response.data;
        } catch (error) {
            console.error('Error fetching status:', error);
            return { status: 'disconnected', error: error.message };
        }
    }

    /**
     * Test connection to Alex AI
     */
    async testConnection(): Promise<boolean> {
        try {
            const response = await this.axiosInstance.get('/api/health');
            this.isConnected = response.status === 200;
            return this.isConnected;
        } catch (error) {
            this.isConnected = false;
            return false;
        }
    }

    /**
     * Get connection status
     */
    isConnectedToAlexAI(): boolean {
        return this.isConnected;
    }

    /**
     * Update API configuration
     */
    updateConfiguration(apiUrl: string, apiKey: string) {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
        
        this.axiosInstance.defaults.baseURL = apiUrl;
        this.axiosInstance.defaults.headers.Authorization = apiKey ? `Bearer ${apiKey}` : '';
        
        // Test new configuration
        this.testConnection();
    }

    /**
     * Get default crew members (fallback)
     */
    private getDefaultCrewMembers(): CrewMember[] {
        return [
            {
                id: 'captain-picard',
                name: 'Captain Jean-Luc Picard',
                department: 'Command',
                specialization: 'Strategic Planning',
                personality: 'Diplomatic, strategic, and wise leader',
                capabilities: ['Strategic planning', 'Decision making', 'Mission command']
            },
            {
                id: 'commander-riker',
                name: 'Commander William Riker',
                department: 'Tactical',
                specialization: 'Tactical Execution',
                personality: 'Confident, tactical, and decisive',
                capabilities: ['Code implementation', 'Workflow management', 'Tactical execution']
            },
            {
                id: 'commander-data',
                name: 'Commander Data',
                department: 'Operations',
                specialization: 'Data Analysis',
                personality: 'Logical, analytical, and precise',
                capabilities: ['Code analysis', 'Logic operations', 'Data processing']
            },
            {
                id: 'geordi-la-forge',
                name: 'Geordi La Forge',
                department: 'Engineering',
                specialization: 'System Integration',
                personality: 'Innovative, technical, and problem-solving',
                capabilities: ['System integration', 'Infrastructure', 'Technical solutions']
            },
            {
                id: 'lieutenant-worf',
                name: 'Lieutenant Worf',
                department: 'Security',
                specialization: 'Security & Testing',
                personality: 'Honorable, security-focused, and disciplined',
                capabilities: ['Security analysis', 'Testing', 'Risk assessment']
            },
            {
                id: 'dr-crusher',
                name: 'Dr. Beverly Crusher',
                department: 'Medical',
                specialization: 'Performance Optimization',
                personality: 'Caring, analytical, and health-focused',
                capabilities: ['Performance optimization', 'Health diagnostics', 'System monitoring']
            },
            {
                id: 'counselor-troi',
                name: 'Counselor Deanna Troi',
                department: 'Counseling',
                specialization: 'User Experience',
                personality: 'Empathetic, user-focused, and intuitive',
                capabilities: ['User experience', 'Quality assurance', 'Empathy analysis']
            },
            {
                id: 'lieutenant-uhura',
                name: 'Lieutenant Uhura',
                department: 'Communications',
                specialization: 'Automation',
                personality: 'Communicative, organized, and efficient',
                capabilities: ['Workflow automation', 'Communications', 'I/O operations']
            },
            {
                id: 'quark',
                name: 'Quark',
                department: 'Business',
                specialization: 'Business Analysis',
                personality: 'Entrepreneurial, profit-focused, and strategic',
                capabilities: ['Business analysis', 'ROI optimization', 'Budget analysis']
            }
        ];
    }
}








