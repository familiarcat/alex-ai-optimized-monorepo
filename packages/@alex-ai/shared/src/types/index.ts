// @alex-ai/shared types
// Shared TypeScript type definitions

export interface AlexAIConfig {
  version: string;
  environment: 'development' | 'production' | 'test';
  features: Record<string, boolean>;
}

export interface CrewMember {
  name: string;
  role: string;
  specialization: string;
  tasks: string[];
}

export interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
  };
  timestamp: string;
}

export interface MCPQuery {
  query: string;
  sources: string[];
  results: Record<string, any>;
}
