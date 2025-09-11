/**
 * Alex AI Chat Panel
 *
 * Provides the main chat interface for interacting with Alex AI crew members
 * similar to Cursor's chat functionality but with crew member specialization.
 */
import * as vscode from 'vscode';
import { AlexAIClient } from '../services/alexAIClient';
import { ContextManager } from '../services/contextManager';
import { CrewManager } from '../services/crewManager';
export declare class AlexAIChatPanel implements vscode.WebviewViewProvider {
    private readonly context;
    private readonly alexAIClient;
    private readonly contextManager;
    private readonly crewManager;
    static readonly viewType = "alex-ai-chat-panel";
    private _view?;
    private _chatHistory;
    private _crewMembers;
    private _selectedCrewMember;
    constructor(context: vscode.ExtensionContext, alexAIClient: AlexAIClient, contextManager: ContextManager, crewManager: CrewManager);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    private handleSendMessage;
    private loadCrewMembers;
    private clearChat;
    private getHtmlForWebview;
}
//# sourceMappingURL=chatPanel.d.ts.map