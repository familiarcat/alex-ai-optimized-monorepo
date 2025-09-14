/**
 * Engage Alex AI Command
 * 
 * Provides natural language interaction with Alex AI crew members,
 * similar to Cursor AI's "engage Alex AI" functionality.
 */

import * as vscode from 'vscode';
import { AlexAIClient } from '../services/alexAIClient';
import { ContextManager } from '../services/contextManager';
import { CrewManager } from '../services/crewManager';

export async function engageAlexAI(
    alexAIClient: AlexAIClient,
    contextManager: ContextManager,
    crewManager: CrewManager,
    preFilledPrompt?: string
) {
    try {
        // Get user input
        let userInput = preFilledPrompt;
        
        if (!userInput) {
            userInput = await vscode.window.showInputBox({
                prompt: 'Engage Alex AI - Ask anything:',
                placeHolder: 'e.g., "help me create a React component for user authentication"',
                value: '',
                validateInput: (value) => {
                    if (!value || value.trim().length === 0) {
                        return 'Please enter a question or request for Alex AI';
                    }
                    return null;
                }
            });
        }

        if (!userInput) {
            return;
        }

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Alex AI is thinking...",
            cancellable: true
        }, async (progress, token) => {
            progress.report({ increment: 0, message: "Analyzing your request..." });

            // Get current context
            const activeEditor = vscode.window.activeTextEditor;
            const currentCode = activeEditor?.document.getText(activeEditor.selection) || '';
            const currentFile = activeEditor?.document.fileName;
            const projectPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

            progress.report({ increment: 30, message: "Determining best crew member..." });

            // Determine best crew member based on context
            const crewMember = determineBestCrewMember(userInput, currentCode, currentFile);
            
            progress.report({ increment: 50, message: "Connecting to Alex AI..." });

            // Prepare context for Alex AI
            const context = {
                currentFile,
                selectedCode: currentCode,
                projectPath,
                language: activeEditor?.document.languageId,
                lineNumber: activeEditor?.selection.active.line,
                workspace: vscode.workspace.name
            };

            progress.report({ increment: 70, message: "Processing with Alex AI..." });

            // Send request to Alex AI
            const response = await alexAIClient.sendMessage(userInput, {
                crewMember,
                context,
                includeCodeContext: true,
                includeProjectContext: true
            });

            progress.report({ increment: 90, message: "Preparing response..." });

            // Display response
            await displayAlexAIResponse(response, crewMember, userInput);

            progress.report({ increment: 100, message: "Complete!" });
        });

    } catch (error) {
        console.error('Error in engageAlexAI:', error);
        vscode.window.showErrorMessage(`Alex AI Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Determine the best crew member based on user input and context
 */
function determineBestCrewMember(userInput: string, currentCode: string, currentFile?: string): string {
    const input = userInput.toLowerCase();
    const code = currentCode.toLowerCase();
    const file = currentFile?.toLowerCase() || '';

    // Security-related queries
    if (input.includes('security') || input.includes('vulnerability') || input.includes('auth') || 
        input.includes('password') || input.includes('encrypt') || input.includes('secure')) {
        return 'worf';
    }

    // Performance-related queries
    if (input.includes('performance') || input.includes('optimize') || input.includes('slow') || 
        input.includes('memory') || input.includes('cpu') || input.includes('bottleneck')) {
        return 'crusher';
    }

    // Data analysis queries
    if (input.includes('data') || input.includes('analysis') || input.includes('logic') || 
        input.includes('algorithm') || input.includes('statistics') || input.includes('analytics')) {
        return 'data';
    }

    // Engineering/system integration
    if (input.includes('integration') || input.includes('system') || input.includes('architecture') || 
        input.includes('infrastructure') || input.includes('deployment') || input.includes('devops')) {
        return 'geordi';
    }

    // User experience
    if (input.includes('ui') || input.includes('ux') || input.includes('user') || input.includes('interface') || 
        input.includes('design') || input.includes('frontend') || input.includes('component')) {
        return 'troi';
    }

    // Business/ROI related
    if (input.includes('business') || input.includes('cost') || input.includes('roi') || input.includes('value') || 
        input.includes('revenue') || input.includes('profit') || input.includes('market')) {
        return 'quark';
    }

    // Communications/workflow
    if (input.includes('workflow') || input.includes('communication') || input.includes('api') || 
        input.includes('endpoint') || input.includes('webhook') || input.includes('integration')) {
        return 'uhura';
    }

    // Strategic planning
    if (input.includes('strategy') || input.includes('plan') || input.includes('roadmap') || 
        input.includes('decision') || input.includes('leadership') || input.includes('management')) {
        return 'picard';
    }

    // Code generation and implementation
    if (input.includes('create') || input.includes('generate') || input.includes('implement') || 
        input.includes('build') || input.includes('code') || input.includes('function')) {
        return 'riker';
    }

    // Default to tactical execution
    return 'riker';
}

/**
 * Display Alex AI response in a user-friendly format
 */
async function displayAlexAIResponse(response: any, crewMember: string, userInput: string) {
    const crewNames = {
        'picard': 'Captain Jean-Luc Picard',
        'riker': 'Commander William Riker',
        'data': 'Commander Data',
        'geordi': 'Lieutenant Commander Geordi La Forge',
        'worf': 'Lieutenant Worf',
        'troi': 'Counselor Deanna Troi',
        'uhura': 'Lieutenant Uhura',
        'crusher': 'Dr. Beverly Crusher',
        'quark': 'Quark'
    };

    const crewName = crewNames[crewMember as keyof typeof crewNames] || 'Alex AI Crew Member';

    // Create a markdown document with the response
    const doc = await vscode.workspace.openTextDocument({
        content: `# Alex AI Response

**Crew Member:** ${crewName}
**Your Request:** ${userInput}

---

${response.content || response.message || response}

---

*Generated by Alex AI • ${new Date().toLocaleString()}*
`,
        language: 'markdown'
    });

    // Show the document
    await vscode.window.showTextDocument(doc);

    // Also show a notification with a summary
    const summary = response.content || response.message || response;
    const shortSummary = summary.length > 100 ? summary.substring(0, 100) + '...' : summary;
    
    vscode.window.showInformationMessage(
        `Alex AI (${crewName}): ${shortSummary}`,
        'View Full Response',
        'Ask Follow-up'
    ).then(selection => {
        if (selection === 'Ask Follow-up') {
            // Open chat for follow-up
            vscode.commands.executeCommand('alex-ai.openChat');
        }
    });
}

/**
 * Quick engage with predefined prompts
 */
export async function quickEngageAlexAI(
    alexAIClient: AlexAIClient,
    contextManager: ContextManager,
    crewManager: CrewManager
) {
    const quickPrompts = [
        'Help me debug this code',
        'Optimize this function for better performance',
        'Add comprehensive error handling',
        'Create unit tests for this code',
        'Refactor this for better readability',
        'Explain how this code works',
        'Generate documentation for this function',
        'Suggest improvements and best practices',
        'Convert this to TypeScript',
        'Add accessibility features',
        'Implement security best practices',
        'Create a reusable component'
    ];

    const selectedPrompt = await vscode.window.showQuickPick(quickPrompts, {
        placeHolder: 'Select a quick action or type your own...',
        canPickMany: false,
        ignoreFocusOut: true
    });

    if (selectedPrompt) {
        // Get current code context
        const activeEditor = vscode.window.activeTextEditor;
        const currentCode = activeEditor?.document.getText(activeEditor.selection) || '';
        
        // If no code is selected, use the entire file
        const codeToAnalyze = currentCode || activeEditor?.document.getText() || '';
        
        const fullPrompt = `${selectedPrompt}:\n\n\`\`\`${activeEditor?.document.languageId || ''}\n${codeToAnalyze}\n\`\`\``;
        
        // Execute the engagement
        await engageAlexAI(alexAIClient, contextManager, crewManager, fullPrompt);
    }
}
