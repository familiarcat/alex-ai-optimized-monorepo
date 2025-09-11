#!/usr/bin/env node
export = AlexAIMCPQuery;
/**
 * Alex AI MCP Query Tool
 * Queries MCP sources and shares results across workspaces
 */
declare class AlexAIMCPQuery {
    mcpSources: string[];
    queryMCP(query: any, sources?: string[]): Promise<{}>;
    shareAcrossWorkspaces(results: any): Promise<{
        timestamp: string;
        results: any;
        workspaces: string[];
    }>;
}
//# sourceMappingURL=mcp-query.d.ts.map