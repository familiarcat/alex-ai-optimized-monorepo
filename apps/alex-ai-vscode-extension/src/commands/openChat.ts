/**
 * Open Chat Command
 * 
 * Opens the Alex AI chat panel for user interaction.
 */

import * as vscode from 'vscode';
import { AlexAIChatPanel } from '../webview/chatPanel';

export async function openChat(chatPanel: AlexAIChatPanel) {
    // The chat panel is already registered as a webview provider
    // This command can be used to focus or show the chat panel
    await vscode.commands.executeCommand('alex-ai-chat-panel.focus');
}




