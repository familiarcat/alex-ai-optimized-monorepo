"use strict";
/**
 * Alex AI VS Code Extension - Main Entry Point
 *
 * This extension provides AI-powered coding assistance with specialized crew members
 * similar to Cursor's AI capabilities but with Alex AI's unique crew system.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const chatPanel_1 = require("./webview/chatPanel");
const alexAIClient_1 = require("./services/alexAIClient");
const contextManager_1 = require("./services/contextManager");
const crewManager_1 = require("./services/crewManager");
const openChat_1 = require("./commands/openChat");
const explainCode_1 = require("./commands/explainCode");
const generateCode_1 = require("./commands/generateCode");
const refactorCode_1 = require("./commands/refactorCode");
const optimizeCode_1 = require("./commands/optimizeCode");
function activate(context) {
    console.log('Alex AI VS Code Extension is now active!');
    // Initialize services
    const alexAIClient = new alexAIClient_1.AlexAIClient(context);
    const contextManager = new contextManager_1.ContextManager();
    const crewManager = new crewManager_1.CrewManager();
    // Initialize chat panel
    const chatPanel = new chatPanel_1.AlexAIChatPanel(context, alexAIClient, contextManager, crewManager);
    // Register commands
    const commands = [
        vscode.commands.registerCommand('alex-ai.openChat', () => (0, openChat_1.openChat)(chatPanel)),
        vscode.commands.registerCommand('alex-ai.explainCode', () => (0, explainCode_1.explainCode)(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.generateCode', () => (0, generateCode_1.generateCode)(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.refactorCode', () => (0, refactorCode_1.refactorCode)(alexAIClient, contextManager, crewManager)),
        vscode.commands.registerCommand('alex-ai.optimizeCode', () => (0, optimizeCode_1.optimizeCode)(alexAIClient, contextManager, crewManager))
    ];
    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = "$(robot) Alex AI";
    statusBarItem.command = 'alex-ai.openChat';
    statusBarItem.tooltip = 'Open Alex AI Chat';
    statusBarItem.show();
    // Register webview provider
    const provider = new chatPanel_1.AlexAIChatPanel(context, alexAIClient, contextManager, crewManager);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider('alex-ai-chat-panel', provider));
    // Add all disposables
    context.subscriptions.push(...commands, statusBarItem, chatPanel);
    // Set context for when Alex AI is connected
    vscode.commands.executeCommand('setContext', 'alex-ai.connected', true);
    // Show welcome message
    vscode.window.showInformationMessage('Alex AI is ready! Use Ctrl+Shift+P and search for "Alex AI" to get started.');
}
function deactivate() {
    console.log('Alex AI VS Code Extension is now deactivated');
}
//# sourceMappingURL=extension.js.map