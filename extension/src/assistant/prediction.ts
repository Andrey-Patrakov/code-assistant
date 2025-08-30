import * as vscode from 'vscode';
import * as utils from './utils';


export default class Prediction {

    private _position: vscode.Position;
    private _text: string;

    constructor(position: vscode.Position, text: string) {
        this._position = position;
        this._text = text.trim();
    }

    get position() {
        return this._position;
    }

    insertLine() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this._text) {
            return;
        }

        editor.edit(editBuilder => {
            const range = editor.document.lineAt(this._position.line).range;
            editBuilder.replace(range, this.getMerged());
        });
    }

    insertWord() {  // TODO
    }

    getMerged() {
        const editor = vscode.window.activeTextEditor;
        if (!editor || !this._position) {
            return '';
        }
        const editorLine = editor.document.lineAt(this._position.line);

        const str1 = this._text;
        const str2 = editorLine.text.substring(0, this._position.character+1);
        const str3 = editorLine.text.substring(this._position.character+1);

        let merged = utils.mergeStrings(str1, str2, 1);
        if (!merged) {
            merged = utils.mergeStrings(str2, str1, 1);
            if (!merged) {
                return str2 + str1 + str3;
            }
        }

        return utils.mergeStrings(merged, str3, 0);
    }
}
