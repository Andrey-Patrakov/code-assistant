// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import Assistant from './assistant';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const assistant = new Assistant();

	vscode.window.onDidChangeTextEditorSelection(async (e) => {
		assistant.clear();
		await assistant.update();
	});

	context.subscriptions.push(vscode.commands.registerCommand('code-assistant.update', async () => {
		assistant.clear();
		await assistant.update();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('code-assistant.insertLine', () => {
		assistant.insertLine();
	}));

	context.subscriptions.push(vscode.commands.registerCommand('code-assistant.insertWord', () => {
		assistant.insertWord();
	}));
}

// This method is called when your extension is deactivated
export function deactivate() {}
