"use strict";
/**
 * Explain Code Command
 *
 * Sends selected code to Alex AI for explanation.
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
exports.explainCode = explainCode;
const vscode = __importStar(require("vscode"));
async function explainCode(alexAIClient, contextManager, crewManager) {
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
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to explain code: ${error.message}`);
    }
}
//# sourceMappingURL=explainCode.js.map