/**
 * Alex AI Chat Panel
 * 
 * Provides the main chat interface for interacting with Alex AI crew members
 * similar to Cursor's chat functionality but with crew member specialization.
 */

import * as vscode from 'vscode';
import * as path from 'path';
import { AlexAIClient, ChatRequest, ChatResponse, CrewMember } from '../services/alexAIClient';
import { ContextManager, CodeContext } from '../services/contextManager';
import { CrewManager } from '../services/crewManager';

export class AlexAIChatPanel implements vscode.WebviewViewProvider {
    public static readonly viewType = 'alex-ai-chat-panel';
    private _view?: vscode.WebviewView;
    private _chatHistory: ChatMessage[] = [];
    private _crewMembers: CrewMember[] = [];
    private _selectedCrewMember: string = 'Commander Data';

    constructor(
        private readonly context: vscode.ExtensionContext,
        private readonly alexAIClient: AlexAIClient,
        private readonly contextManager: ContextManager,
        private readonly crewManager: CrewManager
    ) {
        this.loadCrewMembers();
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
        _token: vscode.CancellationToken,
    ) {
        this._view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [
                vscode.Uri.file(path.join(this.context.extensionPath, 'src', 'webview'))
            ]
        };

        webviewView.webview.html = this.getHtmlForWebview(webviewView.webview);

        // Handle messages from the webview
        webviewView.webview.onDidReceiveMessage(
            async (message) => {
                switch (message.command) {
                    case 'sendMessage':
                        await this.handleSendMessage(message.text, message.crewMember);
                        break;
                    case 'selectCrewMember':
                        this._selectedCrewMember = message.crewMember;
                        break;
                    case 'clearChat':
                        this.clearChat();
                        break;
                    case 'getContext':
                        const context = this.contextManager.getCurrentFileContext();
                        webviewView.webview.postMessage({
                            command: 'contextUpdate',
                            context: context
                        });
                        break;
                }
            }
        );
    }

    private async handleSendMessage(text: string, crewMember?: string) {
        if (!this._view) return;

        const selectedCrew = crewMember || this._selectedCrewMember;
        
        // Add user message to history
        const userMessage: ChatMessage = {
            type: 'user',
            content: text,
            timestamp: new Date().toISOString(),
            crewMember: selectedCrew
        };
        this._chatHistory.push(userMessage);

        // Update UI
        this._view.webview.postMessage({
            command: 'addMessage',
            message: userMessage
        });

        try {
            // Get current context
            const context = this.contextManager.getCurrentFileContext();

            // Send to Alex AI
            const request: ChatRequest = {
                message: text,
                context: context,
                crewMember: selectedCrew,
                timestamp: new Date().toISOString()
            };

            const response = await this.alexAIClient.sendMessage(request);

            // Add AI response to history
            const aiMessage: ChatMessage = {
                type: 'assistant',
                content: response.response,
                timestamp: response.timestamp,
                crewMember: response.crewMember,
                suggestions: response.suggestions,
                codeActions: response.codeActions
            };
            this._chatHistory.push(aiMessage);

            // Update UI
            this._view.webview.postMessage({
                command: 'addMessage',
                message: aiMessage
            });

        } catch (error) {
            const errorMessage: ChatMessage = {
                type: 'error',
                content: `Error: ${error.message}`,
                timestamp: new Date().toISOString(),
                crewMember: selectedCrew
            };
            this._chatHistory.push(errorMessage);

            this._view.webview.postMessage({
                command: 'addMessage',
                message: errorMessage
            });
        }
    }

    private async loadCrewMembers() {
        try {
            this._crewMembers = await this.alexAIClient.getCrewMembers();
        } catch (error) {
            console.error('Failed to load crew members:', error);
            // Use default crew members
            this._crewMembers = this.alexAIClient.getDefaultCrewMembers();
        }
    }

    private clearChat() {
        this._chatHistory = [];
        if (this._view) {
            this._view.webview.postMessage({
                command: 'clearChat'
            });
        }
    }

    private getHtmlForWebview(webview: vscode.Webview): string {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex AI Chat</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            margin: 0;
            padding: 16px;
            height: 100vh;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            display: flex;
            align-items: center;
            margin-bottom: 16px;
            gap: 12px;
        }
        
        .crew-selector {
            flex: 1;
            padding: 8px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
        }
        
        .clear-button {
            padding: 8px 12px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .clear-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .chat-container {
            flex: 1;
            overflow-y: auto;
            margin-bottom: 16px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            padding: 12px;
        }
        
        .message {
            margin-bottom: 16px;
            padding: 12px;
            border-radius: 8px;
            max-width: 80%;
        }
        
        .message.user {
            background-color: var(--vscode-input-background);
            margin-left: auto;
            text-align: right;
        }
        
        .message.assistant {
            background-color: var(--vscode-textBlockQuote-background);
            margin-right: auto;
        }
        
        .message.error {
            background-color: var(--vscode-inputValidation-errorBackground);
            color: var(--vscode-inputValidation-errorForeground);
        }
        
        .message-header {
            font-size: 12px;
            opacity: 0.7;
            margin-bottom: 4px;
        }
        
        .message-content {
            line-height: 1.4;
        }
        
        .crew-member {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
        }
        
        .input-container {
            display: flex;
            gap: 8px;
        }
        
        .message-input {
            flex: 1;
            padding: 12px;
            border: 1px solid var(--vscode-input-border);
            background-color: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
            resize: none;
            min-height: 40px;
            max-height: 120px;
        }
        
        .send-button {
            padding: 12px 16px;
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            border-radius: 4px;
            cursor: pointer;
            align-self: flex-end;
        }
        
        .send-button:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .send-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .suggestions {
            margin-top: 8px;
            padding: 8px;
            background-color: var(--vscode-textBlockQuote-background);
            border-radius: 4px;
            font-size: 12px;
        }
        
        .suggestion {
            cursor: pointer;
            padding: 4px 8px;
            margin: 2px;
            background-color: var(--vscode-button-background);
            border-radius: 4px;
            display: inline-block;
        }
        
        .suggestion:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        
        .code-actions {
            margin-top: 8px;
        }
        
        .code-action {
            cursor: pointer;
            padding: 8px 12px;
            margin: 4px 0;
            background-color: var(--vscode-button-background);
            border-radius: 4px;
            border: none;
            color: var(--vscode-button-foreground);
            display: block;
            width: 100%;
            text-align: left;
        }
        
        .code-action:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="header">
        <select class="crew-selector" id="crewSelector">
            <option value="Commander Data">Commander Data - Operations</option>
            <option value="Captain Jean-Luc Picard">Captain Picard - Command</option>
            <option value="Commander William Riker">Commander Riker - Tactical</option>
            <option value="Geordi La Forge">Geordi La Forge - Engineering</option>
            <option value="Lieutenant Worf">Lieutenant Worf - Security</option>
            <option value="Dr. Beverly Crusher">Dr. Crusher - Medical</option>
            <option value="Counselor Deanna Troi">Counselor Troi - Counseling</option>
            <option value="Lieutenant Uhura">Lieutenant Uhura - Communications</option>
            <option value="Quark">Quark - Business</option>
        </select>
        <button class="clear-button" onclick="clearChat()">Clear</button>
    </div>
    
    <div class="chat-container" id="chatContainer">
        <div class="message assistant">
            <div class="message-header">
                <span class="crew-member">Commander Data</span> • Operations
            </div>
            <div class="message-content">
                Hello! I'm Commander Data, your AI assistant for code analysis and logic operations. 
                How can I help you with your development tasks today?
            </div>
        </div>
    </div>
    
    <div class="input-container">
        <textarea 
            class="message-input" 
            id="messageInput" 
            placeholder="Ask Alex AI anything about your code..."
            rows="1"
        ></textarea>
        <button class="send-button" id="sendButton" onclick="sendMessage()">Send</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const chatContainer = document.getElementById('chatContainer');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');
        const crewSelector = document.getElementById('crewSelector');

        // Auto-resize textarea
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // Send message on Enter (but allow Shift+Enter for new lines)
        messageInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        // Crew member selection
        crewSelector.addEventListener('change', function() {
            vscode.postMessage({
                command: 'selectCrewMember',
                crewMember: this.value
            });
        });

        function sendMessage() {
            const text = messageInput.value.trim();
            if (!text) return;

            const crewMember = crewSelector.value;
            
            vscode.postMessage({
                command: 'sendMessage',
                text: text,
                crewMember: crewMember
            });

            messageInput.value = '';
            messageInput.style.height = 'auto';
        }

        function clearChat() {
            vscode.postMessage({
                command: 'clearChat'
            });
        }

        // Handle messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            
            switch (message.command) {
                case 'addMessage':
                    addMessage(message.message);
                    break;
                case 'clearChat':
                    clearChatUI();
                    break;
                case 'contextUpdate':
                    // Handle context updates if needed
                    break;
            }
        });

        function addMessage(message) {
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${message.type}\`;
            
            const header = document.createElement('div');
            header.className = 'message-header';
            header.innerHTML = \`<span class="crew-member">\${message.crewMember}</span> • \${new Date(message.timestamp).toLocaleTimeString()}\`;
            
            const content = document.createElement('div');
            content.className = 'message-content';
            content.textContent = message.content;
            
            messageDiv.appendChild(header);
            messageDiv.appendChild(content);
            
            // Add suggestions if available
            if (message.suggestions && message.suggestions.length > 0) {
                const suggestionsDiv = document.createElement('div');
                suggestionsDiv.className = 'suggestions';
                suggestionsDiv.innerHTML = '<strong>Suggestions:</strong><br>';
                
                message.suggestions.forEach(suggestion => {
                    const suggestionSpan = document.createElement('span');
                    suggestionSpan.className = 'suggestion';
                    suggestionSpan.textContent = suggestion;
                    suggestionSpan.onclick = () => {
                        messageInput.value = suggestion;
                        messageInput.focus();
                    };
                    suggestionsDiv.appendChild(suggestionSpan);
                });
                
                messageDiv.appendChild(suggestionsDiv);
            }
            
            // Add code actions if available
            if (message.codeActions && message.codeActions.length > 0) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'code-actions';
                
                message.codeActions.forEach(action => {
                    const actionButton = document.createElement('button');
                    actionButton.className = 'code-action';
                    actionButton.textContent = \`\${action.title}: \${action.description}\`;
                    actionButton.onclick = () => {
                        vscode.postMessage({
                            command: 'executeCodeAction',
                            action: action
                        });
                    };
                    actionsDiv.appendChild(actionButton);
                });
                
                messageDiv.appendChild(actionsDiv);
            }
            
            chatContainer.appendChild(messageDiv);
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }

        function clearChatUI() {
            chatContainer.innerHTML = \`
                <div class="message assistant">
                    <div class="message-header">
                        <span class="crew-member">\${crewSelector.value}</span> • Ready
                    </div>
                    <div class="message-content">
                        Chat cleared. How can I help you?
                    </div>
                </div>
            \`;
        }

        // Request context on load
        vscode.postMessage({
            command: 'getContext'
        });
    </script>
</body>
</html>`;
    }
}

interface ChatMessage {
    type: 'user' | 'assistant' | 'error';
    content: string;
    timestamp: string;
    crewMember: string;
    suggestions?: string[];
    codeActions?: any[];
}





