// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	class Decoration {

		private decoration: vscode.TextEditorDecorationType | null;

		constructor() {
			this.decoration = null;
		}

		show(position: vscode.Position, text: string) {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				this.clear();
				this.decoration = vscode.window.createTextEditorDecorationType({
					after: {
						contentText: text,
						color: new vscode.ThemeColor("editorGhostText.foreground"),
					},
				});
				const hoverMessage = 'Вставка строки: `Alt` + `→`\\\nВставка слова: `Alt` + `←`';
				editor.setDecorations(this.decoration, [
					{
						range: new vscode.Range(position, position),
						hoverMessage: new vscode.MarkdownString(hoverMessage)
					}
				]);
			}
		}
		
		clear() {
			if (this.decoration) {
				const editor = vscode.window.activeTextEditor;
				if (editor && this.decoration) {
					editor.setDecorations(this.decoration, []);
				}
			}
		}
	}

	class Completion {

		private _position: vscode.Position | null;
		private _completion: string;

		constructor() {
			this._position = null;
			this._completion = '';
		}

		get cursorPosition(): vscode.Position | null {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				return new vscode.Position(
					editor.selection.active.line,
					editor.selection.active.character+1
				);
			}
			return null;
		}

		get editorText(): string {
			const editor = vscode.window.activeTextEditor;
			if (editor && this._position && this.cursorPosition) {
				const range = new vscode.Range(this._position, this.cursorPosition);
				const text = editor.document.getText(range);
				return text;
			}
			return '';
		}

		get completion(): string {
			
			if (this.editorText && this._completion) {
				return this._completion.substring(this.editorText.length);
			}
			return '';
		}

		get likeActiveText(): boolean {
			if (this.editorText) {
				return this._completion.startsWith(this.editorText);
			}
			return false;
		}

		insert() {
			const editor = vscode.window.activeTextEditor;
			if (editor) {
				editor.edit(editBuilder => {
					if (this._position && this._completion && this.cursorPosition) {
						const range = new vscode.Range(this._position, this.cursorPosition);
						editBuilder.replace(range, this._completion);
					}
				});
			}
			this.clear();
		}

		setCompletion(position: vscode.Position, completion: string) {
			this.setPosition(position);
			this._completion = completion;
		}

		setPosition(position: vscode.Position) {
			this._position = position;
		}

		clear() {
			this._position = null;
			this._completion = '';
		}
	}
	const completion = new Completion();

	const decoration = new Decoration();
	vscode.workspace.onDidChangeTextDocument((e) => {
		decoration.clear();
		const editor = vscode.window.activeTextEditor;
		if (editor) {

			if (completion.likeActiveText) {
				if (completion.cursorPosition) {
					decoration.show(completion.cursorPosition, completion.completion);
				}
			} else {
				completion.clear();
				decoration.clear();

				const text = editor.document.lineAt(editor.selection.active.line).text;
				if (text.endsWith('H')) {
					const position = editor.selection.active;
					completion.setCompletion(position, 'Hello World!');
				}				
			}
		}
	});

	const insertCompletion = vscode.commands.registerCommand('code-assistant.insertCompletion', () => {
		completion.insert();
		decoration.clear();
	});
	context.subscriptions.push(insertCompletion);
}

// This method is called when your extension is deactivated
export function deactivate() {}
