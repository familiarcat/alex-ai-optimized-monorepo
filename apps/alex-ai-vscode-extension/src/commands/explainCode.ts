/**
 * Explain Code Command
 * 
 * Sends selected code to Alex AI for explanation.
 */

import * as vscode from 'vscode';
import { AlexAIClient } from '../services/alexAIClient';
import { ContextManager } from '../services/contextManager';
import { CrewManager } from '../services/crewManager';

export async function explainCode(
    alexAIClient: AlexAIClient,
    contextManager: ContextManager,
    crewManager: CrewManager
) {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showWarningMessage('No active editor found');
        return;
    }

    const selection = editor.selection;
    if (selection.isEmpty) {
        vscode.window.showWarningMessage('Please select some code to explain');
        return;
    }

    const selectedText = editor.document.getText(selection);
    const context = contextManager.getSelectedCodeContext();

    try {
        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Alex AI is analyzing your code...",
            cancellable: false
        }, async (progress) => {
            // Select appropriate crew member for code explanation
            const crewMember = crewManager.selectCrewMember('code_analysis');
            
            const response = await alexAIClient.sendMessage({
                message: `Please explain this code:\n\n${selectedText}`,
                context: context,
                crewMember: crewMember
            });

            // Show explanation in a new document
            const doc = await vscode.workspace.openTextDocument({
                content: `# Code Explanation by ${response.crewMember}\n\n${response.response}`,
                language: 'markdown'
            });
            
            await vscode.window.showTextDocument(doc);
        });

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to explain code: ${error.message}`);
    }
}











