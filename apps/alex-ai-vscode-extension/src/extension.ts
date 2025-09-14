/**
 * Alex AI VS Code Extension - Main Entry Point
 * 
 * This extension provides AI-powered coding assistance with specialized crew members
 * similar to Cursor's AI capabilities but with Alex AI's unique crew system.
 */

import * as vscode from 'vscode';
import { AlexAIChatPanel } from './webview/chatPanel';
import { AlexAIClient } from './services/alexAIClient';
import { ContextManager } from './services/contextManager';
import { CrewManager } from './services/crewManager';
import { openChat } from './commands/openChat';
import { explainCode } from './commands/explainCode';
import { generateCode } from './commands/generateCode';
import { refactorCode } from './commands/refactorCode';
import { optimizeCode } from './commands/optimizeCode';
import { engageAlexAI, quickEngageAlexAI } from './commands/engageAlexAI';

export function activate(context: vscode.ExtensionContext) {
    console.log('Alex AI VS Code Extension is now active!');

    // Initialize services
    const alexAIClient = new AlexAIClient(context);
    const contextManager = new ContextManager();
    const crewManager = new CrewManager();
    
    // Initialize chat panel
    const chatPanel = new AlexAIChatPanel(context, alexAIClient, contextManager, crewManager);

    // Register commands
    const commands = [
        vscode.commands.registerCommand('alex-ai.openChat', () => openChat(chatPanel)),
        vscode.commands.registerCommand('alex-ai.explainCode', () => explainCode(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.generateCode', () => generateCode(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.refactorCode', () => refactorCode(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.optimizeCode', () => optimizeCode(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.engageAlexAI', () => engageAlexAI(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.quickEngage', () => quickEngageAlexAI(alexAIClient, contextManager, crewManager))
    ];

    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(robot) Alex AI";
    statusBarItem.command = 'alex-ai.engageAlexAI';
    statusBarItem.tooltip = 'Engage Alex AI - Natural language interaction';
    statusBarItem.show();

    // Register webview provider
    const provider = new AlexAIChatPanel(context, alexAIClient, contextManager, crewManager);
    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('alex-ai-chat-panel', provider)
    );

    // Add all disposables
    context.subscriptions.push(
        ...commands,
        statusBarItem,
        chatPanel
    );

    // Set context for when Alex AI is connected
    vscode.commands.executeCommand('setContext', 'alex-ai.connected', true);

    // Show welcome message
    vscode.window.showInformationMessage(
        'Alex AI is ready! Click the robot icon in the status bar or use Ctrl+Shift+P → "Engage Alex AI" to start.',
        'Engage Alex AI',
        'Open Chat'
    ).then(selection => {
        if (selection === 'Engage Alex AI') {
            vscode.commands.executeCommand('alex-ai.engageAlexAI');
        } else if (selection === 'Open Chat') {
            vscode.commands.executeCommand('alex-ai.openChat');
        }
    });
}

export function deactivate() {
    console.log('Alex AI VS Code Extension is now deactivated');
}







